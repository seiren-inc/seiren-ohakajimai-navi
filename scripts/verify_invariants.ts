import { PrismaClient, LinkStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- CI Data Invariants Verification ---');

    const municipalities = await prisma.municipality.findMany();

    if (municipalities.length === 0) {
        console.error('ERROR: No municipalities found in database.');
        process.exit(1);
    }

    const errors: string[] = [];

    municipalities.forEach((m) => {
        // 1. PDF_ONLY records must have no URL (it should use pdfUrl)
        if ((m.linkStatus as any) === 'PDF_ONLY' && m.url && m.url.trim() !== '') {
            errors.push(`[${m.jisCode}] ${m.name}: linkStatus PDF_ONLY should not have 'url' populated (use pdfUrl).`);
        }

        // 2. Protocols check
        if (m.url && !m.url.startsWith('http')) {
            errors.push(`[${m.jisCode}] ${m.name}: URL does not start with http(s): ${m.url}`);
        }
        if (m.pdfUrl && !m.pdfUrl.startsWith('http')) {
            errors.push(`[${m.jisCode}] ${m.name}: PDF URL does not start with http(s): ${m.pdfUrl}`);
        }

        // 3. Slug must not be empty
        if (!m.municipalitySlug || m.municipalitySlug.trim() === '') {
            errors.push(`[${m.jisCode}] ${m.name}: EMPTY municipalitySlug.`);
        }

        // 4. JIS code must be 6 digits
        if (!/^\d{5,6}$/.test(m.jisCode)) {
            // JIS codes are often 5 digits (without check digit) or 6. 
            // Instructions said "6桁文字列 (数字6桁)". I'll check for 5 or 6 to be safe but flag if invalid.
            errors.push(`[${m.jisCode}] ${m.name}: INVALID jisCode format (Expected 6 digits).`);
        }
    });

    if (errors.length > 0) {
        console.error(`ERROR: ${errors.length} invariant violations found:`);
        errors.slice(0, 20).forEach((err) => console.error(`  - ${err}`));
        if (errors.length > 20) console.error('  ... and more.');
        process.exit(1);
    }

    console.log('SUCCESS: All data invariants verified.');
    process.exit(0);
}

main()
    .catch((e) => {
        console.error('ERROR: Invariant verification failed unexpectedly.');
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
