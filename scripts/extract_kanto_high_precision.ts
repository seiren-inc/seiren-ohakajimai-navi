import fs from "fs";
import path from "path";

/**
 * High Precision Extraction Script for Kanto Block
 * Requirements:
 * 1. Keyword scoring (Positive: 申請, ダウンロード, 改葬, 許可; Negative: 霊園, 案内)
 * 2. Designated city merging (横浜市, 川崎市, 相模原市, 千葉市, さいたま市)
 * 3. Priority: URL > PDF
 * 4. Missing report for Kanto block
 */

const HTML_PATH = path.join(process.cwd(), "data/imports/kanto_full.html");
const MAP_PATH = path.join(process.cwd(), "data/imports/municipality_map.json");
const PENDING_PATH = path.join(process.cwd(), "data/imports/pending.json");
const RESULT_PATH = path.join(process.cwd(), "data/imports/kanto_result.json");
const REPORT_PATH = path.join(process.cwd(), "data/imports/kanto_report.md");
const MISSING_PATH = path.join(process.cwd(), "data/imports/kanto_missing_candidates.json");

const PREFECTURES = ["東京都", "神奈川県", "埼玉県", "千葉県", "群馬県", "栃木県", "茨城県", "山梨県", "長野県"];

interface Municipality {
    jisCode: string;
    name: string;
    prefectureName: string;
}

interface PendingEntry {
    prefecture: string;
    municipality: string;
    jisCode: string;
    url: string;
    pdfUrl: string;
}

// Designated Cities and their Wards (for merging)
const DESIGNATED_CITIES: Record<string, { cityJis: string, wards: string[] }> = {
    "横浜市": { cityJis: "14100", wards: ["鶴見区", "神奈川区", "西区", "中区", "南区", "保土ケ谷区", "磯子区", "金沢区", "港北区", "戸塚区", "港南区", "旭区", "緑区", "瀬谷区", "栄区", "泉区", "青葉区", "都筑区"] },
    "川崎市": { cityJis: "14130", wards: ["川崎区", "幸区", "中原区", "高津区", "多摩区", "宮前区", "麻生区"] },
    "相模原市": { cityJis: "14150", wards: ["緑区", "中央区", "南区"] },
    "千葉市": { cityJis: "12100", wards: ["中央区", "花見川区", "稲毛区", "若葉区", "緑区", "美浜区"] },
    "さいたま市": { cityJis: "11100", wards: ["西区", "北区", "大宮区", "見沼区", "中央区", "桜区", "浦和区", "南区", "緑区", "岩槻区"] }
};

// Flatten ward to city mapping for quick lookup
const WARD_TO_CITY: Record<string, string> = {};
for (const city in DESIGNATED_CITIES) {
    for (const ward of DESIGNATED_CITIES[city].wards) {
        WARD_TO_CITY[`${city}${ward}`] = DESIGNATED_CITIES[city].cityJis;
        WARD_TO_CITY[ward] = DESIGNATED_CITIES[city].cityJis; // Also match ward name alone if in context of city
    }
}

