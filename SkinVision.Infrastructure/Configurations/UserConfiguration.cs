using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkinVision.Domain.Entities;

namespace SkinVision.Infrastructure.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.UserId);

        builder.Property(u => u.Username)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(u => u.PasswordHash)
            .IsRequired();

        builder.Property(u => u.Role)
            .HasMaxLength(50);

        builder.Property(u => u.CreatedAt)
            .HasDefaultValueSql("GETDATE()");

        builder.Property(u => u.UpdatedAt)
            .HasDefaultValueSql("GETDATE()");

        builder.HasOne(u => u.DoctorProfile)
            .WithOne(d => d.Doctor)
            .HasForeignKey<DoctorProfile>(d => d.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
