using SkinVision.Application.DTOs;

namespace SkinVision.Application.Interfaces.Services;

public interface IDoctorProfileService
{
    Task<DoctorProfileDto?> GetDoctorProfileAsync(int userId);
    Task<DoctorProfileDto?> UpdateDoctorProfileAsync(int userId, UpdateDoctorProfileDto dto);
}
