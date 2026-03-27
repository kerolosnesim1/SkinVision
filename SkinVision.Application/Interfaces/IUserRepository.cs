using SkinVision.Domain.Entities;

namespace SkinVision.Application.Interfaces;

public interface IUserRepository
{
    User? FindByEmailWithProfile(string email);
    User? Add(User user);
    void Update(User user);
}
