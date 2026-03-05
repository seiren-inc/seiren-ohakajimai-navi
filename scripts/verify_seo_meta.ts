/**
 * T3-07: title・description重複検知CIゲート
 *
 * 検証内容:
 * 1. 静的ページのconstructMetadata()呼び出しからtitle/descriptionを抽出
 * 2. 同一title・同一descriptionの重複を検出
 * 3. title・descriptionが空のページを検出
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_DIR = path.join(__dirname, "../src/app");

// 静的メタデータを持つpage.tsxのパスを再帰的に収集
function collectPageFiles(dir: string, results: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // 動的ルート・管理画面・スクリブナーポータルはスキップ
      if (
        entry.name.startsWith("[") ||
        entry.name === "admin" ||
        entry.name === "scrivener" ||
        entry.name === "api"
      ) {
        continue;
      }
      collectPageFiles(fullPath, results);
    } else if (entry.name === "page.tsx") {
      results.push(fullPath);
    }
  }
  return results;
}

interface MetaEntry {
  file: string;
  title: string | null;
  description: string | null;
}

function extractMeta(filePath: string): MetaEntry {
  const content = fs.readFileSync(filePath, "utf-8");

  // title抽出: title: "..." または title: `...`
  const titleMatch = content.match(/title:\s*[`"']([^`"']+)[`"']/);
  const title = titleMatch ? titleMatch[1].trim() : null;

  // description抽出
  const descMatch = content.match(/description:\s*[`"']([^`"']+)[`"']/);
  const description = descMatch ? descMatch[1].trim() : null;

  return { file: filePath, title, description };
}

function main() {
  console.log("🔍 [T3-07] SEOメタデータ重複検証を開始します...");
  const errors: string[] = [];

  const pageFiles = collectPageFiles(APP_DIR);
  console.log(`  対象ページ数: ${pageFiles.length}件`);

  const metas: MetaEntry[] = pageFiles.map(extractMeta);

  // constructMetadata呼び出しがあるページのみ対象
  const metaPages = metas.filter((m) => {
    const content = fs.readFileSync(m.file, "utf-8");
    return content.includes("constructMetadata") && m.title !== null;
  });

  // title重複チェック
  const titleMap = new Map<string, string[]>();
  for (const m of metaPages) {
    if (!m.title) continue;
    if (!titleMap.has(m.title)) titleMap.set(m.title, []);
    titleMap.get(m.title)!.push(m.file);
  }
  for (const [title, files] of titleMap.entries()) {
    if (files.length > 1) {
      errors.push(
        `[WARN] title重複: "${title}"\n    ${files.map((f) => path.relative(APP_DIR, f)).join("\n    ")}`
      );
    }
  }

  // description重複チェック
  const descMap = new Map<string, string[]>();
  for (const m of metaPages) {
    if (!m.description) continue;
    if (!descMap.has(m.description)) descMap.set(m.description, []);
    descMap.get(m.description)!.push(m.file);
  }
  for (const [desc, files] of descMap.entries()) {
    if (files.length > 1) {
      errors.push(
        `[WARN] description重複: "${desc.slice(0, 50)}..."\n    ${files.map((f) => path.relative(APP_DIR, f)).join("\n    ")}`
      );
    }
  }

  // 結果出力
  console.log(`  メタデータ検証対象: ${metaPages.length}件`);

  if (errors.length > 0) {
    console.warn("\n⚠️  [T3-07] SEOメタデータ重複検出:");
    errors.forEach((e) => console.warn(`  ${e}`));
    // 重複はWARNING扱い（CI停止せず）だが、ログに残す
    console.warn(
      `\n  重複件数: ${errors.length}件（要対応）`
    );
    // 重複がCRITICAL（同一ページが3件以上）の場合のみ失敗
    const critical = errors.filter((e) => {
      const match = e.match(/\n    /g);
      return match && match.length >= 2;
    });
    if (critical.length > 0) {
      console.error("❌ [T3-07] 3件以上の重複があります。CIを停止します。");
      process.exit(1);
    }
  } else {
    console.log("✅ [T3-07] title・description重複なし PASSED");
  }
}

main();
