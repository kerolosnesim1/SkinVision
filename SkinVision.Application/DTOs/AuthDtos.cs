using System;
using System.ComponentModel.DataAnnotations;

namespace SkinVision.Application.DTOs;

public static class PasswordValidation
{
    public const string Pattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$";
    public const string ErrorMessage = "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.";
}

public class LoginRequestDto
{
    [Required,EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string Password { get; set; } = null!;
}

public class LoginResponseDto
{
    public string Token { get; set; } = null!;
    public UserDto User { get; set; } = null!;
}

public class RegisterRequestDto
{
    [Required,StringLength(100, MinimumLength = 4, ErrorMessage = "Full name must be between 4 and 100 characters.")]
    public string FullName { get; set; } = null!;
    [Required,EmailAddress]
    public string Email { get; set; } = null!;
    [Required]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
    [RegularExpression(PasswordValidation.Pattern, ErrorMessage = PasswordValidation.ErrorMessage)]
    public string Password { get; set; } = null!;
    [Required]
    [StringLength(200)]
    public string ClinicName { get; set; } = null!;
    [Required]
    [StringLength(500)]
    public string ClinicAddress { get; set; } = null!;
    [Required]
    [Phone]
    [StringLength(30)]
    public string Phone { get; set; } = null!;
}
public class RegisterResponseDto
{
    public string Token { get; set; } = null!;
    public UserDto User { get; set; } = null!;
}

public class ForgotPasswordRequestDto
{
    [Required,EmailAddress]
    public string Email { get; set; } = null!;
}

public class ResetPasswordWithTokenDto
{
    [Required]
    public string Token { get; set; } = null!;
    [Required]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
    [RegularExpression(PasswordValidation.Pattern, ErrorMessage = PasswordValidation.ErrorMessage)]
    public string NewPassword { get; set; } = null!;
}

public class ExternalLoginResponseDto
{
    public string? Token { get; set; }
    public UserDto? User { get; set; }
    public bool IsNewUser { get; set; }
    public bool RequiresLinking { get; set; }
    public string? Message { get; set; }
}

