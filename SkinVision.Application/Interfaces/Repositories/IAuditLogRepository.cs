using SkinVision.Domain.Entities;

namespace SkinVision.Application.Interfaces.Repositories;

public interface IAuditLogRepository
{
    Task<AuditLog> AddAsync(AuditLog auditLog);
    Task<(List<AuditLog> Items, int TotalCount)> GetFilteredAsync(
        int? actorUserId = null,
        string? action = null,
        string? entityType = null,
        DateTime? dateFrom = null,
        DateTime? dateTo = null,
        int page = 1,
        int pageSize = 20);
}
