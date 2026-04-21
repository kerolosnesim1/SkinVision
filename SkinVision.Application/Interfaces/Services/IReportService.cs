using SkinVision.Application.DTOs;

namespace SkinVision.Application.Interfaces.Services;

public interface IReportService
{
    Task<ReportDto> GenerateReportAsync(int doctorId, int examinationId, GenerateReportDto? dto);
    Task<ReportDto?> GetReportAsync(int doctorId, int reportId);
    Task<List<ReportDto>> GetReportsForExaminationAsync(int doctorId, int examinationId);
    Task<List<ReportDto>> GetAllReportsAsync(int doctorId);
    Task<bool> DeleteReportAsync(int doctorId, int reportId);
    Task<(Stream? Stream, string? FileName)?> DownloadReportAsync(int doctorId, int reportId);
}
