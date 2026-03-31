using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinVision.Application.DTOs;
using SkinVision.Application.Services;

namespace SkinVision.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequestDto request)
    {
        var response = _authService.Login(request);

        if (response == null)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        return Ok(response);
    }
    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequestDto request)
    {
        var response = _authService.Register(request);
        if (response == null)
        {
            return BadRequest(new { message = "Registration failed. Email might already be in use." });
        }
        return Ok(response);
    }
    [Authorize]
    [HttpPost("change-password")]
    public IActionResult ChangePassword([FromBody] ChangePasswordDto request)
    {
        var userId = GetUserIdFromToken();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token" });
        }
        var success = _authService.ChangePassword(userId.Value, request);
        if (!success)
        {
            return BadRequest(new { message = "Current password is incorrect" });
        }
        return Ok(new { message = "Password changed successfully" });
    }

    private int? GetUserIdFromToken()
    {
        var value = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(value, out var id) ? id : null;
    }
}
