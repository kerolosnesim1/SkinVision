using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SkinVision.Domain.Entities;

public class Prediction
{
    [Key]
    public int PredictionId { get; set; }
    public int ImageId { get; set; }

    public string? Classification { get; set; } 
    public double? ConfidenceScore { get; set; } 
    public string? ModelVersion { get; set; }
    public DateTime? CreatedAt { get; set; }
    
    // Storing string array as JSON string or comma-separated for simplicity in Entity
    // Frontend expects string[]. DTO will handle conversion.
    public string? Findings { get; set; } 

    public virtual ExaminationImage Image { get; set; } = null!;
}
