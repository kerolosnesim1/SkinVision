using SkinVision.Application.Interfaces;
using SkinVision.Domain.Entities;
using SkinVision.Infrastructure.Context;

namespace SkinVision.Infrastructure.Repositories;

public class ImageRepository : BaseRepository<ExaminationImage>, IImageRepository
{
    public ImageRepository(AppDbContext context) : base(context)
    {
    }
}
