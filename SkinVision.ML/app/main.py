"""FastAPI entry-point for the SkinVision ML ensemble service.

Loads three models at startup:
  • ISIC_HRNet  (03_HRNet_Dullrazor.pth)
  • ISIC_Swin   (04_Swin_Dullrazor.pth)
  • XGBoost meta-classifier (05_XGBoost_Meta_Classifier.joblib)

The /predict endpoint accepts an image + patient metadata, runs the
ensemble, and returns classification + optional Grad-CAM heatmap.
"""

import os
from contextlib import asynccontextmanager
from pathlib import Path

import joblib
import torch
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.model import ISIC_HRNet, ISIC_Swin
from app.inference import (
    preprocess_image,
    build_meta_tensor,
    predict,
    generate_heatmap_base64,
)
from app.schemas import PredictResponse, HealthResponse

# ── Model weight paths ──────────────────────────────────────────────
_MODEL_DIR = Path(os.environ.get(
    "SKINVISION_MODEL_DIR",
    str(Path(__file__).resolve().parent.parent / "model"),
))

HRNET_WEIGHTS = _MODEL_DIR / "03_HRNet_Dullrazor.pth"
SWIN_WEIGHTS = _MODEL_DIR / "04_Swin_Dullrazor.pth"
XGB_WEIGHTS = _MODEL_DIR / "05_XGBoost_Meta_Classifier.joblib"

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"}
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB

_state: dict = {
    "hrnet_model": None,
    "swin_model": None,
    "xgb_model": None,
    "device": None,
}


def _load_models() -> None:
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # ── HRNet ────────────────────────────────────────────────────────
    if not HRNET_WEIGHTS.exists():
        raise FileNotFoundError(f"HRNet weights not found at {HRNET_WEIGHTS}")
    hrnet = ISIC_HRNet(num_classes=9, meta_features_count=3, pretrained=False)
    hrnet.load_state_dict(
        torch.load(HRNET_WEIGHTS, map_location=device, weights_only=True)
    )
    hrnet.to(device)
    hrnet.eval()

    # ── Swin ─────────────────────────────────────────────────────────
    if not SWIN_WEIGHTS.exists():
        raise FileNotFoundError(f"Swin weights not found at {SWIN_WEIGHTS}")
    swin = ISIC_Swin(num_classes=9, meta_features_count=3)
    # Swin-V2-T downloads pretrained backbone weights on first init;
    # we then overwrite with our fine-tuned checkpoint.
    swin.load_state_dict(
        torch.load(SWIN_WEIGHTS, map_location=device, weights_only=True)
    )
    swin.to(device)
    swin.eval()

    # ── XGBoost ──────────────────────────────────────────────────────
    if not XGB_WEIGHTS.exists():
        raise FileNotFoundError(f"XGBoost weights not found at {XGB_WEIGHTS}")
    xgb = joblib.load(XGB_WEIGHTS)

    _state["hrnet_model"] = hrnet
    _state["swin_model"] = swin
    _state["xgb_model"] = xgb
    _state["device"] = device


@asynccontextmanager
async def lifespan(app: FastAPI):
    _load_models()
    yield
    _state["hrnet_model"] = None
    _state["swin_model"] = None
    _state["xgb_model"] = None
    _state["device"] = None


app = FastAPI(
    title="SkinVision ML Service",
    description=(
        "Skin lesion classification — HRNet-W32 + Swin-V2-T ensemble "
        "with XGBoost meta-classifier and Dullrazor preprocessing. "
        f"Model directory: {_MODEL_DIR}"
    ),
    version="2.0.0",
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

    hrnet = _state["hrnet_model"]
    swin = _state["swin_model"]
    xgb = _state["xgb_model"]
    device = _state["device"]
    if hrnet is None or swin is None or xgb is None:
        raise HTTPException(503, "Models not loaded")

    try:
        image_tensor = preprocess_image(image_bytes)
        meta_tensor = build_meta_tensor(age, sex, anatom_site)
        class_code, class_full, confidence, class_idx, all_probs, ent = predict(
            hrnet, swin, xgb, image_tensor, meta_tensor, device
        )

        heatmap_b64 = generate_heatmap_base64(
            hrnet, image_tensor, meta_tensor, class_idx, device
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
        heatmap_base64=heatmap_b64,
    )


@app.get("/health", response_model=HealthResponse)
def health():
    models_loaded = (
        _state["hrnet_model"] is not None
        and _state["swin_model"] is not None
        and _state["xgb_model"] is not None
    )
    return HealthResponse(
        status="ok" if models_loaded else "models_not_loaded",
        models_loaded=models_loaded,
        device=str(_state["device"]) if _state["device"] else "none",
        model_dir=str(_MODEL_DIR),
    )
