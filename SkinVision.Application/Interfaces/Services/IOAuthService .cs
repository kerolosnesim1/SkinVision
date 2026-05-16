using SkinVision.Application.DTOs;

namespace SkinVision.Application.Interfaces.Services;

public interface IOAuthService
{
    Task<ExternalLoginResponseDto> HandleExternalLoginAsync(string provider, string providerUserId, string email, string name);

    Task<bool> LinkExternalLoginAsync(int userId, string provider, string providerUserId, string email);
}
