import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const PENDING_PATH = path.join(rootDir, 'data', 'imports', 'pending.json');
const UNMATCHED_PATH = path.join(rootDir, 'data', 'imports', 'unmatched_candidates.json');

function main() {
    if (!fs.existsSync(UNMATCHED_PATH)) {
        console.error('unmatched_candidates.json not found');
        return;
    }

    const pendingData: any[] = JSON.parse(fs.readFileSync(PENDING_PATH, 'utf8'));
    const unmatchedData: any[] = JSON.parse(fs.readFileSync(UNMATCHED_PATH, 'utf8'));

    const unmatchedNames = new Set(unmatchedData.map(u => u.municipality));
    let patched = 0;

    for (const p of pendingData) {
        if (p.prefecture === '宮城県' && unmatchedNames.has(p.municipality)) {
            p.isPublished = false;
            p.url = null;
            p.pdfUrl = null;
            p.linkStatus = 'UNKNOWN';
            // notes は増やさない
            patched++;
        }
    }

    fs.writeFileSync(PENDING_PATH, JSON.stringify(pendingData, null, 2), 'utf8');
    console.log(`Phase B: Patched ${patched} Sendai wards as unpublished UNKNOWN.`);
}

main();
