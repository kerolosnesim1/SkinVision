using SkinVision.Application.Interfaces;
using SkinVision.Domain.Entities;
using SkinVision.Infrastructure.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkinVision.Infrastructure.Repositories
{
    public class ImageRepository(AppDbContext context) : IImageRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<ExaminationImage> AddAsync(ExaminationImage image)
        {
            _context.ExaminationImages.Add(image);
            await _context.SaveChangesAsync();
            return image;

        }
    }
}
