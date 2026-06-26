using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Application.Services;
using SkinVision.Domain.Entities;
using SkinVision.Domain.Enums;

namespace SkinVision.Application.Tests.Services;

public class GoogleOAuthServiceTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
    private readonly Mock<IConfiguration> _configurationMock = new();
    private readonly Mock<ILogger<GoogleOAuthService>> _loggerMock = new();
    private readonly Mock<IJwtTokenService> _jwtTokenServiceMock = new();
    private readonly Mock<IUserRepository> _userRepoMock = new();
    private readonly Mock<IExternalLoginRepository> _externalLoginRepoMock = new();
    private readonly GoogleOAuthService _oauthService;

    public GoogleOAuthServiceTests()
    {
        _unitOfWorkMock.Setup(u => u.Users).Returns(_userRepoMock.Object);
        _unitOfWorkMock.Setup(u => u.ExternalLogins).Returns(_externalLoginRepoMock.Object);
        _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

        _configurationMock.Setup(c => c["Jwt:Key"]).Returns("Test_Secret_Key_At_Least_32_Characters!");
        _configurationMock.Setup(c => c["Jwt:Issuer"]).Returns("SkinVision");
        _configurationMock.Setup(c => c["Jwt:Audience"]).Returns("SkinVision");

        _jwtTokenServiceMock.Setup(j => j.GenerateToken(It.IsAny<User>())).Returns("test-token");

        _oauthService = new GoogleOAuthService(
            _unitOfWorkMock.Object,
            _jwtTokenServiceMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task HandleExternalLoginAsync_WithExistingExternalLogin_ReturnsToken()
    {
        var user = new User
        {
            UserId = 1,
            Email = "doctor@example.com",
            Username = "doctor@example.com",
            Role = UserRole.Doctor,
            DoctorProfile = new DoctorProfile { FullName = "Dr. Test" }
        };
        var externalLogin = new ExternalLogin
        {
            Provider = "Google",
            ProviderUserId = "google-123",
            User = user
        };
        _externalLoginRepoMock
            .Setup(r => r.FindByProviderAsync("Google", "google-123"))
            .ReturnsAsync(externalLogin);

        var result = await _oauthService.HandleExternalLoginAsync(
            "Google", "google-123", "doctor@example.com", "Dr. Test");

        Assert.NotNull(result.Token);
        Assert.NotNull(result.User);
        Assert.False(result.IsNewUser);
        Assert.False(result.RequiresLinking);
        _userRepoMock.Verify(r => r.AddAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task HandleExternalLoginAsync_WithExistingEmail_ReturnsRequiresLinking()
    {
        _externalLoginRepoMock
            .Setup(r => r.FindByProviderAsync("Google", "google-456"))
            .ReturnsAsync((ExternalLogin?)null);
        _userRepoMock
            .Setup(r => r.FindByEmailWithProfileAsync("existing@example.com"))
            .ReturnsAsync(new User { UserId = 5, Email = "existing@example.com" });

        var result = await _oauthService.HandleExternalLoginAsync(
            "Google", "google-456", "existing@example.com", "Existing User");

        Assert.Null(result.Token);
        Assert.Null(result.User);
        Assert.True(result.RequiresLinking);
        Assert.False(result.IsNewUser);
        Assert.Contains("already exists", result.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task HandleExternalLoginAsync_WithNewUser_RegistersAndReturnsToken()
    {
        _externalLoginRepoMock
            .Setup(r => r.FindByProviderAsync("Google", "google-new"))
            .ReturnsAsync((ExternalLogin?)null);
        _userRepoMock
            .Setup(r => r.FindByEmailWithProfileAsync("new@example.com"))
            .ReturnsAsync((User?)null);
        _userRepoMock
            .Setup(r => r.AddAsync(It.IsAny<User>()))
            .ReturnsAsync((User u) =>
            {
                u.UserId = 10;
                return u;
            });
        _externalLoginRepoMock
            .Setup(r => r.AddAsync(It.IsAny<ExternalLogin>()))
            .ReturnsAsync((ExternalLogin login) => login);

        var result = await _oauthService.HandleExternalLoginAsync(
            "Google", "google-new", "new@example.com", "New Doctor");

        Assert.NotNull(result.Token);
        Assert.NotNull(result.User);
        Assert.True(result.IsNewUser);
        Assert.False(result.RequiresLinking);
        Assert.Equal("new@example.com", result.User!.Email);
        _userRepoMock.Verify(r => r.AddAsync(It.IsAny<User>()), Times.Once);
        _externalLoginRepoMock.Verify(r => r.AddAsync(It.IsAny<ExternalLogin>()), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Exactly(2));
    }

    [Fact]
    public async Task LinkExternalLoginAsync_WithMissingUser_ReturnsFalse()
    {
        _userRepoMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((User?)null);

        var result = await _oauthService.LinkExternalLoginAsync(99, "Google", "google-789", "user@example.com");

        Assert.False(result);
        _externalLoginRepoMock.Verify(r => r.AddAsync(It.IsAny<ExternalLogin>()), Times.Never);
    }

    [Fact]
    public async Task LinkExternalLoginAsync_WhenAlreadyLinkedToAnotherUser_ReturnsFalse()
    {
        _userRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new User { UserId = 1 });
        _externalLoginRepoMock
            .Setup(r => r.FindByProviderAsync("Google", "google-linked"))
            .ReturnsAsync(new ExternalLogin { UserId = 2, Provider = "Google", ProviderUserId = "google-linked" });

        var result = await _oauthService.LinkExternalLoginAsync(1, "Google", "google-linked", "user@example.com");

        Assert.False(result);
        _externalLoginRepoMock.Verify(r => r.AddAsync(It.IsAny<ExternalLogin>()), Times.Never);
    }

    [Fact]
    public async Task LinkExternalLoginAsync_WithValidUser_ReturnsTrue()
    {
        _userRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new User { UserId = 1 });
        _externalLoginRepoMock
            .Setup(r => r.FindByProviderAsync("Google", "google-unlinked"))
            .ReturnsAsync((ExternalLogin?)null);
        _externalLoginRepoMock
            .Setup(r => r.AddAsync(It.IsAny<ExternalLogin>()))
            .ReturnsAsync((ExternalLogin login) => login);

        var result = await _oauthService.LinkExternalLoginAsync(1, "Google", "google-unlinked", "user@example.com");

        Assert.True(result);
        _externalLoginRepoMock.Verify(r => r.AddAsync(It.IsAny<ExternalLogin>()), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
    }
}
