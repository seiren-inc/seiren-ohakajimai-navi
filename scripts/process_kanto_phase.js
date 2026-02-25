
const fs = require('fs');
const path = require('path');

const MASTER_MAP_PATH = path.join(process.cwd(), 'data/imports/municipality_map.json');

function checkDomainWarning(url) {
    if (!url) return false;
    try {
        const u = new URL(url);
        const domain = u.hostname;
        if (domain.endsWith('.lg.jp')) return false;
        if (domain.endsWith('.go.jp')) return false;
        const parts = domain.split('.');
        if (parts.length >= 3) {
            const sub = parts[parts.length - 3];
            if (['city', 'town', 'vill', 'pref'].includes(sub)) return false;
        }
        return true;
    } catch (e) {
        return true;
    }
}

function processPhase(htmlPath, resultPath, reportPath, phaseName) {
    if (!fs.existsSync(htmlPath)) {
        console.error(`File not found: ${htmlPath}`);
        return;
    }
    const html = fs.readFileSync(htmlPath, 'utf-8');
    const masterMap = JSON.parse(fs.readFileSync(MASTER_MAP_PATH, 'utf-8'));

    const results = [];
    let noiseCount = 0;

    const blocks = html.split(/<h4[^>]*>/);
    for (const block of blocks) {
        const prefMatch = block.match(/^(東京都|神奈川県|埼玉県|千葉県|群馬県|栃木県|茨城県|山梨県|長野県)/);
        if (!prefMatch) continue;
        const currentPref = prefMatch[1];

        const linkRegex = /<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
        let match;
        while ((match = linkRegex.exec(block)) !== null) {
            const url = match[1].trim();
            const rawName = match[2].trim().replace(/　/g, '').replace(/\s/g, '');

            let mName = rawName;
            if (mName.endsWith('役所')) mName = mName.slice(0, -2);
            if (mName.endsWith('役場')) mName = mName.slice(0, -2);
            if (mName.endsWith('第一戸籍係')) mName = mName.slice(0, -5);
            if (mName.endsWith('戸籍係')) mName = mName.slice(0, -3);

            let master = masterMap.find(m => m.prefectureName === currentPref && (m.name === mName || m.name === rawName));
            if (!master) {
                master = masterMap.find(m => m.prefectureName === currentPref && (m.name === mName + '市' || m.name === mName + '町' || m.name === mName + '村' || m.name === mName + '区'));
            }

            if (!master) {
                noiseCount++;
                continue;
            }

            const isPdf = url.toLowerCase().endsWith('.pdf') || url.includes('/pdf/') || url.includes('.pdf?');
            const hasWarning = checkDomainWarning(url);

            results.push({
                prefecture: currentPref,
                municipality: master.name,
                jisCode: master.jisCode,
                municipalitySlug: master.municipalitySlug,
                url: isPdf ? null : url,
                pdfUrl: isPdf ? url : null,
                linkStatus: isPdf ? "PDF_ONLY" : "OK",
                isPublished: true,
                hasDomainWarning: hasWarning
            });
        }
    }

    fs.writeFileSync(resultPath, JSON.stringify(results, null, 2));

    const prefCounts = {};
    const statusCounts = { OK: 0, PDF_ONLY: 0, NEEDS_REVIEW: 0 };
    let warningCount = 0;

    results.forEach(r => {
        prefCounts[r.prefecture] = (prefCounts[r.prefecture] || 0) + 1;
        statusCounts[r.linkStatus] = (statusCounts[r.linkStatus] || 0) + 1;
        if (r.hasDomainWarning) warningCount++;
    });

    let report = `# 関東ブロック 監査レポート (${phaseName})\n\n`;
    report += `- 抽出件数: ${results.length} 件\n`;
    report += `- 除外ノイズ: ${noiseCount} 件\n\n`;
    report += `## 都道府県別内訳\n| 都道府県 | 件数 |\n| :--- | :---: |\n`;
    Object.entries(prefCounts).forEach(([p, c]) => report += `| ${p} | ${c} |\n`);
    report += `\n## ステータス別内訳\n- OK: ${statusCounts.OK}\n- PDF_ONLY: ${statusCounts.PDF_ONLY}\n- ドメイン警告: ${warningCount}\n\n`;

    const pdfList = results.filter(r => r.linkStatus === "PDF_ONLY").slice(0, 20);
    if (pdfList.length > 0) {
        report += `## PDF_ONLY 一覧 (上位20件)\n`;
        pdfList.forEach(r => report += `- ${r.prefecture} ${r.municipality} (${r.pdfUrl})\n`);
    }

    fs.writeFileSync(reportPath, report);
    console.log(`Phase completed: ${phaseName}`);
    console.log(`Results: ${results.length}, Noise: ${noiseCount}`);
}

const args = process.argv.slice(2);
if (args.length === 4) {
    processPhase(args[0], args[1], args[2], args[3]);
} else {
    console.log("Usage: node scripts/process_kanto_phase.js <htmlPath> <resultPath> <reportPath> <phaseName>");
}
