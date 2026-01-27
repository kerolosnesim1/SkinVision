using SkinVision.Backend.Domain.Enums;

namespace SkinVision.Backend.Domain.Entities
{
    public class Case
    {
        public int CaseId { get; set; }
        
        // Foreign Keys
        public int? DoctorId { get; set; }
        public int? PatientId { get; set; }
        
        // Properties
        public CaseStatus Status { get; set; }
        public string Description { get; set; } = string.Empty;
        public CasePriority Priority { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? AssignedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties (relationships)
        public virtual DoctorProfile? Doctor { get; set; }
        public virtual PatientProfile? Patient { get; set; }
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public virtual ICollection<AIJob> AIJobs { get; set; } = new List<AIJob>();
    }
}
