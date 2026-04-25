using SkinVision.Application.DTOs;

namespace SkinVision.Application.Interfaces.Services;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
    Task<RegisterResponseDto?> RegisterAsync(RegisterRequestDto request);
    Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto request);

    Task RequestPasswordResetAsync(ForgotPasswordRequestDto request);

    Task<(bool Success, string? ErrorMessage)> ResetPasswordWithTokenAsync(ResetPasswordWithTokenDto request);
}
