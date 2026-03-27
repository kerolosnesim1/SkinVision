using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkinVision.Domain.Entities;

namespace SkinVision.Infrastructure.Configurations;

public class ExaminationImageConfiguration : IEntityTypeConfiguration<ExaminationImage>
{
    public void Configure(EntityTypeBuilder<ExaminationImage> builder)
    {
        builder.HasKey(i => i.ImageId);

        builder.Property(i => i.FilePath)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(i => i.Format)
            .HasMaxLength(10);

        builder.Property(i => i.UploadDate)
            .HasDefaultValueSql("GETDATE()");

        builder.Property(i => i.BodyPart)
            .HasMaxLength(100);

        builder.HasOne(i => i.Examination)
            .WithMany(e => e.Images)
            .HasForeignKey(i => i.DiagnosisId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
