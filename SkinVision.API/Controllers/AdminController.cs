using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Domain.Enums;

namespace SkinVision.Controllers;

[Authorize(Roles = nameof(UserRole.Admin))]
public class AdminController : BaseApiController
{
    private readonly IAdminService _adminService;
    private readonly ILogger<AdminController> _logger;

    public AdminController(IAdminService adminService, ILogger<AdminController> logger)
    {
        _adminService = adminService;
        _logger = logger;
    }

    /// <summary>
    /// Get platform-wide statistics for the admin dashboard.
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _adminService.GetStatsAsync();
        return Ok(stats);
    }

    /// <summary>
    /// Get a paginated, filterable list of all users.
    /// </summary>
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] AdminUserFilterDto filter)
    {
        var result = await _adminService.GetUsersAsync(filter);
        return Ok(result);
    }

    /// <summary>
    /// Get detailed information about a specific user.
    /// </summary>
    [HttpGet("users/{id}")]
    public async Task<IActionResult> GetUserDetail(int id)
    {
        var user = await _adminService.GetUserDetailAsync(id);
        if (user == null)
            return NotFound(new { message = "User not found" });

        return Ok(user);
    }

    /// <summary>
    /// Activate or deactivate a user account.
    /// </summary>
    [HttpPatch("users/{id}/status")]
    public async Task<IActionResult> SetUserStatus(int id, [FromBody] SetUserStatusDto dto)
    {
        var adminId = GetCurrentUserId();
        if (adminId == null)
            return Unauthorized();

        var success = await _adminService.SetUserActiveStatusAsync(adminId.Value, id, dto.IsActive);
        if (!success)
            return BadRequest(new { message = "Cannot update user status. The user may not exist, or you may be trying to deactivate yourself." });

        return Ok(new { message = dto.IsActive ? "User activated" : "User deactivated" });
    }

    /// <summary>
    /// Change a user's role.
    /// </summary>
    [HttpPatch("users/{id}/role")]
    public async Task<IActionResult> SetUserRole(int id, [FromBody] SetUserRoleDto dto)
    {
        var adminId = GetCurrentUserId();
        if (adminId == null)
            return Unauthorized();

        if (!Enum.TryParse<UserRole>(dto.Role, true, out var role))
            return BadRequest(new { message = "Invalid role. Valid roles: Doctor, Patient, Admin" });

        var success = await _adminService.SetUserRoleAsync(adminId.Value, id, role);
        if (!success)
            return BadRequest(new { message = "Cannot change user role. The user may not exist, or you may be trying to change your own role." });

        return Ok(new { message = $"User role changed to {role}" });
    }

    /// <summary>
    /// Trigger a password reset for a user (generates reset token).
    /// </summary>
    [HttpPost("users/{id}/password-reset")]
    public async Task<IActionResult> TriggerPasswordReset(int id)
    {
        var adminId = GetCurrentUserId();
        if (adminId == null)
            return Unauthorized();

        var success = await _adminService.TriggerPasswordResetAsync(adminId.Value, id);
        if (!success)
            return NotFound(new { message = "User not found" });

        return Ok(new { message = "Password reset token generated" });
    }

    /// <summary>
    /// Get a paginated list of all examinations (global, not doctor-scoped).
    /// </summary>
    [HttpGet("examinations")]
    public async Task<IActionResult> GetExaminations([FromQuery] AdminExamFilterDto filter)
    {
        var result = await _adminService.GetExaminationsAsync(filter);
        return Ok(result);
    }

    /// <summary>
    /// Get a paginated, filterable list of audit logs.
    /// </summary>
    [HttpGet("audit-logs")]
    public async Task<IActionResult> GetAuditLogs([FromQuery] AuditLogFilterDto filter)
    {
        var result = await _adminService.GetAuditLogsAsync(filter);
        return Ok(result);
    }
}