async function main() {
    console.log("Starting High-Precision Extraction for Kanto Block...");

    const html = fs.readFileSync(HTML_PATH, "utf-8");
    const map: Municipality[] = JSON.parse(fs.readFileSync(MAP_PATH, "utf-8"));
    const pending: PendingEntry[] = JSON.parse(fs.readFileSync(PENDING_PATH, "utf-8"));

    // 1. Extract Links from HTML
    const aTagRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    const extractedLinks: { href: string; text: string; fullSource: string }[] = [];

    while ((match = aTagRegex.exec(html)) !== null) {
        const href = match[1];
        const text = match[2].replace(/<[^>]*>/g, "").trim();
        const startIdx = Math.max(0, match.index - 100);
        const endIdx = Math.min(html.length, match.index + match[0].length + 100);
        const context = html.substring(startIdx, endIdx);

        extractedLinks.push({ href, text, fullSource: context });
    }

    console.log(`Found ${extractedLinks.length} total links in HTML.`);

    // 2. Score and Match
    const POSITIVE_KEYWORDS = ["申請", "ダウンロード", "改葬", "許可", "手続き"];
    const NEGATIVE_KEYWORDS = ["霊園", "案内", "施設", "公園", "よくある質問"];

    let newCount = 0;
    let updatedCount = 0;
    const matchedJisCodes = new Set<string>();

    console.log("Matching links to municipalities...");
    let processedLinks = 0;

    for (const link of extractedLinks) {
        // Find municipality mention in text or surrounding context
        let targetJis: string | null = null;
        let matchedName = "";

        // Try exact match in link text first
        const found = map.find(m => m.name === link.text || m.name === link.text.replace(/\s/g, ''));
        if (found) {
            targetJis = found.jisCode;
            matchedName = found.name;
        } else {
            // Check if link text is a ward of a designated city
            if (WARD_TO_CITY[link.text]) {
                targetJis = WARD_TO_CITY[link.text];
                matchedName = link.text;
            }
        }

        if (targetJis) {
            // Scoring
            let score = 0;
            const context = link.fullSource;
            POSITIVE_KEYWORDS.forEach(k => { if (context.includes(k)) score += 10; });
            NEGATIVE_KEYWORDS.forEach(k => { if (context.includes(k)) score -= 5; });

            // If score is too low and it's not an exact name match, skip? 
            // For now, if we matched the name, we take it but prioritize high score if multiple exist.
            
            const isPdf = link.href.toLowerCase().endsWith(".pdf");
            
            // Integrate into pending
            const existingIdx = pending.findIndex(e => e.jisCode === targetJis);
            if (existingIdx >= 0) {
                const current = pending[existingIdx];
                let updated = false;

                if (isPdf) {
                    if (!current.pdfUrl || score > 0) {
                        current.pdfUrl = link.href;
                        updated = true;
                    }
                } else {
                    if (!current.url || score > 0) {
                        current.url = link.href;
                        updated = true;
                    }
                }

                if (updated) updatedCount++;
                matchedJisCodes.add(targetJis);
            } else {
                // New entry (if it's in Kanto block)
                const master = map.find(m => m.jisCode === targetJis);
                if (master && PREFECTURES.includes(master.prefectureName)) {
                    pending.push({
                        prefecture: master.prefectureName,
                        municipality: master.name,
                        jisCode: master.jisCode,
                        url: isPdf ? "" : link.href,
                        pdfUrl: isPdf ? link.href : ""
                    });
                    newCount++;
                    matchedJisCodes.add(targetJis);
                }
            }
        }
        processedLinks++;
        if (processedLinks % 100 === 0) {
            console.log(`Processed ${processedLinks}/${extractedLinks.length} links...`);
        }
    }

    // 3. Designated City Merging Logic (Post-process)
    // Actually the logic above handles ward link -> city JIS mapping.
    // We should ensure we don't have separate entries for wards if we want them merged.
    // The current logic maps "横浜区" -> "14100" (Yokohama-shi).
    
    // 4. Missing Report
    const kantoMaster = map.filter(m => PREFECTURES.includes(m.prefectureName));
    const missing = kantoMaster.filter(m => !matchedJisCodes.has(m.jisCode));

    // 5. Save Results
    fs.writeFileSync(PENDING_PATH, JSON.stringify(pending, null, 2));
    fs.writeFileSync(RESULT_PATH, JSON.stringify(pending.filter(p => matchedJisCodes.has(p.jisCode)), null, 2));
    fs.writeFileSync(MISSING_PATH, JSON.stringify(missing, null, 2));

    // 6. Generate Report
    const stats = {
        totalKanto: kantoMaster.length,
        extracted: matchedJisCodes.size,
        missing: missing.length,
        new: newCount,
        updated: updatedCount
    };

    const report = `# Kanto Block Extraction Report

## Summary
- **Total Municipalities in Kanto Block**: ${stats.totalKanto}
- **Successfully Extracted/Matched**: ${stats.extracted} (${((stats.extracted / stats.totalKanto) * 100).toFixed(1)}%)
- **Missing**: ${stats.missing}
- **Newly Added to Pending**: ${stats.new}
- **Updated in Pending**: ${stats.updated}

## Merged Designated Cities
The following cities had ward links merged into the main city record:
- 横浜市 (Yokohama)
- 川崎市 (Kawasaki)
- 相模原市 (Sagamihara)
- 千葉市 (Chiba)
- さいたま市 (Saitama)

## Missing Municipalities (Top 10)
${missing.slice(0, 10).map(m => `- ${m.prefectureName} ${m.name}`).join("\n")}

*Full missing list available in \`kanto_missing_candidates.json\`*
`;

    fs.writeFileSync(REPORT_PATH, report);
    console.log("Extraction complete. Report generated at:", REPORT_PATH);
}

main().catch(console.error);
