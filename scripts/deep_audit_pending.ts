
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
    const data: Record[] = JSON.parse(fs.readFileSync(pendingPath, "utf-8"));

    const unknownRecords = data.filter(r => !r.linkStatus || r.linkStatus === "UNKNOWN");

    console.log("=== 1. UNKNOWN レコード (649件) の詳細内訳 ===");
    let hasUrlOnly = 0;
    let hasPdfOnly = 0;
    let hasBoth = 0;
    let hasNeither = 0;
    const isPublishedStats: Record<string, number> = { "true": 0, "false": 0, "undefined": 0 };

    unknownRecords.forEach(r => {
        const hasUrl = !!r.url;
        const hasPdf = !!r.pdfUrl;
        if (hasUrl && hasPdf) hasBoth++;
        else if (hasUrl) hasUrlOnly++;
        else if (hasPdf) hasPdfOnly++;
        else hasNeither++;

        if (r.isPublished === true) isPublishedStats["true"]++;
        else if (r.isPublished === false) isPublishedStats["false"]++;
        else isPublishedStats["undefined"]++;
    });

    console.log(`- URLのみ有り: ${hasUrlOnly} 件`);
    console.log(`- PDFのみ有り: ${hasPdfOnly} 件`);
    console.log(`- URL/PDF両方有り: ${hasBoth} 件`);
    console.log(`- リンク一切無し: ${hasNeither} 件`);
    console.log(`- isPublished=true: ${isPublishedStats["true"]} 件`);
    console.log(`- isPublished=false: ${isPublishedStats["false"]} 件`);
    console.log(`- isPublished未定義: ${isPublishedStats["undefined"]} 件`);

    console.log("\n=== 2. 都道府県別 UNKNOWN 件数 ===");
    const prefUnknownMap = new Map<string, number>();
    unknownRecords.forEach(r => {
        prefUnknownMap.set(r.prefecture, (prefUnknownMap.get(r.prefecture) || 0) + 1);
    });
    const sortedPrefs = Array.from(prefUnknownMap.entries()).sort((a, b) => b[1] - a[1]);
    sortedPrefs.forEach(([pref, count]) => {
        console.log(`- ${pref}: ${count} 件`);
    });

    console.log("\n=== 3. OK/PDF_ONLY のURLドメイン妥当性チェック ===");
    const domainAudit: any[] = [];
    data.filter(r => r.linkStatus === "OK" || r.linkStatus === "PDF_ONLY").forEach(r => {
        const uStr = r.url || r.pdfUrl;
        if (!uStr) return;
        try {
            const u = new URL(uStr);
            const hostname = u.hostname;
            const isLgJp = hostname.endsWith(".lg.jp");
            const isGov = hostname.endsWith(".gov");
            const trusted = ["www.nishi.or.jp", "www.asukamura.jp", "www.gaas-port.jp", "www.gaas.jp"];
            const isTrusted = trusted.some(t => hostname === t);
            const isPref = [".osaka.jp", ".hyogo.jp", ".kyoto.jp", ".shiga.jp", ".nara.jp", ".wakayama.jp"].some(p => hostname.endsWith(p));

            if (!isLgJp && !isGov && !isTrusted && !isPref) {
                domainAudit.push({ prefecture: r.prefecture, municipality: r.municipality, url: uStr, hostname });
            }
        } catch (e) {
            domainAudit.push({ prefecture: r.prefecture, municipality: r.municipality, url: uStr, error: "Invalid URL" });
        }
    });

    console.log(`- 特殊ドメイン/要精査: ${domainAudit.length} 件`);
    domainAudit.forEach(d => {
        console.log(`  - [${d.prefecture} ${d.municipality}] ${d.hostname || "ERROR"}: ${d.url}`);
    });
}
main();
