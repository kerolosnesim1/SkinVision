using System;
using System.Collections.Generic;

namespace SkinVision.Backend.Domain.Entities;

public partial class Message
{
    public int MessageId { get; set; }

    public int? SenderId { get; set; }

    public int? ReceiverId { get; set; }

    public string? MessageText { get; set; }

    public DateTime? SentAt { get; set; }

    public bool? ReadStatus { get; set; }

    public virtual User? Receiver { get; set; }

    public virtual User? Sender { get; set; }
}
