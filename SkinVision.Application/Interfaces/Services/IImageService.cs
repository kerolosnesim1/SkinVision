using SkinVision.Application.DTOs;

namespace SkinVision.Application.Interfaces.Services;

public interface IImageService
{
    Task<ImageDto?> AddImageAsync(int doctorId, int examinationId, Stream fileStream, string fileName, string? bodyPart, long fileSizeBytes);
}
