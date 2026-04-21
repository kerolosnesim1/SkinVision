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
    public string? Title { get; set; }
}
