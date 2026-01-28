namespace SkinVision.Backend.API.DTOs
{
    public class RegisterRequest
    {
        public string Role { get; set; } // Doctor or Patient
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword {  get; set; }

        public string? LicenseNumber { get; set; }
        public int? Experience { get; set; }
    }
}
