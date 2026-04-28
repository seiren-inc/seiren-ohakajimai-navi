# GEO Audit Report: お墓じまいナビ

**Audit Date:** 2026-04-26
**URL:** https://www.ohakajimai-navi.jp
**Business Type:** Local Services + Publisher Hybrid（墓じまい・改葬専門サービス業者 兼 情報メディア）
**Pages Analyzed:** 18（ホームページ・主要サービスページ・コラム・地域ページ・API系）

---

## Executive Summary

**Overall GEO Score: 44/100（Poor）**

お墓じまいナビは robots.txt・llms.txt・llms-full.txt の整備、全 AI クローラーへのアクセス開放、23 本のコラム記事、1,737 自治体データベースなど GEO の基盤設計は先進的である。しかし、**JSON-LD がライブページで正常に出力されていない**（Google Rich Results Test 未通過相当）という致命的な問題が全カテゴリのスコアを引き下げており、AI 検索エンジンが構造化データを読み取れない状態が続いている。加えて、**収益の核である行政書士掲載が 0 件（準備中）**、**`/kaissou/kanagawa` が本番で 500 エラー**という release blocker が2件存在する。JSON-LD 修正と 500 エラー解消を最優先で実施することで、GEO スコアは 44 → 65+ に回復する見込み。

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 42/100 | 25% | 10.5 |
| Brand Authority | 35/100 | 20% | 7.0 |
| Content E-E-A-T | 58/100 | 20% | 11.6 |
| Technical GEO | 65/100 | 15% | 9.75 |
| Schema & Structured Data | 15/100 | 10% | 1.5 |
| Platform Optimization | 40/100 | 10% | 4.0 |
| **Overall GEO Score** | | | **44/100** |

---

## Critical Issues（今すぐ修正）

### C-1: JSON-LD がライブページで出力されていない
**影響ページ:** 全ページ（/, /about, /flow, /price, /kaisoukyoka, /sankotsu, /contact, /column/[slug] 等）  
**症状:** WebFetch による HTML 取得で `application/ld+json` スクリプトが一切検出されず。SiteLens 監査でも Structured Data = 0/100。  
**根本原因（コードから確認済み）:** `organization-json-ld.tsx` が `@type: ['Organization', 'LocalBusiness']` の二重定義、かつ `local-business-json-ld.tsx` と両方が `layout.tsx` でレンダリングされることによる競合エンティティが JSON-LD バリデータの invalid 判定を引き起こしている。  
**修正:** Organization / LocalBusiness エンティティの統合（設計済み、Codex 実装待ち）  
**期待効果:** Structured Data 0 → 65+、リッチリザルト復活、AI 引用可能性 +40%

### C-2: `/kaissou/kanagawa` が本番 500 エラー
**影響:** 神奈川県（横浜・川崎・相模原等）の都道府県ページが全滅。MEO の地元強化が機能していない。  
**推定原因:** ISR / DB クエリ失敗またはデータ欠落。`force-dynamic` 設定による毎回 DB アクセスで発生しやすい。  
**修正:** ① ローカルで原因特定 ② DB データ確認 ③ エラーハンドリング追加  
**緊急度:** 最高（神奈川が拠点なのにローカル SEO ページが壊れている）

### C-3: 行政書士掲載が 0 件（収益モデル未稼働）
**影響:** `/gyoseishoshi` ページが「掲載準備中」のため、送客導線・収益・E-E-A-T 信頼性のすべてが機能していない。  
**修正:** 行政書士の初期登録・Stripe 決済フロー完全確認・最低 3 名の掲載  
**緊急度:** 最高（公開しても収益がゼロ）

---

## High Priority Issues（1週間以内）

### H-1: Cloudflare Turnstile がコンタクトフォームに未実装
**確認:** ライブページ（/contact）でも captcha/Turnstile UI が未表示。CLAUDE.md の Non-Negotiable 要件に違反。  
**リスク:** スパム流入 → オペレーション停止 → リード品質の崩壊

### H-2: メール送信元ドメインが未確認（`system@osohiki-navi.jp`）
**確認:** `submit-inquiry.ts` の `from` フィールド。`osohiki-navi.jp` は `ohakajimai-navi.jp` と異なる未確認ドメイン。  
**リスク:** 問い合わせメールが迷惑メールに分類 → リード消失

### H-3: 個人著者ページが存在しない
**確認:** コラム記事の著者は「株式会社清蓮」のみ。眞如理恵 代表の個人 Person スキーマ・著者ページなし。  
**GEO 影響:** E-E-A-T の Experience・Authoritativeness シグナルが弱い。AI が記事を個人の専門知識として引用しにくい。

