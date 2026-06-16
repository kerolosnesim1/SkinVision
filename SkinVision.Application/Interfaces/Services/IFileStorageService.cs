namespace SkinVision.Application.Interfaces.Services;

public interface IFileStorageService
{
    Task<string> SaveFileAsync(Stream fileStream, string fileName, string contentType);
    Task<string> SaveBase64AsFileAsync(string base64Data, string contentType);
    Task<bool> DeleteFileAsync(string filePath);
    Task<Stream> ReadFileAsync(string filePath);
}
