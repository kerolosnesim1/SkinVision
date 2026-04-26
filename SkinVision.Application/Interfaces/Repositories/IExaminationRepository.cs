using SkinVision.Domain.Entities;

namespace SkinVision.Application.Interfaces.Repositories;

public interface IExaminationRepository : IBaseRepository<Examination>
{
    Task<Examination?> GetByIdWithDetailsAsync(int id);
    Task<List<Examination>> GetFilteredAsync(int? doctorId, string? searchQuery, string? riskLevel, DateOnly? date = null);
    Task<int> CountByDoctorAsync(int doctorId);
    Task<int> CountByDoctorTodayAsync(int doctorId);
    Task<int> CountAiAnalysesByDoctorAsync(int doctorId);
}
