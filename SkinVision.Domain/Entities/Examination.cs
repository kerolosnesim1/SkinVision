using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SkinVision.Domain.Entities;

public class Examination
{
    [Key]
    public int DiagnosisId { get; set; }
    public int DoctorId { get; set; }

    public int? PatientId { get; set; }

    public string PatientName { get; set; } = null!;
    public string? PatientPhone { get; set; }
    public int PatientAge { get; set; }

    public string Reason { get; set; } = null!;

    public string? Diagnosis { get; set; }
    public string? Treatment { get; set; }
    public string? FollowUp { get; set; }
    public string? RiskLevel { get; set; }
    public DateTime? FollowUpDate { get; set; }

    public string Status { get; set; } = "InProgress";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public virtual User Doctor { get; set; } = null!;
    public virtual Patient? Patient { get; set; }
    public virtual ICollection<ExaminationImage> Images { get; set; } = new List<ExaminationImage>();
    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();
}
