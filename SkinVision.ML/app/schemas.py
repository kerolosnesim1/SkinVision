from pydantic import BaseModel, Field
from typing import List


class PredictResponse(BaseModel):
    classification: str = Field(description="Predicted class code (e.g. MEL, NV, BCC)")
    classification_full: str = Field(description="Human-readable class name")
    confidence: float = Field(ge=0, le=1, description="Confidence score 0–1")
    class_index: int = Field(ge=0, le=8)
    all_probabilities: List[float] = Field(description="Per-class softmax probabilities")
    prediction_entropy: float = Field(
        description="Uncertainty: Shannon entropy of class probs (nats). ~0 = very sure; ~2.2 ≈ uniform over 9 classes"
    )


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    device: str
    weights_file: str = Field(description="Basename of loaded checkpoint, or empty if not loaded")
