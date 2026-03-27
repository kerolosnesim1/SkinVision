using SkinVision.Application.DTOs;

namespace SkinVision.Application.Services;

public interface IAuthService
{
    LoginResponseDto? Login(LoginRequestDto request);
    RegisterResponseDto? Register(RegisterRequestDto request);
}
