import { test, expect } from "@playwright/test";

/**
 * T4-05: 大量DOMページのE2Eタイムアウト検知
 *
 * 対象ページ:
 * - /kaissou  : 47都道府県リンク一覧
 * - /gyoseishoshi : 行政書士カード一覧 + 都道府県リンク
 *
 * 検証内容:
 * - 各ページが10秒以内にDOMContentLoaded完了すること
 * - h1が表示されること（レンダリング正常確認）
 * - ページにJSエラーが発生していないこと
 */

const PAGES = [
  {
    path: "/kaissou",
    name: "改葬手続き一覧",
    headingText: "全国の改葬手続き情報",
  },
  {
    path: "/gyoseishoshi",
    name: "行政書士マッチング",
    headingText: "改葬許可申請",
  },
];

const LOAD_TIMEOUT_MS = 10_000;

test.describe("大量DOMページ 性能・フリーズ検知", () => {
  for (const { path: pagePath, name, headingText } of PAGES) {
    test(`[T4-05] ${name} (${pagePath}) が${LOAD_TIMEOUT_MS / 1000}秒以内に表示完了すること`, async ({
      page,
    }) => {
      const jsErrors: string[] = [];

      // JSエラーを収集
      page.on("pageerror", (err) => {
        jsErrors.push(err.message);
      });

      // DOMContentLoaded完了を計測
      const start = Date.now();
      await page.goto(pagePath, {
        waitUntil: "domcontentloaded",
        timeout: LOAD_TIMEOUT_MS,
      });
      const elapsed = Date.now() - start;

      console.log(`  ${name}: DOMContentLoaded ${elapsed}ms`);

      // h1が表示されること
      const heading = page.locator("h1").first();
      await expect(heading).toBeVisible({ timeout: 5000 });
      await expect(heading).toContainText(headingText);

      // タイムアウト基準チェック
      expect(elapsed, `${name} のDOMContentLoadedが${LOAD_TIMEOUT_MS}msを超えました`).toBeLessThan(
        LOAD_TIMEOUT_MS
      );

      // JSエラーなしチェック
      expect(
        jsErrors,
        `${name} でJSエラーが発生: ${jsErrors.join(", ")}`
      ).toHaveLength(0);
    });
  }
});
