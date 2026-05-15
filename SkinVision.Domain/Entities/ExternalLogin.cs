using System;
using System.Collections.Generic;

namespace SkinVision.Domain.Entities;

public class ExternalLogin
{
    public Guid ExternalLoginId { get; set; }
    public int UserId { get; set; }
    public string Provider { get; set; } = null!;
    public int ProviderId { get; set; }
    public string? ProviderEmail { get; set; } = null!;
    public string ProviderKey { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual User User { get; set; } = null!;

}