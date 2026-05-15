using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SkinVision.Infrastructure.Context;


namespace SkinVision.Application.Services
{
    public class GoogleOAuthService : IOAuthService
    {
        private readonly AppDbContext _context;
        private readonly IJwtProvider _jwtProvider;
        private readonly IPasswordHasher<User> _passwordHasher;

        public GoogleOAuthService(
            AppDbContext context,
            IJwtProvider jwtProvider,
            IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _jwtProvider = jwtProvider;
            _passwordHasher = passwordHasher;
        }

        public Task<LoginResponseDto?> HandleExternalLoginAsync(string provider, string providerUserId, string email, string name)
        {
            var externalLogin = _context.ExternalLogins
                .FirstOrDefault(el => el.Provider == provider && el.ProviderUserId == providerUserId);

            if (externalLogin is not null)
            {
                var token = _jwtProvider.GenerateToken(externalLogin.User);

                return new AuthResponseDto
                {
                    token = token,
                };
            }
        }

        public Task<bool> LinkExternalLoginAsync(int userId, string provider, string providerUserId, string email)
        {
            throw new NotImplementedException();
        }
    }
}
