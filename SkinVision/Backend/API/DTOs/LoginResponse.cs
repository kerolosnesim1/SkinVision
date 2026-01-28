namespace SkinVision.Backend.API.DTOs
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public string Email { get; set; }   
        public string FullName { get; set; }
        public string Role { get; set; }    
        public string Message { get; set; }
    }
}
