using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkinVision.Domain.Entities;

namespace SkinVision.Infrastructure.Configurations;

public class PredictionConfiguration : IEntityTypeConfiguration<Prediction>
{
    public void Configure(EntityTypeBuilder<Prediction> builder)
    {
        builder.HasKey(p => p.PredictionId);

        builder.Property(p => p.Classification) 
            .HasMaxLength(200);
            
        builder.Property(p => p.Findings) 
            .HasMaxLength(2000);

        builder.Property(p => p.ModelVersion)
            .HasMaxLength(50);

        builder.Property(p => p.CreatedAt)
            .HasDefaultValueSql("GETDATE()");

        builder.HasOne(p => p.Image)
            .WithOne(i => i.AiResult) // One-to-One
            .HasForeignKey<Prediction>(p => p.ImageId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
