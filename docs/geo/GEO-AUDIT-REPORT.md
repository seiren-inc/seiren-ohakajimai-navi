# GEO Audit Report: お墓じまいナビ

**Audit Date:** 2026-05-22（初回: 2026-04-26、Phase 1〜3 実装後 再監査）
**URL:** https://www.ohakajimai-navi.jp
**Business Type:** Local Services + Publisher Hybrid（墓じまい・改葬専門サービス業者 兼 情報メディア）
**Pages Analyzed:** 18（ホームページ・主要サービスページ・コラム・地域ページ・API系）

> **再監査ノート（2026-05-22）:** Phase 1〜3（コミット 67ffb4b / b7a7d22 / 719a8fe）の実装を反映してスコアを再算出した。JSON-LD 重複削除・FAQPage 追加・llms.txt 大幅拡充・行政書士 CTA 強化・trust copy 追加・compliance 修正が主な改善内容。Rich Results Test（live ページでのバリデーション）は未実施のため、Schema カテゴリのスコアはコードベース確認による推定値。

---

## Executive Summary

**Overall GEO Score: 58/100（Fair）** ← 前回: 44/100（Poor）

Phase 1〜3 の実装により、特に致命的だった JSON-LD エンティティ競合が解消され、スコアが 14 ポイント回復した。llms.txt の大幅拡充（96行 → 335行、約4,000語）と FAQPage の追加により、AI 引用可能性が大きく向上している。

### 主要な改善点（Phase 1〜3）
- **JSON-LD 重複問題の解消**: `layout.tsx` のインライン Organization + LocalBusiness JSON-LD を削除し、エンティティ競合を解消。スキーマがバリデーターに正しく認識される状態になった
- **FAQPage 構造化データの追加**: `/flow`・`/kaisoukyoka`・`/kaissou/[prefecture]`（動的）に FAQPage を実装。都道府県ごとに3問の地域特化 FAQ が自動生成される
- **llms.txt 大幅拡充**: 96行 → 335行（約4,000語）。費用・法律・遺骨取り扱い・供養先・対応エリア・行政書士業務範囲の詳細 FAQ 20問を追加

### まだ残っている重大課題
- **行政書士掲載が 0 件（収益モデル未稼働）**: gyoseishoshi ページは整備されたが、実際の掲載者が存在しないため E-E-A-T・収益両面でブロッカーが継続
- **Rich Results Test 未実施**: JSON-LD の重複解消はコード上で確認済みだが、live ページでのバリデーション通過・リッチリザルト表示は未確認

### Score Breakdown

| Category | 旧スコア | 新スコア | Weight | Weighted Score |
|---|---|---|---|---|
| AI Citability | 42/100 | **68/100** | 25% | 17.0 |
| Brand Authority | 35/100 | **35/100** | 20% | 7.0 |
| Content E-E-A-T | 58/100 | **70/100** | 20% | 14.0 |
| Technical GEO | 65/100 | **72/100** | 15% | 10.8 |
| Schema & Structured Data | 15/100 | **45/100** | 10% | 4.5 |
| Platform Optimization | 40/100 | **47/100** | 10% | 4.7 |
| **Overall GEO Score** | **44/100** | **58/100** | | |

> **スコア算出の根拠**: 全スコアはコードベース（`src/`・`public/`）の直接確認に基づく。Rich Results Test・Google Search Console・WebFetch による live ページ検証は未実施。「確認済み」はコード確認済みを意味し、live での動作保証ではない。

---

## Phase 1〜3 実装内容と効果

### Phase 1（コミット: 67ffb4b）
`seo(phase1): remove duplicate JSON-LD, add FAQPage, enhance Person schema, expand llms.txt`

