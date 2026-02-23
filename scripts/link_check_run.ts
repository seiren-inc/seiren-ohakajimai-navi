import { PrismaClient } from "@prisma/client";
import axios from "axios";
import pLimit from "p-limit";

const prisma = new PrismaClient();
const limit = pLimit(10); // 並列実行数

const TIMEOUT = 8000;
const RETRIES = 2;

async function checkLink(url: string): Promise<{ ok: boolean; status?: number; error?: string }> {
    if (!url || !url.startsWith("http")) {
        return { ok: false, error: "Invalid Format" };
    }

    for (let i = 0; i <= RETRIES; i++) {
        try {
            // HEAD リクエストを試行、失敗したら GET
            const response = await axios.get(url, {
                timeout: TIMEOUT,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; SeirenAuditBot/1.0; +https://seiren.co.jp)',
                },
                validateStatus: (status) => status < 400, // 2xx, 3xx を成功とする
            });
            return { ok: true, status: response.status };
        } catch (err: any) {
            if (i === RETRIES) {
                return {
                    ok: false,
                    status: err.response?.status,
                    error: err.code || err.message
                };
            }
            // 短い待機を入れてリトライ
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    return { ok: false, error: "Unknown" };
}

async function main() {
    console.log("🚀 Starting Link Check Run...");

    // 実行記録の初期化
    // @ts-ignore
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
        fixedCount: 0, // 今回は自動修正しないため0固定
        temporaryFailureCount: 0,
        invalidFormatCount: 0,
        pdfRuleViolationCount: 0,
    };

    const tasks = municipalities.map(m => limit(async () => {
        let hasIssue = false;

        // 1. PDF Rule Check
        // @ts-ignore
        if (m.linkStatus === "PDF_ONLY" && m.url && m.url.trim() !== "") {
            stats.pdfRuleViolationCount++;
            hasIssue = true;
        }

        // 2. Guide URL Check
        if (m.url) {
            stats.totalChecked++;
            const res = await checkLink(m.url);
            if (res.ok) {
                stats.okCount++;
            } else {
                if (res.error === "Invalid Format") {
                    stats.invalidFormatCount++;
                } else if (res.status && res.status >= 500) {
                    stats.temporaryFailureCount++;
                } else {
                    stats.brokenCount++;
                }
                hasIssue = true;
            }
        }

        // 3. PDF URL Check
        if (m.pdfUrl) {
            stats.totalChecked++;
            const res = await checkLink(m.pdfUrl);
            if (res.ok) {
                // すでに Guide URL で OK 判定なら重複カウントしないが、stats は純粋な URL 数
            } else {
                if (res.error === "Invalid Format") {
                    stats.invalidFormatCount++;
                } else if (res.status && res.status >= 500) {
                    stats.temporaryFailureCount++;
                } else {
                    stats.brokenCount++;
                }
                hasIssue = true;
            }
        }

        // 進捗表示 (100件ごと)
        const processed = stats.totalChecked;
        if (processed > 0 && processed % 100 === 0) {
            console.log(`Progress: ${processed} URLs checked...`);
        }
    }));

    await Promise.all(tasks);

    // 実行結果を更新
    // @ts-ignore
    await prisma.linkCheckRun.update({
        where: { id: run.id },
        data: {
            status: "SUCCEEDED",
            finishedAt: new Date(),
            totalChecked: stats.totalChecked,
            brokenCount: stats.brokenCount + stats.invalidFormatCount,
            fixedCount: 0,
            notes: `Check completed. OK: ${stats.okCount}, Broken: ${stats.brokenCount}, TempFail: ${stats.temporaryFailureCount}, PDF-Violation: ${stats.pdfRuleViolationCount}`,
        }
    });

    console.log("\n✅ Link Check Run Completed.");
    console.table(stats);
}

main()
    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
