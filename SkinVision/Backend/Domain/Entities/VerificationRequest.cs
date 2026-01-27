using System;
using System.Collections.Generic;

namespace SkinVision.Backend.Domain.Entities;

public partial class VerificationRequest
{
    public int VerificationId { get; set; }

    public int? DoctorId { get; set; }

    public string? LicenseNumber { get; set; }

    public string? IssuingAuthority { get; set; }

    public string? LicenseDocumentPath { get; set; }

    public string? VerificationStatus { get; set; }

    public DateTime? SubmissionDate { get; set; }

    public int? ApprovedByAdmin { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public virtual User? ApprovedByAdminNavigation { get; set; }

    public virtual DoctorProfile? Doctor { get; set; }
}
