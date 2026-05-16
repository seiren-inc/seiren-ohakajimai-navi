# SEO/GEO/デザイン監査 実装計画書

> **監査日:** 2026-05-16  
> **実施監査:** seo-maps (42/100) / geo-content (71/100) / landing-page CRO / design-taste-frontend (6.5/10)  
> **方針:** 最小 diff 優先。既存UI・SEO挙動・データ構造は変更しない。

---

## メタ情報

| 項目 | 値 |
|------|---|
| 作成日 | 2026-05-16 |
| 最終更新 | 2026-05-16 |
| 担当 | Claude Code + Takuma |
| 関連ファイル | GEO-AUDIT-REPORT.md, docs/18_implementation_tasks/geo-audit-homepage-redesign-2026-05-09.md |

---

## ゴール・非ゴール

- **ゴール:**
  - LCP / CWV の技術的ブロッカーを即時解消する
  - JSON-LD @id 重複・LinkedIn 404 など Entity Graph の汚染を除去する
  - LP のコピー・構造を PAS フレームワークに沿って改善しコンバージョンを向上させる
  - デザイン品質スコアを 6.5 → 7.5+ に引き上げる
  - RSC 化で不要な JS バンドルサイズを削減する
- **非ゴール（やらないこと）:**
  - DB・Prisma スキーマへの変更
  - 既存ルーティング・URL 構造の変更
  - ブランドカラーパレット・フォントシステムの変更
  - GBP / Bing / Apple Maps 等の外部プラットフォーム操作（別途手動対応）
  - コンテンツページ（石材店ガイド・離檀料トラブル等）の新規作成（Phase 6 別タスク）

---

## 実装チェックリスト

### Phase 1 — クリティカル技術修正（即時・リスクゼロ）

> 推定所要時間: 45分 / 対象ファイル: 3ファイル

- [ ] `src/app/layout.tsx`: `<link rel="preload">` の href を `hero-garden-v3.webp` → `cemetery-flowers.jpg` に修正（LCP最適化が現在不機能）
- [ ] `src/app/layout.tsx`: `organizationLd` スクリプトブロックを削除（不完全な #organization @id を本番に出力している）
- [ ] `src/app/layout.tsx`: `localBusinessLd` スクリプトブロックを削除（#localbusiness @id の重複エンティティを排除）
- [ ] `src/components/home/HomepageClient.tsx` L473: `min-h-[88vh]` → `min-h-[88dvh]`（iOS Safari ビューポートバグ解消）
- [ ] `src/components/seo/local-business-json-ld.tsx`: `telephone` を配列化し `045-881-9952` を追加
- [ ] `src/components/seo/local-business-json-ld.tsx`: LinkedIn sameAs エントリを削除（404 が Entity Graph decay を引き起こしている）
- [ ] `src/components/home/HomepageClient.tsx` + `src/app/globals.css`: inline `<style jsx global>` の fadeUp キーフレーム重複を解消

### Phase 2 — SEO & コピー改善

> 推定所要時間: 2時間 / 対象ファイル: 2ファイル

- [ ] `src/app/page.tsx`: meta description を KW 列挙型 → Pain-first ベネフィット訴求に書き換え
- [ ] `src/components/home/HomepageClient.tsx`: H1「お墓じまいの不安、すべて一括でサポート。」→ Pain-first コピーに変更
- [ ] `src/components/home/HomepageClient.tsx`: Hero のガラスカード（trustStats）をモバイルでも表示（`hidden md:flex` → `flex`、レイアウト調整）
- [ ] `src/components/home/HomepageClient.tsx`: glassmorphism trust card に `animate-floating` クラスを適用（tailwind.config.ts の既存 keyframe を活用）
- [ ] `src/components/home/HomepageClient.tsx`: H2 の font 統一（font-zen を全 H2 に適用、font-serif は引用・ボディ専用に限定）
- [ ] `src/components/home/HomepageClient.tsx`: body text の `max-w-[640px]` → `max-w-[65ch]` に変更（タイポグラフィ最適化）

### Phase 3 — LP 構造最適化

> 推定所要時間: 3時間 / 対象ファイル: 1ファイル

