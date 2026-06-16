using SkinVision.Domain.Entities;
 using Xunit; 

 namespace SkinVision.Application.Tests.Domain; 

 public class PredictionTests
 {
    [Fact]
    public void Prediction_DefaultValues_ShouldBeNull()
    {
        var prediction = new Prediction();
        Assert.Null(prediction.Classification);
        Assert.Null(prediction.ConfidenceScore);
        Assert.Null(prediction.ModelVersion);
        Assert.Null(prediction.CreatedAt);
        Assert.Null(prediction.Findings);
        Assert.Null(prediction.HeatmapPath);
    }

    [Fact]
    public void Prediction_WithValues_ShouldMapCorrectly()
    {
        var prediction = new Prediction
        {
            PredictionId = 1,
            ImageId = 10,
            Classification = "Melanoma",
            ConfidenceScore = 0.85m,
            ModelVersion = "v2.0",
            CreatedAt = DateTime.UtcNow,
            Findings = "Suspicious lesion detected",
            HeatmapPath = "/heatmaps/heatmap1.png"
        };

        Assert.Equal(1, prediction.PredictionId);
        Assert.Equal(10, prediction.ImageId);
        Assert.Equal("Melanoma", prediction.Classification);
        Assert.Equal(0.85m, prediction.ConfidenceScore);
        Assert.Equal("v2.0", prediction.ModelVersion);
        Assert.Equal("Suspicious lesion detected", prediction.Findings);
        Assert.Equal("/heatmaps/heatmap1.png", prediction.HeatmapPath);
    }
}