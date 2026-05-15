# GEO Audit Report: お墓じまいナビ

**Audit Date:** 2026-05-09
**URL:** https://www.ohakajimai-navi.jp
**Business Type:** Local Business / Professional Service (全国対応)
**Pages Analyzed:** 9 (Homepage + 5 key pages + robots.txt + llms.txt + sitemap.xml)
**Branch audited against:** Production (chore/seo-eeat-and-agent-tooling の修正は未デプロイ)

---

## Executive Summary

**Overall GEO Score: 68/100 (Good)**

ローカルビジネスとしてのクローラーアクセスは完璧（100点）、コンテンツの引用可能性も高い（87点）。しかし **ブランド権威が極めて低い（18点）** ことが全体スコアを大幅に引き下げている。Wikipedia・Reddit・YouTube・LinkedInのいずれも存在しない。加えて、ホームページに **スキーマ @id 衝突**（Organization と LocalBusiness の重複定義）という新たな Critical 問題が発見された。

ローカル改修（現ブランチ）で対応済みの3件（openingHours修正・SpeakableJsonLd追加・llms.txt Optional追加）は **本番に未反映**。デプロイ後に再検証が必要。

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 87/100 | 35% | 30.45 |
| Brand Authority | 18/100 | 30% | 5.40 |
| Crawler Access | 100/100 | 25% | 25.00 |
| llms.txt Quality | 70/100 | 10% | 7.00 |
| **Overall GEO Score** | | | **67.85 → 68/100** |

---

## Critical Issues (Fix Immediately)

### C-1: Duplicate Organization @id conflict (homepage)
**File:** `src/app/layout.tsx` (Block 1) vs `src/components/seo/organization-json-ld.tsx` (Block 6)

両ブロックが同一 `@id: "#organization"` を持つ。Block 1（layout.tsx）は `sameAs` のみの最小定義で、telephone・address・foundingDate が欠落している。DOMで先に登場するためパーサーによってはこの不完全なブロックが採用される。

**Fix:** `layout.tsx` の `organizationLd` スクリプトブロックを削除する。`organization-json-ld.tsx` の完全定義に一本化。

### C-2: SpeakableSpecification が homepage に存在しない（本番未反映）
ローカルブランチでは `src/app/page.tsx` に追加済みだが、本番HTMLに反映されていない。全内部ページ（about, flow, price, sankotsu）には存在するが、最重要ページであるホームページのみ欠落。

**Fix:** デプロイ実行。

### C-3: openingHoursSpecification が "09:00-17:00 全7日" のみ（本番未反映）
サイト本文は「24時間365日受付」と記載。ローカルで2仕様に分離済みだがデプロイ未実施。現状は矛盾スキーマのまま本番に存在する。

**Fix:** デプロイ実行。

---

## High Priority Issues

### H-1: Duplicate LocalBusiness entities (homepage)
`layout.tsx` が `@id: "#localbusiness"`（型: LocalBusiness）を定義し、`local-business-json-ld.tsx` が `@id: "#local-business"`（型: LocalBusiness+ProfessionalService）を定義している。同一ビジネスを指す2つの異なるエンティティが共存。

**Fix:** `layout.tsx` の `localBusinessLd` スクリプトブロックを削除する。`local-business-json-ld.tsx` のみ残す。（C-1と同一ファイルの変更なので合わせて対応）

### H-2: AggregateRating に Review オブジェクトが存在しない（本番未反映）
`ratingValue: 4.5, reviewCount: 28` は Google Maps 由来と推定されるが、裏付けとなる `Review` オブジェクトが存在しない。ローカルで3件追加済みだがデプロイ未実施。

**Fix:** デプロイ実行。

### H-3: llms.txt に ## Optional セクションが存在しない（本番未反映）
ローカルで追加済みだがデプロイ未実施。

**Fix:** デプロイ実行。

### H-4: Wikipedia 存在なし
"お墓じまいナビ", "清蓮", "株式会社清蓮", "ohakajimai-navi" のいずれの表記でも Wikipedia 記事が存在しない。2008年設立・年間15万件市場のプレイヤーとして記事作成の根拠は十分にある。AIエンティティ認識の最大強化要因。

