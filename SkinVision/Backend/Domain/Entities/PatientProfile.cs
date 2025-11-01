using System;
using System.Collections.Generic;

namespace SkinVision.Backend.Domain.Entities;

public partial class PatientProfile
{
    public int PatientId { get; set; }

    public int? Age { get; set; }

    public string? Gender { get; set; }

    public string? SkinType { get; set; }

    public string? MedicalHistory { get; set; }

    public virtual User Patient { get; set; } = null!;
}
