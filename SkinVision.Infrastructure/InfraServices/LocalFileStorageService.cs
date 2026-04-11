using SkinVision.Application.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace SkinVision.Infrastructure.InfraServices
{
    public class LocalFileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _env;

        public LocalFileStorageService(IWebHostEnvironment env)
        {
            _env = env;
        }
        public Task<bool> DeleteFileAsync(string filePath)
        {
            throw new NotImplementedException();
        }

        public async Task<string> SaveFileAsync(Stream fileStream, string fileName, string contentType)
        {
            var basePath = Path.Combine(_env.WebRootPath, "uploads", "images");

            Directory.CreateDirectory(basePath);

            var fileNameGenerated = Guid.NewGuid()+ Path.GetExtension(fileName);   

            var filePath = Path.Combine(basePath, fileNameGenerated);

            using (var fileStreamOutput = new FileStream(filePath, FileMode.Create))
            {
                await fileStream.CopyToAsync(fileStreamOutput);
            }
            return $"uploads/images/{fileNameGenerated}";
        }
    }
}
