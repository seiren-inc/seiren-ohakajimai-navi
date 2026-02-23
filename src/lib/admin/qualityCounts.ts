import { prisma } from "@/lib/prisma";
import { LinkStatus } from "@prisma/client";

export async function getQualityCounts() {
    const lastRun = await prisma.linkCheckRun.findFirst({
        where: { status: 'SUCCEEDED' },
        orderBy: { finishedAt: 'desc' },
    });

    const counts = await prisma.municipality.groupBy({
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

    counts.forEach((c) => {
        statusMap[c.linkStatus] = c._count.id;
    });

    const published_ok = statusMap.OK;

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
