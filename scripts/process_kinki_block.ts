
import fs from 'fs';
import path from 'path';

interface RawRecord {
    prefecture: string;
    municipality: string;
    url: string;
    pdfUrl: string;
}

interface MasterRecord {
    prefectureName: string;
    name: string;
    jisCode: string;
    municipalitySlug: string;
}

interface SubLink {
    name: string;
    url: string;
}

interface NormalizedRecord {
    prefecture: string;
    municipality: string;
    jisCode: string;
    municipalitySlug: string;
    url: string;
    pdfUrl: string;
    linkStatus: "OK" | "PDF_ONLY" | "NEEDS_REVIEW";
    isPublished: boolean;
    subLinks?: SubLink[];
    originalName?: string;
}

const KINKI_PREFECTURES = ["大阪府", "兵庫県", "京都府", "滋賀県", "奈良県", "和歌山県"];
const DESIGNATED_CITIES: Record<string, string[]> = {
    "大阪府": ["大阪市"],
    "兵庫県": ["神戸市"],
    "京都府": ["京都市"]
};

const CITY_TOP_URLS: Record<string, string> = {
    "大阪市": "https://www.city.osaka.lg.jp/kurashi/category/3011-1-2-1-0-0-0-0-0-0.html",
    "神戸市": "https://www.city.kobe.lg.jp/a60186/kurashi/memorial/kyoka/kaisoukyoka.html",
    "京都市": "https://www.city.kyoto.lg.jp/hokenfukushi/page/0000246769.html"
};

function parseHtml(html: string): RawRecord[] {
    const records: RawRecord[] = [];
    const sections = html.split(/<h4/);

    sections.forEach((section, idx) => {
        if (idx === 0) return;
        const h4Match = section.match(/^[^>]*>([^<]+)<\/h4>/);
        if (!h4Match) return;
        const currentPref = h4Match[1].trim();
        if (!KINKI_PREFECTURES.includes(currentPref)) return;

        const body = section.split(/<\/h4>/)[1] || "";
        const lines = body.split(/<br>|\n/);
        lines.forEach(line => {
            const cleanLine = line.trim();
            if (!cleanLine) return;
            const linkMatch = cleanLine.match(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/);
            let munName = "";
            let url = "";
            let pdfUrl = "";
            if (linkMatch) {
                url = linkMatch[1];
                munName = linkMatch[2].trim();
                if (url.endsWith(".pdf") || url.includes("view.officeapps.live.com")) {
                    pdfUrl = url;
                    url = "";
                }
            } else {
                const text = cleanLine.replace(/<[^>]+>/g, '').trim();
                const firstWord = text.split(/\s+|　+/)[0];
                if (firstWord && firstWord.length >= 2 && !firstWord.includes("-") && !firstWord.includes("窓口")) {
                    munName = firstWord;
                }
            }
            if (munName && munName.length < 20) {
                records.push({ prefecture: currentPref, municipality: munName, url, pdfUrl });
            }
        });
    });
    return records;
}

function normalizeSlug(name: string, originalSlug: string): string {
    let slug = originalSlug;
    if (name === "大阪市") return "osaka-shi";

    // Check if suffix already exists
    if (!slug.endsWith("-shi") && !slug.endsWith("-ku") && !slug.endsWith("-cho") && !slug.endsWith("-son")) {
        if (name.endsWith("市")) slug += "-shi";
        else if (name.endsWith("区")) slug += "-ku";
        else if (name.endsWith("町")) slug += "-cho";
        else if (name.endsWith("村") && !name.includes("北山村")) slug += "-son";
    }
    if (name === "北山村") return "kitayama-mura";
    return slug;
}

