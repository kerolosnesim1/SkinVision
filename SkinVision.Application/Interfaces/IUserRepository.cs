using SkinVision.Domain.Entities;

namespace SkinVision.Application.Interfaces;

public interface IUserRepository : IBaseRepository<User>
{
    Task<User?> FindByEmailWithProfileAsync(string email);
}
