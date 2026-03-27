using SkinVision.Application.DTOs;

namespace SkinVision.Application.Services
{
    public interface IExaminationService
    {
        Task<ExaminationDto?> GetExaminationAsync(int id);
        Task<List<ExaminationListItemDto>> GetExaminationsAsync(int? doctorId = null, string? searchQuery = null);
        Task<ExaminationDto> CreateExaminationAsync(int doctorId, CreateExaminationDto dto);
        // Task<ExaminationDto?> UpdateExaminationAsync(int id, UpdateExaminationDto dto); // Commenting out until Update DTO is defined or not needed
        Task<bool> DeleteExaminationAsync(int id);
        Task<ExaminationStatsDto> GetStatsAsync(int doctorId);
    }
}
