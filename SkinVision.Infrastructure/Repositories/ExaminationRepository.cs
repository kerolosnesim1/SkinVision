using Microsoft.EntityFrameworkCore;
using SkinVision.Application.Interfaces;
using SkinVision.Domain.Entities;
using SkinVision.Infrastructure.Context;

namespace SkinVision.Infrastructure.Repositories;

public class ExaminationRepository : IExaminationRepository
{
    private readonly AppDbContext _context;

    public ExaminationRepository(AppDbContext context)
    {
        _context = context;
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

    public async Task<Examination> AddAsync(Examination examination)
    {
        _context.Examinations.Add(examination);
        await _context.SaveChangesAsync();
        return examination;
    }

    public async Task<Examination?> FindAsync(int id)
    {
        return await _context.Examinations.FindAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var examination = await _context.Examinations.FindAsync(id);
        if (examination == null)
            return false;

        _context.Examinations.Remove(examination);
        await _context.SaveChangesAsync();
        return true;
    }
    public async Task<Examination> UpdateAsync(Examination examination)
    {
        await _context.SaveChangesAsync();
        return examination;
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
