using System;
using System.Collections.Generic;

namespace SkinVision.Domain.Entities;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string? Role { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual DoctorProfile? DoctorProfile { get; set; }

    public virtual ICollection<Examination> Examinations { get; set; } = new List<Examination>();
}
