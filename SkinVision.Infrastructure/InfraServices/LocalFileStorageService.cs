using Microsoft.AspNetCore.Hosting;
using SkinVision.Application.Interfaces.Services;

namespace SkinVision.Infrastructure.InfraServices;

public class LocalFileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _env;
    private static readonly IReadOnlyDictionary<string, string> ExtensionByContentType =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["application/pdf"] = ".pdf",
            ["image/jpeg"] = ".jpg",
            ["image/png"] = ".png",
            ["image/webp"] = ".webp"
        };

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
        var subFolder = contentType == "application/pdf" ? "reports" : "images";
        var uploadsRoot = Path.GetFullPath(Path.Combine(GetWebRootPath(), "uploads"));
        var basePath = Path.GetFullPath(Path.Combine(uploadsRoot, subFolder));
        if (!IsPathInside(basePath, uploadsRoot))
        {
            throw new InvalidOperationException("Invalid upload destination.");
        }

        Directory.CreateDirectory(basePath);

        var extension = GetSafeExtension(contentType, fileName);
        var fileNameGenerated = $"{Guid.NewGuid():N}{extension}";
        var physicalPath = Path.GetFullPath(Path.Combine(basePath, fileNameGenerated));
        if (!IsPathInside(physicalPath, uploadsRoot))
        {
            throw new InvalidOperationException("Invalid upload path.");
        }

        await using (var fileStreamOutput = new FileStream(physicalPath, FileMode.CreateNew))
        {
            await fileStream.CopyToAsync(fileStreamOutput);
        }

        return $"uploads/{subFolder}/{fileNameGenerated}";
    }

    public async Task<string> SaveBase64AsFileAsync(string base64Data, string contentType)
    {
        var subFolder = "heatmaps";
        var uploadsRoot = Path.GetFullPath(Path.Combine(GetWebRootPath(), "uploads"));
        var basePath = Path.GetFullPath(Path.Combine(uploadsRoot, subFolder));
        if (!IsPathInside(basePath, uploadsRoot))
        {
            throw new InvalidOperationException("Invalid upload destination.");
        }

        Directory.CreateDirectory(basePath);

        var extension = ExtensionByContentType.TryGetValue(contentType, out var ext) ? ext : ".png";
        var fileNameGenerated = $"{Guid.NewGuid():N}{extension}";
        var physicalPath = Path.GetFullPath(Path.Combine(basePath, fileNameGenerated));
        if (!IsPathInside(physicalPath, uploadsRoot))
        {
            throw new InvalidOperationException("Invalid upload path.");
        }

        var bytes = Convert.FromBase64String(base64Data);
        await using (var fileStreamOutput = new FileStream(physicalPath, FileMode.CreateNew))
        {
            await fileStreamOutput.WriteAsync(bytes);
        }

        return $"uploads/{subFolder}/{fileNameGenerated}";
    }

    private static string GetSafeExtension(string contentType, string fileName)
    {
        if (ExtensionByContentType.TryGetValue(contentType, out var extension))
        {
            return extension;
        }

        var fallbackExtension = Path.GetExtension(fileName);
        if (!string.IsNullOrWhiteSpace(fallbackExtension)
            && fallbackExtension.Equals(".pdf", StringComparison.OrdinalIgnoreCase))
        {
            return ".pdf";
        }

        throw new InvalidOperationException("Unsupported file content type.");
    }

    public Task<Stream> ReadFileAsync(string filePath)
    {
        if (string.IsNullOrWhiteSpace(filePath))
        {
            throw new ArgumentException("File path cannot be empty.", nameof(filePath));
        }

        var relative = filePath.TrimStart('/', '\\').Replace('/', Path.DirectorySeparatorChar);
        if (relative.Contains("..", StringComparison.Ordinal))
        {
            throw new InvalidOperationException("Invalid file path.");
        }

        var root = GetWebRootPath();
        var fullPath = Path.GetFullPath(Path.Combine(root, relative));

        var webRootFull = Path.GetFullPath(root);
        var isInsideWebRoot = fullPath.Equals(webRootFull, StringComparison.OrdinalIgnoreCase)
            || fullPath.StartsWith(webRootFull + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase);
        if (!isInsideWebRoot)
        {
            throw new InvalidOperationException("File path is outside the web root.");
        }

        if (!File.Exists(fullPath))
        {
            throw new FileNotFoundException($"File not found: {filePath}");
        }

        return Task.FromResult<Stream>(new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, FileOptions.Asynchronous));
    }

    private static bool IsPathInside(string path, string root)
    {
        var normalizedRoot = root.TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
        return path.Equals(normalizedRoot, StringComparison.OrdinalIgnoreCase)
            || path.StartsWith(normalizedRoot + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase);
    }
}
