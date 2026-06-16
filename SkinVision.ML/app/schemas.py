from pydantic import BaseModel, Field
from typing import List, Optional


class PredictResponse(BaseModel):
    classification: str = Field(description="Predicted class code (e.g. MEL, NV, BCC)")
    classification_full: str = Field(description="Human-readable class name")
    confidence: float = Field(ge=0, le=1, description="Confidence score 0–1")
    class_index: int = Field(ge=0, le=8)
    all_probabilities: List[float] = Field(description="Per-class probabilities from XGBoost ensemble")
    prediction_entropy: float = Field(
        description="Uncertainty: Shannon entropy of class probs (nats). ~0 = very sure; ~2.2 ≈ uniform over 9 classes"
    )
    heatmap_base64: str = Field(
        description="Grad-CAM heatmap as base64-encoded PNG (always generated for explainability)",
    )


class HealthResponse(BaseModel):
    status: str
    models_loaded: bool = Field(description="True when all three models (HRNet, Swin, XGBoost) are loaded")
    device: str
    model_dir: str = Field(description="Directory containing model weight files")
