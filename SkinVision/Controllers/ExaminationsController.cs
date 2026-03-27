using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinVision.Application.DTOs;
using SkinVision.Application.Services;
using System.Security.Claims;
namespace SkinVision.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExaminationsController : ControllerBase
{
    private readonly IExaminationService _examinationService;

    public ExaminationsController(IExaminationService examinationService)
    {
        _examinationService = examinationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetExaminations([FromQuery] string? searchQuery)
    {
        var UserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(UserIdClaim)  || !int.TryParse(UserIdClaim, out int doctorId))
        {
            return Unauthorized();
        }

        var examinations = await _examinationService.GetExaminationsAsync(doctorId, searchQuery);
        return Ok(examinations);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetExamination(int id)
    {
        var examination = await _examinationService.GetExaminationAsync(id);

        if (examination == null)
            return NotFound();

        return Ok(examination);
    }
    
    [HttpPost]
    public async Task<IActionResult> CreateExamination([FromBody] CreateExaminationDto dto)
    {
        var UserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(UserIdClaim)|| !int.TryParse(UserIdClaim, out int doctorId))
        {
            return Unauthorized(); 
        }

        
        var examination = await _examinationService.CreateExaminationAsync(doctorId, dto);
        return CreatedAtAction(nameof(GetExamination), new { id = examination.DiagnosisId }, examination);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExamination(int id)
    {
        var result = await _examinationService.DeleteExaminationAsync(id);

        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var UserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(UserIdClaim) || !int.TryParse(UserIdClaim, out int doctorId))
        {
            return Unauthorized();
        }
        var stats = await _examinationService.GetStatsAsync(doctorId);
        return Ok(stats);
    }
}
