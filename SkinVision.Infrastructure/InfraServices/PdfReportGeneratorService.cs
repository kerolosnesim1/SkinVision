using Microsoft.AspNetCore.Hosting;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Domain.Entities;

namespace SkinVision.Infrastructure.InfraServices;

public class PdfReportGeneratorService : IReportGeneratorService
{
    private readonly IWebHostEnvironment _env;

    public PdfReportGeneratorService(IWebHostEnvironment env)
    {
        _env = env;
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public Task<Stream> GeneratePdfAsync(Examination examination)
    {
        var aiResult = examination.Images?
            .Select(i => i.AiResult)
            .FirstOrDefault(p => p != null);

        var doctorProfile = examination.Doctor?.DoctorProfile;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.MarginHorizontal(40);
                page.MarginVertical(30);
                page.DefaultTextStyle(x => x.FontSize(10).FontColor(Colors.Grey.Darken4));

                // ── Header ──
                page.Header().Element(header =>
                {
                    header.Column(col =>
                    {
                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Column(left =>
                            {
                                left.Item().Text("SkinVision").Bold().FontSize(22)
                                    .FontColor(Colors.Teal.Darken2);
                                left.Item().Text("AI-Powered Dermatology Platform")
                                    .FontSize(9).FontColor(Colors.Grey.Medium);
                            });

                            row.RelativeItem().AlignRight().Column(right =>
                            {
                                right.Item().Text("EXAMINATION REPORT").Bold().FontSize(14)
                                    .FontColor(Colors.Teal.Darken2);
                                right.Item().Text($"Report Date: {DateTime.UtcNow:MMMM dd, yyyy}")
                                    .FontSize(9).FontColor(Colors.Grey.Medium);
                                right.Item().Text($"Exam ID: #{examination.DiagnosisId}")
                                    .FontSize(9).FontColor(Colors.Grey.Medium);
                            });
                        });

                        col.Item().PaddingVertical(8)
                            .LineHorizontal(1).LineColor(Colors.Teal.Darken2);
                    });
                });

