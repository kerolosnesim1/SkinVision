namespace SkinVision.Backend.Domain.Entities
{
    public class AIJob
    {
        public Guid Id { get; set; }
        public int CaseId { get; set; }
        public int DiagnosisId { get; set; }
        public int? RequestedBy { get; set; }

        public Case Case { get; set; }
        public Diagnosis Diagnosis { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
