using Microsoft.EntityFrameworkCore;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Infrastructure.Context;

namespace SkinVision.Infrastructure.Repositories;

public class BaseRepository<T> : IBaseRepository<T> where T : class
{
    protected readonly AppDbContext _context;

    public BaseRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<T?> GetByIdAsync(int id)
    {
        return await _context.Set<T>().FindAsync(id);
    }

    public async Task<List<T>> GetAllAsync()
    {
        return await _context.Set<T>().AsNoTracking().ToListAsync();
    }

    public async Task<T> AddAsync(T entity)
    {
        await _context.Set<T>().AddAsync(entity);
        return entity;
    }

    /// <summary>
    /// Marks <paramref name="entity"/> for update without forcing every column to be written.
    /// When the entity is already tracked by the change tracker (the common case, where it was
    /// loaded and then modified in a service), only the properties that actually changed are
    /// sent in the UPDATE statement. Detached entities are attached and marked as fully modified.
    /// </summary>
    public Task UpdateAsync(T entity)
    {
        var entry = _context.Entry(entity);
        if (entry.State == EntityState.Detached)
        {
            _context.Set<T>().Attach(entity);
            entry.State = EntityState.Modified;
        }

        return Task.CompletedTask;
    }

    /// <summary>
    /// Deletes the entity with the given primary key in a single round trip, without
    /// materializing it first. The primary key property is resolved from the EF Core model
    /// metadata so this stays generic over <typeparamref name="T"/>.
    /// </summary>
    public async Task DeleteByIdAsync(int id)
    {
        var keyProperty = _context.Model
            .FindEntityType(typeof(T))?
            .FindPrimaryKey()?
            .Properties[0];

        if (keyProperty is null)
            return;

        await _context.Set<T>()
            .Where(e => EF.Property<int>(e, keyProperty.Name) == id)
            .ExecuteDeleteAsync();
    }
}
