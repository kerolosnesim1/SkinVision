using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace SkinVision.Application.Services;

public class ImageService : IImageService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IExaminationService _examinationService;
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<ImageService> _logger;

    public ImageService(
       IUnitOfWork unitOfWork,
       IExaminationService examinationService,
       IFileStorageService fileStorageService,
       ILogger<ImageService> logger)
    {
        _unitOfWork = unitOfWork;
        _examinationService = examinationService;
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    public async Task<ImageDto?> AddImageAsync(int doctorId, int examinationId, Stream fileStream, string fileName, string contentType, string? bodyPart, long fileSizeBytes)
    {
        var exam = await _examinationService.GetExaminationAsync(examinationId);
        if (exam == null || exam.DoctorId != doctorId)
        {
            _logger.LogWarning(
                "Image upload rejected for doctor {DoctorId} and examination {ExaminationId}",
                doctorId,
                examinationId);
            return null;
        }

        var savedPath = await _fileStorageService.SaveFileAsync(fileStream, fileName, contentType);
        var extension = Path.GetExtension(fileName).ToLowerInvariant();

        var newImage = new ExaminationImage
        {
            DiagnosisId = examinationId,
            FilePath = savedPath,
            Format = extension,
            Size = fileSizeBytes,
            UploadDate = DateTime.UtcNow,
            BodyPart = bodyPart
        };

        await _unitOfWork.Images.AddAsync(newImage);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation(
            "Image {ImageId} uploaded for examination {ExaminationId} by doctor {DoctorId}",
            newImage.ImageId,
            examinationId,
            doctorId);

        return new ImageDto
        {
            ImageId = newImage.ImageId,
            FilePath = newImage.FilePath,
            Format = newImage.Format,
            Size = newImage.Size,
            UploadDate = newImage.UploadDate,
            BodyPart = newImage.BodyPart
        };
    }
}
