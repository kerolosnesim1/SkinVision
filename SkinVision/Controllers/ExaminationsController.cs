using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinVision.Application.DTOs;
using SkinVision.Application.Services;

namespace SkinVision.Controllers;

[Authorize(Roles = "doctor")]
public class ExaminationsController : BaseApiController
{
    private readonly IExaminationService _examinationService;

    public ExaminationsController(IExaminationService examinationService)
    {
        _examinationService = examinationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetExaminations([FromQuery] string? searchQuery,[FromQuery] string? riskLevel)
    {
        var doctorId = GetCurrentUserId();
        if (doctorId == null)
            return Unauthorized();

        var examinations = await _examinationService.GetExaminationsAsync(doctorId.Value, searchQuery, riskLevel);
        return Ok(examinations);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetExamination(int id)
    {
        var doctorId = GetCurrentUserId();
        if (doctorId == null)
            return Unauthorized();

        var examination = await _examinationService.GetExaminationAsync(id);
        if (examination == null)
            return NotFound();

        if (examination.DoctorId != doctorId.Value)
            return Forbid();

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
