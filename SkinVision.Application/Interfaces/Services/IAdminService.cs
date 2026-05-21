using SkinVision.Application.DTOs;
using SkinVision.Domain.Enums;

namespace SkinVision.Application.Interfaces.Services;

public interface IAdminService
{
    Task<AdminStatsDto> GetStatsAsync();
    Task<PaginatedResult<AdminUserDto>> GetUsersAsync(AdminUserFilterDto filter);
    Task<AdminUserDetailDto?> GetUserDetailAsync(int userId);
    Task<bool> SetUserActiveStatusAsync(int adminUserId, int userId, bool isActive);
    Task<bool> SetUserRoleAsync(int adminUserId, int userId, UserRole role);
    Task<bool> TriggerPasswordResetAsync(int adminUserId, int userId);
    Task<PaginatedResult<AdminExaminationDto>> GetExaminationsAsync(AdminExamFilterDto filter);
    Task<PaginatedResult<AuditLogDto>> GetAuditLogsAsync(AuditLogFilterDto filter);
}
