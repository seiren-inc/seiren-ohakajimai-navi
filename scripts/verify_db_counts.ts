import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const total = await prisma.municipality.count();
    const published_ok = await prisma.municipality.count({
        where: { isPublished: true, linkStatus: 'OK', linkType: 'GUIDE' }
    });
    const published_pdf = await prisma.municipality.count({
        where: { isPublished: true, linkStatus: 'OK', linkType: 'PDF' }
    });

    // For missing links, it means both url and pdfUrl are null or empty
    const missing = await prisma.municipality.count({
        where: {
            OR: [
                { url: null, pdfUrl: null },
                { url: '', pdfUrl: '' }
            ]
        }
    });

    console.log('--- DB Counts ---');
    console.log(`total: ${total}`);
    console.log(`published_ok: ${published_ok}`);
    console.log(`published_pdf: ${published_pdf}`);
    console.log(`missing_link: ${missing}`);
    console.log(`theoretical_display: ${published_ok + published_pdf}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
