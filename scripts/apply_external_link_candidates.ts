import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const DRYRUN_PATH = path.join(rootDir, 'data', 'imports', 'external_link_search_dryrun.json');
const PENDING_PATH = path.join(rootDir, 'data', 'imports', 'pending.json');
const REPORT_PATH = path.join(rootDir, 'data', 'imports', 'external_link_apply_report.md');
const RESULT_PATH = path.join(rootDir, 'data', 'imports', 'external_link_apply_result.json');

interface DryRunEntry {
    jisCode: string;
    prefecture: string;
    municipality: string;
    candidateUrls: string[];
    classification: string;
}

interface PendingRecord {
    jisCode: string;
    prefecture: string;
    municipality: string;
    url: string | null;
    pdfUrl: string | null;
    linkStatus: string;
    isPublished: boolean;
    linkType: string | null;
    [key: string]: any;
}

interface ApplyResult {
    jisCode: string;
    prefecture: string;
    municipality: string;
    status: 'applied' | 'skipped';
    reason?: string;
    before?: any;
    after?: any;
}

function main() {
    const dryrunData: DryRunEntry[] = JSON.parse(fs.readFileSync(DRYRUN_PATH, 'utf8'));
    const pendingData: PendingRecord[] = JSON.parse(fs.readFileSync(PENDING_PATH, 'utf8'));

    const candidates = dryrunData.filter(d => d.classification === 'guide_candidate' && d.candidateUrls.length > 0);

    const results: ApplyResult[] = [];
    let appliedCount = 0;
    let skippedCount = 0;

    const pendingMap = new Map<string, PendingRecord>();
    pendingData.forEach(p => pendingMap.set(p.jisCode, p));

    candidates.forEach(cand => {
        const record = pendingMap.get(cand.jisCode);
        if (!record) {
            results.push({
                jisCode: cand.jisCode,
                prefecture: cand.prefecture,
                municipality: cand.municipality,
                status: 'skipped',
                reason: 'jisCode not found in pending.json'
            });
            skippedCount++;
            return;
        }

        if (record.url) {
            results.push({
                jisCode: cand.jisCode,
                prefecture: cand.prefecture,
                municipality: cand.municipality,
                status: 'skipped',
                reason: 'existing url is not null',
                before: { url: record.url }
            });
            skippedCount++;
            return;
        }

        const before = { ...record };

        // Apply changes
        record.url = cand.candidateUrls[0];
        record.linkStatus = 'OK';
        record.linkType = 'GUIDE';
        record.isPublished = true;

        const after = { ...record };

        results.push({
            jisCode: cand.jisCode,
            prefecture: cand.prefecture,
            municipality: cand.municipality,
            status: 'applied',
            before: {
                url: before.url,
                linkStatus: before.linkStatus,
                linkType: before.linkType,
                isPublished: before.isPublished
            },
            after: {
                url: after.url,
                linkStatus: after.linkStatus,
                linkType: after.linkType,
                isPublished: after.isPublished
            }
        });
        appliedCount++;
    });

    // Write back pending.json
    fs.writeFileSync(PENDING_PATH, JSON.stringify(pendingData, null, 2), 'utf8');

    // Write Result JSON
    fs.writeFileSync(RESULT_PATH, JSON.stringify(results, null, 2), 'utf8');

    // Generate Report MD
    const runDate = new Date().toLocaleString('ja-JP');
    let reportMd = `# 外部リンク適用レポート (External Link Apply Report)

- **実行日時**: ${runDate}
- **採用件数**: ${appliedCount}件
- **スキップ件数**: ${skippedCount}件

## 適用レコード一覧

| jisCode | 都道府県 | 市区町村 | 更新内容 |
|---|---|---|---|
`;

    results.filter(r => r.status === 'applied').forEach(r => {
        reportMd += `| ${r.jisCode} | ${r.prefecture} | ${r.municipality} | \`${r.before.url}\` -> \`${r.after.url}\` | \n`;
    });

    if (skippedCount > 0) {
        reportMd += `\n## スキップ理由 一覧\n\n`;
        results.filter(r => r.status === 'skipped').forEach(r => {
            reportMd += `- **${r.prefecture} ${r.municipality} (${r.jisCode})**: ${r.reason}\n`;
        });
    }

    fs.writeFileSync(REPORT_PATH, reportMd, 'utf8');

    console.log(`Apply complete. Applied: ${appliedCount}, Skipped: ${skippedCount}`);
    console.log(`Outputs: ${REPORT_PATH}, ${RESULT_PATH}`);
}

main();
