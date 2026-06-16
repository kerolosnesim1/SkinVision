using System.ComponentModel.DataAnnotations;
 using SkinVision.Application.DTOs;
 using SkinVision.Domain.Enums;
 using Xunit; 

 namespace SkinVision.Application.Tests.DTOs; 

 public class ExaminationDtoValidationTests
 {
    [Fact]
    public void CreateExaminationDto_WithValidData_ShouldPassValidation()
    {
        var dto = new CreateExaminationDto
        {
            PatientName = "John Doe",
            PatientAge = 45,
            AnatomSite = "Head/Neck",
            Sex = "Male"
        };

        var results = Validate(dto);
        Assert.Empty(results);
    }

    [Fact]
    public void CreateExaminationDto_WithMissingPatientName_ShouldFailValidation()
    {
        var dto = new CreateExaminationDto
        {
            PatientName = null!,
            PatientAge = 45,
            AnatomSite = "Head/Neck",
            Sex = "Male"
        };

        var results = Validate(dto);
        Assert.Contains(results, r => r.MemberNames.Contains(nameof(CreateExaminationDto.PatientName)));
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(121)]
    public void CreateExaminationDto_WithInvalidPatientAge_ShouldFailValidation(int age)
    {
        var dto = new CreateExaminationDto
        {
            PatientName = "John Doe",
            PatientAge = age,
            AnatomSite = "Head/Neck",
            Sex = "Male"
        };

        var results = Validate(dto);
        Assert.Contains(results, r => r.MemberNames.Contains(nameof(CreateExaminationDto.PatientAge)));
    }

    [Fact]
    public void CreateExaminationDto_WithMissingAnatomSite_ShouldFailValidation()
    {
        var dto = new CreateExaminationDto
        {
            PatientName = "John Doe",
            PatientAge = 45,
            AnatomSite = null!,
            Sex = "Male"
        };

        var results = Validate(dto);
        Assert.Contains(results, r => r.MemberNames.Contains(nameof(CreateExaminationDto.AnatomSite)));
    }

    [Fact]
    public void CreateExaminationDto_DefaultStatus_ShouldBeInProgress()
    {
        var dto = new CreateExaminationDto
        {
            PatientName = "John Doe",
            PatientAge = 45,
            AnatomSite = "Head/Neck",
            Sex = "Male"
        };

        Assert.Equal(ExaminationStatus.InProgress, dto.Status);
    }

    private static List<ValidationResult> Validate(object model)
    {
        var results = new List<ValidationResult>();
        var context = new ValidationContext(model);
        Validator.TryValidateObject(model, context, results, validateAllProperties: true);
        return results;
    }
}