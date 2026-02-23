import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- CI DB Counts Verification ---');

    const total = await prisma.municipality.count();

    // Strict check for national master count
    if (total !== 1737) {
        console.error(`ERROR: Total municipalities count mismatch. Expected 1737, found ${total}.`);
        process.exit(1);
    }

    const okCount = await prisma.municipality.count({
        where: { linkStatus: 'OK' }
    });
    const needsReviewCount = await prisma.municipality.count({
        where: { linkStatus: 'NEEDS_REVIEW' }
    });
    const brokenCount = await prisma.municipality.count({
        where: { linkStatus: 'BROKEN' }
    });
    const unknownCount = await prisma.municipality.count({
        where: { linkStatus: 'UNKNOWN' }
    });

    const sum = okCount + needsReviewCount + brokenCount + unknownCount;

    if (sum !== total) {
        console.error(`ERROR: Link status counts sum (${sum}) does not match total (${total}).`);
        process.exit(1);
    }

    console.log('SUCCESS: DB counts verified.');
    console.log(`Total: ${total} (OK: ${okCount}, Review: ${needsReviewCount}, Broken: ${brokenCount}, Unknown: ${unknownCount})`);
    process.exit(0);
}

main()
    .catch((e) => {
        console.error('ERROR: Database verification failed unexpectedly.');
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
