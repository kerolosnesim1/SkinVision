"""Inference utilities for the SkinVision ML ensemble.

Handles image preprocessing (including Dullrazor hair removal),
metadata encoding, ensemble prediction via HRNet + Swin + XGBoost,
and optional Grad-CAM explainability heatmaps.
"""

import io
import math
import base64
from typing import Tuple, List, Optional

import cv2
import numpy as np
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
    "lower extremity": 2,
    "oral/genital": 3,
    "palms/soles": 4,
    "posterior torso": 5,
    "upper extremity": 6,
    "unknown": 7,
}

val_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])


def apply_dullrazor(pil_image: Image.Image) -> Image.Image:
    """Apply Dullrazor hair-removal filter to a PIL image.

    Morphological black-hat filtering + inpainting removes dark hair
    artefacts from dermoscopic images before classification.
    """
    img = np.array(pil_image.resize((256, 256)))
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    blackhat = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel)
    _, mask = cv2.threshold(blackhat, 10, 255, cv2.THRESH_BINARY)
    inpainted = cv2.inpaint(img, mask, 5, cv2.INPAINT_TELEA)
    inpainted = cv2.medianBlur(inpainted, 3)
    return Image.fromarray(inpainted)


def preprocess_image(image_bytes: bytes) -> torch.Tensor:
    """Load image bytes → Dullrazor → tensor ready for the model."""
    pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    cleaned_image = apply_dullrazor(pil_image)
    return val_transforms(cleaned_image).unsqueeze(0)


def build_meta_tensor(age: float, sex: str, anatom_site: str) -> torch.Tensor:
    """Encode patient metadata into a normalised 3-element tensor."""
    age_norm = min(max(age, 0), 100) / 100.0
    sex_code = SEX_MAP.get(sex.strip().lower(), 2)
    site_code = SITE_MAP.get(anatom_site.strip().lower(), 7)
    return torch.tensor([[age_norm, float(sex_code), float(site_code)]], dtype=torch.float32)


def prediction_entropy(probs: List[float]) -> float:
    """Shannon entropy of the class distribution (nats).

    High ≈ uncertain / spread out; low ≈ peaked.
    """
    return float(-sum(p * math.log(p + 1e-12) for p in probs))


def predict(
    hrnet_model: torch.nn.Module,
    swin_model: torch.nn.Module,
    xgb_model,
    image_tensor: torch.Tensor,
    meta_tensor: torch.Tensor,
    device: torch.device,
) -> Tuple[str, str, float, int, List[float], float]:
    """Run the full ensemble: HRNet + Swin → XGBoost meta-classifier.

    Returns (class_code, class_full, confidence, class_idx, all_probs, entropy).
    """
    img_on_device = image_tensor.to(device)
    meta_on_device = meta_tensor.to(device)

    with torch.no_grad():
        hr_out = hrnet_model(img_on_device, meta_on_device)
        hr_probs = torch.softmax(hr_out, dim=1).cpu().numpy()

        swin_out = swin_model(img_on_device, meta_on_device)
        swin_probs = torch.softmax(swin_out, dim=1).cpu().numpy()

    meta_features = np.hstack((hr_probs, swin_probs))
    final_probs = xgb_model.predict_proba(meta_features)[0]

    predicted_class_idx = int(np.argmax(final_probs))
    confidence = float(final_probs[predicted_class_idx])
    class_code = CLASS_NAMES[predicted_class_idx]
    class_full = CLASS_FULL_NAMES[class_code]
    plist = [float(p) for p in final_probs]

    return class_code, class_full, confidence, predicted_class_idx, plist, prediction_entropy(plist)


def generate_heatmap_base64(
    model: torch.nn.Module,
    image_tensor: torch.Tensor,
    meta_tensor: torch.Tensor,
    target_class: int,
    device: torch.device,
) -> Optional[str]:
    """Generate a Grad-CAM heatmap and return it as a base64-encoded PNG.

    Returns None if no Conv2d layer is found in the model.
    """
    from app.model import MultiModal_GradCAM, get_last_conv_layer

    target_layer = get_last_conv_layer(model)
    if target_layer is None:
        return None

    cam_engine = MultiModal_GradCAM(model, target_layer)
    img_on_device = image_tensor.to(device)
    img_on_device.requires_grad_()
    meta_on_device = meta_tensor.to(device)

    heatmap = cam_engine.generate_heatmap(img_on_device, meta_on_device, target_class)
    cam_engine.remove_hooks()

    heatmap_np = np.array(heatmap, dtype=np.float32)
    heatmap_uint8 = np.uint8(255 * heatmap_np)
    heatmap_colored = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)

    # Resize to 224×224 for overlay consistency
    heatmap_colored = cv2.resize(heatmap_colored, (224, 224))

    _, buffer = cv2.imencode(".png", heatmap_colored)
    return base64.b64encode(buffer).decode("utf-8")
