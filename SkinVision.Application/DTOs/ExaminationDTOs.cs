using System;
using System.Collections.Generic;

namespace SkinVision.Application.DTOs;

public class ExaminationDto
{
    public int DiagnosisId { get; set; }
    public string PatientName { get; set; } = null!;
    public string? PatientPhone { get; set; }
    public int? PatientAge { get; set; }
    public string Reason { get; set; } = null!;
    public string? Diagnosis { get; set; }
    public string? Treatment { get; set; }
    public string? FollowUp { get; set; }
    public string? RiskLevel { get; set; }
    public DateTime? FollowUpDate { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    public List<ImageDto> Images { get; set; } = new();
    public PredictionDto? AiAnalysis { get; set; }
    public DoctorProfileDto? Doctor { get; set; }
}

public class CreateExaminationDto
{
    public string PatientName { get; set; } = null!;
    public string? PatientPhone { get; set; }
    public int? PatientAge { get; set; }
    public string Reason { get; set; } = null!;
    public string? Diagnosis { get; set; }
    public string? Treatment { get; set; }
    public string? FollowUp { get; set; }
    public string? RiskLevel { get; set; }
    public DateTime? FollowUpDate { get; set; }
    public List<int> ImageIds { get; set; } = new();
}

public class ExaminationListItemDto
{
    public int DiagnosisId { get; set; }
    public string PatientName { get; set; } = null!;
    public string? PatientPhone { get; set; }
    public string Reason { get; set; } = null!;
    public string? Diagnosis { get; set; }
    public string? RiskLevel { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class ExaminationStatsDto
{
    public int Total { get; set; }
    public int Today { get; set; }
    public int AiAnalyses { get; set; }
}
