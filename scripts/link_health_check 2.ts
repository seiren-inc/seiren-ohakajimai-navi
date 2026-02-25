import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const prisma = new PrismaClient();

const RESULT_PATH = path.join(rootDir, 'data', 'imports', 'link_health_check_result.json');
const REPORT_PATH = path.join(rootDir, 'data', 'imports', 'link_health_check_report.md');

const CONCURRENCY = 10;
const TIMEOUT = 10000;
const USER_AGENT = 'Mozilla/5.0 (compatible; SeirenLinkMonitor/1.0; +https://seiren-ohakajimai-navi.jp)';

type LinkStatusResult =
    | 'OK'
    | 'REDIRECT_OK'
    | 'BROKEN_4XX'
    | 'BROKEN_5XX'
    | 'TIMEOUT'
    | 'DNS_ERROR'
    | 'SSL_ERROR'
    | 'FORBIDDEN'
    | 'UNKNOWN_ERROR';

interface CheckResult {
    jisCode: string;
    prefecture: string;
    municipality: string;
    checkedUrl: string;
    status: LinkStatusResult;
    httpStatus: number | null;
    contentType: string | null;
    errorMessage: string | null;
    lastCheckedAt: string;
}

async function checkUrl(url: string): Promise<{ status: LinkStatusResult; httpStatus: number | null; contentType: string | null; errorMessage: string | null }> {
    const check = async (method: 'HEAD' | 'GET') => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), TIMEOUT);

        try {
            const response = await fetch(url, {
                method,
                headers: { 'User-Agent': USER_AGENT },
                signal: controller.signal,
                redirect: 'follow',
            });
            clearTimeout(id);

            const status = response.status;
            const contentType = response.headers.get('content-type') || null;

            if (status >= 200 && status < 300) {
                return { status: 'OK' as LinkStatusResult, httpStatus: status, contentType, errorMessage: null };
            }
            if (status >= 300 && status < 400) {
                return { status: 'REDIRECT_OK' as LinkStatusResult, httpStatus: status, contentType, errorMessage: null };
            }
            if (status >= 400 && status < 500) {
                if (status === 403) return { status: 'FORBIDDEN' as LinkStatusResult, httpStatus: status, contentType, errorMessage: null };
                return { status: 'BROKEN_4XX' as LinkStatusResult, httpStatus: status, contentType, errorMessage: null };
            }
            if (status >= 500) {
                return { status: 'BROKEN_5XX' as LinkStatusResult, httpStatus: status, contentType, errorMessage: null };
            }
            return { status: 'UNKNOWN_ERROR' as LinkStatusResult, httpStatus: status, contentType, errorMessage: null };
        } catch (error: any) {
            clearTimeout(id);
            if (error.name === 'AbortError') {
                return { status: 'TIMEOUT' as LinkStatusResult, httpStatus: null, contentType: null, errorMessage: 'Timeout' };
            }
            const msg = error.message || '';
            if (msg.includes('getaddrinfo')) return { status: 'DNS_ERROR' as LinkStatusResult, httpStatus: null, contentType: null, errorMessage: msg };
            if (msg.includes('SSL') || msg.includes('certificate')) return { status: 'SSL_ERROR' as LinkStatusResult, httpStatus: null, contentType: null, errorMessage: msg };
            return { status: 'UNKNOWN_ERROR' as LinkStatusResult, httpStatus: null, contentType: null, errorMessage: msg };
        }
    };

    // Try HEAD first
    let res = await check('HEAD');
    // If HEAD fails or gives error, try GET once as fallback
    if (res.status !== 'OK' && res.status !== 'REDIRECT_OK' && res.status !== 'FORBIDDEN') {
        res = await check('GET');
    }
    return res;
}

