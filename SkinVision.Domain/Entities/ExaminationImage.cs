using System;
using System.Collections.Generic;

namespace SkinVision.Domain.Entities;

public class ExaminationImage
{
    public int ImageId { get; set; }
    public int DiagnosisId { get; set; } 

    public string FilePath { get; set; } = null!;
    public string? Format { get; set; } 
    public long? Size { get; set; } 
    public DateTime UploadDate { get; set; } 

    public string? BodyPart { get; set; } 

    public virtual Examination Examination { get; set; } = null!;
    
    public virtual Prediction? AiResult { get; set; } 
}
