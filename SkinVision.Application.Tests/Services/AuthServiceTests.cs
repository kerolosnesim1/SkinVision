using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Application.Services;
using SkinVision.Domain.Entities;
using SkinVision.Domain.Enums;
using Xunit;

namespace SkinVision.Application.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly Mock<ILogger<AuthService>> _loggerMock;
    private readonly Mock<IEmailService> _emailServiceMock;
    private readonly Mock<IUserRepository> _userRepoMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _configurationMock = new Mock<IConfiguration>();
        _loggerMock = new Mock<ILogger<AuthService>>();
        _emailServiceMock = new Mock<IEmailService>();
        _userRepoMock = new Mock<IUserRepository>();

        _unitOfWorkMock.Setup(u => u.Users).Returns(_userRepoMock.Object);
        _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

        _configurationMock.Setup(c => c["Jwt:Key"]).Returns("Test_Secret_Key_At_Least_32_Characters!");
        _configurationMock.Setup(c => c["Jwt:Issuer"]).Returns("SkinVision");
        _configurationMock.Setup(c => c["Jwt:Audience"]).Returns("SkinVision");

        _authService = new AuthService(
            _unitOfWorkMock.Object,
            _configurationMock.Object,
            _loggerMock.Object,
            _emailServiceMock.Object);
    }

    [Fact]
    public async Task RegisterAsync_WithExistingEmail_ReturnsNull()
    {
        // Arrange
        var existingUser = new User { Email = "doctor@example.com" };
        _userRepoMock.Setup(r => r.FindByEmailWithProfileAsync("doctor@example.com"))
            .ReturnsAsync(existingUser);

        var request = new RegisterRequestDto
        {
            Email = "doctor@example.com",
            Password = "Password1!",
            FullName = "Dr. Test",
            ClinicName = "Test Clinic",
            ClinicAddress = "123 Test St",
            Phone = "01012345678"
        };

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        Assert.Null(result);
        _userRepoMock.Verify(r => r.AddAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task RegisterAsync_WithNewEmail_ReturnsRegisterResponseDto()
    {
        // Arrange
        _userRepoMock.Setup(r => r.FindByEmailWithProfileAsync("new@example.com"))
            .ReturnsAsync((User?)null);
        _userRepoMock.Setup(r => r.AddAsync(It.IsAny<User>()))
            .ReturnsAsync((User u) => u);

        var request = new RegisterRequestDto
        {
            Email = "new@example.com",
            Password = "Password1!",
            FullName = "Dr. New",
            ClinicName = "New Clinic",
            ClinicAddress = "456 New St",
            Phone = "01098765432"
        };

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.NotNull(result.Token);
        Assert.Equal("new@example.com", result.User.Email);
        Assert.Equal(UserRole.Doctor, result.User.Role);
        _userRepoMock.Verify(r => r.AddAsync(It.IsAny<User>()), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_WithUnknownEmail_ReturnsNull()
    {
        // Arrange
        _userRepoMock.Setup(r => r.FindByEmailWithProfileAsync("unknown@example.com"))
            .ReturnsAsync((User?)null);

        var request = new LoginRequestDto
        {
            Email = "unknown@example.com",
            Password = "Password1!"
        };

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task LoginAsync_WithDeactivatedUser_ReturnsNull()
    {
        // Arrange
        var deactivatedUser = new User
        {
            UserId = 1,
            Email = "deactivated@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password1!"),
            IsActive = false
        };
        _userRepoMock.Setup(r => r.FindByEmailWithProfileAsync("deactivated@example.com"))
            .ReturnsAsync(deactivatedUser);

        var request = new LoginRequestDto
        {
            Email = "deactivated@example.com",
            Password = "Password1!"
        };

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task LoginAsync_WithWrongPassword_ReturnsNull()
    {
        // Arrange
        var user = new User
        {
            UserId = 1,
            Email = "doctor@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword1!"),
            IsActive = true
        };
        _userRepoMock.Setup(r => r.FindByEmailWithProfileAsync("doctor@example.com"))
            .ReturnsAsync(user);

        var request = new LoginRequestDto
        {
            Email = "doctor@example.com",
            Password = "WrongPassword1!"
        };

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsLoginResponseDto()
    {
        // Arrange
        var user = new User
        {
            UserId = 1,
            Email = "doctor@example.com",
            Username = "doctor@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password1!"),
            IsActive = true,
            Role = UserRole.Doctor,
            DoctorProfile = new DoctorProfile
            {
                DoctorId = 1,
                FullName = "Dr. Test",
                ClinicName = "Test Clinic"
            }
        };
        _userRepoMock.Setup(r => r.FindByEmailWithProfileAsync("doctor@example.com"))
            .ReturnsAsync(user);

        var request = new LoginRequestDto
        {
            Email = "doctor@example.com",
            Password = "Password1!"
        };

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.NotNull(result.Token);
        Assert.Equal("doctor@example.com", result.User.Email);
        _userRepoMock.Verify(r => r.UpdateAsync(user), Times.Once);
    }

    [Fact]
    public async Task ChangePasswordAsync_WithWrongCurrentPassword_ReturnsFalse()
    {
        // Arrange
        var user = new User
        {
            UserId = 1,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("OldPassword1!")
        };
        _userRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(user);

        var request = new ChangePasswordDto
        {
            CurrentPassword = "WrongOldPassword1!",
            NewPassword = "NewPassword1!"
        };

        // Act
        var result = await _authService.ChangePasswordAsync(1, request);

        // Assert
        Assert.False(result);
        _userRepoMock.Verify(r => r.UpdateAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task ChangePasswordAsync_WithCorrectCurrentPassword_ReturnsTrue()
    {
        // Arrange
        var user = new User
        {
            UserId = 1,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("OldPassword1!")
        };
        _userRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(user);

        var request = new ChangePasswordDto
        {
            CurrentPassword = "OldPassword1!",
            NewPassword = "NewPassword1!"
        };

        // Act
        var result = await _authService.ChangePasswordAsync(1, request);

        // Assert
        Assert.True(result);
        _userRepoMock.Verify(r => r.UpdateAsync(user), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task ResetPasswordWithTokenAsync_WithShortPassword_ReturnsFailure()
    {
        // Arrange
        var request = new ResetPasswordWithTokenDto
        {
            Token = "some-token",
            NewPassword = "short"
        };

        // Act
        var result = await _authService.ResetPasswordWithTokenAsync(request);

        // Assert
        Assert.False(result.Success);
        Assert.Equal("Password must be at least 8 characters.", result.ErrorMessage);
    }

    [Fact]
    public async Task ChangePasswordAsync_WithMissingUser_ReturnsFalse()
    {
        _userRepoMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((User?)null);

        var request = new ChangePasswordDto
        {
            CurrentPassword = "OldPassword1!",
            NewPassword = "NewPassword1!"
        };

        var result = await _authService.ChangePasswordAsync(99, request);

        Assert.False(result);
    }

    [Fact]
    public async Task LoginAsync_WithOAuthOnlyAccount_ReturnsNull()
    {
        var oauthUser = new User
        {
            UserId = 2,
            Email = "oauth@example.com",
            PasswordHash = null,
            IsActive = true
        };
        _userRepoMock.Setup(r => r.FindByEmailWithProfileAsync("oauth@example.com"))
            .ReturnsAsync(oauthUser);

        var request = new LoginRequestDto
        {
            Email = "oauth@example.com",
            Password = "AnyPassword1!"
        };

        var result = await _authService.LoginAsync(request);

        Assert.Null(result);
    }

    [Fact]
    public async Task RequestPasswordResetAsync_WithUnknownEmail_DoesNotSendEmail()
    {
        _userRepoMock.Setup(r => r.FindByEmailWithProfileAsync("unknown@example.com"))
            .ReturnsAsync((User?)null);

        await _authService.RequestPasswordResetAsync(new ForgotPasswordRequestDto
        {
            Email = "unknown@example.com"
        });

        _emailServiceMock.Verify(
            e => e.SendPasswordResetEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task RequestPasswordResetAsync_WithKnownUser_SendsEmailAndSavesToken()
    {
        var user = new User
        {
            UserId = 1,
            Email = "doctor@example.com"
        };
        _userRepoMock.Setup(r => r.FindByEmailWithProfileAsync("doctor@example.com"))
            .ReturnsAsync(user);
        _configurationMock.Setup(c => c["Frontend:BaseUrl"]).Returns("http://localhost:4200");

        await _authService.RequestPasswordResetAsync(new ForgotPasswordRequestDto
        {
            Email = "doctor@example.com"
        });

        Assert.NotNull(user.PasswordResetToken);
        Assert.NotNull(user.PasswordResetTokenExpires);
        Assert.True(user.PasswordResetTokenExpires > DateTime.UtcNow);
        _userRepoMock.Verify(r => r.UpdateAsync(user), Times.Once);
        _emailServiceMock.Verify(
            e => e.SendPasswordResetEmailAsync(
                "doctor@example.com",
                user.PasswordResetToken,
                "http://localhost:4200/reset-password"),
            Times.Once);
    }

    [Fact]
    public async Task ResetPasswordWithTokenAsync_WithValidToken_ReturnsSuccess()
    {
        var user = new User
        {
            UserId = 1,
            PasswordResetToken = "valid-token",
            PasswordResetTokenExpires = DateTime.UtcNow.AddMinutes(30)
        };
        _userRepoMock.Setup(r => r.FindByPasswordResetTokenAsync("valid-token"))
            .ReturnsAsync(user);

        var result = await _authService.ResetPasswordWithTokenAsync(new ResetPasswordWithTokenDto
        {
            Token = "valid-token",
            NewPassword = "NewPassword1!"
        });

        Assert.True(result.Success);
        Assert.Null(result.ErrorMessage);
        Assert.Null(user.PasswordResetToken);
        Assert.Null(user.PasswordResetTokenExpires);
        _userRepoMock.Verify(r => r.UpdateAsync(user), Times.Once);
    }

    [Fact]
    public async Task ResetPasswordWithTokenAsync_WithExpiredToken_ReturnsFailure()
    {
        // Arrange
        var user = new User
        {
            UserId = 1,
            PasswordResetToken = "valid-token",
            PasswordResetTokenExpires = DateTime.UtcNow.AddHours(-2) // expired 2 hours ago
        };
        _userRepoMock.Setup(r => r.FindByPasswordResetTokenAsync("valid-token"))
            .ReturnsAsync(user);

        var request = new ResetPasswordWithTokenDto
        {
            Token = "valid-token",
            NewPassword = "NewPassword1!"
        };

        // Act
        var result = await _authService.ResetPasswordWithTokenAsync(request);

        // Assert
        Assert.False(result.Success);
        Assert.Equal("Invalid or expired reset link. Please request a new one.", result.ErrorMessage);
    }
}
