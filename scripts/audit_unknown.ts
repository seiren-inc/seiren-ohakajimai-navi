
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import pLimit from 'p-limit';

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

const ALLOWED_DOMAIN_PATTERNS = [
    '.lg.jp',
    '.pref.',
    '.city.',
    '.town.',
    '.vill.',
    '.gov',
    'gaas-port.jp'
];

const TIMEOUT_MS = 10000;
const CONCURRENCY = 10;
const LIMIT = pLimit(CONCURRENCY);

const PENDING_FILE = path.join(process.cwd(), 'data/imports/pending.json');
const OUTPUT_FILE = path.join(process.cwd(), 'data/imports/pending_audited.json');

async function checkLink(url: string): Promise<{ success: boolean; finalUrl?: string }> {
    try {
        // Try HEAD request first for efficiency
        const headRes = await axios.head(url, {
            timeout: TIMEOUT_MS,
            maxRedirects: 5,
            validateStatus: (status) => status >= 200 && status < 303,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        return { success: true, finalUrl: headRes.request?.res?.responseUrl || url };
    } catch (error: any) {
        // Fallback to GET if HEAD is not supported (many gov sites block HEAD)
        try {
            const getRes = await axios.get(url, {
                timeout: TIMEOUT_MS,
                maxRedirects: 5,
                validateStatus: (status) => status >= 200 && status < 300,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            return { success: true, finalUrl: getRes.request?.res?.responseUrl || url };
        } catch (getErr: any) {
            return { success: false };
        }
    }
}

function verifyDomain(urlStr: string): boolean {
    try {
        const url = new URL(urlStr);
        const hostname = url.hostname;
        return ALLOWED_DOMAIN_PATTERNS.some(pattern => hostname.includes(pattern));
    } catch {
        return false;
    }
}

async function auditRecord(record: Municipality): Promise<Municipality> {
    // Only audit UNKNOWN or missing status
    if (record.linkStatus && record.linkStatus !== 'UNKNOWN') {
        return record;
    }

    const targetUrl = record.url || record.pdfUrl;
    if (!targetUrl) {
        return {
            ...record,
            linkStatus: 'NEEDS_REVIEW',
            isPublished: false
        };
    }

    const { success, finalUrl } = await checkLink(targetUrl);
    const isAllowedDomain = verifyDomain(targetUrl);

    let linkStatus = 'NEEDS_REVIEW';
    if (success) {
        linkStatus = record.url ? 'OK' : 'PDF_ONLY';
    }

    // Final published status logic:
    // OK/PDF_ONLY AND HTTP Success AND Allowed Domain -> true
    const isPublished = (linkStatus === 'OK' || linkStatus === 'PDF_ONLY') && success && isAllowedDomain;

    return {
        ...record,
        linkStatus,
        isPublished,
        hasDomainWarning: !isAllowedDomain
    };
}

async function main() {
    if (!fs.existsSync(PENDING_FILE)) {
        console.error(`File not found: ${PENDING_FILE}`);
        return;
    }

    const data: Municipality[] = JSON.parse(fs.readFileSync(PENDING_FILE, 'utf-8'));
    const totalCount = data.length;

    console.log(`Auditing ${totalCount} records (Concurrency: ${CONCURRENCY})...`);

    const auditedData = await Promise.all(
        data.map(record => LIMIT(() => auditRecord(record)))
    );

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(auditedData, null, 2));

    // Summary counts
    const okCount = auditedData.filter(r => r.linkStatus === 'OK').length;
    const pdfCount = auditedData.filter(r => r.linkStatus === 'PDF_ONLY').length;
    const nrCount = auditedData.filter(r => r.linkStatus === 'NEEDS_REVIEW').length;
    const publishedCount = auditedData.filter(r => r.isPublished === true).length;

    console.log('\n=== Audit Output ===');
    console.log(`- 総件数: ${totalCount}`);
    console.log(`- OK件数: ${okCount}`);
    console.log(`- PDF_ONLY件数: ${pdfCount}`);
    console.log(`- NEEDS_REVIEW件数: ${nrCount}`);
    console.log(`- isPublished=true件数: ${publishedCount}`);
    console.log(`\nAudited file saved to: ${OUTPUT_FILE}`);
}

main().catch(console.error);
