import fs from 'fs';
import path from 'path';

// Define the input file from the command line argument, or provide a help message.
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('使用方法: npx ts-node scripts/import_html_municipalities.ts <ターゲットHTMLファイルのパス>');
    console.error('例: npx ts-node scripts/import_html_municipalities.ts data/imports/block1.txt');
    process.exit(1);
}

const inputFilePath = path.resolve(process.cwd(), args[0]);
if (!fs.existsSync(inputFilePath)) {
    console.error(`エラー: 指定されたファイルが存在しません - ${inputFilePath}`);
    process.exit(1);
}

// Ensure the outputs are written to the data/imports directory
const outputCandidatesJsonPath = path.join(process.cwd(), 'data/imports/html_extracted_candidates.json');
const outputReportMdPath = path.join(process.cwd(), 'data/imports/html_extracted_report.md');

const rawHtml = fs.readFileSync(inputFilePath, 'utf-8');

// The required fields for the extracted candidates
interface Candidate {
    prefecture: string;
    municipality: string;
    url: string | null;
    pdfUrl: string | null;
    source: string;
    rawText: string | null;
    notes?: string;
}

const candidates: Candidate[] = [];
let currentPrefecture = '';

// We will split the file by H4 tags or scan it sequentially.
// Regex to catch <h4...>Prefecture</h4>  AND  <a href="...">Municipality</a>
const combinedRegex = /<h4[^>]*>([^<]+)<\/h4>|<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;

let match;
while ((match = combinedRegex.exec(rawHtml)) !== null) {
    const isHeader = !!match[1];

    if (isHeader) {
        currentPrefecture = match[1].trim();
        continue;
    }

    if (!currentPrefecture) {
        continue; // Wait until we hit the first prefecture header
    }

    // It's an a-tag match
    const rawHref = match[2];
    let rawMuni = match[3];

    // Remove tags if there are any inside the <a>, though usually just text
    rawMuni = rawMuni.replace(/<[^>]+>/g, '');

    // Clean whitespace and invisible characters/BOM
    const cleanMuni = rawMuni
        .replace(/[\ufeff]/g, '') // remove BOM
        .replace(/^[\\s　]+|[\\s　]+$/g, '') // trim
        .replace(/[\\r\\n]/g, ''); // remove newlines

    // If there is no URL, skip as per rules.
    if (!rawHref || rawHref.trim() === '') {
        continue;
    }

    const href = rawHref.trim();
    const isPdf = href.toLowerCase().endsWith('.pdf');

    // Validate if it's a valid http or https URL
    let isValidUrl = href.startsWith('http://') || href.startsWith('https://');
    let notes = '';

    // Check for garbled text (basic heuristic: presence of replacement characters or pure question marks where names belong)
    if (cleanMuni.includes('') || cleanMuni === '?') {
        notes = '文字化けの可能性あり';
    }

    // Create the candidate record
    const record: Candidate = {
        prefecture: currentPrefecture,
        municipality: cleanMuni,
        url: isValidUrl && !isPdf ? href : null,
        pdfUrl: isValidUrl && isPdf ? href : null,
        source: 'yasuda_html_import',
        rawText: rawMuni, // original anchor text
    };

    // Add notes logic
    if (notes) record.notes = notes;
    if (!isValidUrl) {
        record.notes = record.notes ? record.notes + ' / 不正なURL形式' : '不正なURL形式';
        // The rule says "invalid URL (not http)", we still keep it but report it.
    }

    // According to rule: if BOTH url and pdfUrl are null, discard.
    // In our logic, if it's not http/https, they become null unless we want to map invalid ones to url.
    // The instructions: "url も pdfUrl も無いものは捨てる". If not valid http, our mapping puts null.
    // Let's modify: if it's not valid http, maybe keep it in url but add note, or put to null and skip?
    // Instruction: "不正URL件数（http以外、空など）" in the report implies we might process them, or we count them and discard.
    // Let's keep them in url if they exist but flag them, OR put null. Let's put null and IF BOTH are null, discard.
    // Actually, let's keep the rawHref in `url` if it's not valid, just to not lose data, or we flag it.
    // Re-reading: "pdfUrl直リンクは pdfUrlに入れ urlは null", "urlもpdfUrlも無いものは捨てる".

    if (record.url === null && record.pdfUrl === null) {
        if (!isValidUrl && href.length > 0) {
            // Provide it as URL but flag it as invalid
            record.url = href;
        } else {
            continue;
        }
    }

    candidates.push(record);
}

// Generate the Report Data
const totalExtracted = candidates.length;
const pdfUrlCount = candidates.filter(c => c.pdfUrl !== null).length;
const urlCount = candidates.filter(c => c.url !== null && c.url.startsWith('http')).length;
const invalidUrlCount = candidates.filter(c => {
    const target = c.pdfUrl || c.url || '';
    return !target.startsWith('http');
}).length;

// Duplicate calculation
const duplicateMap = new Map<string, number>();
let duplicateCount = 0;
candidates.forEach(c => {
    const key = `${c.prefecture}_${c.municipality}`;
    if (duplicateMap.has(key)) {
        duplicateCount++;
    } else {
        duplicateMap.set(key, 1);
    }
});

const sample20 = candidates.slice(0, 20);

// Write JSON output
fs.writeFileSync(outputCandidatesJsonPath, JSON.stringify(candidates, null, 2), 'utf-8');

// Write Report Markdown
const reportMarkdown = `# HTML Extraction Report

## 実行概要
- **入力ファイル**: \`${args[0]}\`
- **出力日**: ${new Date().toISOString()}

## 抽出結果サマリー
- **総抽出件数**: \`${totalExtracted}\` 件
- **PDFリンク (\`pdfUrl\`) の件数**: \`${pdfUrlCount}\` 件
- **通常リンク (\`url\`) の件数**: \`${urlCount}\` 件
- **重複候補件数**: \`${duplicateCount}\` 件
- **不正URL件数（http以外など）**: \`${invalidUrlCount}\` 件

## 実行コマンド例（README用）
\`\`\`bash
npx ts-node scripts/import_html_municipalities.ts data/imports/入力ファイル.html
\`\`\`

## 抽出データのサンプル（先頭20件）
\`\`\`json
${JSON.stringify(sample20, null, 2)}
\`\`\`
`;

fs.writeFileSync(outputReportMdPath, reportMarkdown, 'utf-8');

console.log(`抽出完了: ${totalExtracted} 件の候補を抽出しました。`);
console.log(`JSON出力: ${outputCandidatesJsonPath}`);
console.log(`レポート出力: ${outputReportMdPath}`);
