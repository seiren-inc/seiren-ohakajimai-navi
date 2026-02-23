import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const prisma = new PrismaClient();
const REPORT_MD_PATH = path.join(rootDir, 'data', 'imports', 'missing_link_report.md');
const REPORT_JSON_PATH = path.join(rootDir, 'data', 'imports', 'missing_link_breakdown.json');

async function main() {
    console.log('Fetching municipality metrics from DB...');

    try {
        const total = await prisma.municipality.count();
        const publishedOk = await prisma.municipality.count({
            where: { isPublished: true, linkStatus: 'OK', linkType: 'GUIDE' }
        });
        const publishedPdf = await prisma.municipality.count({
            where: { isPublished: true, linkStatus: 'OK', linkType: 'PDF' }
        });
        const missingLink = await prisma.municipality.count({
            where: { OR: [{ linkStatus: 'UNKNOWN' }, { linkStatus: 'NEEDS_REVIEW' }] }
        });

        // Group missing links by prefecture
        console.log('Fetching breakdown by prefecture...');
        const missingPrefectures = await prisma.municipality.groupBy({
            by: ['prefectureName'],
            where: { OR: [{ linkStatus: 'UNKNOWN' }, { linkStatus: 'NEEDS_REVIEW' }] },
            _count: { jisCode: true },
            orderBy: { _count: { jisCode: 'desc' } }
        });

        const breakdown = missingPrefectures.map(p => ({
            prefecture: p.prefectureName,
            missingCount: p._count.jisCode
        }));

        // Write JSON breakdown
        fs.writeFileSync(REPORT_JSON_PATH, JSON.stringify(breakdown, null, 2), 'utf8');

        // Write MD Report
        const runDate = new Date().toLocaleString('ja-JP');
        let md = `# Missing Link 棚卸しレポート (Phase 1)
        
- **実行日時**: ${runDate}

## データベース全件集計
- **Total (総自治体数)**: ${total}件
- **Published OK (通常リンク公開)**: ${publishedOk}件
- **Published PDF (PDFのみ公開)**: ${publishedPdf}件
- **Missing Link (欠損・未レビュー)**: ${missingLink}件

> [!NOTE] 
> 本レポート時点での表示可能数（OK + PDF）は **${publishedOk + publishedPdf}件** です。
> 残る ${missingLink}件 の Missing Link を削減することが本作業の主な目的です。

## 都道府県別 欠損ランキング
`;
        breakdown.forEach((b, i) => {
            md += `${i + 1}. **${b.prefecture}**: ${b.missingCount}件\n`;
        });

        fs.writeFileSync(REPORT_MD_PATH, md, 'utf8');

        console.log(`Outputs generated:\n- ${REPORT_JSON_PATH}\n- ${REPORT_MD_PATH}`);

    } catch (e) {
        console.error('Error during audit:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
