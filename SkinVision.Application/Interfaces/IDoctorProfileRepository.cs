using SkinVision.Domain.Entities;

namespace SkinVision.Application.Interfaces;

public interface IDoctorProfileRepository : IBaseRepository<DoctorProfile>
{
    Task<DoctorProfile?> GetByUserIdAsync(int userId);
}