function main() {
    const htmlPath = path.join(process.cwd(), "data/imports/kinki_block_1.html");
    const mapPath = path.join(process.cwd(), "data/imports/municipality_map.json");
    const html = fs.readFileSync(htmlPath, "utf-8");
    const masterList: MasterRecord[] = JSON.parse(fs.readFileSync(mapPath, "utf-8"));

    const rawRecords = parseHtml(html);
    const rawNormalized: NormalizedRecord[] = [];

    rawRecords.forEach(raw => {
        let searchName = raw.municipality;
        if (raw.prefecture === "大阪府" && searchName.endsWith("区") && !searchName.startsWith("大阪市") && !["堺市"].some(s => searchName.includes(s))) {
            searchName = "大阪市" + searchName;
        }
        let masterEntry = masterList.find(m => m.prefectureName === raw.prefecture && m.name === searchName);

        if (!masterEntry && searchName.endsWith("区")) {
            const parentCity = DESIGNATED_CITIES[raw.prefecture]?.find(city =>
                masterList.some(m => m.prefectureName === raw.prefecture && m.name === city)
            ) || "";
            if (parentCity) {
                masterEntry = masterList.find(m => m.prefectureName === raw.prefecture && m.name === parentCity);
            }
        }

        if (masterEntry) {
            const linkStatus = (raw.pdfUrl && !raw.url) ? "PDF_ONLY" : (raw.url ? "OK" : "NEEDS_REVIEW");
            const slug = normalizeSlug(masterEntry.name, masterEntry.municipalitySlug);

            rawNormalized.push({
                prefecture: masterEntry.prefectureName,
                municipality: masterEntry.name,
                jisCode: masterEntry.jisCode,
                municipalitySlug: slug,
                url: raw.url,
                pdfUrl: raw.pdfUrl,
                linkStatus,
                isPublished: linkStatus !== "NEEDS_REVIEW",
                originalName: raw.municipality
            });
        }
    });

    const jisMap = new Map<string, NormalizedRecord[]>();
    rawNormalized.forEach(n => {
        const list = jisMap.get(n.jisCode) || [];
        list.push(n);
        jisMap.set(n.jisCode, list);
    });

    const finalRecords: NormalizedRecord[] = [];
    jisMap.forEach((list, jis) => {
        const base = list[0];
        const isDesignated = Object.values(DESIGNATED_CITIES).flat().includes(base.municipality);

        if (!isDesignated) {
            const best = list.find(l => l.linkStatus === "OK") || list.find(l => l.linkStatus === "PDF_ONLY") || list[0];
            finalRecords.push(best);
        } else {
            const topUrl = CITY_TOP_URLS[base.municipality] || base.url || "";
            const subLinks = list
                .filter(l => (l.url || l.pdfUrl) && l.originalName !== base.municipality)
                .map(l => ({ name: l.originalName!, url: l.url || l.pdfUrl }));

            finalRecords.push({
                ...base,
                url: topUrl,
                pdfUrl: "",
                linkStatus: "OK",
                isPublished: true,
                subLinks: subLinks.length > 0 ? subLinks : undefined
            });
        }
    });

    // --- Audit ---
    console.log("=== 監査レポート ===");

    // 1) Slug Double Suffix Check
    const doubleSuffixSlugs = finalRecords.filter(n => {
        const slug = n.municipalitySlug;
        const suffixes = ["-shi", "-ku", "-cho", "-son"];
        let count = 0;
        suffixes.forEach(s => { if (slug.includes(s)) count++; });
        // Special check for overlapping patterns if any, but mainly looking for repeated ones
        const repeated = suffixes.some(s => slug.split(s).length > 2);
        return repeated || count > 1;
    });
    console.log(`1) スラッグ二重サフィックス不備: ${doubleSuffixSlugs.length} 件`);
    doubleSuffixSlugs.forEach(n => console.log(`   - ${n.municipality}: ${n.municipalitySlug}`));

    // 2) JIS Duplicate Check
    const jisCodes = finalRecords.map(r => r.jisCode);
    const uniqueJis = new Set(jisCodes);
    const duplicateJis = Array.from(uniqueJis).filter(j => jisCodes.filter(c => c === j).length > 1);
    console.log(`2) JISコード重複: ${duplicateJis.length} 件`);
    duplicateJis.forEach(j => console.log(`   - ${j}`));

    // 3) subLinks Parent-Child URL Duplicate Check
    const subLinkUrlDupes: string[] = [];
    finalRecords.forEach(n => {
        if (n.subLinks) {
            const dupeLinks = n.subLinks.filter(s => s.url === n.url);
            if (dupeLinks.length > 0) {
                subLinkUrlDupes.push(`${n.municipality} (${dupeLinks.map(d => d.name).join(', ')})`);
            }
        }
    });
    console.log(`3) subLinks 親子URL重複: ${subLinkUrlDupes.length} 件`);
    subLinkUrlDupes.forEach(s => console.log(`   - ${s}`));

    // 4) Full Re-tally
    const ok = finalRecords.filter(n => n.linkStatus === "OK").length;
    const pdf = finalRecords.filter(n => n.linkStatus === "PDF_ONLY").length;
    const nr = finalRecords.filter(n => n.linkStatus === "NEEDS_REVIEW").length;
    console.log(`\n4) 全件再集計出力`);
    console.log(`- 総数: ${finalRecords.length}`);
    console.log(`- OK: ${ok}`);
    console.log(`- PDF_ONLY: ${pdf}`);
    console.log(`- NEEDS_REVIEW: ${nr}`);

    fs.writeFileSync("kinki_result.json", JSON.stringify(finalRecords, null, 2));
}
main();