### H-5: /sankotsu にも LocalBusiness 重複ブロック
ホームページと同様のパターン。`/sankotsu` も2つの LocalBusiness エンティティを持つ。layout.tsx の削除で連動解消される。

---

## Medium Priority Issues

### M-1: YouTube チャンネル・動画の存在なし
「お墓じまい 流れ」「改葬手続き 方法」などのクエリでAIはYouTube動画を引用することが多い。VideoObjectスキーマは存在するが、それが示すYouTubeチャンネルが見つからない。

### M-2: LinkedIn 会社ページ（404）
`sameAs` に記載された `/company/seiren-japan` が404。E-E-ATシグナルとして影響するため、ページを作成するか `sameAs` から削除する必要がある。

### M-3: Reddit 言及なし
日本語Redditコミュニティでのブランド言及がゼロ。AI検索エンジンはRedditをニッチサービス質問の引用源として頻繁に使用する。

### M-4: blogPosting dateModified = datePublished（/about）
`/about` ページの BlogPosting スキーマで `dateModified` と `datePublished` が同一値（2024-01-15）。ページ更新が反映されておらず、AIの鮮度評価に悪影響。

### M-5: organization-json-ld.tsx の contactPoint に hoursAvailable が 09:00-17:00 のみ
openingHours修正に合わせて contactPoint も2仕様に更新すべき。

---

## Low Priority Issues

### L-1: 外部プレス・レビューサイト言及なし
Kakaku.com、epark、業界メディア（終活ジャーナル等）での言及がゼロ。Google Maps のみが外部信頼ソース。

### L-2: llms.txt の清蓮グループセクション名
現在 "清蓮グループ（供養・終活エコシステム）公式サイト" というセクション名だが、`## Optional` と `## Additional Context` に正規化することで llms.txt spec 準拠度が向上する。

### L-3: 離檀交渉サポートセクションのCitabilityが低い
ホームページの「離檀交渉サポート」H3は具体的なガイダンスを含まず（スコア28）。離檀料の目安や交渉ステップを追加すると引用可能性が上がる。

---

## Category Deep Dives

### AI Citability (87/100)

**強み:**
- `/about` の「2022年の改葬件数は約15万件超」は最高スコア（95点）の引用適格ブロック
- 費用相場「30万〜100万円程度」は自己完結型の数値情報として優秀
- DefinedTermSet スキーマ（専門用語8件）はAI辞書引用に直結
- HowTo 5ステップフローは構造化されていてAI抽出に適している
- FAQ回答はすべて直接引用可能な形式

**弱み:**
- Hero開口部のコピーはブランド専用で具体情報なし（スコア22）
- お客様の声はテキスト量が少なく数値化されていない（スコア25）

### Brand Authority (18/100)

現在存在するプラットフォーム: Facebook, Instagram, LINE, Google Maps（4.5/28件）, グループ5サイト

**不在プラットフォーム:** Wikipedia, Reddit, YouTube, LinkedIn

2008年創業・業界実績300件・全国対応という実績は、Wikipedia記事を正当化するには十分だが、記事が存在しない。AI言語モデルはWikipediaをエンティティ正規化の主要ソースとして使用するため、これが最大のブランド権威ギャップ。

### Crawler Access (100/100)

完璧な設定。GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot をすべて明示的に許可。sitemap.xml 参照あり。crawl-delay なし。不明ボット（Amazonbot, CCBot等）もワイルドカード `Allow: /` で通過可能。

### llms.txt Quality (70/100)

有効なH1・blockquote・8つのH2セクション・マークダウンリンク付き。専門用語辞書とFAQは特に優秀。`## Optional` 欠落（ローカルで修正済み・未デプロイ）と `/llms-full.txt` の不在が減点要因。

### Schema & Structured Data

13種類のJSONLDスキーマは業界水準を大きく上回る。主要問題は新規発見の重複エンティティ（C-1, H-1）。内部ページのスキーマ品質は高い。

---

## Quick Wins (今週実施)

