using Moq;using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Application.Services;
using SkinVision.Domain.Entities;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit; 

namespace SkinVision.Application.Tests.Services; 

public class ReportServiceTests
 {
    private readonly Mock<IUnitOfWork> _unitOfWork;
    private readonly Mock<IReportRepository> _reportRepo;
    private readonly Mock<IExaminationRepository> _examinationRepo;
    private readonly Mock<IReportGeneratorService> _reportGenerator;
    private readonly Mock<IFileStorageService> _fileStorage;
    private readonly ReportService _reportService; 

    public ReportServiceTests()
    {
        _reportRepo = new Mock<IReportRepository>();
        _examinationRepo = new Mock<IExaminationRepository>();
        _reportGenerator = new Mock<IReportGeneratorService>();
        _fileStorage = new Mock<IFileStorageService>();
        _unitOfWork = new Mock<IUnitOfWork>(); 

        _unitOfWork.Setup(u => u.Reports).Returns(_reportRepo.Object);
        _unitOfWork.Setup(u => u.Examinations).Returns(_examinationRepo.Object);
        _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1); 

        _reportService = new ReportService(
            _unitOfWork.Object,
            _reportGenerator.Object,
            _fileStorage.Object,
            NullLogger<ReportService>.Instance);
    } 

    [Fact]
    public async Task GetReportAsync_WithValidDoctorAndReport_ReturnsReportDto()
    {
        // Arrange
        var examination = new Examination { DiagnosisId = 1, DoctorId = 10 };
        var report = new Report
        {
            ReportId = 1,
            DiagnosisId = 1,
            Title = "Examination Report",
            ReportPath = "/reports/report1.pdf",
            Format = "PDF",
            CreatedAt = DateTime.UtcNow,
            Examination = examination
        };
        _reportRepo.Setup(r => r.GetByIdWithExaminationAsync(1)).ReturnsAsync(report); 

        // Act
        var result = await _reportService.GetReportAsync(10, 1); 

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.ReportId);
        Assert.Equal("Examination Report", result.Title);
        Assert.Equal("PDF", result.Format);
    } 

    [Fact]
    public async Task GetReportAsync_WithWrongDoctor_ReturnsNull()
    {
        // Arrange
        var examination = new Examination { DiagnosisId = 1, DoctorId = 10 };
        var report = new Report
        {
            ReportId = 1,
            DiagnosisId = 1,
            Examination = examination
        };
        _reportRepo.Setup(r => r.GetByIdWithExaminationAsync(1)).ReturnsAsync(report); 

        // Act
        var result = await _reportService.GetReportAsync(5, 1); 

        // Assert
        Assert.Null(result);
    } 

    [Fact]
    public async Task GetReportsForExaminationAsync_WithWrongDoctor_ReturnsEmptyList()
    {
        // Arrange
        var examination = new Examination { DiagnosisId = 1, DoctorId = 10 };
        _examinationRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(examination); 

        // Act
        var result = await _reportService.GetReportsForExaminationAsync(5, 1); 

        // Assert
        Assert.Empty(result);
    } 

    [Fact]
    public async Task DeleteReportAsync_WithWrongDoctor_ReturnsFalse()
    {
        // Arrange
        var examination = new Examination { DiagnosisId = 1, DoctorId = 10 };
        var report = new Report { ReportId = 1, DiagnosisId = 1, Examination = examination };
        _reportRepo.Setup(r => r.GetByIdWithExaminationAsync(1)).ReturnsAsync(report); 

        // Act
        var result = await _reportService.DeleteReportAsync(5, 1); 

        // Assert
        Assert.False(result);
    } 

    [Fact]
    public async Task DeleteReportAsync_WithCorrectDoctor_ReturnsTrue()
    {
        // Arrange
        var examination = new Examination { DiagnosisId = 1, DoctorId = 10 };
        var report = new Report
        {
            ReportId = 1,
            DiagnosisId = 1,
            ReportPath = "/reports/report1.pdf",
            Examination = examination
        };
        _reportRepo.Setup(r => r.GetByIdWithExaminationAsync(1)).ReturnsAsync(report);
        _fileStorage.Setup(f => f.DeleteFileAsync("/reports/report1.pdf")).ReturnsAsync(true); 

        // Act
        var result = await _reportService.DeleteReportAsync(10, 1); 

        // Assert
        Assert.True(result);
    }
}