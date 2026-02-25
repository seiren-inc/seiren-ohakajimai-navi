
import fs from 'fs';
import path from 'path';

const MASTER_MAP_PATH = path.join(process.cwd(), 'data/imports/municipality_map.json');
const PENDING_JSON_PATH = path.join(process.cwd(), 'data/imports/pending.json');
const RESULT_JSON_PATH = path.join(process.cwd(), 'data/imports/kanto_result.json');
const REPORT_MD_PATH = path.join(process.cwd(), 'data/imports/kanto_report.md');

interface MasterEntry {
    jisCode: string;
    prefectureName: string;
    name: string;
    municipalitySlug: string;
}

interface MunicipalityInput {
    prefecture: string;
    municipality: string;
    jisCode: string;
    municipalitySlug: string;
    url: string | null;
    pdfUrl: string | null;
    linkStatus: "OK" | "PDF_ONLY" | "NEEDS_REVIEW" | "UNKNOWN";
    isPublished: boolean;
    hasDomainWarning: boolean;
    subLinks?: any;
}

const KANTO_PREFS = ["東京都", "神奈川県", "埼玉県", "千葉県", "群馬県", "栃木県", "茨城県", "山梨県", "長野県"];

// Logic for Domain Warning (v2)
function checkDomainWarning(url: string | null): boolean {
    if (!url) return false;
    try {
        const domain = new URL(url).hostname;
        // Official patterns
        if (domain.endsWith('.lg.jp')) return false;
        if (domain.endsWith('.go.jp')) return false;

        // city/town/vill/pref patterns
        const parts = domain.split('.');
        if (parts.length >= 3) {
            const sub = parts[parts.length - 3];
            if (['city', 'town', 'vill', 'pref'].includes(sub)) return false;
        }

        // Specific cases (e.g., saitama-city.jp or similar if they exist, but v2 is usually strict)
        // If not matching obvious LG patterns, mark as warning
        return true;
    } catch (e) {
        return true;
    }
}

async function main() {
    console.log('--- Kanto Block Data Processing ---');

    // 1. Load Combined HTML
    // (Note: The combined HTML is assumed to be in data/imports/kanto_combined.html)
    // I will write the combined content to this file first.
    const combinedHtmlPath = path.join(process.cwd(), 'data/imports/kanto_combined.html');
    if (!fs.existsSync(combinedHtmlPath)) {
        console.error('kanto_combined.html not found.');
        process.exit(1);
    }
    const html = fs.readFileSync(combinedHtmlPath, 'utf-8');

    // 2. Load Master Data
    const masterMap: MasterEntry[] = JSON.parse(fs.readFileSync(MASTER_MAP_PATH, 'utf-8'));

    // 3. Extraction
    const results: MunicipalityInput[] = [];
    let noiseCount = 0;

    // Split by h4 (Prefecture headings)
    const prefBlocks = html.split(/<h4[^>]*>/);

    for (const block of prefBlocks) {
        // Extract prefecture name
        const prefMatch = block.match(/^(東京都|神奈川県|埼玉県|千葉県|群馬県|栃木県|茨城県|山梨県|長野県)/);
        if (!prefMatch) continue;
        const currentPref = prefMatch[1];

        // Find links in this block
        const linkRegex = /<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
        let match;
        while ((match = linkRegex.exec(block)) !== null) {
            const url = match[1].trim();
            const rawName = match[2].trim().replace(/　/g, '').replace(/\s/g, '');

            // Normalize name (e.g. remove "役所", "役場" if they are part of the link text but not master)
            let mName = rawName;
            // Common cleaning
            if (mName.endsWith('役所')) mName = mName.slice(0, -2);
            if (mName.endsWith('役場')) mName = mName.slice(0, -2);
            if (mName.endsWith('役所窓口係')) mName = mName.slice(0, -6);
            if (mName.endsWith('第一戸籍係')) mName = mName.slice(0, -5);
            if (mName.endsWith('戸籍係')) mName = mName.slice(0, -3);

            // Special cases for designated cities if needed, but master map should cover them

            // Match with Master
            let master = masterMap.find(m => m.prefectureName === currentPref && (m.name === mName || m.name === rawName));

            // Try partial match if not found (e.g. master has "役所" or "役場" in some older versions, though usually not)
            if (!master) {
                // Try adding common suffixes to mName to match master
                master = masterMap.find(m => m.prefectureName === currentPref && (m.name === mName + '市' || m.name === mName + '町' || m.name === mName + '村' || m.name === mName + '区'));
            }

            if (!master) {
                console.warn(`[NOT_FOUND] ${currentPref} ${rawName} (${mName})`);
                noiseCount++;
                continue;
            }

            // Classification
            const isPdf = url.toLowerCase().endsWith('.pdf') || url.includes('/pdf/') || url.includes('.pdf?');
            const hasWarning = checkDomainWarning(url);

            const entry: MunicipalityInput = {
                prefecture: currentPref,
                municipality: master.name,
                jisCode: master.jisCode,
                municipalitySlug: master.municipalitySlug,
                url: isPdf ? null : url,
                pdfUrl: isPdf ? url : null,
                linkStatus: isPdf ? "PDF_ONLY" : "OK",
                isPublished: true,
                hasDomainWarning: hasWarning
            };

            results.push(entry);
        }
    }

    console.log(`Extracted ${results.length} valid records. (Noise: ${noiseCount})`);

    // 4. Merge (Upsert by jisCode)
    const pendingJson: MunicipalityInput[] = fs.existsSync(PENDING_JSON_PATH)
        ? JSON.parse(fs.readFileSync(PENDING_JSON_PATH, 'utf-8'))
        : [];

    const mergedMap = new Map<string, MunicipalityInput>();
    pendingJson.forEach(p => mergedMap.set(p.jisCode, p));
    results.forEach(r => {
        // Simple Upsert logic
        mergedMap.set(r.jisCode, r);
    });

    const finalPending = Array.from(mergedMap.values()).sort((a, b) => a.jisCode.localeCompare(b.jisCode));

    // Save
    fs.writeFileSync(PENDING_JSON_PATH, JSON.stringify(finalPending, null, 2));
    fs.writeFileSync(RESULT_JSON_PATH, JSON.stringify(results, null, 2));

    // 5. Report Generation
    const reportMd = generateReport(results, noiseCount, finalPending.length);
    fs.writeFileSync(REPORT_MD_PATH, reportMd);

    console.log(`Successfully merged into pending.json. Report saved to ${REPORT_MD_PATH}`);
}

