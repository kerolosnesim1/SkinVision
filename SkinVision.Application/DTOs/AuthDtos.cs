using System;

namespace SkinVision.Application.DTOs;

public class LoginRequestDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class LoginResponseDto
{
    public string Token { get; set; } = null!;
    public UserDto User { get; set; } = null!;
}

public class RegisterRequestDto
{
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string ClinicName { get; set; } = null!;
    public string ClinicAddress { get; set; } = null!;
    public string Phone { get; set; } = null!;
}
public class RegisterResponseDto
{
    public string Token { get; set; } = null!;
    public UserDto User { get; set; } = null!;
}

public class ForgotPasswordRequestDto
{
    public string Email { get; set; } = null!;
}

public class ResetPasswordWithTokenDto
{
    public string Token { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
}
