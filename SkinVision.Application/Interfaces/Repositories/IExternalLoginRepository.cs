using SkinVision.Domain.Entities;

namespace SkinVision.Application.Interfaces.Repositories;

public interface IExternalLoginRepository
{
    Task<ExternalLogin?> FindByProviderAsync(string provider, string providerUserId);
    Task<List<ExternalLogin>> FindByUserIdAsync(int userId);
    Task<ExternalLogin> AddAsync(ExternalLogin externalLogin);
    Task RemoveAsync(ExternalLogin externalLogin);
}
