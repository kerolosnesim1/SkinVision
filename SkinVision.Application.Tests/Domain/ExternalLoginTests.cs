using SkinVision.Domain.Entities;
 using Xunit; 

 namespace SkinVision.Application.Tests.Domain; 

 public class ExternalLoginTests
 {
    [Fact]
    public void ExternalLogin_DefaultCreatedAt_ShouldBeRecentUtc()
    {
        var externalLogin = new ExternalLogin();
        Assert.True(externalLogin.CreatedAt <= DateTime.UtcNow);
        Assert.True(externalLogin.CreatedAt > DateTime.UtcNow.AddMinutes(-1));
    }

    [Fact]
    public void ExternalLogin_ProviderEmail_ShouldBeNullByDefault()
    {
        var externalLogin = new ExternalLogin();
        Assert.Null(externalLogin.ProviderEmail);
    }
}