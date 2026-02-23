/**
 * Simple memory-based rate limiter for API endpoints.
 * In a distributed environment, this should be replaced by Redis.
 */
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const WINDOW_SIZE_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

export function isRateLimited(identifier: string): { limited: boolean; remaining: number; reset: number } {
    const now = Date.now();
    const userData = rateLimitMap.get(identifier);

    if (!userData || now - userData.lastReset > WINDOW_SIZE_MS) {
        // New window or first request
        const newData = { count: 1, lastReset: now };
        rateLimitMap.set(identifier, newData);
        return { limited: false, remaining: MAX_REQUESTS - 1, reset: now + WINDOW_SIZE_MS };
    }

    if (userData.count >= MAX_REQUESTS) {
        return { limited: true, remaining: 0, reset: userData.lastReset + WINDOW_SIZE_MS };
    }

    userData.count += 1;
    return { limited: false, remaining: MAX_REQUESTS - userData.count, reset: userData.lastReset + WINDOW_SIZE_MS };
}
