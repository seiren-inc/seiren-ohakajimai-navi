import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const PENDING_PATH = path.join(rootDir, 'data', 'imports', 'pending.json');
const CANDIDATES_PATH = path.join(rootDir, 'data', 'imports', 'html_extracted_candidates.json');
const REPORT_PATH = path.join(rootDir, 'data', 'imports', 'merge_html_candidates_report.md');
const MAP_PATH = path.join(rootDir, 'data', 'imports', 'municipality_map.json');

function normalizeName(name) {
    return name.replace(/ケ/g, 'ヶ').replace(/ノ/g, 'の').replace(/[\s　]/g, '').trim();
}

function normalizePrefecture(pref) {
    return pref.replace(/[\s　]/g, '').trim();
}

function main() {
    if (!fs.existsSync(CANDIDATES_PATH)) {
        console.error('Candidate file not found:', CANDIDATES_PATH);
        process.exit(1);
    }
    
    const pendingData = JSON.parse(fs.readFileSync(PENDING_PATH, 'utf8'));
    const candidates = JSON.parse(fs.readFileSync(CANDIDATES_PATH, 'utf8'));
    const mapData = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));

    const mapByPrefName = new Map();
    for (const m of mapData) {
        const key = `${normalizePrefecture(m.prefectureName)}_${normalizeName(m.name)}`;
        mapByPrefName.set(key, m);
    }

    const pendingByJis = new Map();
    for (const p of pendingData) {
        pendingByJis.set(p.jisCode, p);
    }

    let overwrittenCount = 0;
    let newCount = 0;
    let skippedCount = 0;
    let unmatchedCount = 0;

    for (const cand of candidates) {
        const searchKey = `${normalizePrefecture(cand.prefecture)}_${normalizeName(cand.municipality)}`;
        const mapEntry = mapByPrefName.get(searchKey);
        
        let targetJisCode = null;
        if (mapEntry) targetJisCode = mapEntry.jisCode;

        let existingRecord = null;
        if (targetJisCode) {
            existingRecord = pendingByJis.get(targetJisCode);
        } else {
            existingRecord = pendingData.find(p => p.prefecture === cand.prefecture && normalizeName(p.municipality) === normalizeName(cand.municipality));
        }

        if (!existingRecord) {
            unmatchedCount++;
            continue;
        }

        const newUrl = cand.url;
        const newPdfUrl = cand.pdfUrl;

        if ((!newUrl && !newPdfUrl) || (existingRecord.url === newUrl && existingRecord.pdfUrl === newPdfUrl)) {
            skippedCount++;
            continue;
        }

        let appendNotes = existingRecord.notes || '';
        if (existingRecord.url || existingRecord.pdfUrl) {
            appendNotes += ` [Auto-merge backup previous: url=${existingRecord.url || 'null'}, pdfUrl=${existingRecord.pdfUrl || 'null'}]`;
        }
        
        existingRecord.url = newUrl || null;
        existingRecord.pdfUrl = newPdfUrl || null;
        existingRecord.notes = appendNotes;

        if (existingRecord.url) {
            existingRecord.linkStatus = 'OK';
            existingRecord.linkType = 'GUIDE';
            existingRecord.isPublished = true;
        } else if (existingRecord.pdfUrl) {
            existingRecord.linkStatus = 'PDF_ONLY';
            existingRecord.linkType = 'PDF';
            existingRecord.isPublished = true;
        } else {
            existingRecord.linkStatus = 'UNKNOWN';
            existingRecord.linkType = 'NONE';
            existingRecord.isPublished = false;
        }
        overwrittenCount++;
    }

    fs.writeFileSync(PENDING_PATH, JSON.stringify(pendingData, null, 2), 'utf8');

    const reportMd = `# HTML候補データ マージ結果レポート (Phase B)
    
- **実行日時**: ${new Date().toLocaleString('ja-JP')}
- **入力候補件数**: ${candidates.length}件

## マージ結果サマリー
- **上書き件数 (Overwritten)**: ${overwrittenCount}件 (既存URLがNullから埋まったもの等含む)
- **新規件数 (New Insert)**: 0件 (既存ですべての自治体枠が作成済みのため)
- **スキップ件数 (Skipped)**: ${skippedCount}件 (候補URLが空、または完全に同一)
- **照合不能件数 (Unmatched)**: ${unmatchedCount}件 (マスターに該当なし)

Total Processed: ${overwrittenCount + skippedCount + unmatchedCount}
`;

    fs.writeFileSync(REPORT_PATH, reportMd, 'utf8');
    console.log(`Merge completed. Report saved to ${REPORT_PATH}`);
}
main();
