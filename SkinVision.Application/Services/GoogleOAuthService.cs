using Microsoft.Extensions.Logging;
using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Domain.Entities;
using SkinVision.Domain.Enums;

namespace SkinVision.Application.Services;

public class GoogleOAuthService : IOAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly ILogger<GoogleOAuthService> _logger;

    public GoogleOAuthService(
        IUnitOfWork unitOfWork,
        IJwtTokenService jwtTokenService,
        ILogger<GoogleOAuthService> logger)
    {
        _unitOfWork = unitOfWork;
        _jwtTokenService = jwtTokenService;
        _logger = logger;
    }

    public async Task<ExternalLoginResponseDto> HandleExternalLoginAsync(
        string provider, string providerUserId, string email, string name)
    {
        // Case 1: External login already exists → return JWT
        var externalLogin = await _unitOfWork.ExternalLogins.FindByProviderAsync(provider, providerUserId);
        if (externalLogin is not null)
        {
            var user = externalLogin.User;
            var token = _jwtTokenService.GenerateToken(user);

            _logger.LogInformation(
                "OAuth login for existing external login: Provider={Provider}, UserId={UserId}",
                provider, user.UserId);

            return new ExternalLoginResponseDto
            {
                Token = token,
                User = MapToUserDto(user),
                IsNewUser = false,
                RequiresLinking = false
            };
        }

        // Case 2: No external login, but email matches an existing user → require explicit linking
        var existingUser = await _unitOfWork.Users.FindByEmailWithProfileAsync(email);
        if (existingUser is not null)
        {
            _logger.LogInformation(
                "OAuth login matched existing user email: Provider={Provider}, UserId={UserId}. Linking required.",
                provider, existingUser.UserId);

            return new ExternalLoginResponseDto
            {
                Token = null,
                User = null,
                IsNewUser = false,
                RequiresLinking = true,
                Message = "An account with this email already exists. Please log in with your password and link your Google account from profile settings."
            };
        }

        // Case 3: No external login, no matching user → auto-register
        var newUser = new User
        {
            Username = email,
            Email = email,
            PasswordHash = null, // OAuth-only user — no password
            Role = UserRole.Doctor,
            DoctorProfile = new DoctorProfile
            {
                FullName = name
            }
        };

        await _unitOfWork.Users.AddAsync(newUser);
        await _unitOfWork.SaveChangesAsync();

        var newExternalLogin = new ExternalLogin
        {
            ExternalLoginId = Guid.NewGuid(),
            UserId = newUser.UserId,
            Provider = provider,
            ProviderUserId = providerUserId,
            ProviderEmail = email
        };

        await _unitOfWork.ExternalLogins.AddAsync(newExternalLogin);
        await _unitOfWork.SaveChangesAsync();

        var newToken = _jwtTokenService.GenerateToken(newUser);

        _logger.LogInformation(
            "OAuth auto-registered new user: Provider={Provider}, UserId={UserId}, Email={Email}",
            provider, newUser.UserId, email);

        return new ExternalLoginResponseDto
        {
            Token = newToken,
            User = MapToUserDto(newUser),
            IsNewUser = true,
            RequiresLinking = false
        };
    }

    public async Task<bool> LinkExternalLoginAsync(
        int userId, string provider, string providerUserId, string email)
    {
        // Validate user exists
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user is null)
        {
            _logger.LogWarning("Link failed: user {UserId} not found", userId);
            return false;
        }

        // Check if this provider+id is already linked to another user
        var existing = await _unitOfWork.ExternalLogins.FindByProviderAsync(provider, providerUserId);
        if (existing is not null)
        {
            _logger.LogWarning(
                "Link failed: Provider={Provider}, ProviderUserId={ProviderUserId} already linked to UserId={ExistingUserId}",
                provider, providerUserId, existing.UserId);
            return false;
        }

        var externalLogin = new ExternalLogin
        {
            ExternalLoginId = Guid.NewGuid(),
            UserId = userId,
            Provider = provider,
            ProviderUserId = providerUserId,
            ProviderEmail = email
        };

        await _unitOfWork.ExternalLogins.AddAsync(externalLogin);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation(
            "Linked external login: Provider={Provider}, UserId={UserId}",
            provider, userId);

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
}
