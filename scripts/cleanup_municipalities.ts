
import { PrismaClient, LinkStatus } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const isDryRun = process.argv.includes('--dry-run');
    console.log(`=== Municipality Cleanup (Archive & Delete) ===`);
    console.log(`Mode: ${isDryRun ? 'DRY-RUN' : 'LIVE'}\n`);

    // クリーンアップ対象の抽出
    // ルール: UNKNOWN ステータス、または非公開レコード
    const targetRecords = await prisma.municipality.findMany({
        where: {
            OR: [
                { linkStatus: LinkStatus.UNKNOWN },
                { isPublished: false },
                { jisCode: '' }
            ]
        }
    });

    console.log(`対象レコード数: ${targetRecords.length} 件`);

    if (targetRecords.length === 0) {
        console.log('クリーンアップ対象はありません。');
        return;
    }

    let successCount = 0;
    let errorCount = 0;

    const CHUNK_SIZE = 20;
    for (let i = 0; i < targetRecords.length; i += CHUNK_SIZE) {
        const chunk = targetRecords.slice(i, i + CHUNK_SIZE);
        try {
            if (isDryRun) {
                console.log(`[DRY-RUN] Processing chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(targetRecords.length / CHUNK_SIZE)}...`);
                successCount += chunk.length;
            } else {
                await prisma.$transaction(async (tx) => {
                    for (const record of chunk) {
                        // 1. アーカイブへコピー
                        await tx.municipalityArchive.create({
                            data: {
                                id: record.id,
                                jisCode: record.jisCode,
                                name: record.name,
                                prefectureCode: record.prefectureCode,
                                prefectureName: record.prefectureName,
                                prefectureSlug: record.prefectureSlug,
                                municipalitySlug: record.municipalitySlug,
                                region: record.region,
                                url: record.url,
                                pdfUrl: record.pdfUrl,
                                isPublished: record.isPublished,
                                linkStatus: record.linkStatus,
                                lastCheckedAt: record.lastCheckedAt,
                                notes: record.notes,
                                seoDescription: record.seoDescription,
                                createdAt: record.createdAt,
                                updatedAt: record.updatedAt,
                                hasDomainWarning: record.hasDomainWarning,
                                subLinks: record.subLinks || undefined,
                            }
                        });

                        // 2. 元テーブルから削除
                        await tx.municipality.delete({
                            where: { id: record.id }
                        });
                    }
                }, {
                    timeout: 120000 // 120 seconds
                });
                successCount += chunk.length;
                console.log(`Progress: ${successCount}/${targetRecords.length} processed...`);
            }
        } catch (err) {
            console.error(`[ERROR] Failed to process chunk starting at index ${i}`, err);
            errorCount += chunk.length;
        }
    }

    console.log(`\n=== Cleanup Results ===`);
    console.log(`- 成功: ${successCount} 件`);
    console.log(`- 失敗: ${errorCount} 件`);

    if (!isDryRun && errorCount === 0) {
        console.log('\nクリーンアップが正常に完了しました。');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
