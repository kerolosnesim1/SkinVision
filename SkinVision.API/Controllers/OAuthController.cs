using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Application.Interfaces.Repositories;

namespace SkinVision.Controllers;

public class OAuthController : BaseApiController
{
    private readonly IOAuthService _oAuthService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;
    private readonly ILogger<OAuthController> _logger;

    public OAuthController(
        IOAuthService oAuthService,
        IUnitOfWork unitOfWork,
        IConfiguration configuration,
        ILogger<OAuthController> logger)
    {
        _oAuthService = oAuthService;
        _unitOfWork = unitOfWork;
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Initiates the Google OAuth sign-in flow by redirecting to Google.
    /// </summary>
    [HttpGet("google-login")]
    public IActionResult GoogleLogin()
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Action(nameof(GoogleCallback)),
            Items = { { "scheme", GoogleDefaults.AuthenticationScheme } }
        };

        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    /// <summary>
    /// Handles the callback from Google after authentication.
    /// Reads claims, processes the login, and redirects to the frontend with a JWT token.
    /// </summary>
    [HttpGet("google-callback")]
    public async Task<IActionResult> GoogleCallback()
    {
        var frontendBaseUrl = _configuration["Frontend:BaseUrl"] ?? "http://localhost:4200";

        try
        {
            var result = await HttpContext.AuthenticateAsync("ExternalCookies");
            if (!result.Succeeded || result.Principal == null)
            {
                _logger.LogWarning("Google OAuth callback failed: authentication result unsuccessful");
                return Redirect($"{frontendBaseUrl}/auth/callback?error=authentication_failed");
            }

            var claims = result.Principal.Claims.ToList();
            var providerUserId = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var name = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(providerUserId) || string.IsNullOrEmpty(email))
            {
                _logger.LogWarning("Google OAuth callback: missing required claims (providerUserId or email)");
                return Redirect($"{frontendBaseUrl}/auth/callback?error=missing_claims");
            }

            var response = await _oAuthService.HandleExternalLoginAsync(
                "Google", providerUserId, email, name ?? email);

            // Clean up the external cookie
            await HttpContext.SignOutAsync("ExternalCookies");

            if (response.RequiresLinking)
            {
                return Redirect($"{frontendBaseUrl}/auth/callback?error=requires_linking&message={Uri.EscapeDataString(response.Message ?? "")}");
            }

            // Encode user data as base64 JSON to pass via URL
            var userJson = System.Text.Json.JsonSerializer.Serialize(response.User);
            var userBase64 = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(userJson));

            return Redirect($"{frontendBaseUrl}/auth/callback?token={response.Token}&user={userBase64}&isNewUser={response.IsNewUser}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during Google OAuth callback");
            return Redirect($"{frontendBaseUrl}/auth/callback?error=server_error");
        }
    }

    /// <summary>
    /// Initiates Google account linking. The JWT token must be passed as a query parameter
    /// because this endpoint triggers a browser redirect (Challenge), which cannot carry
    /// an Authorization header.
    /// </summary>
    [HttpGet("link-google")]
    public IActionResult LinkGoogle([FromQuery] string? token)
    {
        var frontendBaseUrl = _configuration["Frontend:BaseUrl"] ?? "http://localhost:4200";

        if (string.IsNullOrEmpty(token))
        {
            return Redirect($"{frontendBaseUrl}/auth/callback?error=missing_token");
        }

        var userId = ValidateTokenAndGetUserId(token);
        if (userId == null)
        {
            return Redirect($"{frontendBaseUrl}/auth/callback?error=invalid_token");
        }

        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Action(nameof(LinkGoogleCallback)),
            Items =
            {
                { "scheme", GoogleDefaults.AuthenticationScheme },
                { "userId", userId.Value.ToString() }
            }
        };

        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    /// <summary>
    /// Callback after Google auth for account linking.
    /// </summary>
    [HttpGet("link-google-callback")]
    public async Task<IActionResult> LinkGoogleCallback()
    {
        var frontendBaseUrl = _configuration["Frontend:BaseUrl"] ?? "http://localhost:4200";

        try
        {
            var result = await HttpContext.AuthenticateAsync("ExternalCookies");
            if (!result.Succeeded || result.Principal == null)
            {
                return Redirect($"{frontendBaseUrl}/dashboard/profile?linkError=authentication_failed");
            }

            // Retrieve the userId that was stored in AuthenticationProperties by LinkGoogle
            var userIdString = result.Properties?.Items["userId"];
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            {
                return Redirect($"{frontendBaseUrl}/login?error=unauthorized");
            }

            var claims = result.Principal.Claims.ToList();
            var providerUserId = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(providerUserId) || string.IsNullOrEmpty(email))
            {
                return Redirect($"{frontendBaseUrl}/dashboard/profile?linkError=missing_claims");
            }

            var success = await _oAuthService.LinkExternalLoginAsync(
                userId, "Google", providerUserId, email);

            await HttpContext.SignOutAsync("ExternalCookies");

            if (!success)
            {
                return Redirect($"{frontendBaseUrl}/dashboard/profile?linkError=already_linked");
            }

            return Redirect($"{frontendBaseUrl}/dashboard/profile?linkSuccess=true");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during Google account linking");
            return Redirect($"{frontendBaseUrl}/dashboard/profile?linkError=server_error");
        }
    }

    /// <summary>
    /// Unlinks a Google account from the currently authenticated user.
    /// Only allowed if the user has a password set (otherwise they'd be locked out).
    /// </summary>
    [HttpDelete("unlink-google")]
    [Authorize]
    public async Task<IActionResult> UnlinkGoogle()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized(new { message = "Invalid token" });

        var user = await _unitOfWork.Users.GetByIdAsync(userId.Value);
        if (user == null)
            return NotFound(new { message = "User not found" });

        // Prevent unlinking if user has no password (OAuth-only account)
        if (string.IsNullOrEmpty(user.PasswordHash))
        {
            return BadRequest(new { message = "Cannot unlink Google account. You must set a password first, otherwise you won't be able to log in." });
        }

        var externalLogins = await _unitOfWork.ExternalLogins.FindByUserIdAsync(userId.Value);
        var googleLogin = externalLogins.FirstOrDefault(e => e.Provider == "Google");

        if (googleLogin == null)
        {
            return NotFound(new { message = "No Google account linked" });
        }

        await _unitOfWork.ExternalLogins.RemoveAsync(googleLogin);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Unlinked Google account for user {UserId}", userId.Value);

        return Ok(new { message = "Google account unlinked successfully" });
    }

    /// <summary>
    /// Validates a JWT token passed as a query parameter and extracts the user ID.
    /// Used for the LinkGoogle flow where the token can't be sent as an Authorization header.
    /// </summary>
    private int? ValidateTokenAndGetUserId(string token)
    {
        var keyString = string.IsNullOrEmpty(_configuration["Jwt:Key"])
            ? "SkinVision_Default_Secret_Key_2026!"
            : _configuration["Jwt:Key"]!;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));

        var handler = new JwtSecurityTokenHandler();
        var parameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = _configuration["Jwt:Issuer"] ?? "SkinVision",
            ValidateAudience = true,
            ValidAudience = _configuration["Jwt:Audience"] ?? "SkinVision",
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key
        };

        try
        {
            var principal = handler.ValidateToken(token, parameters, out _);
            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var id) ? id : null;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Invalid JWT token provided for Google account linking");
            return null;
        }
    }
}
