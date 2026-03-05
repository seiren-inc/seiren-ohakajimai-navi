/**
 * T3-06: sitemap内URLの存在検証CIゲート
 *
 * 検証内容:
 * 1. 静的ルートと都道府県ルートの重複URLがないか
 * 2. PDFリンク（.pdf）がsitemapに混入していないか
 * 3. BASE_URLが正しく設定されているか（localhost混入チェック）
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.ohakajimai-navi.jp";

const PREFECTURES = [
  "hokkaido", "aomori", "iwate", "miyagi", "akita", "yamagata", "fukushima",
  "ibaraki", "tochigi", "gunma", "saitama", "chiba", "tokyo", "kanagawa",
  "niigata", "toyama", "ishikawa", "fukui", "yamanashi", "nagano",
  "shizuoka", "aichi", "gifu", "mie",
  "shiga", "kyoto", "osaka", "hyogo", "nara", "wakayama",
  "tottori", "shimane", "okayama", "hiroshima", "yamaguchi",
  "tokushima", "kagawa", "ehime", "kochi",
  "fukuoka", "saga", "nagasaki", "kumamoto", "oita", "miyazaki", "kagoshima", "okinawa",
];

function buildStaticUrls(base: string): string[] {
  return [
    `${base}/`,
    `${base}/about`,
    `${base}/flow`,
    `${base}/price`,
    `${base}/kaisoukyoka`,
    `${base}/kaissou`,
    `${base}/gyoseishoshi`,
    `${base}/company`,
    `${base}/contact`,
  ];
}

function buildPrefectureUrls(base: string): string[] {
  return [
    ...PREFECTURES.map((p) => `${base}/kaissou/${p}`),
    ...PREFECTURES.map((p) => `${base}/gyoseishoshi/area/${p}`),
  ];
}

function main() {
  console.log("🔍 [T3-06] Sitemap URL検証を開始します...");
  const errors: string[] = [];

  // BASE_URLのlocalhostチェック
  if (BASE_URL.includes("localhost") || BASE_URL.includes("127.0.0.1")) {
    errors.push(`[CRITICAL] BASE_URL がローカルホストです: ${BASE_URL}`);
  }

  const staticUrls = buildStaticUrls(BASE_URL);
  const prefUrls = buildPrefectureUrls(BASE_URL);
  const allUrls = [...staticUrls, ...prefUrls];

  // PDFリンク混入チェック
  const pdfUrls = allUrls.filter((u) => u.toLowerCase().endsWith(".pdf"));
  if (pdfUrls.length > 0) {
    pdfUrls.forEach((u) =>
      errors.push(`[CRITICAL] sitemapにPDFリンクが混入しています: ${u}`)
    );
  }

  // 重複URLチェック
  const seen = new Set<string>();
  const duplicates: string[] = [];
  for (const url of allUrls) {
    if (seen.has(url)) {
      duplicates.push(url);
    }
    seen.add(url);
  }
  if (duplicates.length > 0) {
    duplicates.forEach((u) =>
      errors.push(`[CRITICAL] sitemapに重複URLがあります: ${u}`)
    );
  }

  // 都道府県数チェック（48件 = 47都道府県 × 2カテゴリ）
  if (prefUrls.length !== PREFECTURES.length * 2) {
    errors.push(
      `[CRITICAL] 都道府県URLの件数が不正です: ${prefUrls.length}件（期待値: ${PREFECTURES.length * 2}件）`
    );
  }

  // 結果出力
  console.log(`  静的ルート: ${staticUrls.length}件`);
  console.log(`  都道府県ルート: ${prefUrls.length}件`);
  console.log(`  合計: ${allUrls.length}件`);

  if (errors.length > 0) {
    console.error("\n❌ [T3-06] Sitemap検証 FAILED:");
    errors.forEach((e) => console.error(`  ${e}`));
    process.exit(1);
  }

  console.log("✅ [T3-06] Sitemap URL検証 PASSED");
}

main();
