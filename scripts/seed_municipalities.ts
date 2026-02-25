
import { PrismaClient, Prisma } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

interface SubLink {
    name: string;
    url: string;
}

interface MunicipalityInput {
    prefecture: string;
    municipality: string;
    jisCode: string;
    municipalitySlug: string;
    url?: string;
    pdfUrl?: string;
    linkStatus?: string;
    linkType?: string;
    isPublished?: boolean;
    hasDomainWarning?: boolean;
    subLinks?: SubLink[];
    notes?: string;
}

const PREF_MAP: Record<string, { code: string; slug: string; region: string }> = {
    "北海道": { code: "01", slug: "hokkaido", region: "hokkaido" },
    "青森県": { code: "02", slug: "aomori", region: "tohoku" },
    "岩手県": { code: "03", slug: "iwate", region: "tohoku" },
    "宮城県": { code: "04", slug: "miyagi", region: "tohoku" },
    "秋田県": { code: "05", slug: "akita", region: "tohoku" },
    "山形県": { code: "06", slug: "yamagata", region: "tohoku" },
    "福島県": { code: "07", slug: "fukushima", region: "tohoku" },
    "茨城県": { code: "08", slug: "ibaraki", region: "kanto" },
    "栃木県": { code: "09", slug: "tochigi", region: "kanto" },
    "群馬県": { code: "10", slug: "gunma", region: "kanto" },
    "埼玉県": { code: "11", slug: "saitama", region: "kanto" },
    "千葉県": { code: "12", slug: "chiba", region: "kanto" },
    "東京都": { code: "13", slug: "tokyo", region: "kanto" },
    "神奈川県": { code: "14", slug: "kanagawa", region: "kanto" },
    "新潟県": { code: "15", slug: "niigata", region: "chubu" },
    "富山県": { code: "16", slug: "toyama", region: "chubu" },
    "石川県": { code: "17", slug: "ishikawa", region: "chubu" },
    "福井県": { code: "18", slug: "fukui", region: "chubu" },
    "山梨県": { code: "19", slug: "yamanashi", region: "chubu" },
    "長野県": { code: "20", slug: "nagano", region: "chubu" },
    "岐阜県": { code: "21", slug: "gifu", region: "chubu" },
    "静岡県": { code: "22", slug: "shizuoka", region: "chubu" },
    "愛知県": { code: "23", slug: "aichi", region: "chubu" },
    "三重県": { code: "24", slug: "mie", region: "kansai" },
    "滋賀県": { code: "25", slug: "shiga", region: "kansai" },
    "京都府": { code: "26", slug: "kyoto", region: "kansai" },
    "大阪府": { code: "27", slug: "osaka", region: "kansai" },
    "兵庫県": { code: "28", slug: "hyogo", region: "kansai" },
    "奈良県": { code: "29", slug: "nara", region: "kansai" },
    "和歌山県": { code: "30", slug: "wakayama", region: "kansai" },
    "鳥取県": { code: "31", slug: "tottori", region: "chugoku" },
    "島根県": { code: "32", slug: "shimane", region: "chugoku" },
    "岡山県": { code: "33", slug: "okayama", region: "chugoku" },
    "広島県": { code: "34", slug: "hiroshima", region: "chugoku" },
    "山口県": { code: "35", slug: "yamaguchi", region: "chugoku" },
    "徳島県": { code: "36", slug: "tokushima", region: "shikoku" },
    "香川県": { code: "37", slug: "kagawa", region: "shikoku" },
    "愛媛県": { code: "38", slug: "ehime", region: "shikoku" },
    "高知県": { code: "39", slug: "kochi", region: "shikoku" },
    "福岡県": { code: "40", slug: "fukuoka", region: "kyushu" },
    "佐賀県": { code: "41", slug: "saga", region: "kyushu" },
    "長崎県": { code: "42", slug: "nagasaki", region: "kyushu" },
    "熊本県": { code: "43", slug: "kumamoto", region: "kyushu" },
    "大分県": { code: "44", slug: "oita", region: "kyushu" },
    "宮崎県": { code: "45", slug: "miyazaki", region: "kyushu" },
    "鹿児島県": { code: "46", slug: "kagoshima", region: "kyushu" },
    "沖縄県": { code: "47", slug: "okinawa", region: "kyushu" }
};

