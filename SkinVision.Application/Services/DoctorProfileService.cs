using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces;
using SkinVision.Domain.Entities;

namespace SkinVision.Application.Services;

public class DoctorProfileService(IDoctorProfileRepository doctorProfileRepository) : IDoctorProfileService
{
    private readonly IDoctorProfileRepository _doctorProfileRepository = doctorProfileRepository;

    public async Task<DoctorProfileDto?> GetDoctorProfileAsync(int userId)
    {
        var profile = await _doctorProfileRepository.GetByUserIdAsync(userId);
        return profile == null ? null : MapToDto(profile);
    }

    public async Task<DoctorProfileDto?> UpdateDoctorProfileAsync(int userId, UpdateDoctorProfileDto dto)
    {
        var profile = await _doctorProfileRepository.GetByUserIdAsync(userId);
        if (profile == null)
            return null;

        profile.FullName = dto.FullName ?? profile.FullName;
        profile.ClinicName = dto.ClinicName ?? profile.ClinicName;
        profile.ClinicAddress = dto.ClinicAddress ?? profile.ClinicAddress;
        profile.Phone = dto.Phone ?? profile.Phone;
        profile.Specialization = dto.Specialization ?? profile.Specialization;
        profile.YearsExperience = dto.YearsExperience ?? profile.YearsExperience;
 
        var updatedProfile = await _doctorProfileRepository.UpdateAsync(profile);
        return MapToDto(updatedProfile);
    }

    private static DoctorProfileDto MapToDto(DoctorProfile profile) => new()
    {
        DoctorId = profile.DoctorId,
        FullName = profile.FullName,
        ClinicName = profile.ClinicName,
        ClinicAddress = profile.ClinicAddress,
        Phone = profile.Phone,
        Specialization = profile.Specialization,
        YearsExperience = profile.YearsExperience,
    };
}
