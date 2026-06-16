using System.Globalization;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Domain.Entities;

namespace SkinVision.Application.Services;

public class DlPredictionService : IDlPredictionService
{
    private const string ModelVersion = "SkinVision.ML 2.0.0";

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private readonly HttpClient _httpClient;

    public DlPredictionService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<Prediction> PredictAsync(
        Stream imageStream,
        string fileName,
        int? age,
        string? sex,
        string? anatomSite,
        CancellationToken cancellationToken = default)
    {
        if (imageStream.CanSeek)
        {
            imageStream.Position = 0;
        }

        using var form = new MultipartFormDataContent();
        using var imageContent = new StreamContent(imageStream);
        imageContent.Headers.ContentType = new MediaTypeHeaderValue(GetContentType(fileName));

        form.Add(imageContent, "file", fileName);
        form.Add(new StringContent((age ?? 55).ToString(CultureInfo.InvariantCulture)), "age");
        form.Add(new StringContent(NormalizeSex(sex)), "sex");
        form.Add(new StringContent(NormalizeAnatomSite(anatomSite)), "anatom_site");

        using var response = await _httpClient.PostAsync("predict", form, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new InvalidOperationException(
                $"DL prediction failed with {(int)response.StatusCode} {response.ReasonPhrase}: {errorBody}");
        }

        await using var responseStream = await response.Content.ReadAsStreamAsync(cancellationToken);
        var payload = await JsonSerializer.DeserializeAsync<DlPredictResponseDto>(
            responseStream,
            JsonOptions,
            cancellationToken);

        if (payload is null)
        {
            throw new InvalidOperationException("DL prediction response was empty or invalid.");
        }

        return new Prediction
        {
            Classification = payload.Classification,
            ConfidenceScore = Convert.ToDecimal(payload.Confidence, CultureInfo.InvariantCulture),
            ModelVersion = ModelVersion,
            CreatedAt = DateTime.UtcNow,
            Findings = BuildFindings(payload),
            HeatmapBase64 = payload.HeatmapBase64
        };
    }

    private static string GetContentType(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return extension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".webp" => "image/webp",
            ".bmp" => "image/bmp",
            ".tiff" or ".tif" => "image/tiff",
            _ => "application/octet-stream"
        };
    }

    private static string NormalizeSex(string? sex)
    {
        if (string.IsNullOrWhiteSpace(sex))
        {
            return "unknown";
        }

        var normalized = sex.Trim().ToLowerInvariant();
        return normalized is "male" or "female" ? normalized : "unknown";
    }

    private static string NormalizeAnatomSite(string? anatomSite)
    {
        return string.IsNullOrWhiteSpace(anatomSite)
            ? "unknown"
            : anatomSite.Trim().ToLowerInvariant();
    }

    private static string BuildFindings(DlPredictResponseDto payload)
    {
        var confidencePercent = payload.Confidence.ToString("P1", CultureInfo.InvariantCulture);
        var entropy = payload.PredictionEntropy?.ToString("0.####", CultureInfo.InvariantCulture) ?? "n/a";

        return $"{payload.ClassificationFull} ({confidencePercent} confidence, entropy {entropy})";
    }

    private sealed class DlPredictResponseDto
    {
        public string Classification { get; set; } = string.Empty;

        [JsonPropertyName("classification_full")]
        public string ClassificationFull { get; set; } = string.Empty;

        public double Confidence { get; set; }

        [JsonPropertyName("class_index")]
        public int ClassIndex { get; set; }

        [JsonPropertyName("all_probabilities")]
        public List<double> AllProbabilities { get; set; } = new();

        [JsonPropertyName("prediction_entropy")]
        public double? PredictionEntropy { get; set; }

        [JsonPropertyName("heatmap_base64")]
        public string? HeatmapBase64 { get; set; }
    }
}