async function main() {
    const isDryRun = process.argv.includes('--dry-run');
    const pendingFile = path.join(process.cwd(), 'data/imports/pending.json');

    if (!fs.existsSync(pendingFile)) {
        console.error(`Error: ${pendingFile} not found.`);
        process.exit(1);
    }

    const data: MunicipalityInput[] = JSON.parse(fs.readFileSync(pendingFile, 'utf-8'));
    console.log(`Starting bulk seed with ${data.length} records... (isDryRun: ${isDryRun})`);

    if (isDryRun) {
        console.log('DryRun mode: Checking records...');
        const existing = await prisma.municipality.findMany({ select: { jisCode: true } });
        const existingSet = new Set(existing.map(m => m.jisCode));
        let newCount = 0;
        let upCount = 0;
        data.forEach(d => {
            if (existingSet.has(d.jisCode)) upCount++;
            else newCount++;
        });
        console.log(`- Predicted New: ${newCount}`);
        console.log(`- Predicted Update: ${upCount}`);
        console.log('Dry-run completed.');
        return;
    }

    try {
        // Build values safe for PostgreSQL
        const valuesList: string[] = [];

        for (const d of data) {
            const prefMeta = PREF_MAP[d.prefecture];
            if (!prefMeta) continue;

            const id = uuidv4();
            const name = d.municipality.replace(/'/g, "''");
            const jis = d.jisCode.replace(/'/g, "''");
            const pCode = prefMeta.code;
            const pName = d.prefecture.replace(/'/g, "''");
            const pSlug = prefMeta.slug;
            const mSlug = (d.municipalitySlug || '').replace(/'/g, "''");
            const region = prefMeta.region;
            const url = d.url ? `'${d.url.replace(/'/g, "''")}'` : 'NULL';
            const pdf = d.pdfUrl ? `'${d.pdfUrl.replace(/'/g, "''")}'` : 'NULL';

            let status = d.linkStatus || 'UNKNOWN';
            if (status === 'UPDATED' || status === 'PDF_ONLY') status = 'OK';

            let type = d.linkType || 'GUIDE';
            if (type === 'E-APPLY') type = 'E_APPLY';

            let pub = d.isPublished ?? true;
            let warn = d.hasDomainWarning ?? false;
            let notes = d.notes || "";

            // --- Operational Rules v2.1 ---
            const targetUrl = d.url || d.pdfUrl || "";
            if (targetUrl.includes('powercms.hosting') || targetUrl.includes('site-station.net')) {
                pub = false;
                const msg = "ホスティングURLのため差し替え要";
                if (!notes.includes(msg)) notes = notes ? `${notes}\n${msg}` : msg;
            } else if (warn) {
                const msg = "ドメイン要確認（独自ドメインのため）";
                if (!notes.includes(msg)) notes = notes ? `${notes}\n${msg}` : msg;
            }

            const notesVal = notes ? `'${notes.replace(/'/g, "''")}'` : 'NULL';
            const subLinks = d.subLinks ? `'${JSON.stringify(d.subLinks).replace(/'/g, "''")}'::jsonb` : 'NULL';

            valuesList.push(`(
          '${id}', '${name}', '${jis}', '${pCode}', '${pName}', '${pSlug}', '${mSlug}', '${region}',
          ${url}, ${pdf}, '${status}', '${type}', ${pub}, ${warn}, ${notesVal}, ${subLinks}, NOW(), NOW()
        )`);
        }

        if (valuesList.length === 0) {
            console.log('No valid records to seed.');
            return;
        }

        const sql = `
        INSERT INTO municipalities (
            id, name, jis_code, prefecture_code, prefecture_name, prefecture_slug, municipality_slug, region,
            url, pdf_url, link_status, link_type, is_published, has_domain_warning, notes, sub_links, created_at, updated_at
        )
        VALUES ${valuesList.join(',')}
        ON CONFLICT (jis_code) DO UPDATE SET
            name = EXCLUDED.name,
            prefecture_code = EXCLUDED.prefecture_code,
            prefecture_name = EXCLUDED.prefecture_name,
            prefecture_slug = EXCLUDED.prefecture_slug,
            municipality_slug = EXCLUDED.municipality_slug,
            region = EXCLUDED.region,
            url = EXCLUDED.url,
            pdf_url = EXCLUDED.pdf_url,
            link_status = EXCLUDED.link_status,
            link_type = EXCLUDED.link_type,
            is_published = EXCLUDED.is_published,
            has_domain_warning = EXCLUDED.has_domain_warning,
            notes = EXCLUDED.notes,
            sub_links = EXCLUDED.sub_links,
            updated_at = NOW();
    `;

        console.log('Executing bulk upsert query...');
        await prisma.$executeRawUnsafe(sql);
        console.log('Seed completed successfully.');

    } catch (err) {
        console.error('Bulk seed failed.', err);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
