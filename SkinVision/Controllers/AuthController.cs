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
