using Microsoft.EntityFrameworkCore;
using SkinVision.Domain.Entities;

namespace SkinVision.Infrastructure.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<DoctorProfile> DoctorProfiles { get; set; }
    public DbSet<Examination> Examinations { get; set; }
    public DbSet<ExaminationImage> ExaminationImages { get; set; }
    public DbSet<Prediction> Predictions { get; set; }
    public DbSet<Report> Reports { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<Log> Logs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }

    internal void saveChanges()
    {
        throw new NotImplementedException();
    }
}
