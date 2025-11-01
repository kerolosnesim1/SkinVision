using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SkinVision.Backend.Domain.Entities;

public partial class SkinVisionDbContext : DbContext
{
    public SkinVisionDbContext()
    {
    }

    public SkinVisionDbContext(DbContextOptions<SkinVisionDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Bill> Bills { get; set; }

    public virtual DbSet<Diagnosis> Diagnoses { get; set; }

    public virtual DbSet<DoctorProfile> DoctorProfiles { get; set; }

    public virtual DbSet<Image> Images { get; set; }

    public virtual DbSet<Log> Logs { get; set; }

    public virtual DbSet<Message> Messages { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<PatientProfile> PatientProfiles { get; set; }

    public virtual DbSet<Prediction> Predictions { get; set; }

    public virtual DbSet<Report> Reports { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<VerificationRequest> VerificationRequests { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=.;Database=SkinVisionDB;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("Latin1_General_CI_AS");

        modelBuilder.Entity<Bill>(entity =>
        {
            entity.HasKey(e => e.BillId).HasName("PK__Bill__D706DDB3A20672BD");

            entity.ToTable("Bill");

            entity.Property(e => e.BillId).HasColumnName("bill_id");
            entity.Property(e => e.Amount).HasColumnName("amount");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .HasColumnName("description");
            entity.Property(e => e.DiagnosisId).HasColumnName("diagnosis_id");
            entity.Property(e => e.GeneratedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("generated_at");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");

            entity.HasOne(d => d.Diagnosis).WithMany(p => p.Bills)
                .HasForeignKey(d => d.DiagnosisId)
                .HasConstraintName("FK__Bill__diagnosis___59063A47");
        });

        modelBuilder.Entity<Diagnosis>(entity =>
        {
            entity.HasKey(e => e.DiagnosisId).HasName("PK__Diagnosi__D49E32B4223EA29F");

            entity.ToTable("Diagnosis");

            entity.HasIndex(e => e.DoctorId, "IDX_Diagnosis_Doctor");

            entity.Property(e => e.DiagnosisId).HasColumnName("diagnosis_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DoctorId).HasColumnName("doctor_id");
            entity.Property(e => e.ImageId).HasColumnName("image_id");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.PredictionId).HasColumnName("prediction_id");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.Doctor).WithMany(p => p.Diagnoses)
                .HasForeignKey(d => d.DoctorId)
                .HasConstraintName("FK__Diagnosis__docto__5BE2A6F2");

            entity.HasOne(d => d.Image).WithMany(p => p.Diagnoses)
                .HasForeignKey(d => d.ImageId)
                .HasConstraintName("FK__Diagnosis__image__5AEE82B9");

            entity.HasOne(d => d.Prediction).WithMany(p => p.Diagnoses)
                .HasForeignKey(d => d.PredictionId)
                .HasConstraintName("FK__Diagnosis__predi__5CD6CB2B");
        });

        modelBuilder.Entity<DoctorProfile>(entity =>
        {
            entity.HasKey(e => e.DoctorId).HasName("PK__DoctorPr__F3993564330490FF");

            entity.ToTable("DoctorProfile");

            entity.Property(e => e.DoctorId)
                .ValueGeneratedNever()
                .HasColumnName("doctor_id");
            entity.Property(e => e.HospitalAffiliation)
                .HasMaxLength(150)
                .HasColumnName("hospital_affiliation");
            entity.Property(e => e.Specialization)
                .HasMaxLength(100)
                .HasColumnName("specialization");
            entity.Property(e => e.YearsExperience).HasColumnName("years_experience");

            entity.HasOne(d => d.Doctor).WithOne(p => p.DoctorProfile)
                .HasForeignKey<DoctorProfile>(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DoctorPro__docto__60A75C0F");
        });

        modelBuilder.Entity<Image>(entity =>
        {
            entity.HasKey(e => e.ImageId).HasName("PK__Image__DC9AC95526BFDA94");

            entity.ToTable("Image");

            entity.HasIndex(e => e.UploaderId, "IDX_Image_Uploader");

            entity.Property(e => e.ImageId).HasColumnName("image_id");
            entity.Property(e => e.FilePath)
                .HasMaxLength(255)
                .HasColumnName("file_path");
            entity.Property(e => e.Format)
                .HasMaxLength(20)
                .HasColumnName("format");
            entity.Property(e => e.Size).HasColumnName("size");
            entity.Property(e => e.UploadDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("upload_date");
            entity.Property(e => e.UploaderId).HasColumnName("uploader_id");

            entity.HasOne(d => d.Uploader).WithMany(p => p.Images)
                .HasForeignKey(d => d.UploaderId)
                .HasConstraintName("FK__Image__uploader___619B8048");
        });

        modelBuilder.Entity<Log>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__Log__9E2397E053312E5C");

            entity.ToTable("Log");

            entity.Property(e => e.LogId).HasColumnName("log_id");
            entity.Property(e => e.Action)
                .HasMaxLength(255)
                .HasColumnName("action");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(50)
                .HasColumnName("ip_address");
            entity.Property(e => e.Timestamp)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("timestamp");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Logs)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Log__user_id__6383C8BA");
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__Message__0BBF6EE63AD8FA99");

            entity.ToTable("Message");

            entity.HasIndex(e => e.ReceiverId, "IDX_Message_Receiver");

            entity.Property(e => e.MessageId).HasColumnName("message_id");
            entity.Property(e => e.MessageText).HasColumnName("message_text");
            entity.Property(e => e.ReadStatus)
                .HasDefaultValue(false)
                .HasColumnName("read_status");
            entity.Property(e => e.ReceiverId).HasColumnName("receiver_id");
            entity.Property(e => e.SenderId).HasColumnName("sender_id");
            entity.Property(e => e.SentAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("sent_at");

            entity.HasOne(d => d.Receiver).WithMany(p => p.MessageReceivers)
                .HasForeignKey(d => d.ReceiverId)
                .HasConstraintName("FK__Message__receive__66603565");

            entity.HasOne(d => d.Sender).WithMany(p => p.MessageSenders)
                .HasForeignKey(d => d.SenderId)
                .HasConstraintName("FK__Message__sender___656C112C");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__E059842F3795DE56");

            entity.ToTable("Notification");

            entity.HasIndex(e => e.UserId, "IDX_Notification_User");

            entity.Property(e => e.NotificationId).HasColumnName("notification_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Message)
                .HasMaxLength(255)
                .HasColumnName("message");
            entity.Property(e => e.ReadStatus)
                .HasDefaultValue(false)
                .HasColumnName("read_status");
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .HasColumnName("title");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .HasColumnName("type");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Notificat__user___693CA210");
        });

        modelBuilder.Entity<PatientProfile>(entity =>
        {
            entity.HasKey(e => e.PatientId).HasName("PK__PatientP__4D5CE476CD0579F9");

            entity.ToTable("PatientProfile");

            entity.Property(e => e.PatientId)
                .ValueGeneratedNever()
                .HasColumnName("patient_id");
            entity.Property(e => e.Age).HasColumnName("age");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .HasColumnName("gender");
            entity.Property(e => e.MedicalHistory).HasColumnName("medical_history");
            entity.Property(e => e.SkinType)
                .HasMaxLength(50)
                .HasColumnName("skin_type");

            entity.HasOne(d => d.Patient).WithOne(p => p.PatientProfile)
                .HasForeignKey<PatientProfile>(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PatientPr__patie__6B24EA82");
        });

        modelBuilder.Entity<Prediction>(entity =>
        {
            entity.HasKey(e => e.PredictionId).HasName("PK__Predicti__F1AE77BF987EE08E");

            entity.ToTable("Prediction");

            entity.HasIndex(e => e.Result, "IDX_Prediction_Result");

            entity.Property(e => e.PredictionId).HasColumnName("prediction_id");
            entity.Property(e => e.ConfidenceScore).HasColumnName("confidence_score");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.ImageId).HasColumnName("image_id");
            entity.Property(e => e.ModelVersion)
                .HasMaxLength(50)
                .HasColumnName("model_version");
            entity.Property(e => e.Result)
                .HasMaxLength(255)
                .HasColumnName("result");

            entity.HasOne(d => d.Image).WithMany(p => p.Predictions)
                .HasForeignKey(d => d.ImageId)
                .HasConstraintName("FK__Predictio__image__6C190EBB");
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__Report__779B7C58F6F1AE02");

            entity.ToTable("Report");

            entity.Property(e => e.ReportId).HasColumnName("report_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DiagnosisId).HasColumnName("diagnosis_id");
            entity.Property(e => e.Format)
                .HasMaxLength(10)
                .HasColumnName("format");
            entity.Property(e => e.ReportPath)
                .HasMaxLength(255)
                .HasColumnName("report_path");

            entity.HasOne(d => d.Diagnosis).WithMany(p => p.Reports)
                .HasForeignKey(d => d.DiagnosisId)
                .HasConstraintName("FK__Report__diagnosi__6E01572D");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__B9BE370F940D9E82");

            entity.ToTable("User");

            entity.HasIndex(e => e.Email, "IDX_User_Email");

            entity.HasIndex(e => e.Email, "UQ__User__AB6E6164EF7C2B08").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .HasColumnName("email");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("password_hash");
            entity.Property(e => e.Role)
                .HasMaxLength(20)
                .HasColumnName("role");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.Username)
                .HasMaxLength(100)
                .HasColumnName("username");
        });

        modelBuilder.Entity<VerificationRequest>(entity =>
        {
            entity.HasKey(e => e.VerificationId).HasName("PK__Verifica__24F17969E3D1BB0F");

            entity.ToTable("VerificationRequest");

            entity.Property(e => e.VerificationId).HasColumnName("verification_id");
            entity.Property(e => e.ApprovedAt)
                .HasColumnType("datetime")
                .HasColumnName("approved_at");
            entity.Property(e => e.ApprovedByAdmin).HasColumnName("approved_by_admin");
            entity.Property(e => e.DoctorId).HasColumnName("doctor_id");
            entity.Property(e => e.IssuingAuthority)
                .HasMaxLength(150)
                .HasColumnName("issuing_authority");
            entity.Property(e => e.LicenseDocumentPath)
                .HasMaxLength(255)
                .HasColumnName("license_document_path");
            entity.Property(e => e.LicenseNumber)
                .HasMaxLength(100)
                .HasColumnName("license_number");
            entity.Property(e => e.SubmissionDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("submission_date");
            entity.Property(e => e.VerificationStatus)
                .HasMaxLength(20)
                .HasColumnName("verification_status");

            entity.HasOne(d => d.ApprovedByAdminNavigation).WithMany(p => p.VerificationRequests)
                .HasForeignKey(d => d.ApprovedByAdmin)
                .HasConstraintName("FK__Verificat__appro__70DDC3D8");

            entity.HasOne(d => d.Doctor).WithMany(p => p.VerificationRequests)
                .HasForeignKey(d => d.DoctorId)
                .HasConstraintName("FK__Verificat__docto__6FE99F9F");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
