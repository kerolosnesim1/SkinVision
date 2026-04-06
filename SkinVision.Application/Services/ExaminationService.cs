using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces;
using SkinVision.Domain.Entities;

namespace SkinVision.Application.Services;

public class ExaminationService : IExaminationService
{
    private readonly IExaminationRepository _examinationRepository;

    public ExaminationService(IExaminationRepository examinationRepository)
    {
        _examinationRepository = examinationRepository;
    }

    public async Task<ExaminationDto?> GetExaminationAsync(int id)
    {
        var examination = await _examinationRepository.GetByIdWithDetailsAsync(id);
        return examination == null ? null : MapToExaminationDto(examination);
    }

    public async Task<List<ExaminationListItemDto>> GetExaminationsAsync(int? doctorId = null, string? searchQuery = null, string? riskLevel = null)
    {
        var examinations = await _examinationRepository.GetFilteredAsync(doctorId, searchQuery, riskLevel);
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
            Status = dto.Status ??"InProgress",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await _examinationRepository.AddAsync(examination);
        return MapToExaminationDto(created);
    }
    public async Task<ExaminationDto?> UpdateExaminationAsync(int doctorId, int id, UpdateExaminationDto dto)
    {
        var existingExamination = await _examinationRepository.GetByIdWithDetailsAsync(id);
        if (existingExamination == null || existingExamination.DoctorId != doctorId)
        {
            return null;
        }
        existingExamination.Diagnosis = dto.Diagnosis ?? existingExamination.Diagnosis;
        existingExamination.Treatment = dto.Treatment ?? existingExamination.Treatment;
        existingExamination.Status = dto.Status ?? existingExamination.Status;
        existingExamination.FollowUp = dto.FollowUp ?? existingExamination.FollowUp;
        existingExamination.RiskLevel = dto.RiskLevel ?? existingExamination.RiskLevel;
        existingExamination.FollowUpDate = dto.FollowUpDate ?? existingExamination.FollowUpDate;
        existingExamination.UpdatedAt = DateTime.UtcNow;

        await _examinationRepository.UpdateAsync(existingExamination);
        return MapToExaminationDto(existingExamination);

    }

    public async Task<bool> DeleteExaminationAsync(int doctorId, int id)
    {
        var examination = await _examinationRepository.FindAsync(id);
        if (examination == null || examination.DoctorId != doctorId)
            return false;

        return await _examinationRepository.DeleteAsync(id);
    }

    public async Task<ExaminationStatsDto> GetStatsAsync(int doctorId)
    {
        var total = await _examinationRepository.CountByDoctorAsync(doctorId);
        var today = await _examinationRepository.CountByDoctorTodayAsync(doctorId);
        var aiAnalyses = await _examinationRepository.CountAiAnalysesByDoctorAsync(doctorId);

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
                HospitalAffiliation = e.Doctor.DoctorProfile.HospitalAffiliation
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
