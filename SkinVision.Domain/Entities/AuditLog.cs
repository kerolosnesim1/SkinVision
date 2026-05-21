namespace SkinVision.Domain.Entities;

public class AuditLog
{
    public int AuditLogId { get; set; }
    public int ActorUserId { get; set; }
    public string Action { get; set; } = null!;
    public string EntityType { get; set; } = null!;
    public string? EntityId { get; set; }
    public string? Details { get; set; }
    public string? IpAddress { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual User ActorUser { get; set; } = null!;
}
