
const fs = require('fs');
const path = require('path');

const PENDING_JSON_PATH = path.join(process.cwd(), 'data/imports/pending.json');
const FINAL_RESULT_PATH = path.join(process.cwd(), 'data/imports/kanto_result.json');
const FINAL_REPORT_PATH = path.join(process.cwd(), 'data/imports/kanto_report.md');

function main() {
    const part1 = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/imports/kanto_part1_result.json'), 'utf-8'));
    const part2 = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/imports/kanto_part2_result.json'), 'utf-8'));
    const part3 = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/imports/kanto_part3_result.json'), 'utf-8'));

    const allExtracted = [...part1, ...part2, ...part3];
    fs.writeFileSync(FINAL_RESULT_PATH, JSON.stringify(allExtracted, null, 2));

    const pending = fs.existsSync(PENDING_JSON_PATH)
        ? JSON.parse(fs.readFileSync(PENDING_JSON_PATH, 'utf-8'))
        : [];

    const mergedMap = new Map();
    pending.forEach(p => mergedMap.set(p.jisCode, p));

    // Upsert extracted data
    allExtracted.forEach(r => {
        mergedMap.set(r.jisCode, r);
    });

    const finalPending = Array.from(mergedMap.values()).sort((a, b) => a.jisCode.localeCompare(b.jisCode));
    fs.writeFileSync(PENDING_JSON_PATH, JSON.stringify(finalPending, null, 2));

    // Generate Final Report
    const prefCounts = {};
    const statusCounts = { OK: 0, PDF_ONLY: 0, NEEDS_REVIEW: 0 };
    let warningCount = 0;

    allExtracted.forEach(r => {
        prefCounts[r.prefecture] = (prefCounts[r.prefecture] || 0) + 1;
        statusCounts[r.linkStatus] = (statusCounts[r.linkStatus] || 0) + 1;
        if (r.hasDomainWarning) warningCount++;
    });

    let report = `# 関東ブロック 最終統合レポート\n\n`;
    report += `- **総抽出件数**: ${allExtracted.length} 件\n`;
    report += `- **マージ後 pending.json 総件数**: ${finalPending.length} 件\n\n`;

    report += `## 都道府県別内訳\n| 都道府県 | 件数 |\n| :--- | :---: |\n`;
    Object.entries(prefCounts).forEach(([p, c]) => report += `| ${p} | ${c} |\n`);

    report += `\n## 最終分類統計\n- OK: ${statusCounts.OK}\n- PDF_ONLY: ${statusCounts.PDF_ONLY}\n- ドメイン警告: ${warningCount}\n\n`;

    report += `## サンプルデータ (Top 3)\n\`\`\`json\n`;
    report += JSON.stringify(allExtracted.slice(0, 3), null, 2);
    report += `\n\`\`\`\n\n`;

    if (statusCounts.PDF_ONLY > 0) {
        report += `## PDF_ONLY 全件一覧\n`;
        allExtracted.filter(r => r.linkStatus === "PDF_ONLY").forEach(r => {
            report += `- ${r.prefecture} ${r.municipality} (${r.pdfUrl})\n`;
        });
    }

    fs.writeFileSync(FINAL_REPORT_PATH, report);
    console.log(`Merge completed. Total: ${allExtracted.length}, Pending Total: ${finalPending.length}`);
}

main();