- [ ] `src/components/home/HomepageClient.tsx`: 中間 CTA 直前に testimonial ハイライト 3 件を挿入（既存データの再利用、新規コンテンツ不要）
- [ ] `src/components/home/HomepageClient.tsx`: 「セルフチェック」セクションを最終CTA後から対応範囲セクション（[G]）に統合または削除
- [ ] `src/components/home/HomepageClient.tsx`: 「つまずきやすいポイント」セクションを下部 FAQ に統合して最終CTA後のセクション数を削減
- [ ] `src/components/home/HomepageClient.tsx`: DIY ルート（[J]）の CTA ボタン色を `bg-[#1A1A1A]` → `bg-seiren-main` に変更（ブランドカラー統一）
- [ ] `src/components/home/HomepageClient.tsx`: お客様の声の表示件数ラベルを「全 XX 件中 / 代表的な声」形式に変更（信憑性向上）

### Phase 4 — モーション & インタラクション

> 推定所要時間: 2時間 / 対象ファイル: 2ファイル

- [ ] `src/components/home/HomepageClient.tsx`: TestimonialCarousel にページ切り替えアニメーション追加（Framer Motion `AnimatePresence` / `mode="wait"` + opacity+y）
- [ ] `src/components/home/HomepageClient.tsx`: 悩みリスト（worryPoints）に stagger reveal 追加（各アイテムに delay: i * 80ms）
- [ ] `src/components/layouts/header.tsx`: モバイルメニューに CSS transition 追加（`max-height` アニメーション or Framer Motion）
- [ ] `src/components/home/HomepageClient.tsx`: セルフチェック・つまずき以外の 3-col 等幅グリッドのうち 2 箇所を非対称レイアウトに変更（Line 1281: `sm:grid-cols-2 xl:grid-cols-4` → `md:grid-cols-2 lg:grid-cols-4` で中間 dead zone 解消）

### Phase 5 — RSC アーキテクチャ リファクタ

> 推定所要時間: 3〜4時間 / 対象ファイル: 3ファイル（新規 2 + 変更 1）

- [ ] `src/components/home/TestimonialCarousel.tsx`（新規）: TestimonialCarousel を "use client" leaf component として分離
- [ ] `src/components/home/RevealWrapper.tsx`（新規）: Reveal / StickyReveal を "use client" leaf component として分離
- [ ] `src/components/home/HomepageClient.tsx`: "use client" → Server Component に変換（静的セクションはすべてサーバーサイドへ）
- [ ] `src/components/home/HomepageClient.tsx`: `HomepageComingSoonModal` dead code を削除（`@typescript-eslint/no-unused-vars` 警告解消）

### Phase 6 — コンテンツ新規作成（別タスク・本計画外）

> コードではなくコンテンツ作成。別途実装計画を起票する。

- 特定商取引法に基づく表記ページ（法的必須）
- 石材店・業者選びガイド
- 離檀料トラブル事例ページ
- 散骨・樹木葬・永代供養 比較ページ
- 事例紹介（ケーススタディ）詳細化

---

## 外部対応タスク（非コード・手動）

- GBP verification 確認・最適化（カテゴリ・説明文・写真・サービスエリア設定）
- Bing Places for Business 申請登録
- Apple Maps Connect 申請登録
- Yahoo Japan ローカル登録
- LINE レビュー依頼テンプレート作成・運用開始（目標: 5件/月）
- OSM（OpenStreetMap）への事業者登録
- LinkedIn 企業ページ作成（または sameAs 削除後に別途検討）

---

## 検証（各 Phase 完了時に実施）

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run verify`
- [ ] Phase 1 完了後: Google Rich Results Test でスキーマ重複が解消されたことを確認
- [ ] Phase 2 完了後: モバイルビューでヒーローの信頼カードが表示されることを確認
- [ ] Phase 5 完了後: `npm run build` でバンドルサイズの削減を確認

---

## リスク・注意事項

- **layout.tsx の organizationLd 削除**: `organization-json-ld.tsx` がすべてのページに挿入されていることを確認してから削除する
- **HomepageClient.tsx の RSC 化 (Phase 5)**: 段階的に実施。一度に変換しない。TestimonialCarousel → Reveal → 残り の順で分離する
- **testimonial ハイライト追加 (Phase 3)**: 既存データ（`testimonials` 配列）の最初の 3 件を再利用するだけ。新規データ・DB 変更なし

---

## 参照

- 実施監査レポート: `GEO-AUDIT-REPORT.md`
- 前回 GEO 監査: `docs/18_implementation_tasks/geo-audit-homepage-redesign-2026-05-09.md`
- SEO ロードマップ: `docs/ai/seo-geo-meo-implementation-plan.md`（存在する場合）
