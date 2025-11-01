using System;
using System.Collections.Generic;

namespace SkinVision.Backend.Domain.Entities;

public partial class DoctorProfile
{
    public int DoctorId { get; set; }

    public string? Specialization { get; set; }

    public int? YearsExperience { get; set; }

    public string? HospitalAffiliation { get; set; }

    public virtual ICollection<Diagnosis> Diagnoses { get; set; } = new List<Diagnosis>();

    public virtual User Doctor { get; set; } = null!;

    public virtual ICollection<VerificationRequest> VerificationRequests { get; set; } = new List<VerificationRequest>();
}
