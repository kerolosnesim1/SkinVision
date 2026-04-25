using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Domain.Entities;
using SkinVision.Domain.Enums;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace SkinVision.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUnitOfWork unitOfWork,
        IConfiguration configuration,
        ILogger<AuthService> logger)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
        _logger = logger;
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

    public async Task RequestPasswordResetAsync(ForgotPasswordRequestDto request)
    {
        var email = request.Email.Trim();
        var user = await _unitOfWork.Users.FindByEmailWithProfileAsync(email);
        if (user == null)
            return;

        var token = GeneratePasswordResetToken();
        user.PasswordResetToken = token;
        user.PasswordResetTokenExpires = DateTime.UtcNow.AddHours(1);
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        var baseUrl = _configuration["Frontend:BaseUrl"]?.TrimEnd('/') ?? "http://localhost:4200";
        var link = $"{baseUrl}/reset-password?token={Uri.EscapeDataString(token)}";
        _logger.LogInformation("Password reset for {Email}. Reset link: {ResetLink}", user.Email, link);
    }

    public async Task<(bool Success, string? ErrorMessage)> ResetPasswordWithTokenAsync(ResetPasswordWithTokenDto request)
    {
        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 8)
            return (false, "Password must be at least 8 characters.");

        var user = await _unitOfWork.Users.FindByPasswordResetTokenAsync(request.Token);
        if (user == null
            || user.PasswordResetTokenExpires == null
            || user.PasswordResetTokenExpires < DateTime.UtcNow)
            return (false, "Invalid or expired reset link. Please request a new one.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpires = null;
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();
        return (true, null);
    }

    private static string GeneratePasswordResetToken()
    {
        var bytes = new byte[32];
        RandomNumberGenerator.Fill(bytes);
        return Convert.ToBase64String(bytes)
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');
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
