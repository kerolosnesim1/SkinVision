namespace SkinVision.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IExaminationRepository Examinations { get; }
    IUserRepository Users { get; }
    IImageRepository Images { get; }
    IDoctorProfileRepository DoctorProfiles { get; }

    Task<int> SaveChangesAsync();
}
