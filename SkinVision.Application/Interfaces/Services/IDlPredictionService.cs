using SkinVision.Domain.Entities;

namespace SkinVision.Application.Interfaces.Services;

public interface IDlPredictionService
{
    Task<Prediction> PredictAsync(
        Stream imageStream,
        string fileName,
        int? age,
        string? sex,
        string? anatomSite,
        CancellationToken cancellationToken = default);
}