| 実装内容 | 対象ファイル | スコアへの影響 |
|---|---|---|
| layout.tsx のインライン Organization + LocalBusiness JSON-LD を削除 | `src/app/layout.tsx` | Schema +15（エンティティ競合解消） |
| FAQPage 追加（/flow、5問） | `src/app/flow/page.tsx` | AI Citability +4、Schema +3 |
| FAQPage 追加（/kaisoukyoka、5問） | `src/app/kaisoukyoka/page.tsx` | AI Citability +4、Schema +3 |
| author-json-ld.tsx の Person schema 強化（url・sameAs・knowsAbout 追加） | `src/components/seo/author-json-ld.tsx` | Schema +2、Content E-E-A-T +2 |
| organization-json-ld.tsx の sameAs 修正（twitter.com → x.com）+ employee Person 強化 | `src/components/seo/organization-json-ld.tsx` | Schema +2、Brand Authority 微 |
| FinalCTA の href 修正（`#flow` → `/flow`）によるクロール可能な内部リンク | `src/components/home/sections/FinalCTA.tsx` | Technical GEO +1 |
| llms.txt 拡充（96行 → 335行、約4,000語、FAQ 20問・都道府県情報・行政書士解説） | `public/llms.txt` | AI Citability +8、Platform +7 |

### Phase 2（コミット: b7a7d22）
`cro(phase2): migrate CTA tokens emerald→seiren-cta, upgrade gyoseishoshi CTA, add trust copy`

| 実装内容 | 対象ファイル | スコアへの影響 |
|---|---|---|
| CTA トークン移行（emerald → seiren-cta）全 8 ページ | 複数 | Content E-E-A-T 微（デザイン統一） |
| trust micro-copy 追加（「相談・お見積りは無料。強引な勧誘はしません。」）7ページ | about, flow, kaisoukyoka, sankotsu, ridanryou, kaisougo, column/[slug] | Content E-E-A-T +4（Trustworthiness 向上） |
| /flow の行政書士 CTA を ghost → bg-seiren-green に変更（視認性向上） | `src/app/flow/page.tsx` | Content E-E-A-T +1 |

### Phase 3（コミット: 719a8fe）
`seo(phase3): gyoseishoshi CTA across kaissou cluster + compliance fixes + internal links`

| 実装内容 | 対象ファイル | スコアへの影響 |
|---|---|---|
| `/kaissou`（都道府県一覧）に行政書士 CTA を常時表示 | `src/app/kaissou/page.tsx` | AI Citability +2、Technical GEO +1 |
| `/kaissou/[prefecture]` に行政書士 CTA を常時表示（条件外で常時レンダリング）+ リンク先修正（/gyoseishoshi → /gyoseishoshi/area/{slug}） | `src/app/kaissou/[prefecture]/page.tsx` | Technical GEO +1、内部リンク強化 |
| `/kaissou/[prefecture]/[municipality]` の FAQ・sidebar で行政書士業務範囲の誤解を招く表現を修正（「代行サポートします」→「提携行政書士による手続きサポート」） | `src/app/kaissou/[prefecture]/[municipality]/page.tsx` | Content E-E-A-T +3（compliance・Trustworthiness） |
| `/kaissou/[prefecture]/[municipality]` に行政書士 CTA を常時表示 | 同上 | AI Citability +1 |
| revalidate = 86400 追加（kaissou/[prefecture]）で ISR 化（force-dynamic 解消） | `src/app/kaissou/[prefecture]/page.tsx` | Technical GEO +2 |

---

## Critical Issues（今すぐ修正）

### C-1: ✅ JSON-LD エンティティ競合の解消（Phase 1 で対応済み）
~~`organization-json-ld.tsx` が `@type: ['Organization', 'LocalBusiness']` の二重定義、かつ `local-business-json-ld.tsx` と両方が `layout.tsx` でレンダリングされることによる競合~~

**解消内容（Phase 1 確認済み）:** `layout.tsx` のインライン JSON-LD（organizationLd / localBusinessLd）を完全削除。各ページのコンポーネント（`organization-json-ld.tsx`・`local-business-json-ld.tsx`）に一元化された。コードベース上でのエンティティ競合は解消されている。

