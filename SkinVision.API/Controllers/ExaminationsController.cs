using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Services;

namespace SkinVision.Controllers;

[Authorize(Roles = nameof(Domain.Enums.UserRole.Doctor))]
public class ExaminationsController : BaseApiController
{
    private const long MaxImageFileSizeBytes = 10 * 1024 * 1024;
    private static readonly IReadOnlyDictionary<string, string[]> AllowedImageExtensionsByContentType =
        new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase)
        {
            ["image/jpeg"] = [".jpg", ".jpeg"],
            ["image/png"] = [".png"],
            ["image/webp"] = [".webp"]
        };

    private readonly IExaminationService _examinationService;
    private readonly IImageService _imageService;

    public ExaminationsController(IExaminationService examinationService,IImageService imageService)
    {
        _examinationService = examinationService;
        _imageService = imageService;
    }

    [HttpGet]
    public async Task<IActionResult> GetExaminations([FromQuery] string? searchQuery, [FromQuery] string? riskLevel, [FromQuery] DateOnly? date)
    {
        var doctorId = GetCurrentUserId();
        if (doctorId == null)
            return Unauthorized();

        var examinations = await _examinationService.GetExaminationsAsync(doctorId.Value, searchQuery, riskLevel, date);
        return Ok(examinations);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetExamination(int id)
    {
        var doctorId = GetCurrentUserId();
        if (doctorId == null)
            return Unauthorized();

        // Use the doctor-scoped lookup so authorization is enforced inside the
        // service rather than after loading the record (prevents IDOR).
        var examination = await _examinationService.GetExaminationForDoctorAsync(doctorId.Value, id);
        if (examination == null)
            return NotFound();

        return Ok(examination);
    }

    [HttpPost]
    public async Task<IActionResult> CreateExamination([FromBody] CreateExaminationDto dto)
    {
        var doctorId = GetCurrentUserId();
        if (doctorId == null)
            return Unauthorized();

        var examination = await _examinationService.CreateExaminationAsync(doctorId.Value, dto);
        return CreatedAtAction(nameof(GetExamination), new { id = examination.DiagnosisId }, examination);
    }
    [HttpPost("{id}/images")]
    public async Task<IActionResult> UploadImage(int id, IFormFile file)
    {
        var doctorId = GetCurrentUserId();
        if (doctorId == null)
            return Unauthorized();

        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        if (file.Length > MaxImageFileSizeBytes)
            return BadRequest("Image must not exceed 10 MB.");

        if (!AllowedImageExtensionsByContentType.TryGetValue(file.ContentType, out var allowedExtensions))
            return BadRequest("Unsupported image type. Only JPEG, PNG, and WebP images are allowed.");

        var extension = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(extension)
            || !allowedExtensions.Contains(extension, StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest("Image file extension does not match the uploaded content type.");
        }

        await using var uploadStream = file.OpenReadStream();
        var result = await _imageService.AddImageAsync(
            doctorId.Value,
            id,
            uploadStream,
            file.FileName,
            file.ContentType,
            file.Length);
        if (result == null)
            return NotFound();

        return CreatedAtAction(nameof(GetExamination), new { id }, result);
    }

    [HttpPost("{id}/images/upload")]
    public async Task<IActionResult> UploadImageOnly(int id, IFormFile file)
    {
        var doctorId = GetCurrentUserId();
        if (doctorId == null)
            return Unauthorized();

        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        if (file.Length > MaxImageFileSizeBytes)
            return BadRequest("Image must not exceed 10 MB.");

        if (!AllowedImageExtensionsByContentType.TryGetValue(file.ContentType, out var allowedExtensions))
            return BadRequest("Unsupported image type. Only JPEG, PNG, and WebP images are allowed.");

        var extension = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(extension)
            || !allowedExtensions.Contains(extension, StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest("Image file extension does not match the uploaded content type.");
        }

        await using var uploadStream = file.OpenReadStream();
        var result = await _imageService.AddImageOnlyAsync(
            doctorId.Value,
            id,
            uploadStream,
            file.FileName,
            file.ContentType,
            file.Length);
        if (result == null)
            return NotFound();

        return CreatedAtAction(nameof(GetExamination), new { id }, result);
    }

    [HttpPost("{id}/images/{imageId}/analyze")]
    public async Task<IActionResult> AnalyzeImage(int id, int imageId)
    {
        var doctorId = GetCurrentUserId();
        if (doctorId == null)
            return Unauthorized();

        try
        {
            var result = await _imageService.AnalyzeImageAsync(doctorId.Value, id, imageId);
            if (result == null)
                return NotFound();

            return Ok(result);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(503, new { error = "AI analysis service is unavailable. The ML service may not be running.", detail = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(503, new { error = "AI analysis service is unavailable. Please try again later.", detail = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "AI analysis failed.", detail = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateExamination(int id, [FromBody] UpdateExaminationDto dto)
    {
        var doctorId = GetCurrentUserId();
        if (doctorId == null)
            return Unauthorized();

        var result = await _examinationService.UpdateExaminationAsync(doctorId.Value, id, dto);
        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExamination(int id)
    {
        var doctorId = GetCurrentUserId();
        if (doctorId == null)
            return Unauthorized();

        var result = await _examinationService.DeleteExaminationAsync(doctorId.Value, id);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var doctorId = GetCurrentUserId();
        if (doctorId == null)
            return Unauthorized();

        var stats = await _examinationService.GetStatsAsync(doctorId.Value);
        return Ok(stats);
    }
}
