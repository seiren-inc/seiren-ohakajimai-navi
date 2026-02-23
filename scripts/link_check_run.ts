import { PrismaClient, AuditResult, LinkStatus } from "@prisma/client";
import axios from "axios";
import pLimit from "p-limit";

const prisma = new PrismaClient();
const limit = pLimit(10); // 並列実行数

const TIMEOUT = 10000;
const RETRIES = 1;

async function checkLink(url: string): Promise<{ ok: boolean; status?: number; error?: string; result: AuditResult }> {
    if (!url || !url.startsWith("http")) {
        return { ok: false, error: "Invalid Format", result: AuditResult.UNKNOWN_ERROR };
    }

    for (let i = 0; i <= RETRIES; i++) {
        try {
            const response = await axios.get(url, {
                timeout: TIMEOUT,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; SeirenAuditBot/1.0; +https://seiren.co.jp)',
                },
                validateStatus: (status) => status < 400,
            });
            return { ok: true, status: response.status, result: AuditResult.OK };
        } catch (err: any) {
            if (i === RETRIES) {
                let result: AuditResult = AuditResult.UNKNOWN_ERROR;
                const status = err.response?.status;

                if (status) {
                    if (status >= 500) result = AuditResult.SERVER_ERROR;
                    else if (status >= 400) result = AuditResult.CLIENT_ERROR;
                } else if (err.code === 'ECONNABORTED') {
                    result = AuditResult.TIMEOUT;
                } else if (err.code === 'ENOTFOUND') {
                    result = AuditResult.DNS_ERROR;
                }

                return {
                    ok: false,
                    status: status,
                    error: err.code || err.message,
                    result: result
                };
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    return { ok: false, error: "Unknown", result: AuditResult.UNKNOWN_ERROR };
}

async function main() {
    console.log("🚀 Starting Link Check Run...");

    const run = await prisma.linkCheckRun.create({
        data: {
            status: "RUNNING",
            notes: "Automated scheduled run",
        }
    });

    const municipalities = await prisma.municipality.findMany();
    const stats = {
        totalChecked: 0,
        okCount: 0,
        brokenCount: 0,
        pdfOnlyCount: 0,
        unknownCount: 0,
    };

    const tasks = municipalities.map(m => limit(async () => {
        let isBroken = false;
        let targetUrl = m.url || m.pdfUrl;

        if (!targetUrl) {
            stats.unknownCount++;
            return;
        }

        const res = await checkLink(targetUrl);
        stats.totalChecked++;

        // AuditLog 永続化
        await prisma.auditLog.create({
            data: {
                municipalityId: m.id,
                targetUrl: targetUrl,
                httpStatus: res.status,
                result: res.result,
                errorMessage: res.error,
            }
        });

        if (!res.ok) {
            stats.brokenCount++;
            isBroken = true;

            // RecoveryCandidate の作成
            await prisma.recoveryCandidate.create({
                data: {
                    jisCode: m.jisCode,
                    prefecture: m.prefectureName,
                    municipality: m.name,
                    prevUrl: m.url,
                    prevPdfUrl: m.pdfUrl,
                    source: "Automated Link Check",
                    status: "PENDING",
                    runId: run.id,
                }
            });
        }

        // Municipality のステータス更新 (簡易ロジック)
        let newStatus = m.linkStatus;
        if (isBroken) {
            newStatus = LinkStatus.BROKEN;
        } else if (m.pdfUrl && !m.url) {
            newStatus = LinkStatus.PDF_ONLY;
            stats.pdfOnlyCount++;
        } else if (res.ok) {
            newStatus = LinkStatus.OK;
            stats.okCount++;
        }

        if (newStatus !== m.linkStatus) {
            await prisma.municipality.update({
                where: { id: m.id },
                data: {
                    linkStatus: newStatus,
                    lastCheckedAt: new Date()
                }
            });
        }

        // 進捗表示
        if (stats.totalChecked % 100 === 0) {
            console.log(`Progress: ${stats.totalChecked}/${municipalities.length} checked...`);
        }
    }));

    await Promise.all(tasks);

    // IntegrityScore 計算
    // IntegrityScore = (OK + PDF_ONLY) ÷ 全自治体数 × 100
    const integrityScore = ((stats.okCount + stats.pdfOnlyCount) / municipalities.length) * 100;

    await prisma.linkCheckRun.update({
        where: { id: run.id },
        data: {
            status: "SUCCEEDED",
            finishedAt: new Date(),
            totalChecked: stats.totalChecked,
            brokenCount: stats.brokenCount,
            notes: `IntegrityScore: ${integrityScore.toFixed(2)}%. OK: ${stats.okCount}, PDF_ONLY: ${stats.pdfOnlyCount}, Broken: ${stats.brokenCount}`,
        }
    });

    console.log("\n✅ Link Check Run Completed.");
    console.log(`Final Integrity Score: ${integrityScore.toFixed(2)}%`);
    console.table(stats);
}

main()
    .catch(async (e) => {
        console.error("Fatal Error in Link Check Run:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