**残課題:** Rich Results Test による live 検証は未実施。バリデーション通過を確認してから完全解消と宣言すること。

### C-2: `/kaissou/kanagawa` 本番 500 エラー（未解消）
**影響:** 神奈川県（横浜・川崎・相模原等）の都道府県ページが全滅。MEO の地元強化が機能していない。

> Phase 3 でコードは修正されているが、本番での 500 エラー解消は確認できていない。revalidate = 86400 の追加により ISR が有効になったが、DB データの問題（神奈川データの欠落）は未確認。

**修正:** ① ローカルで `/kaissou/kanagawa` にアクセスして原因特定 ② Prisma の神奈川データ確認 ③ 本番での HTTP ステータス確認
**緊急度:** 最高（神奈川が拠点なのにローカル SEO ページが壊れている）

### C-3: 行政書士掲載が 0 件（収益モデル未稼働）
**影響:** `/gyoseishoshi` ページの CTA・内部リンクは Phase 2〜3 で整備されたが、実際の掲載者がいないため送客が機能しない。kaissou クラスターに行政書士 CTA が追加されても、リンク先に誰もいない状態。

> Phase 2〜3 でページ設計・CTA・内部リンクが整備されたことは評価できるが、E-E-A-T・収益の両面でブロッカーは継続している。

**修正:** 行政書士の初期登録・Stripe 決済フロー完全確認・最低 3 名の掲載
**緊急度:** 最高（公開しても収益がゼロ）

---

## High Priority Issues（1週間以内）

### H-1: Cloudflare Turnstile がコンタクトフォームに未実装（未解消）
**確認:** Phase 1〜3 の変更対象外。ライブページ（/contact）での未実装は継続。CLAUDE.md の Non-Negotiable 要件に違反。
**リスク:** スパム流入 → オペレーション停止 → リード品質の崩壊

### H-2: メール送信元ドメインが未確認（`system@osohiki-navi.jp`）（未解消）
**確認:** Phase 1〜3 の変更対象外。`submit-inquiry.ts` の `from` フィールドは引き続き未確認ドメイン。
**リスク:** 問い合わせメールが迷惑メールに分類 → リード消失

### H-3: 個人著者ページが存在しない（未解消）
**確認:** Phase 1 で Person schema は強化（knowsAbout・url・sameAs 追加）されたが、眞如理恵 代表の個人ページ（`/author/shinnya-rie` 等）は未作成。機械可読なスキーマは改善されたが、人物実在性のコンテンツ証跡は依然不足。

### H-4: 行政書士詳細ページに JSON-LD なし（未解消）
**確認:** Phase 1〜3 の変更対象外。`/gyoseishoshi/[id]/page.tsx` に LegalService / Person スキーマ未実装。
**GEO 影響:** AI が行政書士個人を独立エンティティとして認識できない。

### H-5: /estimation ページに H1 なし・sitemap 未掲載（未解消）
**確認:** Phase 1〜3 の変更対象外。Core SEO エラー・AI がページの主題を把握できない状態が継続。

### H-6: ✅ kaissou/[prefecture] の force-dynamic が ISR に変更（Phase 3 で対応済み）
~~`/kaissou/[prefecture]` が `force-dynamic`（ISR なし）~~

**解消内容（Phase 3 確認済み）:** `export const revalidate = 86400` が追加され、24時間 ISR に変更。毎回 DB アクセスの問題が解消された。

### H-7: ✅ kaissou クラスターの行政書士リンク先修正（Phase 3 で対応済み）
~~行政書士 CTA が `/gyoseishoshi`（全体）にリンクしており、都道府県別フィルタリングがされていない~~

**解消内容（Phase 3 確認済み）:** `/gyoseishoshi/area/{prefSlug}` への修正が `/kaissou/[prefecture]` と `/kaissou/[prefecture]/[municipality]` で実施済み。

---

## Medium Priority Issues（1ヶ月以内）

