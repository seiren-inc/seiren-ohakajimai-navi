
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('=== DB Municipality Audit ===\n');

    // 1. jisCode が null/空文字の件数
    const missingJis = await prisma.municipality.count({
        where: {
            OR: [
                { jisCode: { equals: '' } },
                { jisCode: { equals: undefined } } // null is handled by @unique but let's check
            ]
        }
    });

    // 2. jisCode の重複チェック
    const jisDuplicates = await prisma.$queryRaw`
    SELECT jis_code, COUNT(*) 
    FROM municipalities 
    WHERE jis_code IS NOT NULL AND jis_code != ''
    GROUP BY jis_code 
    HAVING COUNT(*) > 1
  `;

    // 3. municipalitySlug の重複チェック (都道府県内での重複を想定)
    const slugDuplicates = await prisma.$queryRaw`
    SELECT prefecture_code, municipality_slug, COUNT(*) 
    FROM municipalities 
    GROUP BY prefecture_code, municipality_slug 
    HAVING COUNT(*) > 1
  `;

    // 4. isPublished status
    const publishedCount = await prisma.municipality.count({ where: { isPublished: true } });
    const unpublishedCount = await prisma.municipality.count({ where: { isPublished: false } });

    // 5. linkStatus distribution
    const statusCounts = await prisma.municipality.groupBy({
        by: ['linkStatus'],
        _count: true
    });

    console.log(`1) JISコード欠損: ${missingJis} 件`);
    console.log(`2) JISコード重複: ${(jisDuplicates as any[]).length} パターン`);
    if ((jisDuplicates as any[]).length > 0) {
        console.log(jisDuplicates);
    }

    console.log(`3) Slug重複(都道府県別): ${(slugDuplicates as any[]).length} パターン`);

    console.log(`4) 公開フラグ: true=${publishedCount}, false=${unpublishedCount}`);

    console.log(`5) リンクステータス分類:`);
    statusCounts.forEach(s => {
        console.log(`   - ${s.linkStatus}: ${s._count}`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
