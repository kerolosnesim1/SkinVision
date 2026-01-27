using System;
using System.Collections.Generic;

namespace SkinVision.Backend.Domain.Entities;

public partial class Bill
{
    public int BillId { get; set; }

    public int? DiagnosisId { get; set; }

    public double? Amount { get; set; }

    public string? Description { get; set; }

    public string? Status { get; set; }

    public DateTime? GeneratedAt { get; set; }

    public virtual Diagnosis? Diagnosis { get; set; }
}
