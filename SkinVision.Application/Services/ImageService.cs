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
    private readonly IDlPredictionService _dlPredictionService;
    private readonly ILogger<ImageService> _logger;

    public ImageService(
       IUnitOfWork unitOfWork,
       IExaminationService examinationService,
       IFileStorageService fileStorageService,
       IDlPredictionService dlPredictionService,
       ILogger<ImageService> logger)
    {
        _unitOfWork = unitOfWork;
        _examinationService = examinationService;
        _fileStorageService = fileStorageService;
        _dlPredictionService = dlPredictionService;
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

        await using var bufferedImage = new MemoryStream();
        await fileStream.CopyToAsync(bufferedImage);
        bufferedImage.Position = 0;

        var savedPath = await _fileStorageService.SaveFileAsync(bufferedImage, fileName, contentType);
        var extension = Path.GetExtension(fileName).ToLowerInvariant();

        Prediction? aiResult = null;
        try
        {
            bufferedImage.Position = 0;
            aiResult = await _dlPredictionService.PredictAsync(
                bufferedImage,
                fileName,
                exam.PatientAge,
                "unknown",
                bodyPart);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(
                ex,
                "DL prediction failed for examination {ExaminationId} and file {FileName}; continuing without AI result",
                examinationId,
                fileName);
        }

        var newImage = new ExaminationImage
        {
            DiagnosisId = examinationId,
            FilePath = savedPath,
            Format = extension,
            Size = fileSizeBytes,
            UploadDate = DateTime.UtcNow,
            BodyPart = bodyPart,
            AiResult = aiResult
        };

        if (aiResult is not null)
        {
            aiResult.Image = newImage;
        }

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
            PatientAge = exam.PatientAge,
            ExaminationReason = exam.Reason,
            BodyPart = newImage.BodyPart,
            AiResult = aiResult is null ? null : MapToPredictionDto(aiResult)
        };
    }

    private static PredictionDto MapToPredictionDto(Prediction prediction)
    {
        var findings = string.IsNullOrWhiteSpace(prediction.Findings)
            ? new List<string>()
            : new List<string> { prediction.Findings };

        return new PredictionDto
        {
            PredictionId = prediction.PredictionId,
            Classification = prediction.Classification,
            ConfidenceScore = prediction.ConfidenceScore,
            ModelVersion = prediction.ModelVersion,
            CreatedAt = prediction.CreatedAt,
            Findings = findings
        };
    }
}
