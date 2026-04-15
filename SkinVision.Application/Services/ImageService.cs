using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces;
using SkinVision.Domain.Entities;

namespace SkinVision.Application.Services;

public class ImageService : IImageService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IExaminationService _examinationService;
    private readonly IFileStorageService _fileStorageService;

    public ImageService(IUnitOfWork unitOfWork, IExaminationService examinationService, IFileStorageService fileStorageService)
    {
        _unitOfWork = unitOfWork;
        _examinationService = examinationService;
        _fileStorageService = fileStorageService;
    }

    public async Task<ImageDto?> AddImageAsync(int doctorId, int examinationId, Stream fileStream, string fileName, string? bodyPart, long fileSizeBytes)
    {
        var exam = await _examinationService.GetExaminationAsync(examinationId);
        if (exam == null || exam.DoctorId != doctorId)
            return null;

        var savedPath = await _fileStorageService.SaveFileAsync(fileStream, fileName, Path.GetExtension(fileName));

        var newImage = new ExaminationImage
        {
            DiagnosisId = examinationId,
            FilePath = savedPath,
            Format = Path.GetExtension(fileName),
            Size = fileSizeBytes,
            UploadDate = DateTime.UtcNow,
            BodyPart = bodyPart
        };

        await _unitOfWork.Images.AddAsync(newImage);
        await _unitOfWork.SaveChangesAsync();

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