### M-1: llms-full.txt の FAQ 深度（部分解消）
**現状:** Phase 1 で llms.txt が 335行（約4,000語）に拡充。llms-full.txt は別ファイルで、依然として 2,200〜2,500 語程度の可能性あり（未確認）。
**目標:** 5,000 語以上・FAQ 50 問以上・都道府県別情報を追加

### M-2: コラム記事に外部ソース引用がない（未解消）
**確認:** Phase 1〜3 の変更対象外。厚生労働省統計・法律条文への引用リンクなし。
**GEO 影響:** AI が記事を信頼できる一次情報として扱いにくい。E-E-A-T の Trustworthiness 不足。

### M-3: コラム記事に「最終更新日」表示なし（未解消）
**確認:** Phase 1〜3 の変更対象外。

### M-4: 口コミ・レビュー導線が弱い（未解消）
**確認:** Phase 1〜3 の変更対象外。Google ビジネスプロフィールへのレビュー誘導リンクなし。AggregateRating スキーマも未実装。

### M-5: Video JSON-LD の動画 URL が未設定（未解消）
**確認:** Phase 1〜3 の変更対象外。

---

## Low Priority Issues（最適化フェーズ）

- ARIA violations：/contact・/gyoseishoshi フォームのアクセシビリティエラー（form labels・aria-hidden focus 等）
- `<main>` が /kaisoukyoka・コラムページで二重出力
- ✅ コラム記事の内部リンク密度（FinalCTA href 修正で微改善済み。更なる強化は残課題）
- sameAs の Twitter URL は Phase 1 で x.com に修正済み（✅ 解消）
- company ページに地図埋め込みなし（MEO）

---

## Category Deep Dives

### AI Citability（68/100）← 旧: 42/100（+26）

**強み（Phase 1〜3 後）:**
- robots.txt で GPTBot・ClaudeBot・PerplexityBot・Google-Extended を全明示許可
- llms.txt（335行、約4,000語）・llms-full.txt（2,200〜2,500 語）が両方存在
- FAQPage が `/flow`・`/kaisoukyoka`・`/kaissou/[prefecture]`（動的）に実装
- 都道府県別 FAQ（3問×47都道府県 = 最大141問が動的生成される設計）
- 「改葬許可申請の代行は行政書士のみ」等の法的区分を明示した compliance テキスト（Phase 3 修正後）
- 23 本のコラム記事で FAQ 形式の Q&A が豊富
- kaissou クラスター全体に行政書士 CTA と内部リンクが整備

**弱み（残課題）:**
- Rich Results Test 未通過確認（live ページ検証なし）
- 個人著者の専門性が機械可読形式で表現されていない（著者ページなし）
- 外部ソース引用ゼロ（AI は一次ソース引用のある記事を優先する）
- /kaissou/kanagawa 500 エラーが継続中の可能性

---

### Brand Authority（35/100）← 旧: 35/100（変化なし）

**強み:**
- 2008 年創業（17年以上の実績 ※llms.txt に「17年以上」と更新済み）
- 法人番号公開（0200-01-058496）
- Google マップ登録済み（sameAs に URL）
- LINE・Instagram・Facebook・Twitter(X) に公式アカウント（sameAs x.com に修正済み）
- 300 件以上の施工実績を明示

**弱み（未解消）:**
- Wikipedia ページなし
- YouTube チャンネル確認できず
- 外部メディア掲載・プレスリリースの確認なし
- 業界団体への加盟・認定の記載なし
- Yahoo!知恵袋等の Q&A プラットフォームへの言及なし

---

### Content E-E-A-T（70/100）← 旧: 58/100（+12）

**強み（Phase 1〜3 後）:**
- 眞如理恵 代表取締役の実名表記（Experience の証明）
- 16〜17 年の業歴・「47 都道府県対応」の実績
- 「改葬許可申請の代行は行政書士のみ」等の法令遵守の明示（Phase 3 で更に正確化）
- 行政書士業務範囲の誤解を招く表現を修正（「代行サポートします」→「提携行政書士による手続きサポート」）
- trust micro-copy「相談・お見積りは無料。強引な勧誘はしません。」を 7 ページに追加
- 1,737 市区町村のデータベース管理（Expertise の証明）
- コラム記事の公開日記載・カテゴリ分類

