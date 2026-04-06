using SkinVision.Domain.Entities;

namespace SkinVision.Application.Interfaces;

public interface IDoctorProfileRepository
{
    Task<DoctorProfile?> GetByUserIdAsync(int userId);
    Task<DoctorProfile> UpdateAsync(DoctorProfile profile);
}
