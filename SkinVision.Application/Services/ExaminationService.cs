using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Domain.Entities;

namespace SkinVision.Application.Services;

public class ExaminationService : IExaminationService
{
    private readonly IUnitOfWork _unitOfWork;

    public ExaminationService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
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

    public async Task<List<ExaminationListItemDto>> GetExaminationsAsync(int? doctorId = null, string? searchQuery = null, string? riskLevel = null)
    {
        var examinations = await _unitOfWork.Examinations.GetFilteredAsync(doctorId, searchQuery, riskLevel);
        return examinations.Select(MapToExaminationListDto).ToList();
    }

    public async Task<ExaminationDto> CreateExaminationAsync(int doctorId, CreateExaminationDto dto)
    {
        var examination = new Examination
        {
            DoctorId = doctorId,
            PatientName = dto.PatientName,
            PatientPhone = dto.PatientPhone,
            PatientAge = dto.PatientAge ?? 0,
            Reason = dto.Reason,
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
        var examination = await _unitOfWork.Examinations.GetByIdAsync(id);
        if (examination == null || examination.DoctorId != doctorId)
            return false;

        await _unitOfWork.Examinations.DeleteByIdAsync(id);
        await _unitOfWork.SaveChangesAsync();
        return true;
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
            Reason = e.Reason,
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
            Reason = e.Reason,
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
            Findings = findingsList
        };
    }
}
