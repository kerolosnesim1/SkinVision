using System;
using System.Collections.Generic;

namespace SkinVision.Domain.Entities;

public class Report
{
    public int ReportId { get; set; }
    public int DiagnosisId { get; set; } 

    public string? ReportPath { get; set; }
    public string? Format { get; set; }
    public DateTime? CreatedAt { get; set; }

    public virtual Examination Examination { get; set; } = null!;
}
