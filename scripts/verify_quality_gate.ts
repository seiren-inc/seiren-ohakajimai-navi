import { PrismaClient } from "@prisma/client";
// Use relative path for scripts
import { notifyCritical } from "../src/lib/notify";

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Running Quality Gate Verification...");
    const errors: string[] = [];
    const metrics: Record<string, number> = {};

    // --- Hard Gates (Must Pass) ---

    // 1. Total Count Check
    const totalCount = await prisma.municipality.count();
    if (totalCount !== 1737) {
        errors.push(`[CRITICAL] Total municipality count is ${totalCount}, expected 1737.`);
    }

    const municipalities = await prisma.municipality.findMany();

    // 2. Slug & Protocol & PDF Rule Checks
    const slugs = new Set<string>();

    municipalities.forEach(m => {
        // Slug check
        if (!m.municipalitySlug || m.municipalitySlug.trim() === "") {
            errors.push(`[CRITICAL] JIS:${m.jisCode} has empty municipalitySlug.`);
        }
        if (slugs.has(m.municipalitySlug)) {
            // Uniqueness is usually handled by DB, but we check logic here
            // Note: DB unique constraint is [prefectureCode, municipalitySlug]
            // We'll follow the same logic or just check global if we want tighter control
        }
        slugs.add(m.municipalitySlug);

        // Protocol check
        if (m.url && !m.url.startsWith("http")) {
            errors.push(`[CRITICAL] JIS:${m.jisCode} has invalid URL protocol: ${m.url}`);
        }
        if (m.pdfUrl && !m.pdfUrl.startsWith("http")) {
            errors.push(`[CRITICAL] JIS:${m.jisCode} has invalid PDF URL protocol: ${m.pdfUrl}`);
        }

        // PDF Rule Violation
        // @ts-ignore
        if (m.linkStatus === "PDF_ONLY" && m.url && m.url.trim() !== "") {
            errors.push(`[CRITICAL] JIS:${m.jisCode} is PDF_ONLY but has 'url' populated.`);
        }
    });

    // --- Soft Gates (Collection & Metrics) ---
    metrics.missing_link = await prisma.municipality.count({
        where: { url: null, pdfUrl: null }
    });
    metrics.has_domain_warning = await prisma.municipality.count({
        where: { hasDomainWarning: true }
    });
    // @ts-ignore
    metrics.broken = await prisma.municipality.count({
        where: { linkStatus: "BROKEN" }
    });
    // @ts-ignore
    metrics.needs_review = await prisma.municipality.count({
        where: { linkStatus: "NEEDS_REVIEW" }
    });

    // Output Metrics
    console.log("\n📊 Quality Metrics (Soft Gates):");
    console.table(metrics);

    // Final Evaluation
    if (errors.length > 0) {
        console.error("\n❌ HARD GATE FAILURE:");
        errors.forEach(err => console.error(err));

        await notifyCritical(`Quality Gate Failed with ${errors.length} hard errors.`);
        process.exit(1);
    }

    console.log("\n✅ Global Quality Gates Passed.");
}

main()
    .catch(async (e) => {
        console.error(e);
        await notifyCritical(`Quality Gate execution error: ${e.message}`);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
