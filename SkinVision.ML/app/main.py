import os
from contextlib import asynccontextmanager
from pathlib import Path

import torch
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.model import ISIC_Hybrid_Net
from app.inference import preprocess_image, build_meta_tensor, predict
from app.schemas import PredictResponse, HealthResponse

_DEFAULT_WEIGHTS = "EfficientNet_B3_model.pth"
MODEL_PATH = Path(
    os.environ.get(
        "SKINVISION_MODEL_PATH",
        str(Path(__file__).resolve().parent.parent / "model" / _DEFAULT_WEIGHTS),
    )
)
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"}
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB

_state: dict = {"model": None, "device": None, "weights_file": ""}


def _load_model() -> None:
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = ISIC_Hybrid_Net(num_classes=9, num_heads=1)

    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model weights not found at {MODEL_PATH}")

    model.load_state_dict(torch.load(MODEL_PATH, map_location=device, weights_only=True))
    model.to(device)
    model.eval()

    _state["model"] = model
    _state["device"] = device
    _state["weights_file"] = MODEL_PATH.name


@asynccontextmanager
async def lifespan(app: FastAPI):
    _load_model()
    yield
    _state["model"] = None
    _state["device"] = None
    _state["weights_file"] = ""


app = FastAPI(
    title="SkinVision ML Service",
    description=(
        "Skin lesion classification — EfficientNet-B3 hybrid (meta projection + attention). "
        f"Default weights: {_DEFAULT_WEIGHTS}. Override path with SKINVISION_MODEL_PATH."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/predict", response_model=PredictResponse)
async def predict_endpoint(
    file: UploadFile = File(..., description="Skin lesion image (JPEG/PNG)"),
    age: float = Form(55.0, ge=0, le=120, description="Patient age in years"),
    sex: str = Form("unknown", description="male | female | unknown"),
    anatom_site: str = Form("unknown", description="Anatomical site of the lesion"),
):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"Unsupported file type: {ext}")

    image_bytes = await file.read()
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(400, f"File too large (max {MAX_FILE_SIZE // (1024*1024)} MB)")
    if len(image_bytes) == 0:
        raise HTTPException(400, "Empty file")

    model = _state["model"]
    device = _state["device"]
    if model is None:
        raise HTTPException(503, "Model not loaded")

    try:
        image_tensor = preprocess_image(image_bytes)
        meta_tensor = build_meta_tensor(age, sex, anatom_site)
        class_code, class_full, confidence, class_idx, all_probs, ent = predict(
            model, image_tensor, meta_tensor, device
        )
    except Exception as e:
        raise HTTPException(500, f"Prediction failed: {str(e)}")

    return PredictResponse(
        classification=class_code,
        classification_full=class_full,
        confidence=round(confidence, 4),
        class_index=class_idx,
        all_probabilities=[round(p, 4) for p in all_probs],
        prediction_entropy=round(ent, 4),
    )


@app.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(
        status="ok" if _state["model"] is not None else "model_not_loaded",
        model_loaded=_state["model"] is not None,
        device=str(_state["device"]) if _state["device"] else "none",
        weights_file=_state.get("weights_file") or "",
    )
