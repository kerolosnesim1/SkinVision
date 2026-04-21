using Microsoft.EntityFrameworkCore;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Domain.Entities;
using SkinVision.Infrastructure.Context;

namespace SkinVision.Infrastructure.Repositories;

public class ReportRepository : BaseRepository<Report>, IReportRepository
{
    public ReportRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<List<Report>> GetByExaminationIdAsync(int diagnosisId)
    {
        return await _context.Reports
            .Where(r => r.DiagnosisId == diagnosisId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Report>> GetByDoctorIdAsync(int doctorId)
    {
        return await _context.Reports
            .Include(r => r.Examination)
            .Where(r => r.Examination.DoctorId == doctorId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<Report?> GetByIdWithExaminationAsync(int reportId)
    {
        return await _context.Reports
            .Include(r => r.Examination)
            .FirstOrDefaultAsync(r => r.ReportId == reportId);
    }
}
