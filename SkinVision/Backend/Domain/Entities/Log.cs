using System;
using System.Collections.Generic;

namespace SkinVision.Backend.Domain.Entities;

public partial class Log
{
    public int LogId { get; set; }

    public int? UserId { get; set; }

    public string? Action { get; set; }

    public string? Description { get; set; }

    public string? IpAddress { get; set; }

    public DateTime? Timestamp { get; set; }

    public virtual User? User { get; set; }
}
