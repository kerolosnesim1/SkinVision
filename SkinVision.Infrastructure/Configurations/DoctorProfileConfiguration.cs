using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkinVision.Domain.Entities;

namespace SkinVision.Infrastructure.Configurations;

public class DoctorProfileConfiguration : IEntityTypeConfiguration<DoctorProfile>
{
    public void Configure(EntityTypeBuilder<DoctorProfile> builder)
    {
        builder.HasKey(d => d.DoctorId);

        builder.Property(d => d.FullName)
            .HasMaxLength(200);

        builder.Property(d => d.ClinicName)
            .HasMaxLength(200);

        builder.Property(d => d.Specialization)
            .HasMaxLength(200);

        builder.Property(d => d.HospitalAffiliation)
            .HasMaxLength(300);

        builder.Property(d => d.ClinicAddress)
            .HasMaxLength(500);

        builder.Property(d => d.Phone)
            .HasMaxLength(50);
    }
}
