
const fs = require('fs');
const path = require('path');

const RESULT_PATH = path.join(process.cwd(), 'data/imports/kanto_result.json');
const ANALYSIS_REPORT_PATH = path.join(process.cwd(), 'data/imports/kanto_domain_analysis.md');

function analyze() {
    const data = JSON.parse(fs.readFileSync(RESULT_PATH, 'utf-8'));
    const warnings = data.filter(r => r.hasDomainWarning);

    const domainGroups = {};
    const detailedSamples = {};

    warnings.forEach(r => {
        try {
            const url = r.url || r.pdfUrl;
            if (!url) return;
            const domain = new URL(url).hostname;
            domainGroups[domain] = (domainGroups[domain] || 0) + 1;

            if (!detailedSamples[domain]) {
                detailedSamples[domain] = [];
            }
            if (detailedSamples[domain].length < 2) {
                detailedSamples[domain].push({
                    pref: r.prefecture,
                    muni: r.municipality,
                    url: url
                });
            }
        } catch (e) {
            domainGroups['invalid-url'] = (domainGroups['invalid-url'] || 0) + 1;
        }
    });

    // Sort by count
    const sortedDomains = Object.entries(domainGroups).sort((a, b) => b[1] - a[1]);

    let report = `# 関東ブロック ドメイン警告精査レポート\n\n`;
    report += `- **警告総数**: ${warnings.length} 件\n\n`;

    report += `## 警告ドメイン一覧（件数順）\n`;
    report += `| ドメイン | 件数 | サンプル自治体 | URL例 |\n`;
    report += `| :--- | :--: | :--- | :--- |\n`;

    sortedDomains.forEach(([domain, count]) => {
        const sample = detailedSamples[domain][0];
        report += `| ${domain} | ${count} | ${sample.pref} ${sample.muni} | ${sample.url} |\n`;
    });

    report += `\n## 分類と判定結果\n`;

    report += `### 1. 公式と判定可能なパターン (誤検知候補)\n`;
    report += `- **city.hachioji.tokyo.jp / city.machida.tokyo.jp 等**: \`city.xxx.tokyo.jp\` の形式。東京23区外の市に多い。現状の \`city.xxx.lg.jp\` or \`city.xxx.jp\` (3レベル) の判定から漏れている可能性。\n`;
    report += `- **saitama-city.jp / www.city.yokohama.lg.jp (lgが入っていない場合)**: 特定の独自ドメイン系。\n`;
    report += `- **www.pa.ktr.mlit.go.jp**: \`go.jp\` なので本来通るべきだが、サブドメインが深い場合に漏れている可能性。\n`;

    report += `\n### 2. グレー・外部サービス (警告維持すべきもの)\n`;
    report += `- **www.g-reiki.net**: 例規集サービス。自治体サイトではないが、公式な内容は含まれる。ただし、申請ページそのものではない場合がある。\n`;
    report += `- **shinsei.city.yokohama.lg.jp / shinsei.elg-front.jp**: 電子申請システム。サブドメインが \`shinsei.\` や \`elg-front.jp\` の場合、公式ドメイン判定を広げる必要がある。\n`;

    report += `\n## 判定ロジック改善案\n`;
    report += `現在のロジック：\n`;
    report += `\`\`\`js\n`;
    report += `const parts = domain.split('.');\n`;
    report += `if (parts.length >= 3) {\n`;
    report += `    const sub = parts[parts.length - 3];\n`;
    report += `    if (['city', 'town', 'vill', 'pref'].includes(sub)) return false;\n`;
    report += `}\n`;
    report += `\`\`\`\n`;
    report += `\n改善案：\n`;
    report += `1. **末尾一致の拡充**: \`.tokyo.jp\`, \`.kanagawa.jp\` 等の地域型ドメインかつ \`city.\`等を含む場合を許可する。\n`;
    report += `2. **再帰的判定**: \`go.jp\`, \`lg.jp\` はサブドメインの深さに関わらず許可する (\`domain.endsWith('.go.jp')\` は既に実装済みだが、念のため再確認)。\n`;
    report += `3. **ホワイトリスト**: \`elg-front.jp\` (共同電子申請), \`g-reiki.net\` (例規集) 等の公共性の高いドメインを \`NEEDS_REVIEW\` ではなく \`OK\` (hasWarning=false) とするかの検討。\n`;

    fs.writeFileSync(ANALYSIS_REPORT_PATH, report);
    console.log(`Analysis report generated at ${ANALYSIS_REPORT_PATH}`);
}

analyze();