                // ── Content ──
                page.Content().Element(content =>
                {
                    content.PaddingVertical(10).Column(col =>
                    {
                        col.Spacing(12);

                        // Doctor Info Section
                        if (doctorProfile != null)
                        {
                            col.Item().Element(c => SectionHeader(c, "Doctor Information"));
                            col.Item().Element(c => InfoGrid(c, new Dictionary<string, string?>
                            {
                                ["Doctor Name"] = doctorProfile.FullName ?? "N/A",
                                ["Specialization"] = doctorProfile.Specialization ?? "Dermatology",
                                ["Clinic"] = doctorProfile.ClinicName ?? "N/A",
                                ["Phone"] = doctorProfile.Phone ?? "N/A",
                                ["Clinic Address"] = doctorProfile.ClinicAddress ?? "N/A",
                                ["Experience"] = doctorProfile.YearsExperience.HasValue
                                    ? $"{doctorProfile.YearsExperience} years"
                                    : "N/A"
                            }));
                        }

                        // Patient Info Section
                        col.Item().Element(c => SectionHeader(c, "Patient Information"));
                        col.Item().Element(c => InfoGrid(c, new Dictionary<string, string?>
                        {
                            ["Patient Name"] = examination.PatientName,
                            ["Age"] = $"{examination.PatientAge} years",
                            ["Phone"] = examination.PatientPhone ?? "N/A",
                            ["Lesion Location"] = examination.AnatomSite ?? "N/A",
                            ["Sex"] = examination.Sex ?? "N/A"
                        }));

                        // Examination Details
                        col.Item().Element(c => SectionHeader(c, "Examination Details"));
                        col.Item().Element(c => InfoGrid(c, new Dictionary<string, string?>
                        {
                            ["Status"] = examination.Status.ToString(),
                            ["Created"] = examination.CreatedAt.ToString("MMMM dd, yyyy"),
                            ["Risk Level"] = examination.RiskLevel ?? "Not Assessed",
                            ["Follow-up Date"] = examination.FollowUpDate?.ToString("MMMM dd, yyyy") ?? "None"
                        }));

                        // Skin Images Section
                        if (examination.Images?.Any() == true)
                        {
                            col.Item().Element(c => SectionHeader(c, "Skin Images"));
                            col.Item().Row(row =>
                            {
                                foreach (var image in examination.Images.Take(3))
                                {
                                    var imagePath = GetPhysicalImagePath(image.FilePath);
                                    if (File.Exists(imagePath))
                                    {
                                        row.RelativeItem().Padding(4).Column(imgCol =>
                                        {
                                            // Show original image and heatmap side-by-side if heatmap exists
                                            if (image.AiResult != null && !string.IsNullOrEmpty(image.AiResult.HeatmapPath))
                                            {
                                                var heatmapPhysicalPath = GetPhysicalImagePath(image.AiResult.HeatmapPath);
                                                if (File.Exists(heatmapPhysicalPath))
                                                {
                                                    imgCol.Item().Row(imgRow =>
                                                    {
                                                        imgRow.RelativeItem().PaddingHorizontal(2).Column(origCol =>
                                                        {
                                                            origCol.Item().Height(120).Image(imagePath)
                                                                .FitArea();
                                                            origCol.Item().AlignCenter()
                                                                .Text("Original")
                                                                .FontSize(8).FontColor(Colors.Grey.Medium);
                                                        });
                                                        imgRow.RelativeItem().PaddingHorizontal(2).Column(heatCol =>
                                                        {
                                                            heatCol.Item().Height(120).Image(heatmapPhysicalPath)
                                                                .FitArea();
                                                            heatCol.Item().AlignCenter()
                                                                .Text("Grad-CAM Heatmap")
                                                                .FontSize(8).FontColor(Colors.Grey.Medium);
                                                        });
                                                    });
                                                }
                                                else
                                                {
                                                    imgCol.Item().Height(120).Image(imagePath)
                                                        .FitArea();
                                                    imgCol.Item().AlignCenter()
                                                        .Text(image.BodyPart ?? "Skin Image")
                                                        .FontSize(8).FontColor(Colors.Grey.Medium);
                                                }
                                            }
                                            else
                                            {
                                                imgCol.Item().Height(120).Image(imagePath)
                                                    .FitArea();
                                                imgCol.Item().AlignCenter()
                                                    .Text(image.BodyPart ?? "Skin Image")
                                                    .FontSize(8).FontColor(Colors.Grey.Medium);
                                            }
                                        });
                                    }
                                }
                            });
                        }

                        // AI Analysis Section
                        if (aiResult != null)
                        {
                            col.Item().Element(c => SectionHeader(c, "AI Analysis Results"));
                            col.Item().Background(Colors.Teal.Lighten5)
                                .Border(1).BorderColor(Colors.Teal.Lighten3)
                                .Padding(12).Column(aiCol =>
                                {
                                    aiCol.Spacing(6);
                                    aiCol.Item().Row(row =>
                                    {
                                        row.RelativeItem().Column(left =>
                                        {
                                            left.Item().Text("Classification").Bold()
                                                .FontSize(9).FontColor(Colors.Grey.Darken1);
                                            left.Item().Text(aiResult.Classification ?? "N/A")
                                                .FontSize(14).Bold()
                                                .FontColor(Colors.Teal.Darken2);
                                        });
                                        row.RelativeItem().Column(right =>
                                        {
                                            right.Item().Text("Confidence Score").Bold()
                                                .FontSize(9).FontColor(Colors.Grey.Darken1);
                                            right.Item().Text(
                                                aiResult.ConfidenceScore.HasValue
                                                    ? $"{aiResult.ConfidenceScore:P1}"
                                                    : "N/A")
                                                .FontSize(14).Bold()
                                                .FontColor(Colors.Teal.Darken2);
                                        });
                                    });

                                    if (!string.IsNullOrEmpty(aiResult.Findings))
                                    {
                                        aiCol.Item().PaddingTop(4).Text("Findings:").Bold()
                                            .FontSize(9).FontColor(Colors.Grey.Darken1);
                                        aiCol.Item().Text(aiResult.Findings)
                                            .FontSize(10);
                                    }

                                    if (!string.IsNullOrEmpty(aiResult.ModelVersion))
                                    {
                                        aiCol.Item().Text($"Model: {aiResult.ModelVersion}")
                                            .FontSize(8).FontColor(Colors.Grey.Medium);
                                    }
                                });
                        }

                        // Diagnosis & Treatment Section
                        col.Item().Element(c => SectionHeader(c, "Diagnosis & Treatment"));
                        col.Item().Column(diagCol =>
                        {
                            diagCol.Spacing(8);
                            if (!string.IsNullOrEmpty(examination.Diagnosis))
                            {
                                diagCol.Item().Element(c => LabeledText(c, "Diagnosis", examination.Diagnosis));
                            }
                            if (!string.IsNullOrEmpty(examination.Treatment))
                            {
                                diagCol.Item().Element(c => LabeledText(c, "Treatment Plan", examination.Treatment));
                            }
                            if (!string.IsNullOrEmpty(examination.FollowUp))
                            {
                                diagCol.Item().Element(c => LabeledText(c, "Follow-up Instructions", examination.FollowUp));
                            }
                        });
                    });
                });

