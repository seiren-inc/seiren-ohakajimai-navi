import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isRateLimited } from '@/lib/rate-limit';

describe('Rate Limiter Utility', () => {
    beforeEach(() => {
        // We cannot easily clear the internal map if it's not exported,
        // so we'll test with unique identifiers.
        vi.useFakeTimers();
    });

    it('allows requests within limit', () => {
        const id = 'user-1';
        const result1 = isRateLimited(id);
        expect(result1.limited).toBe(false);
        expect(result1.remaining).toBe(59);

        const result2 = isRateLimited(id);
        expect(result2.limited).toBe(false);
        expect(result2.remaining).toBe(58);
    });

    it('blocks requests exceeding limit', () => {
        const id = 'user-2';
        // Fill the bucket (60 requests)
        for (let i = 0; i < 60; i++) {
            isRateLimited(id);
        }

        const blockedResult = isRateLimited(id);
        expect(blockedResult.limited).toBe(true);
        expect(blockedResult.remaining).toBe(0);
    });

    it('resets after window expires', () => {
        const id = 'user-3';
        // Fill bucket
        for (let i = 0; i < 60; i++) {
            isRateLimited(id);
        }

        expect(isRateLimited(id).limited).toBe(true);

        // Advance time by 61 seconds (WINDOW_SIZE_MS = 60 * 1000)
        vi.advanceTimersByTime(61 * 1000);

        const resetResult = isRateLimited(id);
        expect(resetResult.limited).toBe(false);
        expect(resetResult.remaining).toBe(59);
    });
});
