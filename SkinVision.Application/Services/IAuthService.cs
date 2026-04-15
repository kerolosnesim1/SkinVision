using SkinVision.Application.DTOs;

namespace SkinVision.Application.Services;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
    Task<RegisterResponseDto?> RegisterAsync(RegisterRequestDto request);
    Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto request);
}
