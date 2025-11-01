using System;
using System.Collections.Generic;

namespace SkinVision.Backend.Domain.Entities;

public partial class Prediction
{
    public int PredictionId { get; set; }

    public int? ImageId { get; set; }

    public string? Result { get; set; }

    public double? ConfidenceScore { get; set; }

    public string? ModelVersion { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Diagnosis> Diagnoses { get; set; } = new List<Diagnosis>();

    public virtual Image? Image { get; set; }
}
