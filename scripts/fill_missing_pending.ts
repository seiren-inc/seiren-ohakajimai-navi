import fs from 'fs';
import path from 'path';

function main() {
    const PENDING_LOG = path.join(process.cwd(), 'data/imports/pending.json');
    const MAP_FILE = path.join(process.cwd(), 'data/imports/municipality_map.json');

    const pending = JSON.parse(fs.readFileSync(PENDING_LOG, 'utf-8'));
    const mapData = JSON.parse(fs.readFileSync(MAP_FILE, 'utf-8'));

    const existingJisCodes = new Set(pending.map((p: any) => p.jisCode));
    let addedCount = 0;

    for (const m of mapData) {
        if (!existingJisCodes.has(m.jisCode)) {
            pending.push({
                prefecture: m.prefectureName,
                municipality: m.name,
                jisCode: m.jisCode,
                url: null,
                pdfUrl: null,
                linkStatus: "UNKNOWN",
                isPublished: false,
                hasDomainWarning: false,
                municipalitySlug: m.municipalitySlug,
                linkType: null,
                notes: "No URL found in initial text blocks"
            });
            addedCount++;
            existingJisCodes.add(m.jisCode);
        }
    }

    // Sort by JIS code for clean git diff
    pending.sort((a: any, b: any) => a.jisCode.localeCompare(b.jisCode));

    fs.writeFileSync(PENDING_LOG, JSON.stringify(pending, null, 2));
    console.log(`Successfully added ${addedCount} missing municipalities to pending.json.`);
    console.log(`Total records in pending.json: ${pending.length} (Expected: ${mapData.length})`);
}

main();
