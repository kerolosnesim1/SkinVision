using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Domain.Entities;
using SkinVision.Domain.Enums;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SkinVision.Infrastructure.InfraServices;

public class JwtTokenService : IJwtTokenService
{
    private readonly SigningCredentials _credentials;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly TokenValidationParameters _validationParameters;
    private readonly ILogger<JwtTokenService> _logger;

    public JwtTokenService(IConfiguration configuration, ILogger<JwtTokenService> logger)
    {
        _logger = logger;

        var key = configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Jwt:Key must be configured.");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        _credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        _issuer = configuration["Jwt:Issuer"] ?? "SkinVision";
        _audience = configuration["Jwt:Audience"] ?? "SkinVision";

        _validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = _issuer,
            ValidateAudience = true,
            ValidAudience = _audience,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = securityKey
        };
    }

    public string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, (user.Role ?? UserRole.Doctor).ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: _credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public int? ValidateAndGetUserId(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        try
        {
            var principal = handler.ValidateToken(token, _validationParameters, out _);
            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var id) ? id : null;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Invalid JWT token provided");
            return null;
        }
    }
}
