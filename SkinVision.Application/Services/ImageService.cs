using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace SkinVision.Application.Services;

public class ImageService : IImageService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFileStorageService _fileStorageService;
    private readonly IDlPredictionService _dlPredictionService;
    private readonly ILogger<ImageService> _logger;

    public ImageService(
       IUnitOfWork unitOfWork,
       IFileStorageService fileStorageService,
       IDlPredictionService dlPredictionService,
       ILogger<ImageService> logger)
    {
        _unitOfWork = unitOfWork;
        _fileStorageService = fileStorageService;
        _dlPredictionService = dlPredictionService;
        _logger = logger;
    }

    public async Task<ImageDto?> AddImageAsync(int doctorId, int examinationId, Stream fileStream, string fileName, string contentType, long fileSizeBytes)
    {
        var exam = await _unitOfWork.Examinations.GetByIdWithDetailsAsync(examinationId);
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
                exam.Sex,
                exam.AnatomSite);

            if (aiResult?.HeatmapBase64 != null)
            {
                var heatmapPath = await _fileStorageService.SaveBase64AsFileAsync(
                    aiResult.HeatmapBase64, "image/png");
                aiResult.HeatmapPath = heatmapPath;
            }
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
            BodyPart = exam.AnatomSite,
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
            AnatomSite = exam.AnatomSite,
            Sex = exam.Sex,
            BodyPart = newImage.BodyPart,
            AiResult = aiResult is null ? null : MapToPredictionDto(aiResult)
        };
    }

    public async Task<ImageDto?> AddImageOnlyAsync(int doctorId, int examinationId, Stream fileStream, string fileName, string contentType, long fileSizeBytes)
    {
        var exam = await _unitOfWork.Examinations.GetByIdWithDetailsAsync(examinationId);
        if (exam == null || exam.DoctorId != doctorId)
        {
            _logger.LogWarning(
                "Image upload (no-predict) rejected for doctor {DoctorId} and examination {ExaminationId}",
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
            BodyPart = exam.AnatomSite,
            AiResult = null
        };

        await _unitOfWork.Images.AddAsync(newImage);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation(
            "Image {ImageId} uploaded (no-predict) for examination {ExaminationId} by doctor {DoctorId}",
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
            AnatomSite = exam.AnatomSite,
            Sex = exam.Sex,
            BodyPart = newImage.BodyPart,
            AiResult = null
        };
    }

    public async Task<PredictionDto?> AnalyzeImageAsync(int doctorId, int examinationId, int imageId)
    {
        var exam = await _unitOfWork.Examinations.GetByIdWithDetailsAsync(examinationId);
        if (exam == null || exam.DoctorId != doctorId)
        {
            _logger.LogWarning(
                "AI analysis rejected for doctor {DoctorId}, examination {ExaminationId}, image {ImageId}",
                doctorId,
                examinationId,
                imageId);
            return null;
        }

        var image = await _unitOfWork.Images.GetByIdAsync(imageId);
        if (image == null || image.DiagnosisId != examinationId)
        {
            _logger.LogWarning(
                "Image {ImageId} not found or does not belong to examination {ExaminationId}",
                imageId,
                examinationId);
            return null;
        }

        if (image.AiResult != null)
        {
            return MapToPredictionDto(image.AiResult);
        }

        await using var imageStream = await _fileStorageService.ReadFileAsync(image.FilePath);
        await using var bufferedImage = new MemoryStream();
        await imageStream.CopyToAsync(bufferedImage);
        bufferedImage.Position = 0;

        var fileName = Path.GetFileName(image.FilePath);
        Prediction aiResult;
        try
        {
            bufferedImage.Position = 0;
            aiResult = await _dlPredictionService.PredictAsync(
                bufferedImage,
                fileName,
                exam.PatientAge,
                exam.Sex,
                exam.AnatomSite);

            if (aiResult.HeatmapBase64 != null)
            {
                var heatmapPath = await _fileStorageService.SaveBase64AsFileAsync(
                    aiResult.HeatmapBase64, "image/png");
                aiResult.HeatmapPath = heatmapPath;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "DL prediction failed for examination {ExaminationId}, image {ImageId}",
                examinationId,
                imageId);
            throw;
        }

        aiResult.Image = image;
        image.AiResult = aiResult;

        await _unitOfWork.Images.UpdateAsync(image);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation(
            "AI analysis completed for image {ImageId} on examination {ExaminationId}",
            imageId,
            examinationId);

        return MapToPredictionDto(aiResult);
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
            Findings = findings,
            HeatmapPath = prediction.HeatmapPath
        };
    }
}
