
import fs from 'fs';
import path from 'path';

interface SubLink {
    name: string;
    url: string;
}

interface Municipality {
    prefecture: string;
    municipality: string;
    jisCode: string;
    municipalitySlug?: string;
    url?: string;
    pdfUrl?: string;
    linkStatus?: string;
    isPublished?: boolean;
    subLinks?: SubLink[];
    hasDomainWarning?: boolean;
    originalName?: string;
}

const INPUT_FILE = path.join(process.cwd(), 'data/imports/pending_audited.json');
const OUTPUT_FILE = path.join(process.cwd(), 'data/imports/pending_audited_v2.json');

const STRICT_PATTERNS = [
    '.lg.jp',
    '.gov',
    '.go.jp',
    'gaas-port.jp',
    'g-reiki.net',
    'officeapps.live.com'
];

const TRUSTED_DOMAINS = [
    'www.nishi.or.jp',
    'www.asukamura.jp',
    'www.gaas.jp',
    'www.gaas-port.jp',
    'www.shichigahama.com',
    'mombetsu.jp',
    'jinsekigun.jp',
    'bungo-ohno.jp'
];

const OFFICIAL_JP_PATTERNS = [
    /\.pref\..*\.jp$/,
    /\.city\..*\.jp$/,
    /\.town\..*\.jp$/,
    /\.vill\..*\.jp$/
];

const MAP_FILE = path.join(process.cwd(), 'data/imports/municipality_map.json');

interface MasterRecord {
    jisCode: string;
    municipalitySlug: string;
}

function verifyDomainV2(urlStr: string, slug?: string): boolean {
    try {
        const url = new URL(urlStr);
        const hostname = url.hostname.toLowerCase();

        // 1. Strict patterns / Trusted platforms
        if (STRICT_PATTERNS.some(p => hostname.endsWith(p) || hostname === p)) return true;
        if (TRUSTED_DOMAINS.some(d => hostname === d || hostname.endsWith('.' + d))) return true;

        // 2. Official JP patterns (.city.xxx.jp, etc)
        if (OFFICIAL_JP_PATTERNS.some(regex => regex.test(hostname))) return true;

        // 3. Subdomain/Custom official forms (.jp / .com / .net check with slug match)
        if (hostname.endsWith('.jp') || hostname.endsWith('.com') || hostname.endsWith('.net')) {
            // Allow if domain starts with common official prefixes
            const officialPrefixes = ['city-', 'town-', 'vill-', 'city.', 'town.', 'vill.', 'webtown.', 'official.'];
            if (officialPrefixes.some(p => hostname.startsWith(p))) return true;

            // Dynamic match: if slug (base romaji name) is in domain
            if (slug) {
                let baseRomaji = slug.replace(/-(shi|cho|son|ku|machi|mura)$/, '').toLowerCase();

                // Handle m/n variation (e.g. monbetsu vs mombetsu)
                const altRomaji = baseRomaji.replace(/n/g, 'm');

                // Hyphen-insensitive check
                const cleanBase = baseRomaji.replace(/-/g, '');
                const cleanAlt = altRomaji.replace(/-/g, '');
                const cleanHost = hostname.replace(/-/g, '');

                if (cleanHost.includes(cleanBase) || cleanHost.includes(cleanAlt)) return true;

                // Handle town-xxx vs xxx-town variants
                const cleanHostname = hostname.replace(/^(www\.|city-|town-|vill-)/, '');
                if (cleanHostname.includes(baseRomaji)) return true;
            }
        }

        return false;
    } catch {
        return false;
    }
}

function main() {
    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`Input file not found: ${INPUT_FILE}`);
        return;
    }

    const data: Municipality[] = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));

    // Load master map for slugs
    const masterMap: Record<string, string> = {};
    if (fs.existsSync(MAP_FILE)) {
        const masterList: MasterRecord[] = JSON.parse(fs.readFileSync(MAP_FILE, 'utf-8'));
        masterList.forEach(m => {
            masterMap[m.jisCode] = m.municipalitySlug;
        });
    }

    const totalCount = data.length;

    const refinedData = data.map(record => {
        // Supplement slug if missing
        const slug = record.municipalitySlug || masterMap[record.jisCode];

        const targetUrl = record.url || record.pdfUrl;
        if (!targetUrl) {
            return { ...record, municipalitySlug: slug, isPublished: false, hasDomainWarning: false };
        }

        const isOfficial = verifyDomainV2(targetUrl, slug);
        const hasDomainWarning = !isOfficial;

        // isPublished logic:
        // Success status (OK/PDF_ONLY) AND Official Domain
        let isPublished = record.isPublished || false;
        if (record.linkStatus === 'OK' || record.linkStatus === 'PDF_ONLY') {
            isPublished = isOfficial;
        } else {
            isPublished = false; // NEEDS_REVIEW is always false
        }

        return {
            ...record,
            municipalitySlug: slug,
            isPublished,
            hasDomainWarning
        };
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(refinedData, null, 2));

    // Re-tally
    const okCount = refinedData.filter(r => r.linkStatus === 'OK').length;
    const pdfCount = refinedData.filter(r => r.linkStatus === 'PDF_ONLY').length;
    const nrCount = refinedData.filter(r => r.linkStatus === 'NEEDS_REVIEW').length;
    const publishedCount = refinedData.filter(r => r.isPublished === true).length;
    const warningCount = refinedData.filter(r => r.hasDomainWarning === true).length;

    console.log('\n=== Domain Refinement Output (v2) ===');
    console.log(`- 総件数: ${totalCount}`);
    console.log(`- OK件数: ${okCount}`);
    console.log(`- PDF_ONLY件数: ${pdfCount}`);
    console.log(`- NEEDS_REVIEW件数: ${nrCount}`);
    console.log(`- isPublished=true件数: ${publishedCount}`);
    console.log(`- Domain Warning件数: ${warningCount}`);
    console.log(`\nRefined file saved to: ${OUTPUT_FILE}`);
}

main();
