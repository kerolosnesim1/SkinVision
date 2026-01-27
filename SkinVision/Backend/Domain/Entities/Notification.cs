using System;
using System.Collections.Generic;

namespace SkinVision.Backend.Domain.Entities;

public partial class Notification
{
    public int NotificationId { get; set; }

    public int? UserId { get; set; }

    public string? Title { get; set; }

    public string? Message { get; set; }

    public string? Type { get; set; }

    public bool? ReadStatus { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User? User { get; set; }
}
