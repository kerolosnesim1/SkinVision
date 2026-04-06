using Microsoft.EntityFrameworkCore;
using SkinVision.Application.Interfaces;
using SkinVision.Domain.Entities;
using SkinVision.Infrastructure.Context;

namespace SkinVision.Infrastructure.Repositories;

public class DoctorProfileRepository(AppDbContext context) : IDoctorProfileRepository
{
    private readonly AppDbContext _context = context;

    public async Task<DoctorProfile?> GetByUserIdAsync(int userId)
    {
        return await _context.DoctorProfiles
            .FirstOrDefaultAsync(dp => dp.DoctorId == userId);
    }

    public async Task<DoctorProfile> UpdateAsync(DoctorProfile profile)
    {
        await _context.SaveChangesAsync();
        return profile;
    }
}
