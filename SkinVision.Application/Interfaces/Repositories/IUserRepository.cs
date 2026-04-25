using SkinVision.Domain.Entities;

namespace SkinVision.Application.Interfaces.Repositories;

public interface IUserRepository : IBaseRepository<User>
{
    Task<User?> FindByEmailWithProfileAsync(string email);

    Task<User?> FindByPasswordResetTokenAsync(string token);
}
