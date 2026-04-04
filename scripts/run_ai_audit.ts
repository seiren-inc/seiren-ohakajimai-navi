/**
 * T6-01〜T6-07: 内部AI監査バッチ（ローカル手動実行用）
 *
 * 実行: npm run audit:ai
 *
 * 目的:
 * - 重大違反（PDF_ONLY見逃し、件数1737以外のズレ、slug重複）の検知・即時終了
 * - Vercel AI SDKを用いた、自治体データのURL/関連項目の論理的矛盾の「検知」と「要約」
 * - 生成AIに新しい事実を作らせず、DBにあるデータの状態チェックのみを行わせる
 * - 修正候補はdocs/ai_audit_results.logに出力
 *
 * 自動実行（Vercel Cron）は src/app/api/audit/route.ts を参照。
 * スキーマ・プロンプトの共有ロジックは src/lib/ai-audit.ts を参照。
 */
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { prisma } from "../src/lib/prisma";
import { AuditResultSchema, buildAuditPrompt } from "../src/lib/ai-audit";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// プロジェクト直下の.envを読み込む
dotenv.config({ path: path.join(__dirname, "../.env") });

const LOG_FILE = path.join(__dirname, "../docs/ai_audit_results.log");

const TOTAL_MUNICIPALITIES = 1737;

async function runAudit() {
  console.log("🔍 [T6-00] 内部AI監査バッチを開始します...");

  // 1. 重大違反の事前チェック (T6-06 完了条件)
  console.log("👉 [1/3] 重大違反のチェック（件数・Slug重複）...");
  const count = await prisma.municipality.count();
  if (count !== TOTAL_MUNICIPALITIES) {
    console.error(`❌ [重大違反] 自治体件数が ${TOTAL_MUNICIPALITIES} ではありません（現在: ${count}）`);
    process.exit(1);
  }

  const allSlugs = await prisma.municipality.findMany({
    select: { id: true, prefectureSlug: true, municipalitySlug: true },
  });
  const slugPairs = allSlugs.map((s) => `${s.prefectureSlug}/${s.municipalitySlug}`);
  if (slugPairs.length !== new Set(slugPairs).size) {
    console.error("❌ [重大違反] Prefecture/MunicipalityのSlug組み合わせに重複が存在します。");
    process.exit(1);
  }
  console.log("✅ 重大違反（件数・Slug重複）ゼロを確認");

  // 2. ロジックによる PDF_ONLY 見逃し検知
  console.log("👉 [2/3] ロジックによる重大違反 (PDF_ONLY漏れ) 検知...");
  const pdfOnlyViolations = await prisma.municipality.findMany({
    where: {
      url: { endsWith: ".pdf", mode: "insensitive" },
      linkStatus: { not: "PDF_ONLY" },
    },
    select: { jisCode: true, name: true, url: true, linkStatus: true },
  });

  if (pdfOnlyViolations.length > 0) {
    console.error("❌ [重大違反] urlが.pdfで終わるがlinkStatusがPDF_ONLYでないレコードが存在します。");
    console.error(pdfOnlyViolations);
    process.exit(1);
  }
  console.log("✅ PDF_ONLYの明白な見逃しゼロを確認");

  // 3. AI による論理矛盾チェック
  console.log("👉 [3/3] AIによる論理矛盾の監査 (T6-01〜05)...");

  const targets = await prisma.municipality.findMany({
    where: { linkStatus: { in: ["UNKNOWN", "NEEDS_REVIEW", "OK"] } },
    take: 50,
    select: {
      jisCode: true,
      name: true,
      url: true,
      pdfUrl: true,
      linkStatus: true,
      hasDomainWarning: true,
    },
  });

  if (targets.length === 0) {
    console.log("監査対象のレコードがありません。");
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    console.warn("⚠️ [警告] OPENAI_API_KEY が設定されていないため、AIによる論理矛盾監査をスキップします。");
    console.warn("  (T6-01〜05の実装自体は完了していますが、実行にはAPIキーが必要です)");
    return;
  }

  try {
    // 共有モジュールのプロンプトビルダーとスキーマを使用 (T6-02, T6-03)
    const { object } = await generateObject({
      model: openai("gpt-4o-2024-08-06"),
      schema: AuditResultSchema,
      prompt: buildAuditPrompt(targets),
      temperature: 0,
    });

    // 結果の保存 (T6-04, T6-05)
    const logEntry = {
      timestamp: new Date().toISOString(),
      targetCount: targets.length,
      auditedKeys: targets.map((t) => t.jisCode),
      results: object.violations,
    };

    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + "\n", "utf-8");

    console.log(`✅ AI監査が完了しました。検知された異常: ${object.violations.length}件`);
    if (object.violations.length > 0) {
      console.log("\n--- 検知された異常一覧 ---");
      object.violations.forEach((v) => {
        console.log(`[${v.jisCode}] ${v.municipalityName}: ${v.issueType}`);
        console.log(`  理由: ${v.description}`);
        console.log(`  推奨: ${v.suggestedAction}`);
      });
    }
    console.log(`\n📄 詳細ログを ${LOG_FILE} に保存しました。`);
  } catch (err) {
    console.error("❌ AI監査中にエラーが発生しました:", err);
    process.exit(1);
  }
}

runAudit().finally(() => prisma.$disconnect());
