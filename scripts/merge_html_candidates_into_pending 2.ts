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

// Normalize function for fallback matching
function normalizeName(name: string): string {
    return name
        .replace(/ケ/g, 'ヶ')
        .replace(/ノ/g, 'の')
        .replace(/[\s　]/g, '')
        .trim();
}

function normalizePrefecture(pref: string): string {
    return pref.replace(/[\s　]/g, '').trim();
}

interface Candidate {
    prefecture: string;
    municipality: string;
    url: string | null;
    pdfUrl: string | null;
    source: string;
    rawText: string;
    notes?: string;
}

interface PendingRecord {
    jisCode: string;
    prefecture: string;
    municipality: string;
    url: string | null;
    pdfUrl: string | null;
    subLinks: any | null;
    notes: string | null;
    linkStatus: string;
    isPublished: boolean;
    hasDomainWarning: boolean;
    linkType: string;
    dataQualityLevel: number;
}

function main() {
    if (!fs.existsSync(CANDIDATES_PATH)) {
        console.error('Candidate file not found:', CANDIDATES_PATH);
        process.exit(1);
    }

    // Load data
    const pendingData: PendingRecord[] = JSON.parse(fs.readFileSync(PENDING_PATH, 'utf8'));
    const candidates: Candidate[] = JSON.parse(fs.readFileSync(CANDIDATES_PATH, 'utf8'));
    const mapData = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));

    // Map builders
    const mapByPrefName = new Map<string, any>();
    for (const m of mapData) {
        const key = `${normalizePrefecture(m.prefectureName)}_${normalizeName(m.name)}`;
        mapByPrefName.set(key, m);
    }

    const pendingByJis = new Map<string, PendingRecord>();
    for (const p of pendingData) {
        pendingByJis.set(p.jisCode, p);
    }

    // Counters
    let overwrittenCount = 0;
    let newCount = 0;
    let skippedCount = 0;
    let unmatchedCount = 0;

    for (const cand of candidates) {
        // Resolve JIS Code
        const searchKey = `${normalizePrefecture(cand.prefecture)}_${normalizeName(cand.municipality)}`;
        const mapEntry = mapByPrefName.get(searchKey);

        let targetJisCode = null;
        if (mapEntry) {
            targetJisCode = mapEntry.jisCode;
        }

        // Find existing pending record
        let existingRecord = null;
        if (targetJisCode) {
            existingRecord = pendingByJis.get(targetJisCode);
        } else {
            existingRecord = pendingData.find(p =>
                p.prefecture === cand.prefecture &&
                normalizeName(p.municipality) === normalizeName(cand.municipality)
            );
        }

        if (!existingRecord) {
            unmatchedCount++;
            continue; // Technically shouldn't happen as we've prefilled missing, but safe fallback
        }

        // Determine merged URLs
        const newUrl = cand.url;
        const newPdfUrl = cand.pdfUrl;

        // Skip if new is completely empty or identical
        if ((!newUrl && !newPdfUrl) || (existingRecord.url === newUrl && existingRecord.pdfUrl === newPdfUrl)) {
            skippedCount++;
            continue;
        }

        // We are updating/overwriting
        let appendNotes = existingRecord.notes || '';
        if (existingRecord.url || existingRecord.pdfUrl) {
            appendNotes += ` [Auto-merge backup previous: url=${existingRecord.url || 'null'}, pdfUrl=${existingRecord.pdfUrl || 'null'}]`;
        }

        existingRecord.url = newUrl || null;
        existingRecord.pdfUrl = newPdfUrl || null;
        existingRecord.notes = appendNotes;

        // Define status
        if (existingRecord.url) {
            existingRecord.linkStatus = 'OK';
            existingRecord.linkType = 'GUIDE';
            existingRecord.isPublished = true;
        } else if (existingRecord.pdfUrl) {
            existingRecord.linkStatus = 'OK';
            existingRecord.linkType = 'PDF';
            existingRecord.isPublished = true;
        } else {
            existingRecord.linkStatus = 'UNKNOWN';
            existingRecord.linkType = 'NONE';
            existingRecord.isPublished = false;
        }

        // Preserve hasDomainWarning and dataQualityLevel implicitly via reference
        overwrittenCount++;
    }

    // Write back to pending.json
    fs.writeFileSync(PENDING_PATH, JSON.stringify(pendingData, null, 2), 'utf8');

    // Generate Markdown report
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
