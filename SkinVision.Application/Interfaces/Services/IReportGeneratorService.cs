using SkinVision.Domain.Entities;

namespace SkinVision.Application.Interfaces.Services;

public interface IReportGeneratorService
{
    Task<Stream> GeneratePdfAsync(Examination examination);
}
