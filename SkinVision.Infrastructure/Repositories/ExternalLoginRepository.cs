using Microsoft.EntityFrameworkCore;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Domain.Entities;
using SkinVision.Infrastructure.Context;

namespace SkinVision.Infrastructure.Repositories;

public class ExternalLoginRepository : IExternalLoginRepository
{
    private readonly AppDbContext _context;

    public ExternalLoginRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ExternalLogin?> FindByProviderAsync(string provider, string providerUserId)
    {
        return await _context.ExternalLogins
            .Include(e => e.User)
                .ThenInclude(u => u.DoctorProfile)
            .FirstOrDefaultAsync(e => e.Provider == provider && e.ProviderUserId == providerUserId);
    }

    public async Task<List<ExternalLogin>> FindByUserIdAsync(int userId)
    {
        return await _context.ExternalLogins
            .Where(e => e.UserId == userId)
            .ToListAsync();
    }

    public async Task<ExternalLogin> AddAsync(ExternalLogin externalLogin)
    {
        await _context.ExternalLogins.AddAsync(externalLogin);
        return externalLogin;
    }

    public Task RemoveAsync(ExternalLogin externalLogin)
    {
        _context.ExternalLogins.Remove(externalLogin);
        return Task.CompletedTask;
    }
}
