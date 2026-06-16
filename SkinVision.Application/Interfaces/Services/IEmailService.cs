namespace SkinVision.Application.Interfaces.Services;

public interface IEmailService
{
    Task SendPasswordResetEmailAsync(string toEmail, string resetToken, string resetUrl);
}