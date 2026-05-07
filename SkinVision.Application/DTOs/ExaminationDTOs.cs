using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using SkinVision.Domain.Enums;

namespace SkinVision.Application.DTOs;

public class ExaminationDto
{
    public int DiagnosisId { get; set; }
    public int DoctorId { get; set; }
    public string PatientName { get; set; } = null!;
    public string? PatientPhone { get; set; }
    public int? PatientAge { get; set; }
    public string Reason { get; set; } = null!;
    public string? Diagnosis { get; set; }
    public string? Treatment { get; set; }
    public string? FollowUp { get; set; }
    public string? RiskLevel { get; set; }
    public DateTime? FollowUpDate { get; set; }
    public ExaminationStatus Status { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    public List<ImageDto> Images { get; set; } = new();
    public PredictionDto? AiAnalysis { get; set; }
    public DoctorProfileDto? Doctor { get; set; }
}

public class CreateExaminationDto
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public string PatientName { get; set; } = null!;

    [StringLength(30)]
    public string? PatientPhone { get; set; }
    [Range(0, 120, ErrorMessage = "Patient age must be between 0 and 120.")]
    public int? PatientAge { get; set; }

    [Required]
    [StringLength(2000, MinimumLength = 1)]
    public string Reason { get; set; } = null!;

    [StringLength(2000)]
    public string? Diagnosis { get; set; }

    [StringLength(2000)]
    public string? Treatment { get; set; }

    public ExaminationStatus Status { get; set; } = ExaminationStatus.InProgress;

    [StringLength(1000)]
    public string? FollowUp { get; set; }

    [StringLength(50)]
    public string? RiskLevel { get; set; }

    public DateTime? FollowUpDate { get; set; }
    public List<int> ImageIds { get; set; } = new();
}
public class UpdateExaminationDto
{
    [StringLength(2000)]
    public string? Diagnosis { get; set;}

    [StringLength(2000)]
    public string? Treatment { get; set;}

    [StringLength(1000)]
    public string? FollowUp { get; set;}

    [StringLength(50)]
    public string? RiskLevel { get; set;}

    public DateTime? FollowUpDate { get; set; }
    public ExaminationStatus? Status { get; set; }
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