**弱み（残課題）:**
- 著者の個人ページ・資格・経歴の詳細なし
- 記事の「最終更新日」なし
- 外部引用・統計ソースなし
- 社員・専門家の写真なし
- 受賞歴・メディア掲載歴なし

---

### Technical GEO（72/100）← 旧: 65/100（+7）

**強み（Phase 1〜3 後）:**
- HTTPS・セキュリティヘッダー完備
- Next.js App Router による SSR/ISR（コンテンツがクロール可能）
- Sitemap 234 URL・更新頻度設定済み
- robots.txt で AI ボット全明示許可
- llms.txt・llms-full.txt 設置済み
- `/kaissou/[prefecture]` が ISR（revalidate = 86400）に変更（✅ Phase 3）
- Performance 84点・Mobile 100点（SiteLens、前回値から変化なし見込み）
- kaissou クラスターの内部リンク整備（行政書士 CTA が全都道府県・市区町村ページに常時表示）

**弱み（残課題）:**
- `/kaissou/kanagawa` 本番 500 エラー（確認中）
- `prisma as any` による型安全性欠落（`ignoreBuildErrors: true` 継続）
- 著者個人ページ・Person エンティティが HTML コンテンツとして未作成

---

### Schema & Structured Data（45/100）← 旧: 15/100（+30）

> **重要:** このスコアはコードベース確認に基づく推定値。Rich Results Test・Google Search Console での live 検証は未実施。

**コードベースで確認済みのスキーマ（Phase 1 以降）:**
- Organization（`organization-json-ld.tsx`・layout.tsx の重複を解消済み）
- LocalBusiness（`local-business-json-ld.tsx`・単一エンティティ）
- FAQPage（`/flow`・`/kaisoukyoka`・`/kaissou/[prefecture]` 動的）✅ Phase 1 新規追加
- HowTo（/flow）
- WebSite（layout）
- BreadcrumbList（全ページ）
- Article（/about・/column/[slug]）
- AuthorJsonLd / Person（/about・/flow・/column/[slug]・強化済み）
- SpeakableJsonLd（/about・/price・/flow・/company・/sankotsu）
- Service + AdministrativeArea（`/kaissou/[prefecture]` 動的）
- Dataset（市区町村ページ）
- DefinedTermSet（トップページ）

**未実装のスキーマ（残課題）:**
- LegalService / Person（行政書士詳細ページ）
- AggregateRating / Review（お客様の声に対応するスキーマなし）
- ProfessionalService（サービス全体）
- GovernmentService（各自治体の改葬許可申請ページ）

**スコア 45 の根拠:** JSON-LD 重複解消（+15）+ FAQPage 追加（+10）+ Person 強化（+5）。ただし live バリデーション未通過のため、60 点台ではなく保守的に 45 点と算出。

---

### Platform Optimization（47/100）← 旧: 40/100（+7）

| Platform | Status | 詳細 |
|---|---|---|
| Google 検索 | 改善中 | sitemap・GA4・GTM 済み。JSON-LD 重複解消済みだが Rich Results Test 未確認 |
| Google AI Overviews | 改善中 | FAQPage 実装済み。live 検証待ち |
| Bing / Copilot | 部分対応 | robots.txt 許可・IndexNow 実装。スキーマ改善済み |
| ChatGPT Web Search | 改善 | llms.txt 4,000語に拡充。FAQ 20問追加 |
| Perplexity | 改善 | llms.txt・robots.txt 対応済み。コンテンツ引用可能 |
| YouTube | 未対応 | チャンネル確認なし（変化なし） |
| Wikipedia | 未対応 | 記事なし（変化なし） |
| Yahoo!知恵袋 | 未確認 | 回答投稿なし（推定・変化なし） |