function generateReport(extracted: MunicipalityInput[], noise: number, totalPending: number): string {
    const prefCounts: Record<string, number> = {};
    const statusCounts: Record<string, number> = { OK: 0, PDF_ONLY: 0, NEEDS_REVIEW: 0 };
    let warningCount = 0;
    let urlOnly = 0;
    let pdfOnly = 0;
    let bothCount = 0; // Note: Current logic extracts as single record per link

    extracted.forEach(r => {
        prefCounts[r.prefecture] = (prefCounts[r.prefecture] || 0) + 1;
        statusCounts[r.linkStatus] = (statusCounts[r.linkStatus] || 0) + 1;
        if (r.hasDomainWarning) warningCount++;

        if (r.url && r.pdfUrl) bothCount++;
        else if (r.url) urlOnly++;
        else if (r.pdfUrl) pdfOnly++;
    });

    const pdfOnlyList = extracted.filter(r => r.linkStatus === "PDF_ONLY").slice(0, 20);
    const reviewList = extracted.filter(r => r.linkStatus === "NEEDS_REVIEW").slice(0, 20);

    let report = `# 関東ブロック 監査レポート\n\n`;
    report += `- **抽出・マージ成功**: ${extracted.length} 件\n`;
    report += `- **除外ノイズ**: ${noise} 件\n`;
    report += `- **マージ後 pending.json 総計**: ${totalPending} 件\n\n`;

    report += `## 都道府県別件数\n| 都道府県 | 件数 |\n| :--- | :--: |\n`;
    Object.entries(prefCounts).forEach(([p, c]) => {
        report += `| ${p} | ${c} |\n`;
    });

    report += `\n## リンク分析\n`;
    report += `- ** linkStatus 分類 **\n`;
    report += `  - OK: ${statusCounts.OK}\n`;
    report += `  - PDF_ONLY: ${statusCounts.PDF_ONLY}\n`;
    report += `  - NEEDS_REVIEW: ${statusCounts.NEEDS_REVIEW}\n`;
    report += `- ** 構成タイプ **\n`;
    report += `  - Webページのみ: ${urlOnly}\n`;
    report += `- ** ドメイン警告 (公式外) **: ${warningCount} 件\n\n`;

    report += `## 代表サンプル (3件)\n\n\`\`\`json\n`;
    report += JSON.stringify(extracted.slice(0, 3), null, 2);
    report += `\n\`\`\`\n\n`;

    if (pdfOnlyList.length > 0) {
        report += `## PDFのみの自治体 (上位${pdfOnlyList.length}件)\n`;
        pdfOnlyList.forEach(r => {
            report += `- [${r.prefecture} ${r.municipality}](file:///jisCode/${r.jisCode}) (PDF: ${r.pdfUrl})\n`;
        });
        report += `\n`;
    }

    if (reviewList.length > 0) {
        report += `## 要確認 (NEEDS_REVIEW) 自治体 (上位${reviewList.length}件)\n`;
        reviewList.forEach(r => {
            report += `- ${r.prefecture} ${r.municipality} (JIS: ${r.jisCode})\n`;
        });
        report += `\n`;
    }

    return report;
}

main().catch(console.error);
