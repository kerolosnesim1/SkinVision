using SkinVision.Domain.Entities;

namespace SkinVision.Application.Interfaces.Repositories;

public interface IReportRepository : IBaseRepository<Report>
{
    Task<List<Report>> GetByExaminationIdAsync(int diagnosisId);
    Task<List<Report>> GetByDoctorIdAsync(int doctorId);
    Task<Report?> GetByIdWithExaminationAsync(int reportId);
}
