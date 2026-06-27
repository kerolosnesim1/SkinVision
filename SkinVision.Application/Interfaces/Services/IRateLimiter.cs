namespace SkinVision.Application.Interfaces.Services;

public record RateLimitResult(bool Allowed, int? RetryAfterSeconds);

public interface IRateLimiter
{
    Task<RateLimitResult> TryAcquireAsync(string key,int permit,TimeSpan window,CancellationToken cancellationToken = default);
}
