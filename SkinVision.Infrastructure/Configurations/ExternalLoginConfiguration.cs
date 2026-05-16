using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkinVision.Domain.Entities;

namespace SkinVision.Infrastructure.Configurations;

public class ExternalLoginConfiguration : IEntityTypeConfiguration<ExternalLogin>
{
    public void Configure(EntityTypeBuilder<ExternalLogin> builder)
    {
        builder.HasKey(e => e.ExternalLoginId);

        builder.Property(e => e.Provider)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(e => e.ProviderUserId)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(e => e.ProviderEmail)
            .HasMaxLength(256);

        builder.Property(e => e.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        // Prevent duplicate external logins for the same provider
        builder.HasIndex(e => new { e.Provider, e.ProviderUserId })
            .IsUnique();

        builder.HasOne(e => e.User)
            .WithMany(u => u.ExternalLogins)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
