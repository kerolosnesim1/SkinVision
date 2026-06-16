using SkinVision.Domain.Entities;
 using SkinVision.Domain.Enums;
 using Xunit; 

 namespace SkinVision.Application.Tests.Domain; 

 public class UserTests
 {
    [Fact]
    public void User_DefaultIsActive_ShouldBeTrue()
    {
        var user = new User();
        Assert.True(user.IsActive);
    }

    [Fact]
    public void User_ExaminationsCollection_ShouldBeInitialized()
    {
        var user = new User();
        Assert.NotNull(user.Examinations);
        Assert.Empty(user.Examinations);
    }

    [Fact]
    public void User_ExternalLoginsCollection_ShouldBeInitialized()
    {
        var user = new User();
        Assert.NotNull(user.ExternalLogins);
        Assert.Empty(user.ExternalLogins);
    }

    [Fact]
    public void User_Role_ShouldBeNullByDefault()
    {
        var user = new User();
        Assert.Null(user.Role);
    }

    [Fact]
    public void User_PasswordResetTokenExpires_ShouldBeNullByDefault()
    {
        var user = new User();
        Assert.Null(user.PasswordResetTokenExpires);
    }
}