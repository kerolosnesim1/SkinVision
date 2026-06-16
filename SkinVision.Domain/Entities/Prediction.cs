using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkinVision.Domain.Entities;

public class Prediction
{
    public int PredictionId { get; set; }
    public int ImageId { get; set; }

    public string? Classification { get; set; }
    public decimal? ConfidenceScore { get; set; }
    public string? ModelVersion { get; set; }
    public DateTime? CreatedAt { get; set; }
    
    public string? Findings { get; set; }

    public string? HeatmapPath { get; set; }

    [NotMapped]
    public string? HeatmapBase64 { get; set; }

    public virtual ExaminationImage Image { get; set; } = null!;
}
