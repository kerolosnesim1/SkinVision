using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Domain.Entities;
using SkinVision.Domain.Enums;
using System.Security.Cryptography;

namespace SkinVision.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;
    private readonly IEmailService _emailService;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthService(
        IUnitOfWork unitOfWork,
        IConfiguration configuration,
        ILogger<AuthService> logger,
        IEmailService emailService,
        IJwtTokenService jwtTokenService)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
        _logger = logger;
        _emailService = emailService;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<RegisterResponseDto?> RegisterAsync(RegisterRequestDto request)
    {
        if (await _unitOfWork.Users.FindByEmailWithProfileAsync(request.Email) != null)
        {
            _logger.LogWarning("Registration rejected for existing email");
            return null;
        }

        var user = await _unitOfWork.Users.AddAsync(new User
        {
            Username = request.Email,
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

        var token = _jwtTokenService.GenerateToken(user);

        _logger.LogInformation("Registered new {Role} user {UserId}", user.Role, user.UserId);

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
        {
            _logger.LogWarning("Login failed for unknown email");
            return null;
        }

        if (!user.IsActive)
        {
            _logger.LogWarning("Login failed for user {UserId}: account is deactivated", user.UserId);
            return null;
        }

        if (string.IsNullOrEmpty(user.PasswordHash))
        {
            _logger.LogWarning("Login failed for user {UserId}: no password set (OAuth-only account)", user.UserId);
            return null;
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            _logger.LogWarning("Login failed for user {UserId}", user.UserId);
            return null;
        }

        // Update last login timestamp
        user.LastLoginAt = DateTime.UtcNow;
        await _unitOfWork.SaveChangesAsync();

        var token = _jwtTokenService.GenerateToken(user);
        _logger.LogInformation("User {UserId} logged in successfully", user.UserId);

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
        {
            _logger.LogWarning("Password change failed for missing user {UserId}", userId);
            return false;
        }
            

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
        {
            _logger.LogWarning("Password change rejected for user {UserId}", userId);
            return false;
        }
            

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation("Password changed successfully for user {UserId}", userId);
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
        await _unitOfWork.SaveChangesAsync();

        var frontendBaseUrl = _configuration["Frontend:BaseUrl"] ?? "http://localhost:4200";
        var resetUrl = $"{frontendBaseUrl}/reset-password";

        try
        {
            await _emailService.SendPasswordResetEmailAsync(user.Email, token, resetUrl);
            _logger.LogInformation(
                "Password reset token generated and email sent for user {UserId}; expires at {ExpiresAtUtc}",
                user.UserId,
                user.PasswordResetTokenExpires);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Failed to send password-reset email for user {UserId}. " +
                "Token was saved but email delivery failed. Reset link: {ResetUrl}?token={Token}",
                user.UserId, resetUrl, token);
        }
    }

    public async Task<(bool Success, string? ErrorMessage)> ResetPasswordWithTokenAsync(ResetPasswordWithTokenDto request)
    {
        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 8)
            return (false, "Password must be at least 8 characters.");

        var user = await _unitOfWork.Users.FindByPasswordResetTokenAsync(request.Token);
        if (user == null
            || user.PasswordResetTokenExpires == null
            || user.PasswordResetTokenExpires < DateTime.UtcNow)
        {
            _logger.LogWarning("Invalid or expired password reset token used");
            return (false, "Invalid or expired reset link. Please request a new one.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpires = null;
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation("Password reset completed for user {UserId}", user.UserId);
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
}
