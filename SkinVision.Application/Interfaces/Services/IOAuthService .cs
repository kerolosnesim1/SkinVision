using System;

public interface IOAuthService
{
    Task<LoginResponseDto?> HandleExternalLoginAsync(string provider, string providerUserId, string email, string name);

    Task<bool> LinkExternalLoginAsync(int userId, string provider, string providerUserId, string email);
}
