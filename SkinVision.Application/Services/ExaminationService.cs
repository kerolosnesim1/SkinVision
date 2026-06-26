using Microsoft.Extensions.Logging;
using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Domain.Entities;

namespace SkinVision.Application.Services;

public class ExaminationService : IExaminationService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<ExaminationService> _logger;

    public ExaminationService(
        IUnitOfWork unitOfWork,
        IFileStorageService fileStorageService,
        ILogger<ExaminationService> logger)
    {
        _unitOfWork = unitOfWork;
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    public async Task<ExaminationDto?> GetExaminationAsync(int id)
    {
        var examination = await _unitOfWork.Examinations.GetByIdWithDetailsAsync(id);
        return examination == null ? null : MapToExaminationDto(examination);
    }

    public async Task<ExaminationDto?> GetExaminationForDoctorAsync(int doctorId, int examinationId)
    {
        var examination = await _unitOfWork.Examinations.GetByIdWithDetailsAsync(examinationId);
        if (examination == null || examination.DoctorId != doctorId)
            return null;
        return MapToExaminationDto(examination);
    }

    public async Task<List<ExaminationListItemDto>> GetExaminationsAsync(int? doctorId = null, string? searchQuery = null, string? riskLevel = null, DateOnly? date = null)
    {
        var examinations = await _unitOfWork.Examinations.GetFilteredAsync(doctorId, searchQuery, riskLevel, date);
        return examinations.Select(MapToExaminationListDto).ToList();
    }

    public async Task<ExaminationDto> CreateExaminationAsync(int doctorId, CreateExaminationDto dto)
    {
        var examination = new Examination
        {
            DoctorId = doctorId,
            PatientName = dto.PatientName,
            PatientPhone = dto.PatientPhone,
            PatientAge = dto.PatientAge,
            AnatomSite = dto.AnatomSite,
            Sex = dto.Sex,
            Diagnosis = dto.Diagnosis,
            Treatment = dto.Treatment,
            FollowUp = dto.FollowUp,
            RiskLevel = dto.RiskLevel,
            FollowUpDate = dto.FollowUpDate,
            Status = dto.Status,
        };

        await _unitOfWork.Examinations.AddAsync(examination);
        await _unitOfWork.SaveChangesAsync();
        return MapToExaminationDto(examination);
    }

    public async Task<ExaminationDto?> UpdateExaminationAsync(int doctorId, int id, UpdateExaminationDto dto)
    {
        var existingExamination = await _unitOfWork.Examinations.GetByIdWithDetailsAsync(id);
        if (existingExamination == null || existingExamination.DoctorId != doctorId)
            return null;

        existingExamination.PatientName = dto.PatientName ?? existingExamination.PatientName;
        existingExamination.PatientPhone = dto.PatientPhone ?? existingExamination.PatientPhone;
        if (dto.PatientAge.HasValue)
            existingExamination.PatientAge = dto.PatientAge.Value;
        existingExamination.AnatomSite = dto.AnatomSite ?? existingExamination.AnatomSite;
        existingExamination.Sex = dto.Sex ?? existingExamination.Sex;
        existingExamination.Diagnosis = dto.Diagnosis ?? existingExamination.Diagnosis;
        existingExamination.Treatment = dto.Treatment ?? existingExamination.Treatment;
        if (dto.Status.HasValue)
            existingExamination.Status = dto.Status.Value;
        existingExamination.FollowUp = dto.FollowUp ?? existingExamination.FollowUp;
        existingExamination.RiskLevel = dto.RiskLevel ?? existingExamination.RiskLevel;
        existingExamination.FollowUpDate = dto.FollowUpDate ?? existingExamination.FollowUpDate;

        await _unitOfWork.Examinations.UpdateAsync(existingExamination);
        await _unitOfWork.SaveChangesAsync();
        return MapToExaminationDto(existingExamination);
    }

    public async Task<bool> DeleteExaminationAsync(int doctorId, int id)
    {
        // Load with details so we can clean up the associated physical files
        // (uploaded images, AI heatmaps, and generated report PDFs) before deletion.
        var examination = await _unitOfWork.Examinations.GetByIdWithDetailsAsync(id);
        if (examination == null || examination.DoctorId != doctorId)
            return false;

        await CleanupExaminationFilesAsync(examination);

        await _unitOfWork.Examinations.DeleteByIdAsync(id);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Deletes the physical files associated with an examination (uploaded images,
    /// AI prediction heatmaps, and generated report PDFs). Failures are logged but
    /// do not abort the examination deletion so the database stays consistent.
    /// </summary>
    private async Task CleanupExaminationFilesAsync(Examination examination)
    {
        foreach (var image in examination.Images ?? Enumerable.Empty<ExaminationImage>())
        {
            await TryDeleteFileAsync(image.FilePath, $"image {image.ImageId}");

            if (!string.IsNullOrWhiteSpace(image.AiResult?.HeatmapPath))
                await TryDeleteFileAsync(image.AiResult.HeatmapPath, $"heatmap for image {image.ImageId}");
        }

        foreach (var report in examination.Reports ?? Enumerable.Empty<Report>())
        {
            if (!string.IsNullOrWhiteSpace(report.ReportPath))
                await TryDeleteFileAsync(report.ReportPath, $"report {report.ReportId}");
        }
    }

    private async Task TryDeleteFileAsync(string filePath, string description)
    {
        try
        {
            await _fileStorageService.DeleteFileAsync(filePath);
        }
        catch (Exception ex)
        {
            // File cleanup is best-effort: a missing or locked file must not
            // prevent the examination record from being deleted.
            _logger.LogWarning(
                ex,
                "Failed to delete physical file for {Description} at {FilePath} during examination deletion",
                description,
                filePath);
        }
    }

    public async Task<ExaminationStatsDto> GetStatsAsync(int doctorId)
    {
        var total = await _unitOfWork.Examinations.CountByDoctorAsync(doctorId);
        var today = await _unitOfWork.Examinations.CountByDoctorTodayAsync(doctorId);
        var aiAnalyses = await _unitOfWork.Examinations.CountAiAnalysesByDoctorAsync(doctorId);

        return new ExaminationStatsDto
        {
            Total = total,
            Today = today,
            AiAnalyses = aiAnalyses
        };
    }

    private static ExaminationDto MapToExaminationDto(Examination e)
    {
        var aiResult = e.Images?.Select(i => i.AiResult).FirstOrDefault(p => p != null);

        return new ExaminationDto
        {
            DiagnosisId = e.DiagnosisId,
            DoctorId = e.DoctorId,
            PatientName = e.PatientName,
            PatientPhone = e.PatientPhone,
            PatientAge = e.PatientAge,
            AnatomSite = e.AnatomSite,
            Sex = e.Sex,
            Diagnosis = e.Diagnosis,
            Treatment = e.Treatment,
            FollowUp = e.FollowUp,
            RiskLevel = e.RiskLevel,
            FollowUpDate = e.FollowUpDate,
            Status = e.Status,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt,
            Images = e.Images?.Select(MapToImageDto).ToList() ?? new(),
            AiAnalysis = aiResult == null ? null : MapToPredictionDto(aiResult),
            Doctor = e.Doctor?.DoctorProfile == null ? null : new DoctorProfileDto
            {
                DoctorId = e.Doctor.DoctorProfile.DoctorId,
                FullName = e.Doctor.DoctorProfile.FullName,
                ClinicName = e.Doctor.DoctorProfile.ClinicName,
                ClinicAddress = e.Doctor.DoctorProfile.ClinicAddress,
                Phone = e.Doctor.DoctorProfile.Phone,
                Specialization = e.Doctor.DoctorProfile.Specialization,
                YearsExperience = e.Doctor.DoctorProfile.YearsExperience,
            }
        };
    }

    private static ExaminationListItemDto MapToExaminationListDto(Examination e)
    {
        return new ExaminationListItemDto
        {
            DiagnosisId = e.DiagnosisId,
            PatientName = e.PatientName,
            PatientPhone = e.PatientPhone,
            AnatomSite = e.AnatomSite,
            Diagnosis = e.Diagnosis ?? "Pending",
            RiskLevel = e.RiskLevel,
            CreatedAt = e.CreatedAt
        };
    }

    private static ImageDto MapToImageDto(ExaminationImage i)
    {
        return new ImageDto
        {
            ImageId = i.ImageId,
            FilePath = i.FilePath,
            Format = i.Format,
            Size = i.Size,
            UploadDate = i.UploadDate,
            BodyPart = i.BodyPart,
            AiResult = i.AiResult == null ? null : MapToPredictionDto(i.AiResult)
        };
    }

    private static PredictionDto MapToPredictionDto(Prediction p)
    {
        var findingsList = !string.IsNullOrEmpty(p.Findings)
            ? new List<string> { p.Findings }
            : new List<string>();

        return new PredictionDto
        {
            PredictionId = p.PredictionId,
            Classification = p.Classification,
            ConfidenceScore = p.ConfidenceScore,
            ModelVersion = p.ModelVersion,
            CreatedAt = p.CreatedAt,
            Findings = findingsList,
            HeatmapPath = p.HeatmapPath
        };
    }
}
