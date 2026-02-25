import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateApiKey } from '@/lib/api-auth';
import { isRateLimited } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
    // 1. Rate Limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
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
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '100');
        const skip = (page - 1) * limit;

        const [total, items] = await Promise.all([
            prisma.municipality.count({ where: { isPublished: true } }),
            prisma.municipality.findMany({
                where: { isPublished: true },
                select: {
                    jisCode: true,
                    name: true,
                    prefectureName: true,
                    prefectureSlug: true,
                    municipalitySlug: true,
                    url: true,
                    pdfUrl: true,
                    linkStatus: true,
                    lastCheckedAt: true,
                    dataQualityLevel: true,
                },
                skip,
                take: limit,
                orderBy: { jisCode: 'asc' },
            }),
        ]);

        return NextResponse.json({
            items,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        }, { headers });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500, headers }
        );
    }
}
