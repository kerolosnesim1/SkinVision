namespace SkinVision.Application.Interfaces.Services;

public interface IFileStorageService
{
    Task<string> SaveFileAsync(Stream fileStream, string fileName, string contentType);
    Task<bool> DeleteFileAsync(string filePath);
}
