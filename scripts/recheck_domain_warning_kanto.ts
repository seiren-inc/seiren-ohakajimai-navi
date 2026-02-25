
import fs from 'fs';
import path from 'path';

const PENDING_JSON_PATH = path.join(process.cwd(), 'data/imports/pending.json');
const REPORT_PATH = path.join(process.cwd(), 'data/imports/domain_recheck_report.md');

interface MunicipalityInput {
    prefecture: string;
    municipality: string;
    jisCode: string;
    municipalitySlug: string;
    url: string | null;
    pdfUrl: string | null;
    linkStatus: string;
    isPublished: boolean;
    hasDomainWarning: boolean;
    linkType?: string;
    notes?: string;
}

const PREFECTURES_EN = [
    'hokkaido', 'aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima',
    'ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa',
    'niigata', 'toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano',
    'gifu', 'shizuoka', 'aichi', 'mie', 'shiga', 'kyoto', 'osaka', 'hyogo',
    'nara', 'wakayama', 'tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi',
    'tokushima', 'kagawa', 'ehime', 'kochi', 'fukuoka', 'saga', 'nagasaki',
    'kumamoto', 'oita', 'miyazaki', 'kagoshima', 'okinawa'
];

const REGIONAL_TLDS = PREFECTURES_EN.map(p => `.${p}.jp`).concat(['.pref.jp']);

const KEYWORDS = ['city', 'town', 'village', 'vill', 'pref'];

function determineLinkType(url: string | null, pdfUrl: string | null, domain: string): string {
    if (domain.endsWith('elg-front.jp')) return "E-APPLY";
    if (domain.endsWith('g-reiki.net')) return "REGULATION";
    if (pdfUrl && !url) return "PDF";
    if (url && !pdfUrl) return "GUIDE";
    return "GUIDE"; // Default
}

const PORTAL_DOMAINS = ['gaas-port.jp', 'webtown.nagayo.jp', 'official.shinkamigoto.net', 'elg-front.jp', 'g-reiki.net'];

function checkDomainWarningV2_1(urlStr: string | null, slug: string): boolean {
    if (!urlStr) return false;
    try {
        const url = new URL(urlStr);
        const domain = url.hostname.toLowerCase();

        // 1. Explicit Official (.lg.jp / .go.jp)
        if (domain.endsWith('.lg.jp') || domain.endsWith('.go.jp')) return false;

        // 2. Official Services / Portals
        if (PORTAL_DOMAINS.some(d => domain.endsWith(d))) return false;

        // 3. Regional Domains + Keywords
        const hasRegionalTLD = REGIONAL_TLDS.some(tld => domain.endsWith(tld));
        const hasKeyword = KEYWORDS.some(k => domain.includes(k));

        // Pattern: city.xxx.hokkaido.jp or www.town.xxx.jp
        if (hasRegionalTLD && hasKeyword) return false;

        // 4. Slug Match (Strict & Flexible)
        const normalizedDomain = domain.replace(/-/g, '').replace(/\./g, '');
        const normalizedSlug = slug.replace(/-/g, '');
        const slugPrefix = slug.split('-')[0]; // e.g. "sapporo"

        if (domain.endsWith('.jp') || domain.endsWith('.net') || domain.endsWith('.com')) {
            if (normalizedDomain.includes(normalizedSlug) || (slugPrefix.length > 3 && normalizedDomain.includes(slugPrefix))) {
                if (hasKeyword || domain.includes(slugPrefix)) return false;
            }
        }

        // 5. Mixed patterns (e.g. city.xxx.jp or city-xxx.jp)
        if (KEYWORDS.some(k => domain.startsWith(k + '.') || domain.includes('.' + k + '.') || domain.startsWith(k + '-'))) return false;

        // 6. Special Patterns
        if (domain.includes('saitama-city.jp') || domain.includes('city-yuzawa.jp')) return false;

        // 7. Explicit Hostings / Viewers (Still Warning but classified)
        if (domain.includes('officeapps.live.com')) return false;
        if (domain.includes('powercms.hosting') || domain.includes('site-station.net')) return true;

        // Default: Warn if not matching above
        return true;
    } catch (e) {
        return true;
    }
}

function main() {
    console.log('--- Domain Recheck v2.1 starting ---');
    if (!fs.existsSync(PENDING_JSON_PATH)) {
        console.error('pending.json not found');
        return;
    }

    const data: MunicipalityInput[] = JSON.parse(fs.readFileSync(PENDING_JSON_PATH, 'utf-8'));
    const beforeWarningCount = data.filter(r => r.hasDomainWarning).length;

    const reikiList: MunicipalityInput[] = [];
    const remainingWarnings: MunicipalityInput[] = [];
    const linkTypeCounts: Record<string, number> = { GUIDE: 0, PDF: 0, "E-APPLY": 0, REGULATION: 0, OTHER: 0 };

    const updatedData = data.map(r => {
        const targetUrl = r.url || r.pdfUrl;
        let domain = "";
        try { if (targetUrl) domain = new URL(targetUrl).hostname.toLowerCase(); } catch (e) { }

        const newWarning = checkDomainWarningV2_1(targetUrl, r.municipalitySlug);
        const type = determineLinkType(r.url, r.pdfUrl, domain);

        linkTypeCounts[type] = (linkTypeCounts[type] || 0) + 1;

        if (domain.endsWith('g-reiki.net')) reikiList.push(r);
        if (newWarning) remainingWarnings.push(r);

        return {
            ...r,
            hasDomainWarning: newWarning,
            linkType: type
        };
    });

    const afterWarningCount = remainingWarnings.length;

    // Save
    fs.writeFileSync(PENDING_JSON_PATH, JSON.stringify(updatedData, null, 2));

    // Report
    let report = `# ドメイン再判定 (v2.1) 監査レポート\n\n`;
    report += `- **警告件数の変化**: ${beforeWarningCount} 件 → ${afterWarningCount} 件\n`;
    report += `- **解消された誤検知**: ${beforeWarningCount - afterWarningCount} 件\n\n`;

    report += `## linkType 別件数\n`;
    Object.entries(linkTypeCounts).forEach(([t, c]) => {
        report += `- ${t}: ${c} 件\n`;
    });

    report += `\n## 警告が維持されたドメイン (解消されなかったもの)\n`;
    if (remainingWarnings.length === 0) {
        report += `なし\n`;
    } else {
        report += `| 自治体 | URL | ドメイン |\n| :--- | :--- | :--- |\n`;
        remainingWarnings.slice(0, 50).forEach(r => {
            const url = r.url || r.pdfUrl;
            let d = "";
            try { d = new URL(url!).hostname; } catch (e) { }
            report += `| ${r.prefecture} ${r.municipality} | ${url} | ${d} |\n`;
        });
        if (remainingWarnings.length > 50) report += `| ... | ... | 他 ${remainingWarnings.length - 50} 件 |\n`;
    }

    report += `\n## g-reiki.net (例規集) リンク一覧\n`;
    if (reikiList.length === 0) {
        report += `なし\n`;
    } else {
        reikiList.slice(0, 50).forEach(r => {
            report += `- ${r.prefecture} ${r.municipality} (${r.url || r.pdfUrl})\n`;
        });
        if (reikiList.length > 50) report += `- 他 ${reikiList.length - 50} 件\n`;
    }

    fs.writeFileSync(REPORT_PATH, report);
    console.log(`Recheck completed. ${beforeWarningCount} -> ${afterWarningCount}`);
    console.log(`Report: ${REPORT_PATH}`);
}

main();
