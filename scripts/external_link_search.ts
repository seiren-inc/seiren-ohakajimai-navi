import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const prisma = new PrismaClient();

const UNKNOWN_OUT_PATH = path.join(rootDir, 'data', 'imports', 'unknown_candidates.json');
const DRYRUN_OUT_PATH = path.join(rootDir, 'data', 'imports', 'external_link_search_dryrun.json');
const REPORT_OUT_PATH = path.join(rootDir, 'data', 'imports', 'external_link_search_report.md');

// -------- Phase 2: Search Query Generator --------
function generateSearchQueries(prefecture: string, municipality: string): string[] {
    return [
        `${prefecture}${municipality} 改葬許可`,
        `${prefecture}${municipality} 墓地埋葬 改葬`,
        `${prefecture}${municipality} 改葬許可申請書 filetype:pdf`,
    ];
}

// -------- Phase 3: Domain Validation --------
function isOfficialDomain(url: string): boolean {
    try {
        const hostname = new URL(url).hostname;
        return hostname.endsWith('.lg.jp');
    } catch {
        return false;
    }
}

function classifyUrl(url: string): 'guide_candidate' | 'pdf_candidate' | 'reject' {
    if (!isOfficialDomain(url)) return 'reject';
    if (url.toLowerCase().endsWith('.pdf')) return 'pdf_candidate';
    return 'guide_candidate';
}

async function main() {
    console.log('Phase 1: Extracting UNKNOWN and NEEDS_REVIEW records from DB...');

    try {
        // Phase 1: Extract UNKNOWN records from DB
        const unknownRecords = await prisma.municipality.findMany({
            where: {
                OR: [
                    { linkStatus: 'UNKNOWN' },
                    { linkStatus: 'NEEDS_REVIEW' },
                ],
                url: null,
                pdfUrl: null,
            },
            select: {
                jisCode: true,
                prefectureName: true,
                name: true,
                municipalitySlug: true,
                linkStatus: true,
            },
            orderBy: [
                { prefectureName: 'asc' },
                { name: 'asc' }
            ]
        });

        console.log(`Found ${unknownRecords.length} records without any URL.`);

        // Save unknown_candidates.json
        const unknownJson = unknownRecords.map(r => ({
            jisCode: r.jisCode,
            prefecture: r.prefectureName,
            municipality: r.name,
            municipalitySlug: r.municipalitySlug,
            linkStatus: r.linkStatus,
            searchQueries: generateSearchQueries(r.prefectureName, r.name),
        }));
        fs.writeFileSync(UNKNOWN_OUT_PATH, JSON.stringify(unknownJson, null, 2), 'utf8');
        console.log(`Saved: ${UNKNOWN_OUT_PATH}`);

        // Phase 3: Since this is a dry-run without live search,
        // we generate the query structure that the search batch would use.
        // For each record we produce a planned search entry with classification placeholders.
        // In production, the search_web calls would fill in the candidateUrls field.
        const dryrunResults = unknownJson.map(r => ({
            jisCode: r.jisCode,
            prefecture: r.prefecture,
            municipality: r.municipality,
            linkStatus: r.linkStatus,
            searchQueries: r.searchQueries,
            // These would be filled by actual search execution:
            candidateUrls: [] as string[],
            classification: 'pending_search' as string,
        }));

        fs.writeFileSync(DRYRUN_OUT_PATH, JSON.stringify(dryrunResults, null, 2), 'utf8');
        console.log(`Saved: ${DRYRUN_OUT_PATH}`);

        // Report
        const runDate = new Date().toLocaleString('ja-JP');
        const md = `# 外部リンク探索バッチ Dry-run レポート

- **実行日時**: ${runDate}
- **対象総数**: ${unknownRecords.length}件 (UNKNOWN + NEEDS_REVIEW で url=null AND pdfUrl=null)

## ステータス分布
${[...new Set(unknownRecords.map(r => r.linkStatus))].map(s => {
            const count = unknownRecords.filter(r => r.linkStatus === s).length;
            return `- **${s}**: ${count}件`;
        }).join('\n')}

## 検索クエリテンプレート（自治体ごとに3種類生成）
1. \`<都道府県><市区町村> 改葬許可\`
2. \`<都道府県><市区町村> 墓地埋葬 改葬\`
3. \`<都道府県><市区町村> 改葬許可申請書 filetype:pdf\`

## 採用ドメイン条件
- **guide_candidate**: \`*.lg.jp\` のHTMLページ
- **pdf_candidate**: \`*.lg.jp\` の \`.pdf\` 直リンク
- **reject**: 上記以外のドメイン（民間・ポータルサイト等）

## 都道府県別 対象件数
| 都道府県 | 件数 |
|---|---|
${Object.entries(
            unknownRecords.reduce((acc: Record<string, number>, r) => {
                acc[r.prefectureName] = (acc[r.prefectureName] || 0) + 1;
                return acc;
            }, {})
        ).sort((a, b) => b[1] - a[1]).map(([pref, count]) => `| ${pref} | ${count}件 |`).join('\n')}

> [!NOTE]
> 本スクリプトはクエリ生成とドメイン分類ロジックのみ実装しています。
> 実際の Web 検索は \`external_link_search_execute.ts\` (別バッチ) で行います。
> pending.json は本 dry-run では変更しません。

## 出力ファイル
- \`data/imports/unknown_candidates.json\`: ${unknownRecords.length}件の構造化対象リスト（クエリ付き）
- \`data/imports/external_link_search_dryrun.json\`: 検索実行待ち状態の結果テンプレート
`;

        fs.writeFileSync(REPORT_OUT_PATH, md, 'utf8');
        console.log(`Saved: ${REPORT_OUT_PATH}`);
        console.log('Dry-run complete. pending.json unchanged.');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
