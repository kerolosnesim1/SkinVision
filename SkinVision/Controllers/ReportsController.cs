using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinVision.Application.DTOs;
using SkinVision.Application.Interfaces.Services;

namespace SkinVision.Controllers;

[Authorize(Roles = nameof(Domain.Enums.UserRole.Doctor))]
public class ReportsController : BaseApiController
{
    private readonly IReportService _reportService;
    private readonly IWebHostEnvironment _env;

    public ReportsController(IReportService reportService, IWebHostEnvironment env)
    {
        _reportService = reportService;
        _env = env;
    }

    
    [HttpGet]
    public async Task<IActionResult> GetAllReports()
    {
        var doctorId = GetCurrentUserId();
        if (doctorId == null)
            return Unauthorized();

        var reports = await _reportService.GetAllReportsAsync(doctorId.Value);
        return Ok(reports);
    }

    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetReport(int id)
    {
        var doctorId = GetCurrentUserId();
        if (doctorId == null)
            return Unauthorized();

        var report = await _reportService.GetReportAsync(doctorId.Value, id);
        if (report == null)
            return NotFound();

        return Ok(report);
    }

    
    [HttpPost("/api/examinations/{examinationId}/reports")]
    public async Task<IActionResult> GenerateReport(int examinationId, [FromBody] GenerateReportDto? dto)
    {
        var doctorId = GetCurrentUserId();
        if (doctorId == null)
            return Unauthorized();

        try
        {
            var report = await _reportService.GenerateReportAsync(doctorId.Value, examinationId, dto);
            return CreatedAtAction(nameof(GetReport), new { id = report.ReportId }, report);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get all reports for a specific examination.
    /// </summary>
    [HttpGet("/api/examinations/{examinationId}/reports")]
    public async Task<IActionResult> GetReportsForExamination(int examinationId)
    {
        var doctorId = GetCurrentUserId();
        if (doctorId == null)
            return Unauthorized();

        var reports = await _reportService.GetReportsForExaminationAsync(doctorId.Value, examinationId);
        return Ok(reports);
    }

    /// <summary>
    /// Download the PDF file for a report.
    /// </summary>
    [HttpGet("{id}/download")]
    public async Task<IActionResult> DownloadReport(int id)
    {
        var doctorId = GetCurrentUserId();
        if (doctorId == null)
            return Unauthorized();

        var report = await _reportService.GetReportAsync(doctorId.Value, id);
        if (report == null || string.IsNullOrEmpty(report.ReportPath))
            return NotFound();

        var webRoot = !string.IsNullOrEmpty(_env.WebRootPath)
            ? _env.WebRootPath
            : Path.Combine(_env.ContentRootPath, "wwwroot");

        var cleanPath = report.ReportPath.TrimStart('/', '\\').Replace('/', Path.DirectorySeparatorChar);
        var fullPath = Path.Combine(webRoot, cleanPath);

        if (!System.IO.File.Exists(fullPath))
            return NotFound(new { message = "Report file not found on disk." });

        var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);
        var fileName = $"{report.Title ?? "Report"}.pdf";

        return File(fileBytes, "application/pdf", fileName);
    }

  
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReport(int id)
    {
        var doctorId = GetCurrentUserId();
        if (doctorId == null)
            return Unauthorized();

        var result = await _reportService.DeleteReportAsync(doctorId.Value, id);
        if (!result)
            return NotFound();

        return NoContent();
    }
}
