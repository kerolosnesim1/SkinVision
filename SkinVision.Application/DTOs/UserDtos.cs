using System;
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
    public string? FullName { get; set; }
    public string? ClinicName { get; set; }
    public string? ClinicAddress { get; set; }
    public string? Phone { get; set; }
    public string? Specialization { get; set; }
    public int? YearsExperience { get; set; }
}