                // ── Footer ──
                page.Footer().Element(footer =>
                {
                    footer.Column(col =>
                    {
                        col.Item().LineHorizontal(0.5f).LineColor(Colors.Grey.Lighten2);
                        col.Item().PaddingTop(6).Row(row =>
                        {
                            row.RelativeItem().Column(left =>
                            {
                                left.Item().Text("Generated by SkinVision Platform")
                                    .FontSize(8).FontColor(Colors.Grey.Medium);
                                left.Item().Text("AI analysis is advisory only. Clinical diagnosis by licensed physician.")
                                    .FontSize(7).Italic().FontColor(Colors.Grey.Medium);
                            });
                            row.RelativeItem().AlignRight()
                                .Text(text =>
                                {
                                    text.Span("Page ").FontSize(8).FontColor(Colors.Grey.Medium);
                                    text.CurrentPageNumber().FontSize(8).FontColor(Colors.Grey.Medium);
                                    text.Span(" of ").FontSize(8).FontColor(Colors.Grey.Medium);
                                    text.TotalPages().FontSize(8).FontColor(Colors.Grey.Medium);
                                });
                        });
                    });
                });
            });
        });

        var stream = new MemoryStream();
        document.GeneratePdf(stream);
        stream.Position = 0;

        return Task.FromResult<Stream>(stream);
    }

    // ── Helper Methods ──

    private static void SectionHeader(IContainer container, string title)
    {
        container.PaddingTop(4).Column(col =>
        {
            col.Item().Text(title).Bold().FontSize(12)
                .FontColor(Colors.Teal.Darken2);
            col.Item().PaddingTop(2)
                .LineHorizontal(0.5f).LineColor(Colors.Teal.Lighten3);
        });
    }

    private static void InfoGrid(IContainer container, Dictionary<string, string?> items)
    {
        container.PaddingTop(4).Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.RelativeColumn();
                columns.RelativeColumn();
                columns.RelativeColumn();
            });

            var index = 0;
            foreach (var item in items)
            {
                var row = (uint)(index / 3 + 1);
                var col = (uint)(index % 3 + 1);

                table.Cell().Row(row).Column(col).Padding(4).Column(cellCol =>
                {
                    cellCol.Item().Text(item.Key).Bold()
                        .FontSize(8).FontColor(Colors.Grey.Darken1);
                    cellCol.Item().Text(item.Value ?? "N/A")
                        .FontSize(10);
                });

                index++;
            }
        });
    }

    private static void LabeledText(IContainer container, string label, string value)
    {
        container.Background(Colors.Grey.Lighten5)
            .Border(0.5f).BorderColor(Colors.Grey.Lighten3)
            .Padding(10).Column(col =>
            {
                col.Item().Text(label).Bold()
                    .FontSize(9).FontColor(Colors.Teal.Darken2);
                col.Item().PaddingTop(4).Text(value)
                    .FontSize(10).LineHeight(1.5f);
            });
    }

    private string GetPhysicalImagePath(string relativePath)
    {
        var webRoot = !string.IsNullOrEmpty(_env.WebRootPath)
            ? _env.WebRootPath
            : Path.Combine(_env.ContentRootPath, "wwwroot");

        var cleanPath = relativePath.TrimStart('/', '\\').Replace('/', Path.DirectorySeparatorChar);
        return Path.Combine(webRoot, cleanPath);
    }
}