async function main() {
    console.log('Fetching targets from database...');
    const targets = await prisma.municipality.findMany({
        where: {
            isPublished: true,
            linkStatus: 'OK'
        },
        select: {
            jisCode: true,
            prefectureName: true,
            name: true,
            url: true,
            pdfUrl: true,
        }
    });

    console.log(`Auditing ${targets.length} municipalities...`);

    const results: CheckResult[] = [];
    const queue = [...targets];
    let processed = 0;

    const runWorker = async () => {
        while (queue.length > 0) {
            const target = queue.shift();
            if (!target) break;

            const checkedUrl = target.pdfUrl || target.url;
            if (!checkedUrl) {
                results.push({
                    jisCode: target.jisCode,
                    prefecture: target.prefectureName,
                    municipality: target.name,
                    checkedUrl: '',
                    status: 'BROKEN_4XX',
                    httpStatus: null,
                    contentType: null,
                    errorMessage: 'Both URL and PDF URL are empty',
                    lastCheckedAt: new Date().toISOString()
                });
                continue;
            }

            console.log(`[${++processed}/${targets.length}] Checking: ${target.prefectureName} ${target.name} -> ${checkedUrl}`);
            const checkRes = await checkUrl(checkedUrl);

            results.push({
                jisCode: target.jisCode,
                prefecture: target.prefectureName,
                municipality: target.name,
                checkedUrl,
                ...checkRes,
                lastCheckedAt: new Date().toISOString()
            });
        }
    };

    const workers = Array.from({ length: CONCURRENCY }, () => runWorker());
    await Promise.all(workers);

    // Stats calculation
    const stats = results.reduce((acc: any, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
    }, {});

    const brokenCount = results.filter(r => r.status.startsWith('BROKEN') || r.status === 'TIMEOUT' || r.status === 'DNS_ERROR' || r.status === 'SSL_ERROR').length;

    // Save results
    fs.writeFileSync(RESULT_PATH, JSON.stringify(results, null, 2), 'utf8');

    // Report generation
    const runDate = new Date().toLocaleString('ja-JP');
    let md = `# リンク健全性監査レポート (Link Health Check Report)

- **実行日時**: ${runDate}
- **監査対象数**: ${targets.length}件

## 監査結果サマリー
- **正常 (OK/REDIRECT_OK)**: ${(stats['OK'] || 0) + (stats['REDIRECT_OK'] || 0)}件
- **要注意・エラー (BROKEN/SSL/DNS/TIMEOUT)**: ${brokenCount}件
- **閲覧制限等 (FORBIDDEN)**: ${stats['FORBIDDEN'] || 0}件

### 分類別内訳
| ステータス | 件数 |
|---|---|
${Object.entries(stats).map(([s, count]) => `| ${s} | ${count}件 |`).join('\n')}

## 都道府県別 エラー発生状況 (上位)
| 都道府県 | エラー件数 |
|---|---|
${Object.entries(
        results
            .filter(r => r.status.startsWith('BROKEN') || r.status === 'TIMEOUT' || r.status === 'DNS_ERROR')
            .reduce((acc: any, r) => {
                acc[r.prefecture] = (acc[r.prefecture] || 0) + 1;
                return acc;
            }, {})
    )
            .sort((a: any, b: any) => b[1] - a[1])
            .slice(0, 10)
            .map(([pref, count]) => `| ${pref} | ${count}件 |`)
            .join('\n')}

## 最新の失敗URL一覧 (一部)
| 自治体 | URL | ステータス | エラー内容 |
|---|---|---|---|
${results
            .filter(r => r.status !== 'OK' && r.status !== 'REDIRECT_OK')
            .slice(0, 20)
            .map(r => `| ${r.prefecture} ${r.municipality} | \`${r.checkedUrl}\` | ${r.status} | ${r.errorMessage || '-'} |`)
            .join('\n')}

> [!NOTE]
> この結果をもとに、次フェーズで復旧候補URLの自動探索を行います。
`;

    fs.writeFileSync(REPORT_PATH, md, 'utf8');
    console.log(`Audit complete. Results saved to ${RESULT_PATH}`);
    console.log(`Report generated at ${REPORT_PATH}`);

    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
