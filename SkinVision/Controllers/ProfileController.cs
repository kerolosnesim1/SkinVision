using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Services;

namespace SkinVision.Controllers;

[Authorize(Roles = nameof(Domain.Enums.UserRole.Doctor))]
public class ProfileController(IDoctorProfileService doctorProfileService) : BaseApiController
{
    private readonly IDoctorProfileService _doctorProfileService = doctorProfileService;

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var profile = await _doctorProfileService.GetDoctorProfileAsync(userId.Value);
        if (profile == null)
            return NotFound();

        return Ok(profile);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateDoctorProfileDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var updated = await _doctorProfileService.UpdateDoctorProfileAsync(userId.Value, dto);
        if (updated == null)
            return NotFound(new { message = "Doctor profile not found" });

        return Ok(updated);
    }
}
