using SkinVision.Application.DTOs;

namespace SkinVision.Application.Services
{
    public interface IExaminationService
    {
        Task<ExaminationDto?> GetExaminationAsync(int id);
        Task<List<ExaminationListItemDto>> GetExaminationsAsync(int? doctorId = null, string? searchQuery = null, string? riskLevel = null);
        Task<ExaminationDto> CreateExaminationAsync(int doctorId, CreateExaminationDto dto);
        Task<ExaminationDto?> UpdateExaminationAsync(int doctorId, int id, UpdateExaminationDto dto);
        Task<bool> DeleteExaminationAsync(int doctorId, int id);
        Task<ExaminationStatsDto> GetStatsAsync(int doctorId);
    }
}
