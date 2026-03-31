using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces;
using SkinVision.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SkinVision.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public RegisterResponseDto? Register(RegisterRequestDto request)
    {
        if (_userRepository.FindByEmailWithProfile(request.Email) != null)
            return null;

        var user = _userRepository.Add(new User
        {
            Username = request.FullName,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "doctor",
            DoctorProfile = new DoctorProfile
            {
                FullName = request.FullName,
                ClinicName = request.ClinicName,
                ClinicAddress = request.ClinicAddress,
                Phone = request.Phone
            }
        });

        var token = GenerateJwtToken(user!);

        return new RegisterResponseDto
        {
            Token = token,
            User = MapToUserDto(user!)
        };
    }

    public LoginResponseDto? Login(LoginRequestDto request)
    {
        var user = _userRepository.FindByEmailWithProfile(request.Email);

        if (user == null)
            return null;

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null;

        var token = GenerateJwtToken(user);

        return new LoginResponseDto
        {
            Token = token,
            User = MapToUserDto(user)
        };
    }

    private static UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            UserId = user.UserId,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            DoctorProfile = user.DoctorProfile == null ? null : new DoctorProfileDto
            {
                DoctorId = user.DoctorProfile.DoctorId,
                FullName = user.DoctorProfile.FullName,
                ClinicName = user.DoctorProfile.ClinicName,
                ClinicAddress = user.DoctorProfile.ClinicAddress,
                Phone = user.DoctorProfile.Phone,
                Specialization = user.DoctorProfile.Specialization,
                YearsExperience = user.DoctorProfile.YearsExperience,
                HospitalAffiliation = user.DoctorProfile.HospitalAffiliation
            }
        };
    }
    public bool ChangePassword(int userId, ChangePasswordDto request)
    {
        var user = _userRepository.FindById(userId);
        if (user == null)
            return false;

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            return false;

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        _userRepository.Update(user);
        return true;
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _configuration["Jwt:Key"] ?? "SkinVision_Default_Secret_Key_2026!"
        ));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role ?? "patient")
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"] ?? "SkinVision",
            audience: _configuration["Jwt:Audience"] ?? "SkinVision",
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
