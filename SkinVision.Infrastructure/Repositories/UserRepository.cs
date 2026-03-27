using Microsoft.EntityFrameworkCore;
using SkinVision.Application.Interfaces;
using SkinVision.Domain.Entities;
using SkinVision.Infrastructure.Context;

namespace SkinVision.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public User? Add(User user)
    {
        var addedUser = _context.Users.Add(user).Entity;
        _context.SaveChanges();
        return addedUser;

    }


    public User? FindByEmailWithProfile(string email)
    {
        return _context.Users
            .Include(u => u.DoctorProfile)
            .FirstOrDefault(u => u.Email == email);
    }

    public void Update(User user)
    {
        _context.Users.Update(user);
        _context.SaveChanges();
    }
}
