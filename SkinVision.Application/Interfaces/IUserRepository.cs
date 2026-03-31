using SkinVision.Domain.Entities;

namespace SkinVision.Application.Interfaces;

public interface IUserRepository
{
    User? FindById(int userId);
    User? FindByEmailWithProfile(string email);
    User? Add(User user);
    void Update(User user);
}
