/**
 * T6-01〜T6-07: 内部AI監査バッチ
 * 
 * 実行: npm run audit:ai
 * 
 * 目的:
 * - 重大違反（PDF_ONLY見逃し、件数1737以外のズレ、slug重複）の検知・即時終了
 * - Vercel AI SDKを用いた、自治体データのURL/関連項目の論理的矛盾の「検知」と「要約」
 * - 生成AIに新しい事実を作らせず、DBにあるデータの状態チェックのみを行わせる
 * - 修正候補はdocs/ai_audit_results.logに出力
 */
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { prisma } from "../src/lib/prisma";
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

// --- Zod Schema for AI Output ---
const AuditResultSchema = z.object({
  violations: z.array(
    z.object({
      jisCode: z.string(),
      municipalityName: z.string(),
      issueType: z.enum(["URL_MISMATCH", "LINK_STATUS_CONTRADICTION", "SUSPICIOUS_DOMAIN", "OTHER"]),
      description: z.string().describe("矛盾や異常の具体的な理由（事実のみ）"),
      suggestedAction: z.string().describe("T6-03: 修正候補（例: 'linkStatusをPDF_ONLYに変更する', 'pdfUrlとurlを入れ替える'）"),
    })
  ).describe("異常が検知された自治体のリスト。異常がない場合は空配列。"),
});

async function runAudit() {
  console.log("🔍 [T6-00] 内部AI監査バッチを開始します...");

  // 1. 重大違反の事前チェック (T6-06 完了条件)
  console.log("👉 [1/3] 重大違反のチェック（件数・Slug重複）...");
  const count = await prisma.municipality.count();
  if (count !== TOTAL_MUNICIPALITIES) {
    console.error(`❌ [重大違反] 自治体件数が ${TOTAL_MUNICIPALITIES} ではありません（現在: ${count}）`);
    process.exit(1);
  }

  const allSlugs = await prisma.municipality.findMany({ select: { id: true, prefectureSlug: true, municipalitySlug: true }});
  const slugPairs = allSlugs.map(s => `${s.prefectureSlug}/${s.municipalitySlug}`);
  const uniqueSlugs = new Set(slugPairs);
  if (slugPairs.length !== uniqueSlugs.size) {
    console.error("❌ [重大違反] Prefecture/MunicipalityのSlug組み合わせに重複が存在します。");
    process.exit(1);
  }
  console.log("✅ 重大違反（件数・Slug重複）ゼロを確認");

  // 2. データの取得 (T6-02: DBに限定)
  // 全件は多すぎるため、今回は needs_review 状態のものや、最近更新されたものを対象とする。
  // T6-06: PDF_ONLY見逃しの厳格なチェックは全件に対してロジックで行う方が確実だが、
  // ここではAIに "urlが .pdf で終わるのに PDF_ONLY でないもの" を探させるデモとして機能させる。
  console.log("👉 [2/3] ロジックによる重大違反 (PDF_ONLY漏れ) 検知...");
  const pdfOnlyViolations = await prisma.municipality.findMany({
    where: {
      url: { endsWith: ".pdf", mode: "insensitive" },
      linkStatus: { not: "PDF_ONLY" }
    },
    select: { jisCode: true, name: true, url: true, linkStatus: true }
  });

  if (pdfOnlyViolations.length > 0) {
    console.error("❌ [重大違反] urlが.pdfで終わるがlinkStatusがPDF_ONLYでないレコードが存在します。");
    console.error(pdfOnlyViolations);
    process.exit(1);
  }
  console.log("✅ PDF_ONLYの明白な見逃しゼロを確認");

  // --- AIによる論理矛盾チェック ---
  // APIコスト/時間の都合上、条件を絞ってサンプリング（運用で調整可能）
  console.log("👉 [3/3] AIによる論理矛盾の監査 (T6-01〜05)...");
  
  const targets = await prisma.municipality.findMany({
    where: { linkStatus: { in: ["UNKNOWN", "NEEDS_REVIEW", "OK"] } },
    take: 50, // サンプルとして50件
    select: { jisCode: true, name: true, url: true, pdfUrl: true, linkStatus: true, hasDomainWarning: true }
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

  const promptStr = `
あなたはデータベースの監査AIです。
以下の自治体レコード（JSON）を確認し、論理的な矛盾や異常を検知してください。
新しい情報やURLを「生成」することは禁止です。与えられたデータ内の矛盾のみを指摘してください（T6-02, T6-03）。

【主なチェック観点】
1. url と pdfUrl に同じ値が入っていないか。
2. linkStatusが "OK" なのに、url が空でないか。
3. url がPDFファイルらしきもの (.pdf 等) を指しているのに、pdfUrl に入っていない（またはlinkStatusがPDF_ONLYでない）など、疑わしい状態はないか。
4. hasDomainWarning が true なのに linkStatus が "OK" になっているなどの矛盾。

【データ】
${JSON.stringify(targets, null, 2)}
`;

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-2024-08-06"),
      schema: AuditResultSchema,
      prompt: promptStr,
      temperature: 0,
    });

    // 3. 結果の保存 (T6-04, T6-05)
    const logEntry = {
      timestamp: new Date().toISOString(),
      targetCount: targets.length,
      auditedKeys: targets.map(t => t.jisCode), // T6-05: 根拠として参照したキー一覧
      results: object.violations
    };

    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + "\n", "utf-8");

    console.log(`✅ AI監査が完了しました。検知された異常: ${object.violations.length}件`);
    if (object.violations.length > 0) {
      console.log("\n--- 検知された異常一覧 ---");
      object.violations.forEach((v: any) => {
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

runAudit();
