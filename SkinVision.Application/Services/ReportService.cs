using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Domain.Entities;

namespace SkinVision.Application.Services;

public class ReportService : IReportService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IReportGeneratorService _reportGenerator;
    private readonly IFileStorageService _fileStorage;

    public ReportService(IUnitOfWork unitOfWork,IReportGeneratorService reportGenerator,IFileStorageService fileStorage)
    {
        _unitOfWork = unitOfWork;
        _reportGenerator = reportGenerator;
        _fileStorage = fileStorage;
    }

    public async Task<ReportDto> GenerateReportAsync(int doctorId, int examinationId, GenerateReportDto? dto)
    {
        var examination = await _unitOfWork.Examinations.GetByIdWithDetailsAsync(examinationId);
        if (examination == null || examination.DoctorId != doctorId)
            throw new InvalidOperationException("Examination not found or access denied.");

        // Generate the PDF
        using var pdfStream = await _reportGenerator.GeneratePdfAsync(examination);

        // Save the file to disk
        var fileName = $"Report_{examination.PatientName.Replace(" ", "_")}_{DateTime.UtcNow:yyyyMMdd_HHmmss}.pdf";
        var filePath = await _fileStorage.SaveFileAsync(pdfStream, fileName, "application/pdf");

        // Create the report entity
        var title = dto?.Title ?? $"Examination Report - {examination.PatientName}";
        var report = new Report
        {
            DiagnosisId = examinationId,
            ReportPath = filePath,
            Format = "PDF",
            Title = title
        };

        await _unitOfWork.Reports.AddAsync(report);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(report);
    }

    public async Task<ReportDto?> GetReportAsync(int doctorId, int reportId)
    {
        var report = await _unitOfWork.Reports.GetByIdWithExaminationAsync(reportId);
        if (report == null || report.Examination.DoctorId != doctorId)
            return null;

        return MapToDto(report);
    }

    public async Task<List<ReportDto>> GetReportsForExaminationAsync(int doctorId, int examinationId)
    {
        var examination = await _unitOfWork.Examinations.GetByIdAsync(examinationId);
        if (examination == null || examination.DoctorId != doctorId)
            return new List<ReportDto>();

        var reports = await _unitOfWork.Reports.GetByExaminationIdAsync(examinationId);
        return reports.Select(MapToDto).ToList();
    }

    public async Task<List<ReportDto>> GetAllReportsAsync(int doctorId)
    {
        var reports = await _unitOfWork.Reports.GetByDoctorIdAsync(doctorId);
        return reports.Select(MapToDto).ToList();
    }

    public async Task<bool> DeleteReportAsync(int doctorId, int reportId)
    {
        var report = await _unitOfWork.Reports.GetByIdWithExaminationAsync(reportId);
        if (report == null || report.Examination.DoctorId != doctorId)
            return false;

        // Delete the physical file
        if (!string.IsNullOrEmpty(report.ReportPath))
            await _fileStorage.DeleteFileAsync(report.ReportPath);

        await _unitOfWork.Reports.DeleteByIdAsync(reportId);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<(Stream? Stream, string? FileName)?> DownloadReportAsync(int doctorId, int reportId)
    {
        var report = await _unitOfWork.Reports.GetByIdWithExaminationAsync(reportId);
        if (report == null || report.Examination.DoctorId != doctorId)
            return null;

        if (string.IsNullOrEmpty(report.ReportPath))
            return null;

        // The file storage service saves to wwwroot, so we reconstruct the full path
        // This will be resolved by the controller using IWebHostEnvironment
        return (null, report.ReportPath);
    }

    private static ReportDto MapToDto(Report report)
    {
        return new ReportDto
        {
            ReportId = report.ReportId,
            DiagnosisId = report.DiagnosisId,
            Title = report.Title,
            ReportPath = report.ReportPath,
            Format = report.Format,
            CreatedAt = report.CreatedAt
        };
    }
}