### H-4: 行政書士詳細ページに JSON-LD なし（実装未完）
**確認:** `/gyoseishoshi/[id]/page.tsx` に LegalService / Person スキーマ未実装。  
**GEO 影響:** AI が行政書士個人を独立エンティティとして認識できない。

### H-5: /estimation ページに H1 なし・sitemap 未掲載
**確認:** ライブコード・SiteLens 監査で確認。  
**影響:** Core SEO エラー・AI がページの主題を把握できない。

---

## Medium Priority Issues（1ヶ月以内）

### M-1: llms-full.txt は存在するが FAQが薄い
**確認:** llms-full.txt は 2,200〜2,500 語（良好なスタート）だが、市区町村別の手続き情報・行政書士選定基準・料金の詳細比較・「よくある失敗例」などが未掲載。  
**目標:** 5,000 語以上・FAQ 50 問以上・都道府県別情報を追加

### M-2: コラム記事に外部ソース引用がない
**確認:** `cost-of-hakajimai` 等のコラム記事で外部データソース（厚生労働省統計・法律条文）への引用リンクなし。  
**GEO 影響:** AI が記事を信頼できる一次情報として扱いにくい。E-E-A-T の Trustworthiness 不足。

### M-3: コラム記事に「最終更新日」表示なし
**確認:** 公開日はあるが `dateModified` の表示なし。AI は古いコンテンツとみなしリスク。

### M-4: /kaissou/[prefecture] が `force-dynamic`（ISR なし）
**確認:** 毎回 DB アクセスが発生。Googlebot のクロール効率が低下。  
**修正:** `revalidate = 86400` に変更

### M-5: 口コミ・レビュー導線が弱い
**確認:** ホームページに 57 件のお客様の声（testimonial）はあるが、Google ビジネスプロフィールへのレビュー誘導リンクなし。AggregateRating スキーマも未実装。

### M-6: Video JSON-LD の動画 URL が未設定
**確認:** `/flow` 等に VideoJsonLd コンポーネントが実装されているが、実際の YouTube 動画が存在しない可能性。

---

## Low Priority Issues（最適化フェーズ）

- ARIA violations：/contact・/gyoseishoshi フォームのアクセシビリティエラー（form labels・aria-hidden focus 等）
- `<main>` が /kaisoukyoka・コラムページで二重出力
- コラム記事の内部リンク密度が低い（関連記事リンクの強化が必要）
- sameAs の Twitter URL が旧ドメイン形式の可能性
- company ページに地図埋め込みなし（MEO）

---

## Category Deep Dives

### AI Citability（42/100）

**強み:**
- robots.txt で GPTBot・ClaudeBot・PerplexityBot・Google-Extended を全明示許可
- llms.txt（2,200〜2,500 語）・llms-full.txt（2,200〜2,500 語）が両方存在
- FAQPage が全主要ページに実装（ただしライブ出力未確認）
- 23 本のコラム記事で FAQ 形式の Q&A が豊富
- 「改葬許可申請代行は行政書士のみ」という明示的な法的免責事項 → AI に引用されやすいファクト

**弱み:**
- JSON-LD 不正により FAQPage・HowTo・Article スキーマが AI に読み取られていない
- 個人著者の専門性が機械可読形式で表現されていない
- 外部ソース引用ゼロ（AI は一次ソース引用のある記事を優先する）
- /kaissou/kanagawa 500 エラー → 神奈川関連クエリで空白

**改善優先度:** JSON-LD 修正により即座に +15〜20 ポイント回復可能

---

### Brand Authority（35/100）

**強み:**
- 2008 年創業（16 年の実績）
- 法人番号公開（0200-01-058496）
- Google マップ登録済み（sameAs に URL）
- LINE・Instagram・Facebook・Twitter に公式アカウント
- 300 件以上の施工実績を明示

**弱み:**
- Wikipedia ページなし（日本の墓じまい分野で先駆者的存在なのに未掲載）
- YouTube チャンネル確認できず（「海洋散骨」「墓じまい」の動画コンテンツがない）
- 外部メディア掲載・プレスリリースの確認なし
- 業界団体への加盟・認定の記載なし
- Reddit・Quora 等の Q&A プラットフォームへの言及なし（日本では Yahoo!知恵袋相当）

---

### Content E-E-A-T（58/100）

