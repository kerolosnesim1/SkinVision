using System;
using System.Collections.Generic;

namespace SkinVision.Domain.Entities;

public partial class DoctorProfile
{
    public int DoctorId { get; set; }

    public string? FullName { get; set; }
    public string? ClinicName { get; set; }
    public string? Specialization { get; set; }
    public int? YearsExperience { get; set; }
    public string? ClinicAddress { get; set; }
    public string? Phone { get; set; }

    public virtual User Doctor { get; set; } = null!;
}
