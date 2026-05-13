using System.ComponentModel.DataAnnotations;
using SkinVision.Application.DTOs;
using Xunit;

namespace SkinVision.Application.Tests;

public class AuthDtoValidationTests
{
    [Fact]
    public void LoginRequestDto_WithValidData_ShouldPassValidation()
    {
        // Arrange
        var dto = new LoginRequestDto
        {
            Email = "doctor@example.com",
            Password = "any-existing-password"
        };

        // Act
        var results = Validate(dto);

        // Assert
        Assert.Empty(results);
    }

    [Fact]
    public void LoginRequestDto_WithInvalidEmail_ShouldFailValidation()
    {
        // Arrange
        var dto = new LoginRequestDto
        {
            Email = "not-an-email",
            Password = "Password1!"
        };

        // Act
        var results = Validate(dto);

        // Assert
        Assert.Contains(results, result =>
            result.MemberNames.Contains(nameof(LoginRequestDto.Email)));
    }

    [Theory]
    [InlineData("Aa1!")]
    [InlineData("Password1")]
    [InlineData("password1!")]
    [InlineData("PASSWORD1!")]
    [InlineData("Password!")]
    public void RegisterRequestDto_WithInvalidPassword_ShouldFailValidation(string password)
    {
        // Arrange
        var dto = new RegisterRequestDto
        {
            Email = "doctor@example.com",
            Password = password,
            FullName = "Doctor Example",
            ClinicName = "Skin Clinic",
            ClinicAddress = "123 Medical Center",
            Phone = "01012345678"
        };

        // Act
        var results = Validate(dto);

        // Assert
        Assert.Contains(results, result =>
            result.MemberNames.Contains(nameof(RegisterRequestDto.Password)));
    }

    [Fact]
    public void RegisterRequestDto_WithValidPasswordUsingHashSpecialCharacter_ShouldPassValidation()
    {
        // Arrange
        var dto = new RegisterRequestDto
        {
            FullName = "Doctor Example",
            Email = "doctor@example.com",
            Password = "Password1#",
            ClinicName = "Skin Clinic",
            ClinicAddress = "123 Medical Center",
            Phone = "01012345678"
        };

        // Act
        var results = Validate(dto);

        // Assert
        Assert.Empty(results);
    }



    private static List<ValidationResult> Validate(object model)
    {
        var results = new List<ValidationResult>();
        var context = new ValidationContext(model);

        Validator.TryValidateObject(
            model,
            context,
            results,
            validateAllProperties: true);

        return results;
    }
}