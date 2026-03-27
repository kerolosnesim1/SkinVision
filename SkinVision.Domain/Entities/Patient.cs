using System;
using System.Collections.Generic;

namespace SkinVision.Domain.Entities;

public class Patient
{
    public int PatientId { get; set; }
    public string FullName { get; set; } = null!;
    public int? Age { get; set; }
    public string? Phone { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<Examination> Examinations { get; set; } = new List<Examination>();
}
