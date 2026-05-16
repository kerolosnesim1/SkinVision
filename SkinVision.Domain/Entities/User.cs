using System;
using System.Collections.Generic;
using SkinVision.Domain.Enums;

namespace SkinVision.Domain.Entities;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? PasswordHash { get; set; }

    public string? PasswordResetToken { get; set; }

    public DateTime? PasswordResetTokenExpires { get; set; }

    public UserRole? Role { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual DoctorProfile? DoctorProfile { get; set; }

    public virtual ICollection<Examination> Examinations { get; set; } = new List<Examination>();
    public virtual ICollection<ExternalLogin> ExternalLogins { get; set; } = new List<ExternalLogin>();
}
