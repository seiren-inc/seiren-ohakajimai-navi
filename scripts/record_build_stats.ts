/**
 * T4-04: build所要時間と生成物数を記録し退行検知の基準を作る
 *
 * 実行方法: npm run build:stats
 *
 * 処理内容:
 * 1. npm run build を実行して所要時間を計測
 * 2. .next 配下のHTMLファイル数をカウント
 * 3. docs/build_stats.log に追記
 * 4. 前回比較で時間が+20%超の場合はWARNINGを出力
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, "..");
const LOG_FILE = path.join(ROOT, "docs", "build_stats.log");
const NEXT_DIR = path.join(ROOT, ".next");

interface BuildStats {
  timestamp: string;
  durationMs: number;
  htmlCount: number;
}

function countHtmlFiles(dir: string): number {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  const walk = (current: string) => {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(current, e.name);
      if (e.isDirectory()) {
        walk(full);
      } else if (e.name.endsWith(".html")) {
        count++;
      }
    }
  };
  walk(dir);
  return count;
}

function readLastStats(): BuildStats | null {
  if (!fs.existsSync(LOG_FILE)) return null;
  const lines = fs.readFileSync(LOG_FILE, "utf-8").trim().split("\n");
  const last = lines[lines.length - 1];
  if (!last) return null;
  try {
    return JSON.parse(last) as BuildStats;
  } catch {
    return null;
  }
}

function appendStats(stats: BuildStats): void {
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  fs.appendFileSync(LOG_FILE, JSON.stringify(stats) + "\n", "utf-8");
}

function main() {
  console.log("🏗️  [T4-04] build開始...");

  const start = Date.now();
  try {
    execSync("npm run build", { stdio: "inherit", cwd: ROOT });
  } catch {
    console.error("❌ buildに失敗しました");
    process.exit(1);
  }
  const durationMs = Date.now() - start;

  const htmlCount = countHtmlFiles(NEXT_DIR);
  const stats: BuildStats = {
    timestamp: new Date().toISOString(),
    durationMs,
    htmlCount,
  };

  // 前回比較
  const last = readLastStats();
  if (last) {
    const ratio = durationMs / last.durationMs;
    if (ratio > 1.2) {
      console.warn(
        `⚠️  [T4-04] build時間が前回比 ${((ratio - 1) * 100).toFixed(0)}% 増加しています`
      );
      console.warn(
        `   前回: ${(last.durationMs / 1000).toFixed(1)}s → 今回: ${(durationMs / 1000).toFixed(1)}s`
      );
    }
    if (htmlCount !== last.htmlCount) {
      console.warn(
        `⚠️  [T4-04] 生成HTMLファイル数が変化: ${last.htmlCount} → ${htmlCount}`
      );
    }
  }

  appendStats(stats);

  console.log(`\n✅ [T4-04] build完了`);
  console.log(`   所要時間: ${(durationMs / 1000).toFixed(1)}s`);
  console.log(`   生成HTMLファイル数: ${htmlCount}件`);
  console.log(`   ログ保存先: docs/build_stats.log`);
}

main();
