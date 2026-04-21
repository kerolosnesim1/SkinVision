using Microsoft.EntityFrameworkCore;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Domain.Entities;
using SkinVision.Infrastructure.Context;

namespace SkinVision.Infrastructure.Repositories;

public class DoctorProfileRepository : BaseRepository<DoctorProfile>, IDoctorProfileRepository
{
    public DoctorProfileRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<DoctorProfile?> GetByUserIdAsync(int userId)
    {
        return await _context.DoctorProfiles
            .FirstOrDefaultAsync(dp => dp.DoctorId == userId);
    }
}
