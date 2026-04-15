using Microsoft.AspNetCore.Hosting;
using SkinVision.Application.Services;

namespace SkinVision.Infrastructure.InfraServices;

public class LocalFileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _env;

    public LocalFileStorageService(IWebHostEnvironment env)
    {
        _env = env;
    }
    private string GetWebRootPath()
    {
        if (!string.IsNullOrEmpty(_env.WebRootPath))
        {
            return _env.WebRootPath;
        }

        return Path.Combine(_env.ContentRootPath, "wwwroot");
    }

    public Task<bool> DeleteFileAsync(string filePath)
    {
        if (string.IsNullOrWhiteSpace(filePath))
        {
            return Task.FromResult(false);
        }

        var relative = filePath.TrimStart('/', '\\').Replace('/', Path.DirectorySeparatorChar);
        if (relative.Contains("..", StringComparison.Ordinal))
        {
            return Task.FromResult(false);
        }

        var root = GetWebRootPath();
        var webRootFull = Path.GetFullPath(root);
        var fullPath = Path.GetFullPath(Path.Combine(root, relative));

        var isInsideWebRoot = fullPath.Equals(webRootFull, StringComparison.OrdinalIgnoreCase)
            || fullPath.StartsWith(webRootFull + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase);
        if (!isInsideWebRoot)
        {
            return Task.FromResult(false);
        }

        if (!File.Exists(fullPath))
        {
            return Task.FromResult(false);
        }

        File.Delete(fullPath);
        return Task.FromResult(true);
    }

    public async Task<string> SaveFileAsync(Stream fileStream, string fileName, string contentType)
    {
        var basePath = Path.Combine(GetWebRootPath(), "uploads", "images");
        Directory.CreateDirectory(basePath);

        var fileNameGenerated = Guid.NewGuid() + Path.GetExtension(fileName);
        var physicalPath = Path.Combine(basePath, fileNameGenerated);

        await using (var fileStreamOutput = new FileStream(physicalPath, FileMode.Create))
        {
            await fileStream.CopyToAsync(fileStreamOutput);
        }

        return $"uploads/images/{fileNameGenerated}";
    }
}