1. **layout.tsx の organizationLd と localBusinessLd を削除** — C-1・H-1・H-5 を一括解消。専用コンポーネントに一本化。
2. **現ブランチをデプロイ** — C-2・C-3・H-2・H-3 を一括解消（openingHours修正, SpeakableJsonLd, Review 3件, llms.txt Optional）。
3. **LinkedIn /company/seiren-japan を作成** — M-2解消 + E-E-ATシグナル追加。
4. **/about の dateModified を現在日付に更新** — M-4解消。低コスト。
5. **organization-json-ld.tsx の contactPoint hoursAvailable を2仕様に更新** — M-5解消。

---

## 30-Day Action Plan

### Week 1: スキーマ汚染の完全除去 + デプロイ
- [ ] `layout.tsx` から `organizationLd` と `localBusinessLd` スクリプトブロックを削除
- [ ] 現ブランチ（chore/seo-eeat-and-agent-tooling）をデプロイ
- [ ] デプロイ後に Rich Results Test で Homepage スキーマを再検証
- [ ] `/about` の dateModified を今日の日付に更新

### Week 2: E-E-AT プラットフォーム整備
- [ ] LinkedIn 会社ページ作成（株式会社清蓮 / Seiren Inc.）
- [ ] YouTube チャンネル作成（動画は後でよい。チャンネル存在 → sameAs に追加）
- [ ] `sameAs` から LinkedIn 404 URL を一旦削除し、新しい正しいURLを追加
- [ ] llms.txt の清蓮グループセクションを `## Optional` + `## Additional Context` に正規化

### Week 3: コンテンツ引用可能性の強化
- [ ] ホームページ「離檀交渉サポート」セクションに離檀料目安（数値）と3ステップを追加
- [ ] `/about` の dateModified を実際の最終更新日に合わせる Automation を設定
- [ ] 「お客様の声」に rating 数値（5/5）と都市情報を plaintext で追加（schema Review と対応させる）

### Week 4: ブランド外部存在感の開始
- [ ] 業界メディア（終活ジャーナル・いい葬儀・お墓の教科書）への掲載依頼・プレス送付
- [ ] Wikipedia 記事草稿作成（改葬・お墓じまいの市場規模を主題に清蓮を事例として言及する形）
- [ ] Reddit 日本語コミュニティ（r/japan, r/japanlife）でお墓じまいQ&Aに回答（ブランド名前出しは慎重に）

---

## Appendix: Pages Analyzed

| URL | Schema Types Found | Key GEO Issues |
|---|---|---|
| https://www.ohakajimai-navi.jp | Organization×2, LocalBusiness×2, FAQPage, WebSite, ItemList, DefinedTermSet | C-1, C-2, C-3, H-1, H-2 |
| https://www.ohakajimai-navi.jp/about | Organization, LocalBusiness, BreadcrumbList, BlogPosting, FAQPage, WebPage, Article | M-4 |
| https://www.ohakajimai-navi.jp/flow | Organization, LocalBusiness, BreadcrumbList, HowTo, WebPage, Article, VideoObject | — |
| https://www.ohakajimai-navi.jp/price | Organization, LocalBusiness, BreadcrumbList, FAQPage, WebPage | — |
| https://www.ohakajimai-navi.jp/sankotsu | Organization, LocalBusiness×2, BreadcrumbList, FAQPage, WebPage, VideoObject, Service | H-5 |
| https://www.ohakajimai-navi.jp/company | (not retrieved in this audit) | — |
| https://www.ohakajimai-navi.jp/robots.txt | n/a | none — perfect |
| https://www.ohakajimai-navi.jp/llms.txt | n/a | H-3 (## Optional 欠落) |
| https://www.ohakajimai-navi.jp/sitemap.xml | n/a | none |

---

## Next Steps (優先度順)

1. **今すぐ**: `layout.tsx` の重複スキーマ削除 → PR作成 → デプロイ（C-1, H-1, H-5 解消）
2. **今週**: 現ブランチデプロイ（C-2, C-3, H-2, H-3 解消）
3. **今月**: LinkedIn作成・YouTube作成・/about dateModified 修正
4. **中長期**: Wikipedia・業界メディア・Reddit

デプロイ + layout.tsx 修正が完了すれば **GEO Score は 68 → 推定 77-79** に改善見込み（schema重複解消 + SpeakableJsonLd + Review + openingHours修正 + llms.txt の効果）。Brand Authority（18点）の改善が次の大きな跳躍ポイント。