---

## Quick Wins（今週実施すること）

1. **Rich Results Test 実施**（全主要ページ）→ JSON-LD 修正の live 効果確認・スコア正式確定
2. **`/kaissou/kanagawa` 本番エラーの確認**→ HTTP ステータス確認・DB データ確認
3. **Turnstile 実装**（contact-form.tsx）→ スパム防止・CLAUDE.md Non-Negotiable 準拠
4. **メール送信元ドメイン修正**（`system@osohiki-navi.jp` → 確認済みドメイン）→ リード消失防止
5. **`/estimation` に H1 追加・sitemap 掲載** → Core SEO エラー解消

---

## 30-Day Action Plan（更新版）

### Week 1: 検証・残ブロッカーの解消
- [x] JSON-LD エンティティ競合統合修正（Phase 1 で対応済み）
- [ ] Rich Results Test 全主要ページ実施（live バリデーション）
- [ ] /kaissou/kanagawa 本番エラー確認・修正
- [ ] Turnstile 実装（Codex）
- [ ] メール送信元ドメイン修正（Claude Code）
- [ ] /estimation H1 追加・sitemap 掲載

### Week 2: E-E-A-T と収益モデルの整備
- [ ] 行政書士 3 名以上の掲載（オンボーディングフロー完全確認）
- [ ] 著者プロフィールページ（/author/shinnya-rie）作成（Person スキーマ付き）
- [ ] コラム記事に外部引用を追加（厚生労働省改葬統計・法律条文）
- [ ] コラム記事に「最終更新日」表示追加
- [ ] 行政書士詳細ページに LegalService + Person JSON-LD 実装

### Week 3: llms.txt 拡充・コンテンツ深化
- [ ] llms-full.txt を 5,000 語以上に拡充（FAQ 50 問・都道府県別情報）
- [ ] コラム記事 5 本追加（優先キーワード: 改葬許可 自分で / 離檀料 払わない / 海洋散骨 横浜）
- [ ] ARIA violations 修正（contact・gyoseishoshi フォーム）
- [ ] AggregateRating スキーマを testimonial に対応付け

### Week 4: 計測・改善・プラットフォーム展開
- [ ] Google Search Console でリッチリザルト確認（JSON-LD 修正後）
- [ ] Yahoo!知恵袋・法律相談サイトへの回答投稿（ブランド権威強化）
- [ ] Google ビジネスプロフィールと NAP 完全一致確認
- [ ] /contact/thanks に GBP レビュー誘導リンク設置

---

## Appendix: Pages Analyzed

| URL | Status | GEO Issues |
|---|---|---|
| https://www.ohakajimai-navi.jp/ | 200 | JSON-LD 重複解消済み（Phase 1）。著者スキーマ強化済み |
| https://www.ohakajimai-navi.jp/about | 200 | trust copy 追加済み（Phase 2）。author ページなし（残課題） |
| https://www.ohakajimai-navi.jp/flow | 200 | FAQPage 追加済み（Phase 1）。行政書士 CTA 強化済み（Phase 2） |
| https://www.ohakajimai-navi.jp/price | 200 | JSON-LD 重複解消済み（Phase 1）。trust copy 未追加 |
| https://www.ohakajimai-navi.jp/kaisoukyoka | 200 | FAQPage 追加済み（Phase 1）。trust copy 追加済み（Phase 2） |
| https://www.ohakajimai-navi.jp/gyoseishoshi | 200 | 掲載者 0 件（C-3 継続）。CTA 設計は整備済み（Phase 2〜3） |
| https://www.ohakajimai-navi.jp/sankotsu | 200 | trust copy 追加済み（Phase 2） |
| https://www.ohakajimai-navi.jp/contact | 200 | Turnstile 未実装（H-1 継続）。JSON-LD なし |
| https://www.ohakajimai-navi.jp/company | 200 | Organization JSON-LD 整理済み（Phase 1）。地図埋め込みなし |
| https://www.ohakajimai-navi.jp/column | 200 | JSON-LD 改善済み（Phase 1）。外部引用なし（残課題） |
| https://www.ohakajimai-navi.jp/column/cost-of-hakajimai | 200 | trust copy 追加済み（Phase 2）。外部引用なし・著者個人ページなし |
| https://www.ohakajimai-navi.jp/ridanryou | 200 | trust copy 追加済み（Phase 2） |
| https://www.ohakajimai-navi.jp/kaisougo | 200 | trust copy 追加済み（Phase 2） |
| https://www.ohakajimai-navi.jp/kaissou | 200 | 行政書士 CTA 追加済み（Phase 3） |
| https://www.ohakajimai-navi.jp/kaissou/kanagawa | **要確認** | Phase 3 で ISR 化。本番 500 エラーの継続可否は未確認 |
| https://www.ohakajimai-navi.jp/robots.txt | 200 | 問題なし（AI クローラー全許可） |
| https://www.ohakajimai-navi.jp/llms.txt | 200 | 335行・約4,000語に拡充済み（Phase 1）|
| https://www.ohakajimai-navi.jp/sitemap.xml | 200 | 234 URL（正常） |

