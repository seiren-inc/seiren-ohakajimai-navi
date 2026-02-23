import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const PENDING_PATH = 'data/imports/pending.json';
const REPORT_PATH = path.join(rootDir, 'data', 'imports', 'pending_changed_keys_report.md');

function getGitFileContent(revision: string, filePath: string): string {
    return execSync(`git show ${revision}:${filePath}`, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
}

function main() {
    console.log('Fetching HEAD~1 pending.json...');
    const oldContent = getGitFileContent('HEAD~1', PENDING_PATH);
    const oldData = JSON.parse(oldContent);

    console.log('Fetching HEAD pending.json (current state)...');
    const newContent = getGitFileContent('HEAD', PENDING_PATH); // Or can read from file directly but keeping git for consistency if HEAD differs from working tree
    // Alternatively, to ensure we check HEAD, we use git show HEAD. However, the requirement says "直前コミットで...", implying HEAD~1 vs HEAD as HEAD is the last commit.
    const newData = JSON.parse(newContent);

    const oldMap = new Map(oldData.map((d: any) => [d.jisCode, d]));

    let changedRecords = 0;
    const changedKeysCount: Record<string, number> = {};
    const jisCodesWithOtherChanges: string[] = [];

    for (const newRec of newData) {
        const oldRec = oldMap.get(newRec.jisCode);
        if (!oldRec) {
            // New record - technically all keys changed, but let's count it as whole record addition
            changedRecords++;
            continue;
        }

        const keysChangedInRec = new Set<string>();

        // Collect keys from both
        const allKeys = new Set([...Object.keys(oldRec), ...Object.keys(newRec)]);

        // Compare values
        for (const key of allKeys) {
            const oldVal = JSON.stringify((oldRec as any)[key]);
            const newVal = JSON.stringify((newRec as any)[key]);
            if (oldVal !== newVal) {
                keysChangedInRec.add(key);
            }
        }

        if (keysChangedInRec.size > 0) {
            changedRecords++;

            let hasNonSlugChange = false;
            for (const k of keysChangedInRec) {
                changedKeysCount[k] = (changedKeysCount[k] || 0) + 1;
                if (k !== 'municipalitySlug') {
                    hasNonSlugChange = true;
                }
            }
            if (hasNonSlugChange) {
                jisCodesWithOtherChanges.push(newRec.jisCode);
            }
        }
    }

    const runDate = new Date().toLocaleString('ja-JP');
    let reportMd = `# pending.json 差分キー集計レポート\n\n- **実行日時**: ${runDate}\n- **変更レコード件数**: ${changedRecords}件\n\n## 変更キー一覧と件数\n`;

    for (const [key, count] of Object.entries(changedKeysCount)) {
        reportMd += `- \`${key}\`: ${count}件\n`;
    }

    if (Object.keys(changedKeysCount).length === 0) {
        reportMd += `変更はありませんでした。\n`;
    }

    reportMd += `\n## 不正変更 (municipalitySlug以外) の jisCode一覧\n`;

    if (jisCodesWithOtherChanges.length > 0) {
        const displayLimit = 50;
        const displaySet = jisCodesWithOtherChanges.slice(0, displayLimit);
        reportMd += displaySet.map(j => `- ${j}`).join('\n');
        if (jisCodesWithOtherChanges.length > displayLimit) {
            reportMd += `\n...他 ${jisCodesWithOtherChanges.length - displayLimit} 件`;
        }
        reportMd += `\n\n> [!WARNING] \n> municipalitySlug 以外のキーに変更が混入しています。原因を調査し修正してください。`;
    } else {
        reportMd += `\nmunicipalitySlug 以外の変更はありません。(要件合格)\n`;
    }

    fs.writeFileSync(REPORT_PATH, reportMd, 'utf-8');
    console.log(`Audit complete. Changed records: ${changedRecords}. Report saved to ${REPORT_PATH}`);
}

main();
