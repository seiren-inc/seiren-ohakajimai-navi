import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const HEALTH_RESULT_PATH = path.join(rootDir, 'data', 'imports', 'link_health_check_result.json');
const QUERIES_OUT_PATH = path.join(rootDir, 'data', 'imports', 'link_recovery_queries.json');
const REPORT_OUT_PATH = path.join(rootDir, 'data', 'imports', 'link_recovery_dryrun_report.md');

interface HealthCheckResult {
    jisCode: string;
    prefecture: string;
    municipality: string;
    checkedUrl: string;
    status: string;
    errorMessage: string | null;
}

function generateQueries(prefecture: string, municipality: string): string[] {
    return [
        `${prefecture}${municipality} 改葬許可申請`,
        `${prefecture}${municipality} 墓地埋葬 許可`,
        `${prefecture}${municipality} 改葬許可証 filetype:pdf`
    ];
}

async function main() {
    if (!fs.existsSync(HEALTH_RESULT_PATH)) {
        console.error(`Health check result not found at ${HEALTH_RESULT_PATH}. Run link_health_check.ts first.`);
        process.exit(1);
    }

    const results: HealthCheckResult[] = JSON.parse(fs.readFileSync(HEALTH_RESULT_PATH, 'utf8'));

    const broken = results.filter(r =>
        r.status.startsWith('BROKEN') ||
        r.status === 'TIMEOUT' ||
        r.status === 'DNS_ERROR' ||
        r.status === 'SSL_ERROR'
    );

    console.log(`Generating recovery queries for ${broken.length} broken links...`);

    const recoveryQueries = broken.map(r => ({
        jisCode: r.jisCode,
        prefecture: r.prefecture,
        municipality: r.municipality,
        brokenUrl: r.checkedUrl,
        errorStatus: r.status,
        errorMessage: r.errorMessage,
        queries: generateQueries(r.prefecture, r.municipality)
    }));

    fs.writeFileSync(QUERIES_OUT_PATH, JSON.stringify(recoveryQueries, null, 2), 'utf8');

    // Report generation
    const runDate = new Date().toLocaleString('ja-JP');
    let md = `# 壊れリンク復旧クエリ生成レポート (Link Recovery Query Report)

- **実行日時**: ${runDate}
- **対象となる不備リンク数**: ${broken.length}件

## クエリ生成サマリー
- **クエリ生成済み自治体**: ${broken.length}件
- **総クエリ数**: ${broken.length * 3}件

### 復旧用クエリの構成 (自治体ごとに3パターン)
1. \`<都道府県><市区町村> 改葬許可申請\`
2. \`<都道府県><市区町村> 墓地埋葬 許可\`
3. \`<都道府県><市区町村> 改葬許可証 filetype:pdf\`

## 復旧候補リスト (一部)
| 自治体 | 不備URL | ステータス | 生成クエリ案 |
|---|---|---|---|
${recoveryQueries.slice(0, 20).map(q =>
        `| ${q.prefecture} ${q.municipality} | \`${q.brokenUrl}\` | ${q.errorStatus} | \`${q.queries[0]}\` |`
    ).join('\n')}

> [!NOTE]
> 今回は dry-run のため、実際の検索APIへのリクエストは行っていません。
> また、\`pending.json\` や DB への書き込みも一切行っていません。
`;

    fs.writeFileSync(REPORT_OUT_PATH, md, 'utf8');

    console.log(`Recovery dry-run complete. Queries saved to ${QUERIES_OUT_PATH}`);
    console.log(`Report generated at ${REPORT_OUT_PATH}`);
}

main().catch(console.error);
