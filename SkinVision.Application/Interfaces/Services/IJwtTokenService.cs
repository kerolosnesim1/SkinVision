using SkinVision.Domain.Entities;

namespace SkinVision.Application.Interfaces.Services;

public interface IJwtTokenService
{
    string GenerateToken(User user);
    int? ValidateAndGetUserId(string token);
}