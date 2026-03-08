using WorkforceAPI.src.Application.Interfaces;
using WorkforceAPI.src.Domain.Entities;
using WorkforceAPI.src.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace WorkforceAPI.src.Infrastructure.Auth
{
    public class UserRepository(AppDbContext db) : IUserRepository
    {
        public Task<AppUser?> GetByIdAsync(int id, CancellationToken ct = default)
            => db.Users
                 .Include(u => u.Employee)
                 .FirstOrDefaultAsync(u => u.Id == id, ct);

        public Task<AppUser?> GetByEmailAsync(string email, CancellationToken ct = default)
            => db.Users
                 .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower(), ct);

        public async Task<AppUser> CreateAsync(AppUser user, CancellationToken ct = default)
        {
            db.Users.Add(user);
            await db.SaveChangesAsync(ct);
            return user;
        }

        public async Task<AppUser> UpdateAsync(AppUser user, CancellationToken ct = default)
        {
            db.Users.Update(user);
            await db.SaveChangesAsync(ct);
            return user;
        }
    }

    // =============================================================
    // REFRESH TOKEN REPOSITORY
    // =============================================================
    public class RefreshTokenRepository(AppDbContext db) : IRefreshTokenRepository
    {
        public Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct = default)
            => db.RefreshTokens
                 .Include(rt => rt.User)
                 .FirstOrDefaultAsync(
                     rt => rt.Token == token
                        && !rt.IsRevoked
                        && rt.ExpiresAt > DateTime.UtcNow, ct);

        public async Task CreateAsync(RefreshToken token, CancellationToken ct = default)
        {
            db.RefreshTokens.Add(token);
            await db.SaveChangesAsync(ct);
        }

        public async Task RevokeAsync(
            RefreshToken token, string? replacedBy = null, CancellationToken ct = default)
        {
            token.IsRevoked = true;
            token.ReplacedBy = replacedBy;
            db.RefreshTokens.Update(token);
            await db.SaveChangesAsync(ct);
        }

        public async Task RevokeAllForUserAsync(int userId, CancellationToken ct = default)
        {
            var tokens = await db.RefreshTokens
                .Where(rt => rt.UserId == userId && !rt.IsRevoked)
                .ToListAsync(ct);

            foreach (var t in tokens)
                t.IsRevoked = true;

            await db.SaveChangesAsync(ct);
        }
    }

}
