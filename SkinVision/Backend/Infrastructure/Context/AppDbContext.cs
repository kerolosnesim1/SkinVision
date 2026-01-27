using Microsoft.EntityFrameworkCore;
using SkinVision.Backend.Domain.Entities;

namespace SkinVision.Backend.Infrastructure.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSets for all entities
        public DbSet<User> Users { get; set; }
        public DbSet<PatientProfile> PatientProfiles { get; set; }
        public DbSet<DoctorProfile> DoctorProfiles { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Prediction> Predictions { get; set; }
        public DbSet<Diagnosis> Diagnoses { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Bill> Bills { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Log> Logs { get; set; }
        public DbSet<VerificationRequest> VerificationRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Apply all entity configurations from the Configurations folder
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}

