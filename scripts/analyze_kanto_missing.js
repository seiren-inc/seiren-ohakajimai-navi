const fs = require("fs");
const path = require("path");

/**
 * Detailed Analysis Script for Missing Kanto Municipalities
 */

const HTML_PATH = path.join(process.cwd(), "data/imports/kanto_full.html");
const MISSING_PATH = path.join(process.cwd(), "data/imports/kanto_missing_candidates.json");
const REPORT_PATH = path.join(process.cwd(), "data/imports/kanto_analysis_report.md");

async function main() {
    console.log("Starting Detailed Analysis of Missing Municipalities...");

    const html = fs.readFileSync(HTML_PATH, "utf-8");
    const missing = JSON.parse(fs.readFileSync(MISSING_PATH, "utf-8"));

    const results = [];
    const stats = {};

    for (const item of missing) {
        const name = item.name;
        const pref = item.prefectureName;
        
        if (!stats[pref]) stats[pref] = { total: 0, textOnly: 0, separatePage: 0, pdfOnly: 0, notFound: 0, others: 0 };
        stats[pref].total++;

        // Search for the name in HTML
        const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedName, 'g');
        let match;
        let foundDetails = [];

        while ((match = regex.exec(html)) !== null) {
            const index = match.index;
            const start = Math.max(0, index - 150);
            const end = Math.min(html.length, index + name.length + 150);
            const context = html.substring(start, end);

            // Check if it's inside an <a> tag
            const isInsideLink = /<a\s+[^>]*>[\s\S]*?<\/a>/.test(html.substring(index - 100, index + name.length + 100)) && 
                                 context.includes(name) && 
                                 new RegExp(`<a[^>]*>[^<]*${escapedName}[^<]*<\/a>`).test(context);

            // Look for generic links nearby (e.g., "申請書はこちら")
            const nearbyLinkMatch = context.match(/<a\s+(?:[^>]*?\s+)?href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi);
            
            foundDetails.push({
                context,
                isInsideLink,
                nearbyLinks: nearbyLinkMatch ? nearbyLinkMatch.map(l => l.replace(/<[^>]*>/g, "").trim()) : []
            });
        }

        let classification = "notFound";
        let reason = "HTML内に名前が見つかりませんでした。";

        if (foundDetails.length > 0) {
            const bestMatch = foundDetails[0]; // Take the first hit for classification
            const context = bestMatch.context;

            if (bestMatch.isInsideLink) {
                classification = "others";
                reason = "リンクとして存在しますが、前回の抽出で漏れた可能性があります（要ロジック確認）。";
            } else if (context.includes("申請書") || context.includes("ダウンロード")) {
                classification = "textOnly";
                reason = "名前はテキストのみで、近くに固有のリンクが見当たりません。";
                
                // If there's a nearby link that is generic
                if (bestMatch.nearbyLinks.some(l => l.includes("詳細") || l.includes("こちら") || l.includes("ページ"))) {
                    classification = "separatePage";
                    reason = "名前はテキストですが、「詳細はこちら」などの別ページ誘導リンクが隣接しています。";
                }
            } else {
                classification = "textOnly";
                reason = "名前はテキストのみで、行政窓口案内などの情報のみが記載されています。";
            }
        }

        stats[pref][classification]++;
        results.push({
            ...item,
            classification,
            reason,
            sampleContext: foundDetails.length > 0 ? foundDetails[0].context.substring(100, 200).trim() : null
        });
    }

    // Generate Report
    let report = `# 未抽出自治体 (159件) 詳細分析レポート\n\n`;
    
    report += `## 都道府県別統計\n\n`;
    report += `| 都道府県 | 合計 | テキストのみ | 別ページ誘導 | PDFのみ | 見つからず | その他 |\n`;
    report += `| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n`;
    
    const prefList = Object.keys(stats).sort();
    for (const pref of prefList) {
        const s = stats[pref];
        report += `| ${pref} | ${s.total} | ${s.textOnly} | ${s.separatePage} | ${s.pdfOnly} | ${s.notFound} | ${s.others} |\n`;
    }

    report += `\n## 分類定義と補完戦略\n\n`;
    report += `### 1. テキストのみ (Text Only)\n`;
    report += `- **状態**: 自治体名は存在するが、改葬許可に関するリンクが一切貼られていない。\n`;
    report += `- **戦略**: Google検索 API または 手動による公式サイト検索で URL を特定し、補完。優先度：高。\n\n`;
    
    report += `### 2. 別ページ誘導 (Separate Page/Hub)\n`;
    report += `- **状態**: 「各区役所へ」や「こちらのページを参照」など、一括案内の別ページへ誘導されている。\n`;
    report += `- **戦略**: 誘導先ページをスクレイピング対象に追加し、再抽出。ハブページ経由での特定。優先度：中。\n\n`;

    report += `### 3. 見つからず (Not Found)\n`;
    report += `- **状態**: HTML内に名前すら存在しない。Kantoブロック以外のリストに混入しているか、ページ構成上省略されている。\n`;
    report += `- **戦略**: マスターリストから全件洗い出し、欠落分として一括外部検索。優先度：最高。\n\n`;

    report += `## サンプル事例 (Top 10)\n\n`;
    report += results.slice(0, 10).map(r => `- **${r.prefectureName} ${r.name}**: ${r.classification} (${r.reason})`).join("\n");
    report += `\n\n*詳細は \`kanto_analysis_results.json\` を参照。*`;

    fs.writeFileSync(REPORT_PATH, report);
    fs.writeFileSync(path.join(process.cwd(), "data/imports/kanto_analysis_results.json"), JSON.stringify(results, null, 2));

    console.log("Analysis complete. Report generated at:", REPORT_PATH);
}

main().catch(console.error);
