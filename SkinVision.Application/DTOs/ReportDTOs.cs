using System.ComponentModel.DataAnnotations;

namespace SkinVision.Application.DTOs;

public class ReportDto
{
    public int ReportId { get; set; }
    public int DiagnosisId { get; set; }
    public string? Title { get; set; }
    public string? ReportPath { get; set; }
    public string? Format { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class GenerateReportDto
{
    [StringLength(200, MinimumLength = 1, ErrorMessage = "Title must be between 1 and 200 characters when provided.")]
    public string? Title { get; set; }
}
