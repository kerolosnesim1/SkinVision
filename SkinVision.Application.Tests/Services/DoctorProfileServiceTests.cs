using Moq;
 using SkinVision.Application.DTOs;
 using SkinVision.Application.Interfaces.Repositories;
 using SkinVision.Application.Services;
 using SkinVision.Domain.Entities;
 using Xunit; 

 namespace SkinVision.Application.Tests.Services; 

 public class DoctorProfileServiceTests
 {
    private readonly Mock<IUnitOfWork> _unitOfWork;
    private readonly Mock<IDoctorProfileRepository> _doctorProfileRepo;
    private readonly DoctorProfileService _doctorProfileService;

    public DoctorProfileServiceTests()
    {
        _doctorProfileRepo = new Mock<IDoctorProfileRepository>();
        _unitOfWork = new Mock<IUnitOfWork>();
        _unitOfWork.Setup(u => u.DoctorProfiles).Returns(_doctorProfileRepo.Object);
        _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
        _doctorProfileService = new DoctorProfileService(_unitOfWork.Object);
    }

    [Fact]
    public async Task GetDoctorProfileAsync_WithExistingUser_ReturnsProfileDto()
    {
        // Arrange
        var profile = new DoctorProfile
        {
            DoctorId = 1,
            FullName = "Dr. John Smith",
            ClinicName = "Skin Clinic",
            ClinicAddress = "123 Medical Center",
            Phone = "01012345678",
            Specialization = "Dermatology",
            YearsExperience = 15
        };
        _doctorProfileRepo.Setup(r => r.GetByUserIdAsync(1)).ReturnsAsync(profile);

        // Act
        var result = await _doctorProfileService.GetDoctorProfileAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Dr. John Smith", result.FullName);
        Assert.Equal("Skin Clinic", result.ClinicName);
        Assert.Equal("Dermatology", result.Specialization);
        Assert.Equal(15, result.YearsExperience);
    }

    [Fact]
    public async Task GetDoctorProfileAsync_WithNonExistingUser_ReturnsNull()
    {
        // Arrange
        _doctorProfileRepo.Setup(r => r.GetByUserIdAsync(999)).ReturnsAsync((DoctorProfile?)null);

        // Act
        var result = await _doctorProfileService.GetDoctorProfileAsync(999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateDoctorProfileAsync_WithExistingUser_ShouldUpdateAndReturnDto()
    {
        // Arrange
        var profile = new DoctorProfile
        {
            DoctorId = 1,
            FullName = "Dr. John Smith",
            ClinicName = "Skin Clinic",
            ClinicAddress = "123 Medical Center",
            Phone = "01012345678",
            Specialization = "Dermatology",
            YearsExperience = 15
        };
        _doctorProfileRepo.Setup(r => r.GetByUserIdAsync(1)).ReturnsAsync(profile);

        var dto = new UpdateDoctorProfileDto
        {
            FullName = "Dr. Updated Name",
            Specialization = "Cosmetic Dermatology"
        };

        // Act
        var result = await _doctorProfileService.UpdateDoctorProfileAsync(1, dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Dr. Updated Name", result.FullName);
        Assert.Equal("Cosmetic Dermatology", result.Specialization);
        // Unchanged fields should remain the same
        Assert.Equal("Skin Clinic", result.ClinicName);
        Assert.Equal("123 Medical Center", result.ClinicAddress);
    }

    [Fact]
    public async Task UpdateDoctorProfileAsync_WithNonExistingUser_ReturnsNull()
    {
        // Arrange
        _doctorProfileRepo.Setup(r => r.GetByUserIdAsync(999)).ReturnsAsync((DoctorProfile?)null);

        var dto = new UpdateDoctorProfileDto { FullName = "New Name" };

        // Act
        var result = await _doctorProfileService.UpdateDoctorProfileAsync(999, dto);

        // Assert
        Assert.Null(result);
    }
}