using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Application.Services;
using SkinVision.Domain.Entities;
using SkinVision.Domain.Enums;

namespace SkinVision.Application.Tests.Services;

public class ImageServiceTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
    private readonly Mock<IExaminationService> _examinationServiceMock = new();
    private readonly Mock<IFileStorageService> _fileStorageMock = new();
    private readonly Mock<IDlPredictionService> _dlPredictionMock = new();
    private readonly Mock<IImageRepository> _imageRepoMock = new();
    private readonly ImageService _imageService;

    public ImageServiceTests()
    {
        _unitOfWorkMock.Setup(u => u.Images).Returns(_imageRepoMock.Object);
        _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

        _imageService = new ImageService(
            _unitOfWorkMock.Object,
            _examinationServiceMock.Object,
            _fileStorageMock.Object,
            _dlPredictionMock.Object,
            NullLogger<ImageService>.Instance);
    }

    private static ExaminationDto CreateExamination(int doctorId = 10, int examinationId = 1) => new()
    {
        DiagnosisId = examinationId,
        DoctorId = doctorId,
        PatientName = "Jane Doe",
        PatientAge = 35,
        AnatomSite = "Arm",
        Sex = "Female",
        Status = ExaminationStatus.InProgress
    };

    [Fact]
    public async Task AddImageAsync_WithWrongDoctor_ReturnsNull()
    {
        _examinationServiceMock
            .Setup(s => s.GetExaminationAsync(1))
            .ReturnsAsync(CreateExamination(doctorId: 10));

        using var stream = new MemoryStream([1, 2, 3]);
        var result = await _imageService.AddImageAsync(5, 1, stream, "test.jpg", "image/jpeg", 3);

        Assert.Null(result);
        _fileStorageMock.Verify(
            f => f.SaveFileAsync(It.IsAny<Stream>(), It.IsAny<string>(), It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task AddImageAsync_WithValidExam_SavesImageAndReturnsDto()
    {
        _examinationServiceMock
            .Setup(s => s.GetExaminationAsync(1))
            .ReturnsAsync(CreateExamination());
        _fileStorageMock
            .Setup(f => f.SaveFileAsync(It.IsAny<Stream>(), "test.jpg", "image/jpeg"))
            .ReturnsAsync("/uploads/test.jpg");
        _dlPredictionMock
            .Setup(p => p.PredictAsync(It.IsAny<Stream>(), "test.jpg", 35, "Female", "Arm", default))
            .ReturnsAsync(new Prediction
            {
                Classification = "Melanoma",
                ConfidenceScore = 0.92m,
                ModelVersion = "v1"
            });
        _imageRepoMock
            .Setup(r => r.AddAsync(It.IsAny<ExaminationImage>()))
            .ReturnsAsync((ExaminationImage image) => image);

        using var stream = new MemoryStream([1, 2, 3]);
        var result = await _imageService.AddImageAsync(10, 1, stream, "test.jpg", "image/jpeg", 3);

        Assert.NotNull(result);
        Assert.Equal("/uploads/test.jpg", result.FilePath);
        Assert.Equal(".jpg", result.Format);
        Assert.NotNull(result.AiResult);
        Assert.Equal("Melanoma", result.AiResult!.Classification);
        _imageRepoMock.Verify(r => r.AddAsync(It.IsAny<ExaminationImage>()), Times.Once);
    }

    [Fact]
    public async Task AddImageAsync_WhenPredictionFails_StillSavesImageWithoutAiResult()
    {
        _examinationServiceMock
            .Setup(s => s.GetExaminationAsync(1))
            .ReturnsAsync(CreateExamination());
        _fileStorageMock
            .Setup(f => f.SaveFileAsync(It.IsAny<Stream>(), "test.jpg", "image/jpeg"))
            .ReturnsAsync("/uploads/test.jpg");
        _dlPredictionMock
            .Setup(p => p.PredictAsync(
                It.IsAny<Stream>(),
                It.IsAny<string>(),
                It.IsAny<int?>(),
                It.IsAny<string?>(),
                It.IsAny<string?>(),
                default))
            .ThrowsAsync(new InvalidOperationException("ML service unavailable"));
        _imageRepoMock
            .Setup(r => r.AddAsync(It.IsAny<ExaminationImage>()))
            .ReturnsAsync((ExaminationImage image) => image);

        using var stream = new MemoryStream([1, 2, 3]);
        var result = await _imageService.AddImageAsync(10, 1, stream, "test.jpg", "image/jpeg", 3);

        Assert.NotNull(result);
        Assert.Null(result.AiResult);
        _imageRepoMock.Verify(r => r.AddAsync(It.IsAny<ExaminationImage>()), Times.Once);
    }

    [Fact]
    public async Task AddImageOnlyAsync_WithWrongDoctor_ReturnsNull()
    {
        _examinationServiceMock
            .Setup(s => s.GetExaminationAsync(1))
            .ReturnsAsync(CreateExamination(doctorId: 10));

        using var stream = new MemoryStream([1, 2, 3]);
        var result = await _imageService.AddImageOnlyAsync(5, 1, stream, "test.jpg", "image/jpeg", 3);

        Assert.Null(result);
        _dlPredictionMock.Verify(
            p => p.PredictAsync(
                It.IsAny<Stream>(),
                It.IsAny<string>(),
                It.IsAny<int?>(),
                It.IsAny<string?>(),
                It.IsAny<string?>(),
                default),
            Times.Never);
    }

    [Fact]
    public async Task AnalyzeImageAsync_WithExistingAiResult_ReturnsCachedResult()
    {
        var existingPrediction = new Prediction
        {
            PredictionId = 7,
            Classification = "Benign",
            ConfidenceScore = 0.88m,
            Findings = "No suspicious patterns"
        };
        var image = new ExaminationImage
        {
            ImageId = 3,
            DiagnosisId = 1,
            FilePath = "/uploads/existing.jpg",
            AiResult = existingPrediction
        };

        _examinationServiceMock
            .Setup(s => s.GetExaminationAsync(1))
            .ReturnsAsync(CreateExamination());
        _imageRepoMock.Setup(r => r.GetByIdAsync(3)).ReturnsAsync(image);

        var result = await _imageService.AnalyzeImageAsync(10, 1, 3);

        Assert.NotNull(result);
        Assert.Equal("Benign", result!.Classification);
        _dlPredictionMock.Verify(
            p => p.PredictAsync(
                It.IsAny<Stream>(),
                It.IsAny<string>(),
                It.IsAny<int?>(),
                It.IsAny<string?>(),
                It.IsAny<string?>(),
                default),
            Times.Never);
    }

    [Fact]
    public async Task AnalyzeImageAsync_WithMissingImage_ReturnsNull()
    {
        _examinationServiceMock
            .Setup(s => s.GetExaminationAsync(1))
            .ReturnsAsync(CreateExamination());
        _imageRepoMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((ExaminationImage?)null);

        var result = await _imageService.AnalyzeImageAsync(10, 1, 99);

        Assert.Null(result);
    }
}
