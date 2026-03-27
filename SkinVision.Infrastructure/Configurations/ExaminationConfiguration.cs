using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkinVision.Domain.Entities;

namespace SkinVision.Infrastructure.Configurations;

public class ExaminationConfiguration : IEntityTypeConfiguration<Examination>
{
    public void Configure(EntityTypeBuilder<Examination> builder)
    {
        builder.HasKey(e => e.DiagnosisId);

        builder.Property(e => e.Reason)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(e => e.Diagnosis)
            .HasMaxLength(2000);

        builder.Property(e => e.Treatment)
            .HasMaxLength(2000);

        builder.Property(e => e.FollowUp)
            .HasMaxLength(1000);

        builder.Property(e => e.RiskLevel)
            .HasMaxLength(50);

        builder.Property(e => e.Status)
            .HasMaxLength(50)
            .HasDefaultValue("InProgress");

        builder.Property(e => e.CreatedAt)
            .HasDefaultValueSql("GETDATE()");

        builder.HasOne(e => e.Doctor)
            .WithMany(u => u.Examinations)
            .HasForeignKey(e => e.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Patient)
            .WithMany(p => p.Examinations)
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
