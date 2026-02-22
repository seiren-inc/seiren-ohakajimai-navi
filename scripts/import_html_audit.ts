import fs from 'fs';
import path from 'path';

// Define paths
const PENDING_JSON_PATH = path.join(process.cwd(), 'data/imports/pending.json');
const CANDIDATES_JSON_PATH = path.join(process.cwd(), 'data/imports/html_extracted_candidates.json');
const MAP_JSON_PATH = path.join(process.cwd(), 'data/imports/municipality_map.json');
const OUTPUT_JSON_PATH = path.join(process.cwd(), 'data/imports/html_audit_result.json');
const OUTPUT_MD_PATH = path.join(process.cwd(), 'data/imports/html_audit_report.md');

// Check if required files exist
if (!fs.existsSync(PENDING_JSON_PATH)) {
    console.error(`Error: pending.json not found at ${PENDING_JSON_PATH}`);
    process.exit(1);
}
if (!fs.existsSync(CANDIDATES_JSON_PATH)) {
    console.error(`Error: html_extracted_candidates.json not found at ${CANDIDATES_JSON_PATH}`);
    process.exit(1);
}
if (!fs.existsSync(MAP_JSON_PATH)) {
    console.error(`Error: municipality_map.json not found at ${MAP_JSON_PATH}`);
    process.exit(1);
}

// Read data
const pendingData: any[] = JSON.parse(fs.readFileSync(PENDING_JSON_PATH, 'utf-8'));
const candidatesData: any[] = JSON.parse(fs.readFileSync(CANDIDATES_JSON_PATH, 'utf-8'));
const mapData: any[] = JSON.parse(fs.readFileSync(MAP_JSON_PATH, 'utf-8'));

// Helper string normalizer to improve matching (especially stripping spaces/types)
function normalizeName(str: string): string {
    return str.replace(/[\\s　]+/g, '').trim();
}

// Build quick lookup structures
const pendingByJis = new Map<string, any>();
pendingData.forEach(p => {
    if (p.jisCode) pendingByJis.set(p.jisCode, p);
});

const mapByNormalizedName = new Map<string, any>();
mapData.forEach(m => {
    const key = `${m.prefectureName}_${normalizeName(m.name)}`;
    mapByNormalizedName.set(key, m);
});

// Output structures
const result = {
    newCandidates: [] as any[],
    urlDiffCandidates: [] as any[],
    identical: [] as any[],
    unmatched: [] as any[]
};

// Auditing loop
for (const cand of candidatesData) {
    // 1. Determine JIS code if possible matching against master map
    const normKey = `${cand.prefecture}_${normalizeName(cand.municipality)}`;
    const masterInfo = mapByNormalizedName.get(normKey);
    let targetJisCode = null;

    if (masterInfo) {
        targetJisCode = masterInfo.jisCode;
    }

    // A. 照合キー (Identify corresponding pending.json record)
    let pendingRecord = null;

    if (targetJisCode) {
        pendingRecord = pendingByJis.get(targetJisCode);
    } else {
        // Fallback: match by prefecture + normalized municipality directly in pending
        pendingRecord = pendingData.find(p =>
            p.prefecture === cand.prefecture &&
            normalizeName(p.municipality) === normalizeName(cand.municipality)
        );
    }

    if (!pendingRecord) {
        // 照合不能 (Unmatched in pending.json)
        result.unmatched.push(cand);
        continue;
    }

    // If pendingRecord exists, check if URL is new or diff or identical
    // Important Rule: PDFはpdfUrl同士で比較. urlとpdfUrlを混同しない.

    const candUrl = cand.url || '';
    const candPdf = cand.pdfUrl || '';
    const penUrl = pendingRecord.url || '';
    const penPdf = pendingRecord.pdfUrl || '';

    // Condition: Is it "New" (Pending has no URL and no PDF, but candidate has at least one)
    if (penUrl === '' && penPdf === '' && (candUrl !== '' || candPdf !== '')) {
        result.newCandidates.push({
            jisCode: pendingRecord.jisCode,
            candidate: cand,
            pending: pendingRecord
        });
    }
    // Condition: Identical
    else if (candUrl === penUrl && candPdf === penPdf) {
        result.identical.push({
            jisCode: pendingRecord.jisCode,
            candidate: cand,
            pending: pendingRecord
        });
    }
    // Condition: URL Diff (Pending has something, but Candidate has something different)
    else {
        result.urlDiffCandidates.push({
            jisCode: pendingRecord.jisCode,
            candidate: cand,
            pending: pendingRecord
        });
    }
}

// Write the JSON result
fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(result, null, 2), 'utf-8');

// Generate and write markdown report
const totalParsed = candidatesData.length;
const newCount = result.newCandidates.length;
const urlDiffCount = result.urlDiffCandidates.length;
const identicalCount = result.identical.length;
const unmatchedCount = result.unmatched.length;

const sample20 = candidatesData.slice(0, 20).map(c => {
    // Decorate the sample with classification roughly
    let status = '不明';
    if (result.newCandidates.find(n => n.candidate === c)) status = '新規候補';
    else if (result.urlDiffCandidates.find(d => d.candidate === c)) status = 'URL差分候補';
    else if (result.identical.find(i => i.candidate === c)) status = '完全一致';
    else if (result.unmatched.find(u => u === c)) status = '照合不能';

    return {
        ...c,
        _auditStatus: status
    };
});

const reportMarkdown = `# HTML Audit Report

## 実行概要
- **出力日**: ${new Date().toISOString()}

## 照合結果サマリー
- **総件数 (抽出候補)**: \`${totalParsed}\` 件
- **新規候補 (\`newCandidates\`)**: \`${newCount}\` 件
- **URL差分候補 (\`urlDiffCandidates\`)**: \`${urlDiffCount}\` 件
- **完全一致 (\`identical\`)**: \`${identicalCount}\` 件
- **照合不能 (\`unmatched\`)**: \`${unmatchedCount}\` 件

## 上位20件サンプル (分類付き)
\`\`\`json
${JSON.stringify(sample20, null, 2)}
\`\`\`
`;

fs.writeFileSync(OUTPUT_MD_PATH, reportMarkdown, 'utf-8');

console.log(`監査完了: 総件数 ${totalParsed} 件`);
console.log(`  新規候補: ${newCount}`);
console.log(`  URL差分 : ${urlDiffCount}`);
console.log(`  完全一致: ${identicalCount}`);
console.log(`  照合不能: ${unmatchedCount}`);
console.log(`結果JSON: ${OUTPUT_JSON_PATH}`);
console.log(`レポート: ${OUTPUT_MD_PATH}`);
