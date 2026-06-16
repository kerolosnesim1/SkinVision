using System;
using System.Collections.Generic;

namespace SkinVision.Application.DTOs;

public class ImageDto
{
    public int ImageId { get; set; }
    public string? FilePath { get; set; }
    public string? Format { get; set; }
    public long? Size { get; set; }
    public DateTime? UploadDate { get; set; }
    public string? PatientName { get; set; }
    public int? PatientAge { get; set; }
    public string? AnatomSite { get; set; }
    public string? Sex { get; set; }
    public string? BodyPart { get; set; }
    public PredictionDto? AiResult { get; set; }
}

public class PredictionDto
{
    public int PredictionId { get; set; }
    public string? Classification { get; set; }
    public decimal? ConfidenceScore { get; set; }
    public string? ModelVersion { get; set; }
    public DateTime? CreatedAt { get; set; }
    public List<string> Findings { get; set; } = new();
    public string? HeatmapPath { get; set; }
}
