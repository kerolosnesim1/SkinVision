using SkinVision.Application.Interfaces;
using SkinVision.Infrastructure.Context;

namespace SkinVision.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    private IExaminationRepository? _examinations;
    private IUserRepository? _users;
    private IImageRepository? _images;
    private IDoctorProfileRepository? _doctorProfiles;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public IExaminationRepository Examinations =>
        _examinations ??= new ExaminationRepository(_context);

    public IUserRepository Users =>
        _users ??= new UserRepository(_context);

    public IImageRepository Images =>
        _images ??= new ImageRepository(_context);

    public IDoctorProfileRepository DoctorProfiles =>
        _doctorProfiles ??= new DoctorProfileRepository(_context);

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
