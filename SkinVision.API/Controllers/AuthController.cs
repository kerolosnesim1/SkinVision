using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Services;

namespace SkinVision.Controllers;

public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var response = await _authService.LoginAsync(request);

        if (response == null)
            return Unauthorized(new { message = "Invalid email or password" });

        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        var response = await _authService.RegisterAsync(request);
        if (response == null)
            return BadRequest(new { message = "Registration failed. Email might already be in use." });

        return CreatedAtAction(nameof(Login), response);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request?.Email))
            return BadRequest(new { message = "Email is required." });

        await _authService.RequestPasswordResetAsync(request);
        return Ok(new
        {
            message = "If an account exists for this email, password reset instructions have been sent."
        });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPasswordWithToken([FromBody] ResetPasswordWithTokenDto request)
    {
        if (string.IsNullOrWhiteSpace(request?.Token) || string.IsNullOrWhiteSpace(request.NewPassword))
            return BadRequest(new { message = "Token and new password are required." });

        var (success, error) = await _authService.ResetPasswordWithTokenAsync(request);
        if (!success)
            return BadRequest(new { message = error });

        return Ok(new { message = "Your password has been reset. You can sign in." });
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto request)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized(new { message = "Invalid token" });

        var success = await _authService.ChangePasswordAsync(userId.Value, request);
        if (!success)
            return BadRequest(new { message = "Current password is incorrect" });

        return Ok(new { message = "Password changed successfully" });
    }
}
