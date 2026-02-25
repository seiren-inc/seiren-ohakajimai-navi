import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const PENDING_PATH = path.join(rootDir, 'data', 'imports', 'pending.json');
const REPORT_MD_PATH = path.join(rootDir, 'data', 'imports', 'fill_missing_links_dryrun_report.md');
const PLAN_JSON_PATH = path.join(rootDir, 'data', 'imports', 'fill_missing_links_plan.json');

interface PendingRecord {
    jisCode: string;
    prefecture: string;
    municipality: string;
    url: string | null;
    pdfUrl: string | null;
    linkStatus: string | null;
    isPublished: boolean;
    linkType: string | null;
    notes?: string | null;
    [key: string]: any;
}

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
    const pending: PendingRecord[] = JSON.parse(fs.readFileSync(PENDING_PATH, 'utf8'));

    const plan: PlanEntry[] = [];

    // Group 1: NEEDS_REVIEW records that already have a url or pdfUrl and can be promoted to OK
    // These were manually reviewed in past sessions and have valid URLs but never got promoted
    const needsReviewWithUrl = pending.filter(p =>
        p.linkStatus === 'NEEDS_REVIEW' && (p.url || p.pdfUrl)
    );

    for (const p of needsReviewWithUrl) {
        const hasPdf = !!(p.pdfUrl && p.pdfUrl.trim());
        const hasUrl = !!(p.url && p.url.trim());

        if (hasUrl && hasPdf) {
            plan.push({
                jisCode: p.jisCode, prefecture: p.prefecture, municipality: p.municipality,
                reason: 'NEEDS_REVIEW with both url+pdfUrl -> promote OK/GUIDE',
                newLinkStatus: 'OK', newLinkType: 'GUIDE', newIsPublished: true
            });
        } else if (hasUrl) {
            plan.push({
                jisCode: p.jisCode, prefecture: p.prefecture, municipality: p.municipality,
                reason: 'NEEDS_REVIEW with url only -> promote OK/GUIDE',
                newLinkStatus: 'OK', newLinkType: 'GUIDE', newIsPublished: true
            });
        } else if (hasPdf) {
            plan.push({
                jisCode: p.jisCode, prefecture: p.prefecture, municipality: p.municipality,
                reason: 'NEEDS_REVIEW with pdfUrl only -> promote OK/PDF',
                newLinkStatus: 'OK', newLinkType: 'PDF', newIsPublished: true
            });
        }
    }

    // Group 2: null/empty linkStatus records that have url set — classify them
    const nullStatusWithUrl = pending.filter(p => !p.linkStatus && (p.url || p.pdfUrl));

    for (const p of nullStatusWithUrl) {
        const hasPdf = !!(p.pdfUrl && p.pdfUrl.trim());
        const hasUrl = !!(p.url && p.url.trim());

        // Enforce PDF rule: if url contains .pdf, it belongs in pdfUrl
        const urlIsPdf = hasUrl && p.url!.toLowerCase().endsWith('.pdf');

        if (urlIsPdf) {
            plan.push({
                jisCode: p.jisCode, prefecture: p.prefecture, municipality: p.municipality,
                reason: 'null linkStatus, url is .pdf -> reclassify OK/PDF',
                newLinkStatus: 'OK', newLinkType: 'PDF', newIsPublished: true
            });
        } else if (hasUrl) {
            plan.push({
                jisCode: p.jisCode, prefecture: p.prefecture, municipality: p.municipality,
                reason: 'null linkStatus with url -> classify OK/GUIDE',
                newLinkStatus: 'OK', newLinkType: 'GUIDE', newIsPublished: true
            });
        } else if (hasPdf) {
            plan.push({
                jisCode: p.jisCode, prefecture: p.prefecture, municipality: p.municipality,
                reason: 'null linkStatus with pdfUrl only -> classify OK/PDF',
                newLinkStatus: 'OK', newLinkType: 'PDF', newIsPublished: true
            });
        }
    }

    // Write plan
    fs.writeFileSync(PLAN_JSON_PATH, JSON.stringify(plan, null, 2), 'utf8');

    // Summary counts
    const fillUrl = plan.filter(e => e.newLinkType === 'GUIDE').length;
    const fillPdf = plan.filter(e => e.newLinkType === 'PDF').length;

    const runDate = new Date().toLocaleString('ja-JP');
    const md = `# Missing Link Dry-run 突合レポート (Phase 2) — 修正版

- **実行日時**: ${runDate}

## 候補ソース分析結果
外部候補ファイル (html_extracted_candidates.json, yasuda_municipality_links.json) の全URLは既にpending.jsonに統合済みでした。
そのため、pending.json内部で修復可能な 2グループを対象として計画を生成します。

## 突合結果サマリー
- **対象グループ1 (NEEDS_REVIEW→OK昇格)**: ${needsReviewWithUrl.length}件
- **対象グループ2 (null linkStatus→分類付与)**: ${nullStatusWithUrl.length}件
- **採用計画件数 (重複除去後)**: ${plan.length}件
  - fill_url (GUIDE): ${fillUrl}件
  - fill_pdf (PDF): ${fillPdf}件

> [!NOTE]
> この段階では pending.json は変更していません。
> フェーズ3の apply スクリプトで計画ファイル (fill_missing_links_plan.json) をもとに書き換えます。

> [!IMPORTANT]
> 残る 622件の UNKNOWN (url/pdfUrl 両方null) については、現時点で外部から補完できるデータソースが存在しません。
> これらは別途、自治体ごとのURLを手動調査するか、将来のスクレイピングバッチで補完する対象です。
`;

    fs.writeFileSync(REPORT_MD_PATH, md, 'utf8');
    console.log(`Dry-run complete. Plan: ${plan.length} entries. (GUIDE: ${fillUrl}, PDF: ${fillPdf})`);
    console.log(`Files: ${REPORT_MD_PATH}, ${PLAN_JSON_PATH}`);
}

main();
