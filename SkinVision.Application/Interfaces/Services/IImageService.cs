using SkinVision.Application.DTOs;

namespace SkinVision.Application.Interfaces.Services;

public interface IImageService
{
    Task<ImageDto?> AddImageAsync(int doctorId, int examinationId, Stream fileStream, string fileName, string contentType, long fileSizeBytes);
    Task<ImageDto?> AddImageOnlyAsync(int doctorId, int examinationId, Stream fileStream, string fileName, string contentType, long fileSizeBytes);
    Task<PredictionDto?> AnalyzeImageAsync(int doctorId, int examinationId, int imageId);
}
