using Microsoft.IdentityModel.Tokens;
using SkinVision.Backend.API.DTOs;
using SkinVision.Backend.Domain.Entities;
using SkinVision.Backend.Infrastructure.Context;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SkinVision.Backend.Application.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public RegisterResponse Register(RegisterRequest request)
        {
            
            if (_context.Users.Any(u => u.Email == request.Email))
            {
                return new RegisterResponse
                {
                    Success = false,
                    Message = "Email already registered"
                };
            }

            if (request.Password != request.ConfirmPassword)
            {
                return new RegisterResponse
                {
                    Success = false,
                    Message = "Passwords do not match"
                };
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                Username = request.FullName,
                Email = request.Email,
                PasswordHash = hashedPassword,
                Role = request.Role,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return new RegisterResponse
            {
                Success = true,
                Message = "Registration successful"
            };
        }

        public LoginResponse Login(LoginRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);

            if (user == null)
            {
                return new LoginResponse
                {
                    Token = null,
                    Message = "Email not found"
                };
            }

            var isValidPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!isValidPassword)
            {
                return new LoginResponse
                {
                    Token = null,
                    Message = "Invalid password"
                };
            }

            var token = GenerateJwtToken(user);

            return new LoginResponse
            {
                Token = token,
                Email = user.Email,
                FullName = user.Username,
                Role = user.Role,
                Message = "Login successful"
            };
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"] ?? "SkinVision_Default_Secret_Key_2026!"
            ));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role ?? "patient")
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "SkinVision",
                audience: _configuration["Jwt:Audience"] ?? "SkinVision",
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
