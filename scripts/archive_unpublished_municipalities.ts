
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Archiving Unpublished Municipalities ---');

    const unpublished = await prisma.municipality.findMany({
        where: { isPublished: false }
    });

    console.log(`Found ${unpublished.length} unpublished records.`);

    if (unpublished.length === 0) {
        console.log('No records to archive.');
        return;
    }

    let successCount = 0;
    for (const muni of unpublished) {
        try {
            await prisma.$transaction(async (tx) => {
                // Insert into archive
                await tx.municipalityArchive.upsert({
                    where: { id: muni.id },
                    create: {
                        id: muni.id,
                        jisCode: muni.jisCode,
                        name: muni.name,
                        prefectureCode: muni.prefectureCode,
                        prefectureName: muni.prefectureName,
                        prefectureSlug: muni.prefectureSlug,
                        municipalitySlug: muni.municipalitySlug,
                        region: muni.region,
                        url: muni.url,
                        pdfUrl: muni.pdfUrl,
                        isPublished: muni.isPublished,
                        linkStatus: muni.linkStatus,
                        linkType: muni.linkType,
                        lastCheckedAt: muni.lastCheckedAt,
                        notes: muni.notes,
                        seoDescription: muni.seoDescription,
                        createdAt: muni.createdAt,
                        updatedAt: muni.updatedAt,
                        hasDomainWarning: muni.hasDomainWarning,
                        subLinks: muni.subLinks || undefined,
                        archivedAt: new Date()
                    },
                    update: {
                        // Update if already exists
                        jisCode: muni.jisCode,
                        name: muni.name,
                        url: muni.url,
                        pdfUrl: muni.pdfUrl,
                        isPublished: muni.isPublished,
                        linkStatus: muni.linkStatus,
                        linkType: muni.linkType,
                        notes: muni.notes,
                        updatedAt: muni.updatedAt,
                        hasDomainWarning: muni.hasDomainWarning,
                        subLinks: muni.subLinks || undefined,
                    }
                });

                // Delete from main table
                await tx.municipality.delete({
                    where: { id: muni.id }
                });
            });
            successCount++;
        } catch (err) {
            console.error(`Failed to archive ${muni.name} (JIS: ${muni.jisCode}):`, err);
        }
    }

    console.log(`Successfully archived ${successCount} / ${unpublished.length} records.`);

    // Final Count
    const remaining = await prisma.municipality.count();
    const archived = await prisma.municipalityArchive.count();
    console.log(`--- Result ---`);
    console.log(`Main Table: ${remaining}`);
    console.log(`Archive Table: ${archived}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
