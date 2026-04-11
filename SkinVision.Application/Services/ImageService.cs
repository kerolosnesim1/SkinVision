using SkinVision.Application.Interfaces;
using SkinVision.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkinVision.Application.Services
{
    public class ImageService(IImageRepository imageRepository, IExaminationService examinationService, IFileStorageService fileStorageService) : IImageService
    {
        private readonly IImageRepository _imageRepository = imageRepository;
        private readonly IExaminationService _examinationService = examinationService;
        private readonly IFileStorageService _fileStorageService = fileStorageService;

        public async Task<ExaminationImage> AddImageAsync(int doctorId ,int examinationId, Stream fileStream, string fileName, string bodyPart)
        {
           var exam = await _examinationService.GetExaminationAsync(examinationId);
           if (exam == null || exam.DoctorId != doctorId ) return null;

           var savedPath = await _fileStorageService.SaveFileAsync(fileStream, fileName, Path.GetExtension(fileName));    

            var newImage = new ExaminationImage
            {
                DiagnosisId = examinationId,
                FilePath = savedPath,
                Format = Path.GetExtension(fileName),
                Size = fileStream.Length,
                UploadDate = DateTime.UtcNow,
                BodyPart = bodyPart
            };

            return await _imageRepository.AddAsync(newImage);
        }


    }
}
