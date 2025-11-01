using System;
using System.Collections.Generic;

namespace SkinVision.Backend.Domain.Entities;

public partial class Report
{
    public int ReportId { get; set; }

    public int? DiagnosisId { get; set; }

    public string? ReportPath { get; set; }

    public string? Format { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Diagnosis? Diagnosis { get; set; }
}