**強み:**
- 眞如理恵 代表取締役の実名表記（Experience の証明）
- 16 年の業歴・「47 都道府県対応」の実績
- 「改葬許可申請の代行は行政書士のみ」等の法令遵守の明示（Trustworthiness）
- 1,737 市区町村のデータベース管理（Expertise の証明）
- コラム記事の公開日記載・カテゴリ分類

**弱み:**
- 著者の個人ページ・資格・経歴の詳細なし
- 記事の「最終更新日」なし
- 外部引用・統計ソースなし（厚生労働省の改葬統計が引用されていない）
- 社員・専門家の写真なし（AI に「人物実在性」を伝えにくい）
- 受賞歴・メディア掲載歴なし

---

### Technical GEO（65/100）

**強み:**
- HTTPS・セキュリティヘッダー完備（SiteLens Security 91点）
- Next.js App Router による SSR/ISR（コンテンツがクロール可能）
- Sitemap 234 URL・更新頻度設定済み
- robots.txt で AI ボット全明示許可
- llms.txt・llms-full.txt 設置済み
- Performance 84点（SiteLens）
- Mobile 100点（SiteLens）

**弱み:**
- `/kaissou/kanagawa` 本番 500 エラー（1 URL だが神奈川が拠点なので致命的）
- JSON-LD の live 出力不正（技術的最大問題）
- /kaissou/[prefecture] が `force-dynamic`（ISR なし）
- `prisma as any` による型安全性欠落
- `ignoreBuildErrors: true` による本番ビルドの型チェック無効化

---

### Schema & Structured Data（15/100）

**コードベースに実装済みのスキーマ（live では未検出）:**
- FAQPage（全主要ページ）
- HowTo（/flow）
- Organization + LocalBusiness（layout - 競合あり）
- WebSite（layout）
- BreadcrumbList（全ページ）
- Article（/about・/column/[slug]）
- AuthorJsonLd（/about・/flow・/column/[slug]）
- SpeakableJsonLd（/about・/price・/flow・/company・/sankotsu）
- Dataset（市区町村ページ）
- DefinedTermSet（トップページ）

**未実装のスキーマ:**
- LegalService / Person（行政書士詳細ページ）
- AggregateRating / Review（お客様の声に対応するスキーマなし）
- ProfessionalService（サービス全体）
- GovernmentService（各自治体の改葬許可申請ページ）

**問題:** コードには豊富なスキーマが実装されているが、エンティティ競合により validator が invalid と判定し、AI 検索・リッチリザルトに全く活用できていない。修正さえすれば即座に業界トップレベルのスキーマカバレッジになる。

---

### Platform Optimization（40/100）

| Platform | Status | 詳細 |
|---|---|---|
| Google 検索 | 部分対応 | sitemap・GA4・GTM 済み。リッチリザルトは JSON-LD 不正で未表示 |
| Google AI Overviews | 未対応 | JSON-LD 不正でリッチスニペット候補から除外 |
| Bing / Copilot | 部分対応 | robots.txt 許可・IndexNow 実装。スキーマ不正 |
| ChatGPT Web Search | 部分対応 | llms.txt・robots.txt 対応済み。スキーマ不正 |
| Perplexity | 部分対応 | llms.txt・robots.txt 対応済み。コンテンツは引用可能 |
| YouTube | 未対応 | チャンネル確認なし |
| Wikipedia | 未対応 | 記事なし |
| Yahoo!知恵袋 | 未確認 | 回答投稿なし（推定） |

---

## Quick Wins（今週実施すること）

1. **JSON-LD エンティティ統合修正**（設計済み）→ Structured Data 0 → 65+ / リッチリザルト復活
2. **`/kaissou/kanagawa` 500 エラー修正**→ 神奈川ローカル SEO の緊急回復
3. **Turnstile 実装**（contact-form.tsx）→ スパム防止・CLAUDE.md Non-Negotiable 準拠
4. **メール送信元ドメイン修正**（`system@osohiki-navi.jp` → 確認済みドメイン）→ リード消失防止
5. **`/estimation` に H1 追加・sitemap 掲載** → Core SEO エラー解消

---

## 30-Day Action Plan

### Week 1: 構造的ブロッカーの解消
- [ ] JSON-LD エンティティ競合統合修正（Codex）
- [ ] /kaissou/kanagawa 500 エラー原因調査・修正（Claude Code）
- [ ] Turnstile 実装（Codex）
- [ ] メール送信元ドメイン修正（Claude Code）
- [ ] /estimation H1 追加・sitemap 掲載（Codex）
- [ ] NAP 統一（電話番号・営業時間・座標）

