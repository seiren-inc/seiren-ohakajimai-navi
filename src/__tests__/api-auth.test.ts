import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { validateApiKey } from '@/lib/api-auth';

describe('API Auth Utility', () => {
    const VALID_KEY = 'test-secret-key';

    it('validates a correct API key', () => {
        // Mock environment variable
        vi.stubEnv('INTERNAL_API_KEY', VALID_KEY);

        const request = new NextRequest('http://localhost/api/v1/municipalities', {
            headers: { 'x-api-key': VALID_KEY }
        });

        expect(validateApiKey(request)).toBe(true);
        vi.unstubAllEnvs();
    });

    it('rejects an incorrect API key', () => {
        vi.stubEnv('INTERNAL_API_KEY', VALID_KEY);

        const request = new NextRequest('http://localhost/api/v1/municipalities', {
            headers: { 'x-api-key': 'wrong-key' }
        });

        expect(validateApiKey(request)).toBe(false);
        vi.unstubAllEnvs();
    });

    it('fails safe when INTERNAL_API_KEY is not set', () => {
        vi.stubEnv('INTERNAL_API_KEY', '');

        const request = new NextRequest('http://localhost/api/v1/municipalities', {
            headers: { 'x-api-key': 'any-key' }
        });

        expect(validateApiKey(request)).toBe(false);
        vi.unstubAllEnvs();
    });
});
