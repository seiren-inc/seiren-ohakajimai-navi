import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PENDING_PATH = path.join(__dirname, '..', 'data', 'imports', 'pending.json');

function main() {
    const data = JSON.parse(fs.readFileSync(PENDING_PATH, 'utf8'));
    let patched = 0;
    for (const p of data) {
        if (!p.municipalitySlug || p.municipalitySlug.trim() === '') {
            // We use jisCode as a fallback slug to ensure uniqueness in DB
            p.municipalitySlug = p.jisCode;
            patched++;
        }
    }
    fs.writeFileSync(PENDING_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Patched ${patched} empty slugs in pending.json.`);
}
main();