### Week 2: E-E-A-T と収益モデルの整備
- [ ] 行政書士 3 名以上の掲載（オンボーディングフロー完全確認）
- [ ] 著者プロフィールページ（/author/shinnya-rie）作成（Person スキーマ付き）
- [ ] コラム記事に外部引用を追加（厚生労働省改葬統計・法律条文）
- [ ] コラム記事に「最終更新日」表示追加
- [ ] 行政書士詳細ページに LegalService + Person JSON-LD 実装

### Week 3: llms.txt 拡充・コンテンツ深化
- [ ] llms-full.txt を 5,000 語以上に拡充（FAQ 50 問・都道府県別情報）
- [ ] コラム記事 5 本追加（優先キーワード: 改葬許可 自分で / 離檀料 払わない / 海洋散骨 横浜）
- [ ] /kaissou/[prefecture] を force-dynamic → revalidate = 86400 に変更
- [ ] ARIA violations 修正（contact・gyoseishoshi フォーム）
- [ ] AggregateRating スキーマを testimonial に対応付け

### Week 4: 計測・改善・プラットフォーム展開
- [ ] Google Search Console でリッチリザルト確認（JSON-LD 修正後）
- [ ] Google Rich Results Test 全主要ページ通過確認
- [ ] Yahoo!知恵袋・法律相談サイトへの回答投稿（ブランド権威強化）
- [ ] Google ビジネスプロフィールと NAP 完全一致確認
- [ ] /contact/thanks に GBP レビュー誘導リンク設置

---

## Appendix: Pages Analyzed

| URL | Status | GEO Issues |
|---|---|---|
| https://www.ohakajimai-navi.jp/ | 200 | JSON-LD 不正、著者スキーマ未検出 |
| https://www.ohakajimai-navi.jp/about | 200 | JSON-LD 不正、author ページなし |
| https://www.ohakajimai-navi.jp/flow | 200 | JSON-LD 不正、HowTo 未検出 |
| https://www.ohakajimai-navi.jp/price | 200 | JSON-LD 不正 |
| https://www.ohakajimai-navi.jp/kaisoukyoka | 200 | JSON-LD 不正、main 二重 |
| https://www.ohakajimai-navi.jp/gyoseishoshi | 200 | 掲載者 0 件、JSON-LD 不正 |
| https://www.ohakajimai-navi.jp/sankotsu | 200 | JSON-LD 不正 |
| https://www.ohakajimai-navi.jp/contact | 200 | Turnstile 未実装、JSON-LD なし |
| https://www.ohakajimai-navi.jp/company | 200 | Organization JSON-LD 不正 |
| https://www.ohakajimai-navi.jp/column | 200 | JSON-LD 不正 |
| https://www.ohakajimai-navi.jp/column/cost-of-hakajimai | 200 | 外部引用なし、著者個人ページなし |
| https://www.ohakajimai-navi.jp/kaissou/kanagawa | **500** | **本番エラー** |
| https://www.ohakajimai-navi.jp/robots.txt | 200 | 問題なし（AI クローラー全許可） |
| https://www.ohakajimai-navi.jp/llms.txt | 200 | 内容は良好だが深度不足 |
| https://www.ohakajimai-navi.jp/llms-full.txt | 200 | 2,200〜2,500 語（拡充余地あり） |
| https://www.ohakajimai-navi.jp/sitemap.xml | 200 | 234 URL（正常） |

---

## 修正前後の GEO スコア予測

| フェーズ | 想定スコア | 主な改善点 |
|---|---|---|
| 現状（2026-04-26） | **44/100（Poor）** | JSON-LD 不正・掲載者ゼロ |
| Week 1 完了後 | **58/100（Fair）** | JSON-LD 修正・500 エラー解消・NAP 統一 |
| Week 2 完了後 | **67/100（Fair）** | 行政書士掲載・著者ページ・外部引用 |
| Week 3-4 完了後 | **74/100（Fair+）** | llms.txt 拡充・コンテンツ追加・プラットフォーム展開 |
| 3ヶ月後（目標） | **80/100（Good）** | ブランド権威強化・YouTube・外部メディア掲載 |

---

*Skill: geo-audit（GEO Audit Orchestration Skill）*  
*MCP: WebFetch（本番サイト 16 URL 直接取得）*  
*補助データ: ohakajimai_audit_clean.json（SiteLens 42ページ監査）*
