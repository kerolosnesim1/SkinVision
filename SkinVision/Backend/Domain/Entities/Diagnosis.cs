using System;
using System.Collections.Generic;

namespace SkinVision.Backend.Domain.Entities;

public partial class Diagnosis
{
    public int DiagnosisId { get; set; }

    public int? ImageId { get; set; }

    public int? DoctorId { get; set; }

    public int? PredictionId { get; set; }

    public string? Notes { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Bill> Bills { get; set; } = new List<Bill>();

    public virtual DoctorProfile? Doctor { get; set; }

    public virtual Image? Image { get; set; }

    public virtual Prediction? Prediction { get; set; }

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();
}
