using SkinVision.Domain.Enums;

namespace SkinVision.Application.DTOs;

// ─── Pagination ───────────────────────────────────────

public class PaginatedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}

// ─── Stats ────────────────────────────────────────────

public class AdminStatsDto
{
    public int TotalUsers { get; set; }
    public int TotalDoctors { get; set; }
    public int TotalAdmins { get; set; }
    public int TotalExaminations { get; set; }
    public int TotalReports { get; set; }
    public int TotalImages { get; set; }
    public int TotalPredictions { get; set; }
    public int HighRiskExaminations { get; set; }
    public int RecentRegistrations { get; set; } // Last 7 days
    public int ActiveUsers { get; set; }
    public int InactiveUsers { get; set; }
}

// ─── Users ────────────────────────────────────────────

public class AdminUserDto
{
    public int UserId { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Role { get; set; }
    public bool IsActive { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public DateTime? CreatedAt { get; set; }
    public int ExaminationCount { get; set; }
    public string? FullName { get; set; }
}

public class AdminUserDetailDto : AdminUserDto
{
    public string? ClinicName { get; set; }
    public string? ClinicAddress { get; set; }
    public string? Specialization { get; set; }
    public string? Phone { get; set; }
    public int? YearsExperience { get; set; }
    public bool HasPassword { get; set; }
    public bool HasGoogleLinked { get; set; }
}

public class AdminUserFilterDto
{
    public string? Search { get; set; }
    public string? Role { get; set; }
    public bool? IsActive { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class SetUserStatusDto
{
    public bool IsActive { get; set; }
}

public class SetUserRoleDto
{
    public string Role { get; set; } = null!;
}

// ─── Examinations ─────────────────────────────────────

public class AdminExaminationDto
{
    public int DiagnosisId { get; set; }
    public string? PatientName { get; set; }
    public string? DoctorName { get; set; }
    public string? RiskLevel { get; set; }
    public string? Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public int ImageCount { get; set; }
    public bool HasReport { get; set; }
}

public class AdminExamFilterDto
{
    public int? DoctorId { get; set; }
    public string? RiskLevel { get; set; }
    public string? Status { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

// ─── Audit Logs ───────────────────────────────────────

public class AuditLogDto
{
    public int AuditLogId { get; set; }
    public string ActorName { get; set; } = null!;
    public string Action { get; set; } = null!;
    public string EntityType { get; set; } = null!;
    public string? EntityId { get; set; }
    public string? Details { get; set; }
    public string? IpAddress { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AuditLogFilterDto
{
    public int? ActorUserId { get; set; }
    public string? Action { get; set; }
    public string? EntityType { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
