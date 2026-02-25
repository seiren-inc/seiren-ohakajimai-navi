import fs from 'fs';
import path from 'path';

// Load missing targets
const MISSING_PATH = path.join(process.cwd(), 'data/imports/missing_targets.json');
const MISSING = JSON.parse(fs.readFileSync(MISSING_PATH, 'utf-8'));

// We will use the Google Custom Search JSON API
// Requires: 
// 1. API_KEY (from Google Cloud Console)
// 2. CX (Search Engine ID) configured to search the entire web or specific domain (.lg.jp)
const API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const CX = process.env.GOOGLE_SEARCH_CX;

// Rate limiting and state
const OUT_PATH = path.join(process.cwd(), 'data/imports/scrape_results.json');
let results: any[] = [];
if (fs.existsSync(OUT_PATH)) {
    results = JSON.parse(fs.readFileSync(OUT_PATH, 'utf-8'));
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchGoogle(query: string): Promise<string | null> {
    if (!API_KEY || !CX) return null;

    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}&num=3`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Search failed with status: ${response.status}`);
            return null;
        }

        const data = await response.json();
        const items = data.items || [];

        // Find first .lg.jp or explicit official domain link
        for (const item of items) {
            if (item.link && (item.link.includes('.lg.jp') || item.link.includes('.jp'))) {
                return item.link;
            }
        }
    } catch (err) {
        console.error("Error fetching Google Search API", err);
    }
    return null;
}

async function main() {
    if (!API_KEY || !CX) {
        console.error("Missing GOOGLE_SEARCH_API_KEY or GOOGLE_SEARCH_CX in environment.");
        process.exit(1);
    }

    const completedJisKeys = new Set(results.map(r => r.jisCode));
    const toProcess = MISSING.filter((m: any) => !completedJisKeys.has(m.code));

    console.log(`Starting processing for ${toProcess.length} remaining municipalities...`);

    let processed = 0;
    for (const m of toProcess) {
        console.log(`Searching for: ${m.prefectureName} ${m.name_kanji}`);

        const query = `site:lg.jp OR site:jp ${m.prefectureName} ${m.name_kanji} 改葬許可申請`;
        const link = await searchGoogle(query);

        results.push({
            jisCode: m.code,
            prefecture: m.prefectureName,
            municipality: m.name_kanji,
            url: link && !link.endsWith('.pdf') ? link : null,
            pdfUrl: link && link.endsWith('.pdf') ? link : null,
            linkStatus: link ? 'UNKNOWN' : 'ERROR',
            isPublished: false,
            hasDomainWarning: false,
            linkType: link && link.endsWith('.pdf') ? 'PDF' : 'GUIDE',
            notes: link ? 'Extracted via Google Custom Search' : 'Failed to find link'
        });

        processed++;

        // Save state every 10 records
        if (processed % 10 === 0) {
            fs.writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));
            console.log(`Progress saved: ${processed} records.`);
        }

        // Respect rate limits (1 request per second is generally safe for paid/free quotas)
        await sleep(1000);
    }

    fs.writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));
    console.log("Extraction complete.");
}

main().catch(console.error);
