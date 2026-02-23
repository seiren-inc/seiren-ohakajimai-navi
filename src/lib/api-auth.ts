import { NextRequest } from 'next/server';

/**
 * Validates request using X-API-KEY header.
 * For this simple version, we compare against an environment variable.
 */
export function validateApiKey(request: NextRequest): boolean {
    const apiKey = request.headers.get('x-api-key');
    const validKey = process.env.INTERNAL_API_KEY;

    if (!validKey) {
        // If not configured, we might want to fail safe or allow during dev
        // But for "strictly governed" production, it must be configured.
        console.warn('INTERNAL_API_KEY is not set in environment variables.');
        return false;
    }

    return apiKey === validKey;
}
