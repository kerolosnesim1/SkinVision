using Microsoft.Extensions.Logging;
using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Domain.Entities;
using SkinVision.Domain.Enums;
using System.Text.Json;

namespace SkinVision.Application.Services;

public class AdminService : IAdminService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AdminService> _logger;

    public AdminService(IUnitOfWork unitOfWork, ILogger<AdminService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<AdminStatsDto> GetStatsAsync()
    {
        var users = await _unitOfWork.Users.GetAllAsync();
        var examinations = await _unitOfWork.Examinations.GetFilteredAsync(null, null, null);
        var reports = await _unitOfWork.Reports.GetAllAsync();

        var sevenDaysAgo = DateTime.UtcNow.AddDays(-7);

        return new AdminStatsDto
        {
            TotalUsers = users.Count,
            TotalDoctors = users.Count(u => u.Role == UserRole.Doctor),
            TotalAdmins = users.Count(u => u.Role == UserRole.Admin),
            TotalExaminations = examinations.Count,
            TotalReports = reports.Count,
            TotalImages = examinations.SelectMany(e => e.Images ?? Enumerable.Empty<ExaminationImage>()).Count(),
            TotalPredictions = examinations
                .SelectMany(e => e.Images ?? Enumerable.Empty<ExaminationImage>())
                .Count(i => i.AiResult != null),
            HighRiskExaminations = examinations.Count(e =>
                string.Equals(e.RiskLevel, "High", StringComparison.OrdinalIgnoreCase)),
            RecentRegistrations = users.Count(u => u.CreatedAt >= sevenDaysAgo),
            ActiveUsers = users.Count(u => u.IsActive),
            InactiveUsers = users.Count(u => !u.IsActive)
        };
    }

    public async Task<PaginatedResult<AdminUserDto>> GetUsersAsync(AdminUserFilterDto filter)
    {
        var users = await _unitOfWork.Users.GetAllAsync();

        // Apply filters
        var query = users.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.ToLower();
            query = query.Where(u =>
                u.Username.ToLower().Contains(search) ||
                u.Email.ToLower().Contains(search) ||
                (u.DoctorProfile?.FullName?.ToLower().Contains(search) ?? false));
        }

        if (!string.IsNullOrWhiteSpace(filter.Role) &&
            Enum.TryParse<UserRole>(filter.Role, true, out var role))
        {
            query = query.Where(u => u.Role == role);
        }

        if (filter.IsActive.HasValue)
        {
            query = query.Where(u => u.IsActive == filter.IsActive.Value);
        }

        var filtered = query.ToList();
        var totalCount = filtered.Count;

        var items = filtered
            .OrderByDescending(u => u.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(u => new AdminUserDto
            {
                UserId = u.UserId,
                Username = u.Username,
                Email = u.Email,
                Role = u.Role?.ToString(),
                IsActive = u.IsActive,
                LastLoginAt = u.LastLoginAt,
                CreatedAt = u.CreatedAt,
                ExaminationCount = u.Examinations.Count,
                FullName = u.DoctorProfile?.FullName
            })
            .ToList();

        return new PaginatedResult<AdminUserDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<AdminUserDetailDto?> GetUserDetailAsync(int userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null) return null;

        var externalLogins = await _unitOfWork.ExternalLogins.FindByUserIdAsync(userId);

        return new AdminUserDetailDto
        {
            UserId = user.UserId,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role?.ToString(),
            IsActive = user.IsActive,
            LastLoginAt = user.LastLoginAt,
            CreatedAt = user.CreatedAt,
            ExaminationCount = user.Examinations.Count,
            FullName = user.DoctorProfile?.FullName,
            ClinicName = user.DoctorProfile?.ClinicName,
            ClinicAddress = user.DoctorProfile?.ClinicAddress,
            Specialization = user.DoctorProfile?.Specialization,
            Phone = user.DoctorProfile?.Phone,
            YearsExperience = user.DoctorProfile?.YearsExperience,
            HasPassword = !string.IsNullOrEmpty(user.PasswordHash),
            HasGoogleLinked = externalLogins.Any(e => e.Provider == "Google")
        };
    }

    public async Task<bool> SetUserActiveStatusAsync(int adminUserId, int userId, bool isActive)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null) return false;

        // Prevent deactivating yourself
        if (userId == adminUserId)
        {
            _logger.LogWarning("Admin {AdminId} attempted to deactivate themselves", adminUserId);
            return false;
        }

        user.IsActive = isActive;
        await _unitOfWork.Users.UpdateAsync(user);

        await LogAuditAsync(adminUserId, isActive ? "UserActivated" : "UserDeactivated",
            "User", userId.ToString(),
            JsonSerializer.Serialize(new { userId, isActive }));

        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Admin {AdminId} set user {UserId} active status to {IsActive}",
            adminUserId, userId, isActive);

        return true;
    }

    public async Task<bool> SetUserRoleAsync(int adminUserId, int userId, UserRole role)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null) return false;

        // Prevent changing your own role
        if (userId == adminUserId)
        {
            _logger.LogWarning("Admin {AdminId} attempted to change their own role", adminUserId);
            return false;
        }

        var previousRole = user.Role;
        user.Role = role;
        await _unitOfWork.Users.UpdateAsync(user);

        await LogAuditAsync(adminUserId, "RoleChanged",
            "User", userId.ToString(),
            JsonSerializer.Serialize(new { userId, previousRole = previousRole?.ToString(), newRole = role.ToString() }));

        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Admin {AdminId} changed user {UserId} role from {OldRole} to {NewRole}",
            adminUserId, userId, previousRole, role);

        return true;
    }

    public async Task<bool> TriggerPasswordResetAsync(int adminUserId, int userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null) return false;

        // Generate a reset token
        user.PasswordResetToken = Guid.NewGuid().ToString("N");
        user.PasswordResetTokenExpires = DateTime.UtcNow.AddHours(24);
        await _unitOfWork.Users.UpdateAsync(user);

        await LogAuditAsync(adminUserId, "PasswordResetTriggered",
            "User", userId.ToString(), null);

        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Admin {AdminId} triggered password reset for user {UserId}",
            adminUserId, userId);

        return true;
    }

    public async Task<PaginatedResult<AdminExaminationDto>> GetExaminationsAsync(AdminExamFilterDto filter)
    {
        var examinations = await _unitOfWork.Examinations.GetFilteredAsync(
            filter.DoctorId, null, filter.RiskLevel);

        var query = examinations.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(filter.Status))
            query = query.Where(e => string.Equals(e.Status.ToString(), filter.Status, StringComparison.OrdinalIgnoreCase));

        if (filter.DateFrom.HasValue)
            query = query.Where(e => e.CreatedAt >= filter.DateFrom.Value);

        if (filter.DateTo.HasValue)
            query = query.Where(e => e.CreatedAt <= filter.DateTo.Value);

        var filtered = query.ToList();
        var totalCount = filtered.Count;

        var items = filtered
            .OrderByDescending(e => e.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(e => new AdminExaminationDto
            {
                DiagnosisId = e.DiagnosisId,
                PatientName = e.PatientName,
                DoctorName = e.Doctor?.DoctorProfile?.FullName ?? e.Doctor?.Username,
                RiskLevel = e.RiskLevel,
                Status = e.Status.ToString(),
                CreatedAt = e.CreatedAt,
                ImageCount = e.Images?.Count ?? 0,
                HasReport = false // Reports loaded separately if needed
            })
            .ToList();

        return new PaginatedResult<AdminExaminationDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<PaginatedResult<AuditLogDto>> GetAuditLogsAsync(AuditLogFilterDto filter)
    {
        var (items, totalCount) = await _unitOfWork.AuditLogs.GetFilteredAsync(
            filter.ActorUserId, filter.Action, filter.EntityType,
            filter.DateFrom, filter.DateTo,
            filter.Page, filter.PageSize);

        var dtos = items.Select(a => new AuditLogDto
        {
            AuditLogId = a.AuditLogId,
            ActorName = a.ActorUser?.Username ?? "Unknown",
            Action = a.Action,
            EntityType = a.EntityType,
            EntityId = a.EntityId,
            Details = a.Details,
            IpAddress = a.IpAddress,
            CreatedAt = a.CreatedAt
        }).ToList();

        return new PaginatedResult<AuditLogDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    private async Task LogAuditAsync(int actorUserId, string action, string entityType, string? entityId, string? details)
    {
        var auditLog = new AuditLog
        {
            ActorUserId = actorUserId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            Details = details
        };
        await _unitOfWork.AuditLogs.AddAsync(auditLog);
    }
}
