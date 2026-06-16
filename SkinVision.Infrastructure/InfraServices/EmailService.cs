using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using MailKit.Net.Smtp;
using SkinVision.Application.Interfaces.Services;

namespace SkinVision.Infrastructure.InfraServices;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendPasswordResetEmailAsync(string toEmail, string resetToken, string resetUrl)
    {
        var smtpHost = _configuration["Smtp:Host"];
        var smtpPort = _configuration.GetValue<int>("Smtp:Port", 587);
        var smtpUser = _configuration["Smtp:Username"];
        var smtpPass = _configuration["Smtp:Password"];
        var fromEmail = _configuration["Smtp:FromEmail"];
        var fromName = _configuration["Smtp:FromName"] ?? "SkinVision";

        if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUser) || string.IsNullOrEmpty(smtpPass))
        {
            _logger.LogWarning(
                "SMTP not configured – skipping password-reset email to {Email}. " +
                "Reset URL that would have been sent: {ResetUrl}?token={Token}",
                toEmail, resetUrl, resetToken);
            return;
        }

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(fromName, fromEmail ?? "noreply@skinvision.com"));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = "SkinVision – Reset your password";

        var fullResetLink = $"{resetUrl}?token={resetToken}";

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $@"
                <div style='max-width:480px;margin:0 auto;font-family:Arial,sans-serif'>
                    <h2 style='color:#167d7e'>Reset your SkinVision password</h2>
                    <p>We received a request to reset the password for your account.</p>
                    <p>Click the button below to choose a new password. The link expires in 1 hour.</p>
                    <p style='text-align:center;margin:24px 0'>
                        <a href='{fullResetLink}'
                           style='background:linear-gradient(135deg,#167d7e,#2bb1b8);
                                  color:#fff;padding:14px 28px;border-radius:10px;
                                  text-decoration:none;font-weight:600;display:inline-block'>
                            Reset password
                        </a>
                    </p>
                    <p style='color:#999;font-size:13px'>
                        If you did not request this, you can safely ignore this email.
                    </p>
                </div>",
            TextBody = $"Reset your SkinVision password.\n\nClick the link below to choose a new password (expires in 1 hour):\n{fullResetLink}\n\nIf you did not request this, ignore this email."
        };

        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        try
        {
            await client.ConnectAsync(smtpHost, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(smtpUser, smtpPass);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation("Password-reset email sent to {Email}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send password-reset email to {Email}", toEmail);
            throw;
        }
    }
}