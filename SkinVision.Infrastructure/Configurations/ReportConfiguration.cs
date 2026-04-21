using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkinVision.Domain.Entities;

namespace SkinVision.Infrastructure.Configurations;

public class ReportConfiguration : IEntityTypeConfiguration<Report>
{
    public void Configure(EntityTypeBuilder<Report> builder)
    {
        builder.HasKey(r => r.ReportId);

        builder.Property(r => r.ReportPath)
            .HasMaxLength(500);

        builder.Property(r => r.Format)
            .HasMaxLength(50);

        builder.Property(r => r.Title)
            .HasMaxLength(200);

        builder.Property(r => r.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        builder.HasOne(r => r.Examination)
            .WithMany(e => e.Reports)
            .HasForeignKey(r => r.DiagnosisId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
