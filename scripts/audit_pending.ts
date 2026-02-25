
import fs from 'fs';
import path from 'path';

interface Record {
    prefecture: string;
    municipality: string;
    jisCode: string;
    municipalitySlug?: string;
    url?: string;
    pdfUrl?: string;
    linkStatus?: string;
    isPublished?: boolean;
}

function main() {
    const pendingPath = path.join(process.cwd(), "data/imports/pending.json");
    if (!fs.existsSync(pendingPath)) {
        console.error("pending.json not found");
        return;
    }

    const data: Record[] = JSON.parse(fs.readFileSync(pendingPath, "utf-8"));

    // 1. ユニークJIS総数
    const jisCodes = data.map(r => r.jisCode);
    const uniqueJis = new Set(jisCodes);
    const totalUniqueJIS = uniqueJis.size;

    // 2. Slug 重複チェック (isPublished=true のものを優先チェック)
    const slugMap = new Map<string, Record[]>();
    data.forEach(r => {
        if (r.municipalitySlug) {
            const list = slugMap.get(r.municipalitySlug) || [];
            list.push(r);
            slugMap.set(r.municipalitySlug, list);
        }
    });
    const duplicateSlugs = Array.from(slugMap.entries()).filter(([slug, list]) => list.length > 1);

    // 3. linkStatus 別件数
    const statusCounts: Record<string, number> = {
        "OK": 0,
        "PDF_ONLY": 0,
        "NEEDS_REVIEW": 0,
        "UNKNOWN": 0
    };
    data.forEach(r => {
        const s = r.linkStatus || "UNKNOWN";
        statusCounts[s] = (statusCounts[s] || 0) + 1;
    });

    // 4. isPublished=true 件数
    const isPublishedTrueCount = data.filter(r => r.isPublished === true).length;
    // 古いデータ形式（isPublishedがないがURLがあるもの）も考慮する場合:
    const effectivePublishedCount = data.filter(r => r.isPublished === true || (r.isPublished === undefined && (r.url || r.pdfUrl))).length;

    // 5. 都道府県別件数一覧
    const prefMap = new Map<string, number>();
    data.forEach(r => {
        prefMap.set(r.prefecture, (prefMap.get(r.prefecture) || 0) + 1);
    });

    const sortedPrefs = Array.from(prefMap.entries()).sort((a, b) => {
        // Simple sort, or could use an order of prefs
        return a[0].localeCompare(b[0]);
    });

    // Output
    console.log("=== pending.json 最終監査レポート ===");
    console.log(`1) 全ユニークJIS総数: ${totalUniqueJIS} 件 (全レコード数: ${data.length})`);

    console.log(`\n2) スラッグ重複チェック: ${duplicateSlugs.length} 件不備`);
    duplicateSlugs.forEach(([slug, list]) => {
        console.log(`   - ${slug}: ${list.map(r => `${r.prefecture} ${r.municipality}`).join(', ')}`);
    });

    console.log(`\n3) linkStatus 別集計:`);
    console.log(`   - OK: ${statusCounts["OK"]} 件`);
    console.log(`   - PDF_ONLY: ${statusCounts["PDF_ONLY"]} 件`);
    console.log(`   - NEEDS_REVIEW: ${statusCounts["NEEDS_REVIEW"]} 件`);
    console.log(`   - UNKNOWN (旧形式等): ${statusCounts["UNKNOWN"]} 件`);

    console.log(`\n4) 公開対象件数 (isPublished=true): ${isPublishedTrueCount} 件`);
    console.log(`   (※有効公開件数[未設定含む]: ${effectivePublishedCount} 件)`);

    console.log(`\n5) 都道府県別件数一覧:`);
    sortedPrefs.forEach(([pref, count]) => {
        console.log(`   - ${pref}: ${count} 件`);
    });
}
main();
