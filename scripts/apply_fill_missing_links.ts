import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const PENDING_PATH = path.join(rootDir, 'data', 'imports', 'pending.json');
const PLAN_PATH = path.join(rootDir, 'data', 'imports', 'fill_missing_links_plan.json');
const REPORT_PATH = path.join(rootDir, 'data', 'imports', 'fill_missing_links_apply_report.md');

const isDryRun = process.argv.includes('--dry-run');

interface PlanEntry {
    jisCode: string;
    prefecture: string;
    municipality: string;
    reason: string;
    newLinkStatus: string;
    newLinkType: string;
    newIsPublished: boolean;
}

function main() {
    const pending: any[] = JSON.parse(fs.readFileSync(PENDING_PATH, 'utf8'));
    const plan: PlanEntry[] = JSON.parse(fs.readFileSync(PLAN_PATH, 'utf8'));

    const pendingByJis = new Map(pending.map(p => [p.jisCode, p]));

    let applied = 0, skipped = 0;
    const appliedJis: string[] = [];

    for (const entry of plan) {
        const rec = pendingByJis.get(entry.jisCode);
        if (!rec) { skipped++; continue; }

        // Verify it still needs updating (idempotency check)
        if (rec.linkStatus === entry.newLinkStatus && rec.linkType === entry.newLinkType && rec.isPublished === entry.newIsPublished) {
            skipped++;
            continue;
        }

        // Handle url->pdfUrl correction: if url is a .pdf link, move it
        if (rec.url && rec.url.toLowerCase().endsWith('.pdf') && !rec.pdfUrl) {
            rec.pdfUrl = rec.url;
            rec.url = null;
        }
        // Clean up empty string pdfUrl
        if (rec.pdfUrl === '') rec.pdfUrl = null;

        // Apply plan fields
        rec.linkStatus = entry.newLinkStatus;
        rec.linkType = entry.newLinkType;
        rec.isPublished = entry.newIsPublished;
        // notes は変更しない

        applied++;
        appliedJis.push(entry.jisCode);
    }

    if (!isDryRun) {
        fs.writeFileSync(PENDING_PATH, JSON.stringify(pending, null, 2), 'utf8');
        console.log(`Applied ${applied} changes to pending.json.`);
    } else {
        console.log(`[DRY-RUN] Would apply ${applied} changes. ${skipped} skipped.`);
    }

    // Report
    const runDate = new Date().toLocaleString('ja-JP');
    const md = `# Missing Link Apply レポート (Phase 3)

- **実行日時**: ${runDate}
- **モード**: ${isDryRun ? 'dry-run（pending.json 未変更）' : '実行済み（pending.json 更新済み）'}

## 適用結果
- **適用件数**: ${applied}件
- **スキップ件数**: ${skipped}件（既に正しい状態）

## 適用した jisCode 一覧
${appliedJis.join(', ')}
`;

    fs.writeFileSync(REPORT_PATH, md, 'utf8');
    console.log(`Report: ${REPORT_PATH}`);
}

main();
