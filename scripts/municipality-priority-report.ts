/**
 * 市区町村ページの優先実装リスト（スコア付きMarkdown）を生成する。
 *
 * 実行: npm run municipality-priority-report
 * 前提: DATABASE_URL が効く環境で Prisma が DB に接続できること。
 *
 * 出力: data/imports/municipality_priority_report.md
 */

import { LinkStatus, PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "..");
const REPORT_PATH = path.join(ROOT, "data", "imports", "municipality_priority_report.md");

const prisma = new PrismaClient();

/** 検索ボリューム・都市圏の粗いプロキシ（需要側） */
const TIER_A = new Set<string>([
    "tokyo",
    "kanagawa",
    "osaka",
    "aichi",
    "hyogo",
    "fukuoka",
    "saitama",
    "chiba",
]);

const TIER_B = new Set<string>([
    "hokkaido",
    "miyagi",
    "niigata",
    "nagano",
    "shizuoka",
    "hiroshima",
    "kyoto",
]);

function demandBonus(prefectureSlug: string): number {
    const s = prefectureSlug.toLowerCase();
    if (TIER_A.has(s)) return 28;
    if (TIER_B.has(s)) return 12;
    return 4;
}

function linkStatusScore(status: LinkStatus): number {
    switch (status) {
        case "OK":
            return 42;
        case "PDF_ONLY":
            return 32;
        case "NEEDS_REVIEW":
            return 22;
        case "UNKNOWN":
            return 12;
        case "BROKEN":
            return 0;
        default: {
            const _exhaustive: never = status;
            return _exhaustive;
        }
    }
}

function composeScore(row: {
    prefectureSlug: string;
    linkStatus: LinkStatus;
    dataQualityLevel: number;
    hasDomainWarning: boolean;
    url: string | null;
    seoDescription: string | null;
}): number {
    let score = demandBonus(row.prefectureSlug);
    score += linkStatusScore(row.linkStatus);
    score += row.dataQualityLevel * 6;
    if (row.url) score += 8;
    if (row.seoDescription && row.seoDescription.trim().length > 0) score += 6;
    if (row.hasDomainWarning) score -= 28;
    return score;
}

function iso(d: Date): string {
    return d.toISOString().slice(0, 10);
}

async function main(): Promise<void> {
    const rows = await prisma.municipality.findMany({
        where: { isPublished: true },
        select: {
            name: true,
            prefectureName: true,
            prefectureSlug: true,
            municipalitySlug: true,
            jisCode: true,
            linkStatus: true,
            dataQualityLevel: true,
            hasDomainWarning: true,
            url: true,
            seoDescription: true,
            notes: true,
            updatedAt: true,
        },
    });

    const scored = rows
        .map((r) => ({
            ...r,
            priorityScore: composeScore({
                prefectureSlug: r.prefectureSlug,
                linkStatus: r.linkStatus,
                dataQualityLevel: r.dataQualityLevel,
                hasDomainWarning: r.hasDomainWarning,
                url: r.url,
                seoDescription: r.seoDescription,
            }),
        }))
        .sort((a, b) => {
            if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
            const p = a.prefectureSlug.localeCompare(b.prefectureSlug, "ja");
            if (p !== 0) return p;
            return a.name.localeCompare(b.name, "ja");
        });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ohakajimai-navi.jp";

    const lines: string[] = [
        `# 市区町村ページ優先度レポート`,
        ``,
        `生成日: ${iso(new Date())}（DB接続環境でのスナップショット）`,
        `件数: **${scored.length}**（isPublished=true）`,
        ``,
        `スコアは需要プロキシ（都道府県ティア）・linkStatus・dataQualityLevel・URL/説明文の有無・ドメイン警告を合成したヒューリスティックです。**最終優先順位はGSC実績と事業要件で調整すること。**`,
        ``,
        `| 順位 | スコア | 自治体 | 都道府県 | パス | linkStatus | DQL | 警告 |`,
        `| --- | ---: | --- | --- | --- | --- | --- | --- |`,
    ];

    scored.forEach((r, idx) => {
        const pathname = `/kaissou/${r.prefectureSlug}/${r.municipalitySlug}`;
        const pathCell = `\`${pathname}\``;
        const warnCell = r.hasDomainWarning ? "あり" : "—";
        const esc = (s: string) => s.replace(/\|/g, "\\|");
        lines.push(
            `| ${idx + 1} | ${r.priorityScore} | ${esc(r.name)} | ${esc(
                r.prefectureName,
            )} | ${pathCell} | ${r.linkStatus} | ${r.dataQualityLevel} | ${warnCell} |`,
        );
    });

    lines.push("", "## 詳細URL（確認用）", "");
    scored.slice(0, 120).forEach((r, idx) => {
        const pathname = `/kaissou/${r.prefectureSlug}/${r.municipalitySlug}`;
        lines.push(`${idx + 1}. ${baseUrl}${pathname}`);
    });
    if (scored.length > 120) {
        lines.push("", `_（詳細リストは上位120件。全件はテーブルを参照）_`);
    }

    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    fs.writeFileSync(REPORT_PATH, `${lines.join("\n")}\n`, "utf8");
    console.info(` wrote ${REPORT_PATH}`);
}

main()
    .catch((err) => {
        console.error(err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
