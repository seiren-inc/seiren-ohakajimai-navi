import { prisma } from "@/lib/prisma";


export async function getQualityCounts() {
    const lastRun = await prisma.linkCheckRun.findFirst({
        where: { status: 'SUCCEEDED' },
        orderBy: { finishedAt: 'desc' },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma groupBy 型定義のユニオン互換性問題
    const counts = await (prisma.municipality.groupBy as any)({
        by: ['linkStatus'],
        _count: {
            id: true,
        },
    });

    const total = await prisma.municipality.count();

    const statusMap: Record<string, number> = {
        OK: 0,
        NEEDS_REVIEW: 0,
        BROKEN: 0,
        UNKNOWN: 0,
    };

    counts.forEach((c: { linkStatus: string; _count: { id: number } }) => {
        statusMap[c.linkStatus] = c._count.id;
    });



    const pdfCount = await prisma.municipality.count({
        where: {
            linkType: 'PDF',
            linkStatus: 'OK',
        }
    });

    const okCount = await prisma.municipality.count({
        where: {
            linkType: 'GUIDE',
            linkStatus: 'OK',
        }
    });

    const missingCount = await prisma.municipality.count({
        where: {
            OR: [
                { url: null, pdfUrl: null },
                { linkStatus: 'BROKEN' },
                { linkStatus: 'UNKNOWN' }
            ]
        }
    });

    return {
        total,
        published_ok: okCount,
        published_pdf: pdfCount,
        missing_link: missingCount,
        theoretical_total: okCount + pdfCount + missingCount,
        lastVerified: lastRun ? lastRun.finishedAt : null,
    };
}
