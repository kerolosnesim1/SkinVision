import torch
import torch.nn as nn
from efficientnet_pytorch import EfficientNet


class ISIC_MultiModal_Net(nn.Module):
    """
    Multimodal skin lesion classifier — EfficientNet-B3 (image) + patient metadata.
    Trained on ISIC 2019 (9 classes).
    """

    def __init__(self, num_classes: int = 9, meta_features_count: int = 3):
        super().__init__()

        self.cnn = EfficientNet.from_pretrained("efficientnet-b3")
        self.cnn_out_features = self.cnn._fc.in_features  # 1536
        self.cnn._fc = nn.Identity()

        self.total_features = self.cnn_out_features + meta_features_count
        self.classifier = nn.Linear(self.total_features, num_classes)

    def forward(self, image: torch.Tensor, meta_data: torch.Tensor) -> torch.Tensor:
        cnn_features = self.cnn(image)
        fused_features = torch.cat((cnn_features, meta_data), dim=1)
        return self.classifier(fused_features)


class ISIC_Hybrid_Net(nn.Module):
    """
    Hybrid skin lesion classifier — EfficientNet-B3 + meta projection +
    multi-head self-attention over [meta_token, image_token], then mean-pool.

    Matches checkpoint ``optimal_hybrid_model.pth`` (state_dict verified;
    formerly shipped as ``EfficientNet_B3_model(1).pth``).
    """

    def __init__(self, num_classes: int = 9, num_heads: int = 1):
        super().__init__()

        self.cnn = EfficientNet.from_pretrained("efficientnet-b3")
        self.embed_dim = self.cnn._fc.in_features  # 1536
        self.cnn._fc = nn.Identity()

        self.meta_proj = nn.Linear(3, self.embed_dim)
        self.cross_attention = nn.MultiheadAttention(
            embed_dim=self.embed_dim,
            num_heads=num_heads,
            batch_first=True,
        )
        self.classifier = nn.Linear(self.embed_dim, num_classes)

    def forward(self, image: torch.Tensor, meta_data: torch.Tensor) -> torch.Tensor:
        img_features = self.cnn(image)
        meta_features = self.meta_proj(meta_data)
        seq = torch.stack((meta_features, img_features), dim=1)
        attn_out, _ = self.cross_attention(seq, seq, seq)
        pooled = attn_out.mean(dim=1)
        return self.classifier(pooled)
