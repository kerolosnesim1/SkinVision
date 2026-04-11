using SkinVision.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkinVision.Application.Interfaces
{
    public interface IImageRepository
    {
         Task<ExaminationImage> AddAsync(ExaminationImage image);
    }
}
