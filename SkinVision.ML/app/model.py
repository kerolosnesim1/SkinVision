import torch
import torch.nn as nn
import timm
from torchvision import models


class ISIC_HRNet(nn.Module):
    """HRNet-W32 backbone with metadata cross-attention fusion.

    The metadata (age, sex, site) is projected into the same embedding
    dimension as the CNN features, then cross-attention is applied with
    the metadata as query and image features as key/value.  The fused
    representation is passed through dropout and a linear classifier.
    """

    def __init__(self, num_classes: int = 9, meta_features_count: int = 3, pretrained: bool = True):
        super().__init__()
        self.backbone = timm.create_model("hrnet_w32", pretrained=pretrained, num_classes=0)
        self.cnn_out_features = self.backbone.num_features
        self.meta_proj = nn.Linear(meta_features_count, self.cnn_out_features)
        self.cross_attention = nn.MultiheadAttention(
            embed_dim=self.cnn_out_features, num_heads=8, batch_first=True
        )
        self.dropout = nn.Dropout(p=0.4)
        self.classifier = nn.Linear(self.cnn_out_features, num_classes)

    def forward(self, image: torch.Tensor, meta_data: torch.Tensor) -> torch.Tensor:
        img_features = self.backbone(image).unsqueeze(1)
        meta_features = self.meta_proj(meta_data).unsqueeze(1)
        attn_out, _ = self.cross_attention(query=meta_features, key=img_features, value=img_features)
        fused_features = (img_features + attn_out).squeeze(1)
        fused_features = self.dropout(fused_features)
        return self.classifier(fused_features)


class ISIC_Swin(nn.Module):
    """Swin-V2-T backbone with metadata cross-attention fusion.

    Same fusion strategy as ISIC_HRNet but using a Swin Transformer
    backbone instead of HRNet.
    """

    def __init__(self, num_classes: int = 9, meta_features_count: int = 3):
        super().__init__()
        self.swin = models.swin_v2_t(weights=models.Swin_V2_T_Weights.DEFAULT)
        self.swin_out_features = self.swin.head.in_features
        self.swin.head = nn.Identity()
        self.meta_proj = nn.Linear(meta_features_count, self.swin_out_features)
        self.cross_attention = nn.MultiheadAttention(
            embed_dim=self.swin_out_features, num_heads=8, batch_first=True
        )
        self.dropout = nn.Dropout(p=0.4)
        self.classifier = nn.Linear(self.swin_out_features, num_classes)

    def forward(self, image: torch.Tensor, meta_data: torch.Tensor) -> torch.Tensor:
        img_features = self.swin(image).unsqueeze(1)
        meta_features = self.meta_proj(meta_data).unsqueeze(1)
        attn_out, _ = self.cross_attention(query=meta_features, key=img_features, value=img_features)
        fused_features = (img_features + attn_out).squeeze(1)
        fused_features = self.dropout(fused_features)
        return self.classifier(fused_features)


class MultiModal_GradCAM:
    """Grad-CAM heatmap generator for multi-modal models.

    Registers forward/backward hooks on *target_layer* to capture
    activations and gradients, then computes the class-discriminative
    heatmap using the standard Grad-CAM weighting formula.
    """

    def __init__(self, model: nn.Module, target_layer: nn.Module):
        self.model = model
        self.gradients: torch.Tensor | None = None
        self.activations: torch.Tensor | None = None
        self.hook_handles: list = []
        self.hook_handles.append(target_layer.register_forward_hook(self._save_activation))
        self.hook_handles.append(target_layer.register_full_backward_hook(self._save_gradient))

    def _save_activation(self, module: nn.Module, input: tuple, output: torch.Tensor):
        self.activations = output

    def _save_gradient(self, module: nn.Module, grad_input: tuple, grad_output: tuple):
        self.gradients = grad_output[0]

    def generate_heatmap(
        self,
        image_tensor: torch.Tensor,
        meta_tensor: torch.Tensor,
        target_class: int,
    ) -> list[list[float]]:
        """Return a 2-D heatmap (list-of-lists) normalised to [0, 1].

        The caller is responsible for converting to a colour-mapped image
        or base-64 string as needed.
        """
        import numpy as np

        self.model.eval()
        self.model.zero_grad()
        output = self.model(image_tensor, meta_tensor)
        target_score = output[0, target_class]
        target_score.backward(retain_graph=True)

        gradients = self.gradients.cpu().data.numpy()[0]
        activations = self.activations.cpu().data.numpy()[0]
        weights = np.mean(gradients, axis=(1, 2))
        cam = np.zeros(activations.shape[1:], dtype=np.float32)
        for i, w in enumerate(weights):
            cam += w * activations[i]
        cam = np.maximum(cam, 0)
        cam = np.float32(cam)  # ensure contiguous for resize
        # Resize to match input spatial dims
        import cv2
        h, w = image_tensor.shape[2], image_tensor.shape[3]
        cam = cv2.resize(cam, (w, h))
        cam -= np.min(cam)
        if np.max(cam) != 0:
            cam /= np.max(cam)
        return cam.tolist()

    def remove_hooks(self) -> None:
        for handle in self.hook_handles:
            handle.remove()
        self.hook_handles.clear()


def get_last_conv_layer(model: nn.Module) -> nn.Conv2d | None:
    """Return the last Conv2d layer in *model*, or None if none exists."""
    last_conv = None
    for module in model.modules():
        if isinstance(module, nn.Conv2d):
            last_conv = module
    return last_conv
