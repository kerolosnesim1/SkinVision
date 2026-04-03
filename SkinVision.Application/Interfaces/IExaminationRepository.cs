using SkinVision.Domain.Entities;

namespace SkinVision.Application.Interfaces;

public interface IExaminationRepository
{
    Task<Examination?> GetByIdWithDetailsAsync(int id);
    Task<List<Examination>> GetFilteredAsync(int? doctorId, string? searchQuery);
    Task<Examination> AddAsync(Examination examination);
    Task<Examination> UpdateAsync(Examination examination);
    Task<Examination?> FindAsync(int id);
    Task<bool> DeleteAsync(int id);
    Task<int> CountByDoctorAsync(int doctorId);
    Task<int> CountByDoctorTodayAsync(int doctorId);
    Task<int> CountAiAnalysesByDoctorAsync(int doctorId);
}
