using SkinVision.Application.DTOs;

namespace SkinVision.Application.Services;

public interface IDoctorProfileService
{
    Task<DoctorProfileDto?> GetDoctorProfileAsync(int userId);
    Task<DoctorProfileDto?> UpdateDoctorProfileAsync(int userId, UpdateDoctorProfileDto dto);
}
