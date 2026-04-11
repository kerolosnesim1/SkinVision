using SkinVision.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkinVision.Application.Services
{
    public interface IImageService
    {
        Task<ExaminationImage> AddImageAsync(int doctorId, int examinationId, Stream fileStream, string fileName, string bodyPart);
    }
}
