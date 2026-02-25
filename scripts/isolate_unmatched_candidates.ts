import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const AUDIT_RESULT_PATH = path.join(rootDir, 'data', 'imports', 'html_audit_result.json');
const UNMATCHED_OUT_PATH = path.join(rootDir, 'data', 'imports', 'unmatched_candidates.json');
const REPORT_OUT_PATH = path.join(rootDir, 'data', 'imports', 'unmatched_candidates_report.md');

function main() {
    if (!fs.existsSync(AUDIT_RESULT_PATH)) {
        console.error('Audit result file not found:', AUDIT_RESULT_PATH);
        process.exit(1);
    }

    const auditData = JSON.parse(fs.readFileSync(AUDIT_RESULT_PATH, 'utf8'));
    const unmatched = auditData.unmatched || [];

    // Tagging logic
    const taggedUnmatched = unmatched.map((cand: any) => {
        let reason = 'JISコード不明・名称不一致';
        // Add specific heuristics here if needed based on what they look like
        if (cand.notes && cand.notes.includes('文字化け')) {
            reason = '文字化け疑いによる突合失敗';
        } else if (cand.municipality.includes('役場') || cand.municipality.includes('組合')) {
            reason = '広域行政組合または役場表記のためマスターの市町村名と不一致';
        }

        return {
            ...cand,
            reasonTag: reason
        };
    });

    // Write JSON
    fs.writeFileSync(UNMATCHED_OUT_PATH, JSON.stringify(taggedUnmatched, null, 2), 'utf8');

    // Report Build
    const runDate = new Date().toLocaleString('ja-JP');

    let reportMd = `# マスター不一致候補レコード 隔離レポート
    
- **実行日時**: ${runDate}
- **対象件数**: ${taggedUnmatched.length}件

> [!NOTE]
> これらのデータは、HTMLからURLの抽出には成功しましたが、\`municipality_map.json\` (および \`pending.json\`) のマスターJISコード実体と自動突合ができなかったレコードです。そのため \`pending.json\` には統合せず隔離しています。

## 内訳と推奨解決手順
**【推奨解決手順】**
県と自治体名（表記揺れや文字化けを解読）から人間が本来のJISコードを確定し、そのJISコードを用いて再度マージするか、手動で \`pending.json\` に反映させてください。

### 隔離レコード一覧
`;

    taggedUnmatched.forEach((c: any, index: number) => {
        reportMd += `
**${index + 1}. ${c.prefecture} ${c.municipality}**
- URL: ${c.url || c.pdfUrl || '該当なし'}
- 生テキスト枠: \`${c.rawText}\`
- 理由タグ: \`${c.reasonTag}\`
`;
    });

    fs.writeFileSync(REPORT_OUT_PATH, reportMd, 'utf8');

    console.log(`Unmatched isolation complete. Processed ${taggedUnmatched.length} records.`);
    console.log(`Report generated at: ${REPORT_OUT_PATH}`);
}

main();
