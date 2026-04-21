namespace SkinVision.Application.Interfaces.Repositories;

public interface IUnitOfWork : IDisposable
{
    IExaminationRepository Examinations { get; }
    IUserRepository Users { get; }
    IImageRepository Images { get; }
    IDoctorProfileRepository DoctorProfiles { get; }
    IReportRepository Reports { get; }

    Task<int> SaveChangesAsync();
}
