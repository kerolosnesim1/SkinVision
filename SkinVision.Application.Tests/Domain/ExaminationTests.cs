using SkinVision.Domain.Entities;
 using SkinVision.Domain.Enums;
 using Xunit; 

 namespace SkinVision.Application.Tests.Domain; 

 public class ExaminationTests
 {
    [Fact]
    public void Examination_DefaultStatus_ShouldBeInProgress()
    {
        var examination = new Examination();
        Assert.Equal(ExaminationStatus.InProgress, examination.Status);
    }

    [Fact]
    public void Examination_ImagesCollection_ShouldBeInitialized()
    {
        var examination = new Examination();
        Assert.NotNull(examination.Images);
        Assert.Empty(examination.Images);
    }

    [Fact]
    public void Examination_ReportsCollection_ShouldBeInitialized()
    {
        var examination = new Examination();
        Assert.NotNull(examination.Reports);
        Assert.Empty(examination.Reports);
    }

    [Fact]
    public void Examination_WithNullOptionalFields_ShouldHaveNullValues()
    {
        var examination = new Examination
        {
            DoctorId = 1,
            PatientName = "Jane Smith",
            PatientAge = 30,
            AnatomSite = "Back",
            Sex = "Female"
        };

        Assert.Null(examination.Diagnosis);
        Assert.Null(examination.Treatment);
        Assert.Null(examination.FollowUp);
        Assert.Null(examination.RiskLevel);
        Assert.Null(examination.UpdatedAt);
    }
}