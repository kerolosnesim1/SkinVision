import io
import math
from typing import Tuple, List

import torch
from PIL import Image
from torchvision import transforms

CLASS_NAMES = ["MEL", "NV", "BCC", "AK", "BKL", "DF", "VASC", "SCC", "UNK"]

CLASS_FULL_NAMES = {
    "MEL": "Melanoma",
    "NV": "Melanocytic Nevus",
    "BCC": "Basal Cell Carcinoma",
    "AK": "Actinic Keratosis",
    "BKL": "Benign Keratosis",
    "DF": "Dermatofibroma",
    "VASC": "Vascular Lesion",
    "SCC": "Squamous Cell Carcinoma",
    "UNK": "Unknown",
}

SEX_MAP = {"female": 0, "male": 1, "unknown": 2}

SITE_MAP = {
    "anterior torso": 0,
    "head/neck": 1,
    "lateral torso": 2,
    "lower extremity": 3,
    "oral/genital": 4,
    "palms/soles": 5,
    "posterior torso": 6,
    "upper extremity": 7,
    "unknown": 8,
}

val_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])


def preprocess_image(image_bytes: bytes) -> torch.Tensor:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return val_transforms(image).unsqueeze(0)


def build_meta_tensor(age: float, sex: str, anatom_site: str) -> torch.Tensor:
    age_norm = min(max(age, 0), 100) / 100.0
    sex_code = SEX_MAP.get(sex.strip().lower(), 2)
    site_code = SITE_MAP.get(anatom_site.strip().lower(), 8)
    return torch.tensor([[age_norm, float(sex_code), float(site_code)]], dtype=torch.float32)


def prediction_entropy(probs: List[float]) -> float:
    """Shannon entropy of the class distribution (nats). High ≈ uncertain / spread out; low ≈ peaked."""
    return float(-sum(p * math.log(p + 1e-12) for p in probs))


def predict(
    model: torch.nn.Module,
    image_tensor: torch.Tensor,
    meta_tensor: torch.Tensor,
    device: torch.device,
) -> Tuple[str, str, float, int, List[float], float]:
    with torch.no_grad():
        output = model(image_tensor.to(device), meta_tensor.to(device))
        probs = torch.softmax(output, dim=1)
        confidence, idx = torch.max(probs, dim=1)

    plist = probs[0].tolist()
    class_code = CLASS_NAMES[idx.item()]
    class_full = CLASS_FULL_NAMES[class_code]
    return class_code, class_full, confidence.item(), idx.item(), plist, prediction_entropy(plist)