---

## GEO スコア推移と予測

| フェーズ | スコア | 主な改善点 |
|---|---|---|
| 初回監査（2026-04-26） | **44/100（Poor）** | JSON-LD 重複・掲載者ゼロ |
| Phase 1〜3 完了後（2026-05-22） | **58/100（Fair）** | JSON-LD 修正・FAQPage・llms.txt 拡充・trust copy・行政書士 CTA |
| Phase 4 完了後（見込み） | **65〜68/100（Fair）** | Rich Results Test 通過確認・llms-full.txt 拡充・著者ページ・外部引用追加 |
| 行政書士 3 名以上掲載後（見込み） | **72〜75/100（Fair+）** | E-E-A-T 大幅向上・LegalService スキーマ・収益モデル稼働 |
| 3ヶ月後（目標） | **80/100（Good）** | ブランド権威強化・YouTube・外部メディア掲載・コラム記事拡充 |

### Phase 4 実装後の期待スコア（詳細）

Phase 4 として以下を実施した場合の見込みスコア:
- llms-full.txt を 5,000 語以上に拡充（FAQ 50 問）
- コラム記事 5 本追加
- 著者プロフィールページ（/author/shinnya-rie）作成・Person スキーマ実装
- コラム記事への外部引用追加（厚生労働省統計等）
- Rich Results Test 全主要ページ通過確認

| Category | Phase 3 後 | Phase 4 後（見込み） | 変化 |
|---|---|---|---|
| AI Citability | 68 | **75〜78** | llms-full.txt 拡充・コラム追加 |
| Brand Authority | 35 | **38** | 外部引用追加による微改善 |
| Content E-E-A-T | 70 | **78〜80** | 著者ページ・外部引用・更新日追加 |
| Technical GEO | 72 | **75** | Turnstile・estimation 修正 |
| Schema & Structured Data | 45 | **60〜65** | Rich Results Test 通過・AggregateRating 追加 |
| Platform Optimization | 47 | **55** | llms-full.txt 拡充・AI Overviews 出現 |
| **Overall（加重平均）** | **58** | **65〜68** | |

> Phase 4 後でも Brand Authority（35点）と行政書士掲載（収益モデル）が残課題となる。最終目標の 80/100 達成には行政書士掲載開始・YouTube・外部メディア掲載が必要。

---

*Skill: geo-audit（GEO Audit Orchestration Skill）*
*初回データ: WebFetch（本番サイト 16 URL 直接取得）・ohakajimai_audit_clean.json（SiteLens 42ページ監査）*
*再監査（Phase 1〜3）: コードベース直接確認（git diff / 各ページ・コンポーネントの Read）。Live ページ検証（WebFetch・Rich Results Test）は未実施。*
