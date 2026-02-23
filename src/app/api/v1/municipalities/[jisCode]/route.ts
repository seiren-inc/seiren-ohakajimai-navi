import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateApiKey } from '@/lib/api-auth';
import { isRateLimited } from '@/lib/rate-limit';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ jisCode: string }> }
) {
    // 1. Rate Limiting
    const ip = request.ip || 'anonymous';
    const { limited, remaining, reset } = isRateLimited(ip);

    const headers = {
        'X-RateLimit-Limit': '60',
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
    };

    if (limited) {
        return NextResponse.json(
            { error: 'Too Many Requests' },
            { status: 429, headers }
        );
    }

    // 2. API Key Authentication
    if (!validateApiKey(request)) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401, headers }
        );
    }

    // 3. Data Fetching
    try {
        const { jisCode } = await params;
        const item = await prisma.municipality.findUnique({
            where: { jisCode, isPublished: true },
        });

        if (!item) {
            return NextResponse.json(
                { error: 'Municipality not found' },
                { status: 404, headers }
            );
        }

        return NextResponse.json(item, { headers });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500, headers }
        );
    }
}
