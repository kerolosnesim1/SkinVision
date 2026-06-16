using System.ComponentModel.DataAnnotations;
 using SkinVision.Application.DTOs;
 using Xunit; 

 namespace SkinVision.Application.Tests.DTOs; 

 public class ChangePasswordDtoValidationTests
 {
    [Fact]
    public void ChangePasswordDto_WithValidData_ShouldPassValidation()
    {
        var dto = new ChangePasswordDto
        {
            CurrentPassword = "OldPassword1!",
            NewPassword = "NewPassword1!"
        };

        var results = Validate(dto);
        Assert.Empty(results);
    }

    [Fact]
    public void ChangePasswordDto_WithMissingCurrentPassword_ShouldFailValidation()
    {
        var dto = new ChangePasswordDto
        {
            CurrentPassword = null!,
            NewPassword = "NewPassword1!"
        };

        var results = Validate(dto);
        Assert.Contains(results, r => r.MemberNames.Contains(nameof(ChangePasswordDto.CurrentPassword)));
    }

    [Theory]
    [InlineData("short")]
    [InlineData("nouppercase1")]
    [InlineData("NO_DIGIT_HERE!")]
    [InlineData("PASSWORD1!")]
    public void ChangePasswordDto_WithInvalidNewPassword_ShouldFailValidation(string newPassword)
    {
        var dto = new ChangePasswordDto
        {
            CurrentPassword = "OldPassword1!",
            NewPassword = newPassword
        };

        var results = Validate(dto);
        Assert.Contains(results, r => r.MemberNames.Contains(nameof(ChangePasswordDto.NewPassword)));
    }

    private static List<ValidationResult> Validate(object model)
    {
        var results = new List<ValidationResult>();
        var context = new ValidationContext(model);
        Validator.TryValidateObject(model, context, results, validateAllProperties: true);
        return results;
    }
}