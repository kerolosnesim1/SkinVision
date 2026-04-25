namespace SkinVision.Application.Interfaces.Repositories;

public interface IUnitOfWork : IDisposable
{
    IBaseRepository<T> BaseRepository<T>() where T : class;
    IExaminationRepository Examinations { get; }
    IUserRepository Users { get; }
    IImageRepository Images { get; }
    IDoctorProfileRepository DoctorProfiles { get; }
    IReportRepository Reports { get; }

    Task<int> SaveChangesAsync();
}
