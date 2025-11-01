using System;
using System.Collections.Generic;

namespace SkinVision.Backend.Domain.Entities;

public partial class Image
{
    public int ImageId { get; set; }

    public int? UploaderId { get; set; }

    public string? FilePath { get; set; }

    public string? Format { get; set; }

    public double? Size { get; set; }

    public DateTime? UploadDate { get; set; }

    public virtual ICollection<Diagnosis> Diagnoses { get; set; } = new List<Diagnosis>();

    public virtual ICollection<Prediction> Predictions { get; set; } = new List<Prediction>();

    public virtual User? Uploader { get; set; }
}
