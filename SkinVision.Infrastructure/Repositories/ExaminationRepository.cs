using Microsoft.EntityFrameworkCore;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Domain.Entities;
using SkinVision.Infrastructure.Context;

namespace SkinVision.Infrastructure.Repositories;

public class ExaminationRepository : BaseRepository<Examination>, IExaminationRepository
{
    public ExaminationRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Examination?> GetByIdWithDetailsAsync(int id)
    {
        return await _context.Examinations
            .Include(e => e.Images)
                .ThenInclude(i => i.AiResult)
            .Include(e => e.Doctor)
                .ThenInclude(u => u.DoctorProfile)
            .FirstOrDefaultAsync(e => e.DiagnosisId == id);
    }

    public async Task<List<Examination>> GetFilteredAsync(int? doctorId, string? searchQuery, string? riskLevel)
    {
        var query = _context.Examinations.AsQueryable();

        if (doctorId.HasValue)
            query = query.Where(e => e.DoctorId == doctorId.Value);

        if (!string.IsNullOrWhiteSpace(searchQuery))
            query = query.Where(e => e.PatientName.Contains(searchQuery) || e.Diagnosis!.Contains(searchQuery));

        if (!string.IsNullOrWhiteSpace(riskLevel))
            query = query.Where(e => e.RiskLevel == riskLevel);

        return await query
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }

    public async Task<int> CountByDoctorAsync(int doctorId)
    {
        return await _context.Examinations
            .Where(e => e.DoctorId == doctorId)
            .CountAsync();
    }

    public async Task<int> CountByDoctorTodayAsync(int doctorId)
    {
        var today = DateTime.UtcNow.Date;
        return await _context.Examinations
            .Where(e => e.DoctorId == doctorId && e.CreatedAt.Date == today)
            .CountAsync();
    }

    public async Task<int> CountAiAnalysesByDoctorAsync(int doctorId)
    {
        return await _context.Predictions
            .CountAsync(p => p.Image.DiagnosisId != 0 && p.Image.Examination.DoctorId == doctorId);
    }
}
