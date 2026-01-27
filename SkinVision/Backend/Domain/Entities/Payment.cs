namespace SkinVision.Backend.Domain.Entities
{
    public class Payment
    {
        public Guid Id { get; set; }
        public int UserId { get; set; }
        public int CaseId { get; set; }
        public decimal Amount { get; set; }
        public bool PaymentStatus { get; set; }

        public User? User { get; set; }
        public Case? Case { get; set; }
        public DateTime CreatedAt { get; set; }


    }
}
