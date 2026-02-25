import fs from 'fs';
import path from 'path';

const MISSING_PATH = path.join(process.cwd(), 'data/imports/missing_targets.json');
const YASUDA_PATH = path.join(process.cwd(), 'data/imports/yasuda_municipality_links.json');

const MISSING = JSON.parse(fs.readFileSync(MISSING_PATH, 'utf-8'));
const YASUDA = JSON.parse(fs.readFileSync(YASUDA_PATH, 'utf-8'));

let matchCount = 0;
let exactMatches = [];

for (const m of MISSING) {
    // Exact match approach: kanji name match.
    // Yasuda data has 'municipality' and 'prefecture'. Missing has 'name_kanji' and 'prefectureName'.
    const yMap = YASUDA.find((y: any) =>
        y.prefecture === m.prefectureName &&
        y.municipality === m.name_kanji
    );

    if (yMap && (yMap.url || yMap.pdfUrl)) {
        matchCount++;
        exactMatches.push({
            jisCode: m.code,
            prefecture: m.prefectureName,
            municipality: m.name_kanji,
            url: yMap.url || null,
            pdfUrl: yMap.pdfUrl || null,
            linkStatus: 'UNKNOWN',
            isPublished: false,
            hasDomainWarning: false,
            linkType: yMap.pdfUrl ? 'PDF' : 'GUIDE',
            notes: 'Extracted from Yasuda JSON'
        });
    }
}

console.log(`Matched ${matchCount} out of ${MISSING.length} missing municipalities using Yasuda data.`);

fs.writeFileSync(
    path.join(process.cwd(), 'data/imports/yasuda_missing_fills.json'),
    JSON.stringify(exactMatches, null, 2)
);
console.log('Saved matches to data/imports/yasuda_missing_fills.json');
