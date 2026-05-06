# 技術SEOチェックリスト（sitemap / robots / canonical / 構造化データ）

本番canonicalは **`https://www.ohakajimai-navi.jp`** と整合させること（計画前提）。

## sitemap (`src/app/sitemap.ts`)

- [ ] **インデックス対象のみ** が列挙されている（noindex ページが混ざらない）。
- [ ] `/kaissou/{prefecture}` と `/kaissou/{prefecture}/{municipality}` の規則が一貫。
- [ ] **`isPublished: true`** の自治体のみ municipality URL を出力。
- [ ] PDF直リンクなど、sitemap に含めるべきでない資源が混入していない（`verify:seo` 参照）。
- [ ] `lastModified` が可能な範囲で意味のある値（静的はビルド日、DBは `updatedAt`）。
- [ ] BASE_URL と環境変数の取り違えがない（staging を本番に混ぜない）。

## robots (`src/app/robots.ts`)

- [ ] 本番許可／禁止パスが意図どおりである。
- [ ] staging と本番の差分が文書化されている（変更は承認＋ログ）。詳細は [staging-vs-production-robots.md](./staging-vs-production-robots.md)。

## canonical / メタ

- [ ] 各テンプレで `canonical` と `metadata.alternates` が **www** 本体と矛盾しない。
- [ ] クエリパラメータ URL の正規URLが明示されている場合はひとつの canonical に収束する。

## 構造化データ

- [ ] Organization / WebSite と各ページの `@type` が二重矛盾しない（単一ソース化を検討、`layout.tsx`）。
- [ ] FAQ JSON-LD はページ上に存在する質問のみ。
- [ ] Breadcrumb と実際のURL階層が一致する。

## 自動検証

- `npm run verify:seo`（`verify_seo_sitemap.ts`, `verify_seo_meta.ts`）を CI またはリリース前に実行する。

## 変更管理

routing / メタ / `robots` / `llms` / canonical は横断影響が大きいため **承認済み変更として記録**する。
