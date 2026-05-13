using System.ComponentModel.DataAnnotations;

namespace SkinVision.Application.DTOs
{
    public class ChangePasswordDto
    {
        [Required]
        public string CurrentPassword { get; set; } = null!;

        [Required]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [RegularExpression(PasswordValidation.Pattern, ErrorMessage = PasswordValidation.ErrorMessage)]
        public string NewPassword { get; set; } = null!;
    }
}
