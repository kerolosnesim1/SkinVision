using System.ComponentModel.DataAnnotations;
using SkinVision.Domain.Enums;

namespace SkinVision.Application.DTOs;

public class UserDto
{
    public int UserId { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public UserRole? Role { get; set; }
    public DoctorProfileDto? DoctorProfile { get; set; }
}

public class DoctorProfileDto
{
    public int DoctorId { get; set; }
    public string? FullName { get; set; }
    public string? ClinicName { get; set; }
    public string? ClinicAddress { get; set; }
    public string? Phone { get; set; }
    public string? Specialization { get; set; }
    public int? YearsExperience { get; set; }
}
public class UpdateDoctorProfileDto
{
    [StringLength(100)]
    public string? FullName { get; set; }

    [StringLength(200)]
    public string? ClinicName { get; set; }

    [StringLength(500)]
    public string? ClinicAddress { get; set; }

    [StringLength(30)]
    public string? Phone { get; set; }

    [StringLength(200)]
    public string? Specialization { get; set; }

    [Range(0, 40, ErrorMessage = "Years of experience must be between 0 and 40.")]
    public int? YearsExperience { get; set; }
}
