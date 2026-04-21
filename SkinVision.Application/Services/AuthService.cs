using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Domain.Entities;
using SkinVision.Domain.Enums;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SkinVision.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;

    public AuthService(IUnitOfWork unitOfWork, IConfiguration configuration)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
    }

    public async Task<RegisterResponseDto?> RegisterAsync(RegisterRequestDto request)
    {
        if (await _unitOfWork.Users.FindByEmailWithProfileAsync(request.Email) != null)
            return null;

        var user = await _unitOfWork.Users.AddAsync(new User
        {
            Username = request.FullName,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = UserRole.Doctor,
            DoctorProfile = new DoctorProfile
            {
                FullName = request.FullName,
                ClinicName = request.ClinicName,
                ClinicAddress = request.ClinicAddress,
                Phone = request.Phone
            }
        });

        await _unitOfWork.SaveChangesAsync();

        var token = GenerateJwtToken(user);

        return new RegisterResponseDto
        {
            Token = token,
            User = MapToUserDto(user)
        };
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var user = await _unitOfWork.Users.FindByEmailWithProfileAsync(request.Email);

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

    public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto request)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
            return false;

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            return false;

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();
        return true;
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
            }
        };
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
            new Claim(ClaimTypes.Role, (user.Role ?? UserRole.Patient).ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"] ?? "SkinVision",
            audience: _configuration["Jwt:Audience"] ?? "SkinVision",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
