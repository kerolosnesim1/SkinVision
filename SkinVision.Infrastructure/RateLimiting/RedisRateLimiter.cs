using Microsoft.Extensions.Logging;
using SkinVision.Application.Interfaces.Services;
using StackExchange.Redis;

namespace SkinVision.Infrastructure.RateLimiting;

public class RedisRateLimiter : IRateLimiter
{
    private readonly IConnectionMultiplexer _redis;
    private readonly ILogger<RedisRateLimiter> _logger;

    public RedisRateLimiter(IConnectionMultiplexer redis, ILogger<RedisRateLimiter> logger)
    {
        _redis = redis;
        _logger = logger;
    }

    public async Task<RateLimitResult> TryAcquireAsync(
        string key, int permit, TimeSpan window, CancellationToken cancellationToken = default)
    {
        try
        {
            var db = _redis.GetDatabase();
            var redisKey = "ratelimit:" + key;

            // INCR the counter. Returns the new count (atomic).
            long count = await db.StringIncrementAsync(redisKey);

            // Set expiry only on the first request, so the window resets itself.
            if (count == 1)
            {
                await db.KeyExpireAsync(redisKey, window);
            }

            // Allow if within the limit.
            if (count <= permit)
            {
                return new RateLimitResult(Allowed: true, RetryAfterSeconds: null);
            }

            // Over the limit — tell the client how long to wait.
            var ttl = await db.KeyTimeToLiveAsync(redisKey);
            int retryAfter = ttl is null
                ? (int)window.TotalSeconds
                : (int)Math.Ceiling(ttl.Value.TotalSeconds);

            _logger.LogWarning("Rate limit exceeded for {Key}: {Count}/{Permit}", key, count, permit);

            return new RateLimitResult(Allowed: false, RetryAfterSeconds: retryAfter);
        }
        catch (Exception ex)
        {
            // If Redis is down, let the request through (fail-open).
            _logger.LogError(ex, "Redis rate limiter failed for {Key}; allowing request", key);
            return new RateLimitResult(Allowed: true, RetryAfterSeconds: null);
        }
    }
}
