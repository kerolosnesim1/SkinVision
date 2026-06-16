using Moq;
using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Application.Services;
using SkinVision.Domain.Entities;
using SkinVision.Domain.Enums;
using Xunit;

 

namespace SkinVision.Application.Tests.Services; 

public class ExaminationServiceTests
 {
    private readonly Mock<IUnitOfWork> _unitOfWork;
    private readonly Mock<IExaminationRepository> _examinationRepo;
    private readonly ExaminationService _examinationService; 

    public ExaminationServiceTests()
    {
        _examinationRepo = new Mock<IExaminationRepository>();
        _unitOfWork = new Mock<IUnitOfWork>();
        _unitOfWork.Setup(u => u.Examinations).Returns(_examinationRepo.Object);
        _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
        _examinationService = new ExaminationService(_unitOfWork.Object);
    }

 

    [Fact]
    public async Task GetExaminationAsync_WithExistingId_ReturnsExaminationDto()
    {
        // Arrange
        var examination = new Examination
        {
            DiagnosisId = 1,
            DoctorId = 10,
            PatientName = "John Doe",
            PatientAge = 45,
            AnatomSite = "Head/Neck",
            Sex = "Male",
            Diagnosis = "Melanoma",
            Status = ExaminationStatus.Completed,
            CreatedAt = DateTime.UtcNow,
            Doctor = new User { UserId = 10, DoctorProfile = new DoctorProfile { DoctorId = 10, FullName = "Dr. Smith" } },
            Images = new List<ExaminationImage>()
        };
        _examinationRepo.Setup(r => r.GetByIdWithDetailsAsync(1)).ReturnsAsync(examination); 

 

        // Act
        var result = await _examinationService.GetExaminationAsync(1); 

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.DiagnosisId);
        Assert.Equal("John Doe", result.PatientName);
        Assert.Equal("Melanoma", result.Diagnosis);
        Assert.Equal(ExaminationStatus.Completed, result.Status);
    } 

    [Fact]
    public async Task GetExaminationAsync_WithNonExistingId_ReturnsNull()
    {
        // Arrange
        _examinationRepo.Setup(r => r.GetByIdWithDetailsAsync(999)).ReturnsAsync((Examination?)null); 

        // Act
        var result = await _examinationService.GetExaminationAsync(999); 

        // Assert
        Assert.Null(result);
    } 

    [Fact]
    public async Task GetExaminationForDoctorAsync_WithWrongDoctor_ReturnsNull()
    {
        // Arrange
        var examination = new Examination
        {
            DiagnosisId = 1,
            DoctorId = 10,
            PatientName = "John Doe"
        };
        _examinationRepo.Setup(r => r.GetByIdWithDetailsAsync(1)).ReturnsAsync(examination); 

        // Act
        var result = await _examinationService.GetExaminationForDoctorAsync(5, 1); 

        // Assert
        Assert.Null(result);
    } 

    [Fact]
    public async Task GetExaminationForDoctorAsync_WithCorrectDoctor_ReturnsExaminationDto()
    {
        // Arrange
        var examination = new Examination
        {
            DiagnosisId = 1,
            DoctorId = 10,
            PatientName = "John Doe",
            PatientAge = 45,
            AnatomSite = "Back",
            Sex = "Female",
            Status = ExaminationStatus.InProgress,
            CreatedAt = DateTime.UtcNow,
            Doctor = new User { UserId = 10, DoctorProfile = new DoctorProfile { DoctorId = 10, FullName = "Dr. Smith" } },
            Images = new List<ExaminationImage>()
        };
        _examinationRepo.Setup(r => r.GetByIdWithDetailsAsync(1)).ReturnsAsync(examination); 

        // Act
        var result = await _examinationService.GetExaminationForDoctorAsync(10, 1); 

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.DiagnosisId);
        Assert.Equal(10, result.DoctorId);
    } 

    [Fact]
    public async Task CreateExaminationAsync_ShouldCreateAndReturnExaminationDto()
    {
        // Arrange
        var dto = new CreateExaminationDto
        {
            PatientName = "Jane Smith",
            PatientAge = 30,
            AnatomSite = "Arm",
            Sex = "Female",
            Diagnosis = "Eczema",
            Status = ExaminationStatus.InProgress
        };
        _examinationRepo.Setup(r => r.AddAsync(It.IsAny<Examination>()))
            .ReturnsAsync((Examination e) =>
            {
                e.DiagnosisId = 5;
                return e;
            });

        // Act
        var result = await _examinationService.CreateExaminationAsync(10, dto); 

        // Assert
        Assert.NotNull(result);
        Assert.Equal(5, result.DiagnosisId);
        Assert.Equal(10, result.DoctorId);
        Assert.Equal("Jane Smith", result.PatientName);
        Assert.Equal("Arm", result.AnatomSite);
    } 

    [Fact]
    public async Task DeleteExaminationAsync_WithWrongDoctor_ReturnsFalse()
    {
        // Arrange
        var examination = new Examination { DiagnosisId = 1, DoctorId = 10 };
        _examinationRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(examination); 

        // Act
        var result = await _examinationService.DeleteExaminationAsync(5, 1); 

        // Assert
        Assert.False(result);
    } 

    [Fact]
    public async Task DeleteExaminationAsync_WithCorrectDoctor_ReturnsTrue()
    {
        // Arrange
        var examination = new Examination { DiagnosisId = 1, DoctorId = 10 };
        _examinationRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(examination); 

        // Act
        var result = await _examinationService.DeleteExaminationAsync(10, 1); 

        // Assert
        Assert.True(result);
    } 

    [Fact]
    public async Task GetStatsAsync_ShouldReturnCorrectStats()
    {
        // Arrange
        _examinationRepo.Setup(r => r.CountByDoctorAsync(10)).ReturnsAsync(50);
        _examinationRepo.Setup(r => r.CountByDoctorTodayAsync(10)).ReturnsAsync(5);
        _examinationRepo.Setup(r => r.CountAiAnalysesByDoctorAsync(10)).ReturnsAsync(20); 

        // Act
        var result = await _examinationService.GetStatsAsync(10); 

        // Assert
        Assert.Equal(50, result.Total);
        Assert.Equal(5, result.Today);
        Assert.Equal(20, result.AiAnalyses);
    }
}