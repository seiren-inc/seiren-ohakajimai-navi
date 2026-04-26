# SEO / GEO / MEO 実装計画書
## お墓じまいナビ — 運用開始品質達成ロードマップ

**Agent:** Claude Code  
**作成日:** 2026-04-26  
**対象リポジトリ:** seiren-ohakajimai-navi  
**公開URL:** https://www.ohakajimai-navi.jp

---

## Used Skills
- `bugfix-flow` — /kaissou/kanagawa 500エラー調査フェーズ（前セッション）
- `docs-writer` — 本計画書作成
- `geo-audit` — GEO監査ワークフロー（前セッション）

## Used MCP
- `Vercel MCP` — 本番 runtime logs 取得（PrismaClientInitializationError確認）
- `Supabase MCP` — （接続確認済み、このセッションでは未使用）

## Why Needed
実コードを読まずに推測で計画を作ると設計書と乖離する。Vercel ログでしか判明しない本番エラーは MCP なしに確認不可能。`bugfix-flow` により root cause を特定してから計画を立てる必要があった。

---

## 現状完成度

| 領域 | 評価 | 詳細 |
|------|------|------|
| **総合** | **55/100** | 構造は完成、3つのブロッカーが収益化を阻害 |
| **SEO** | **72/100** | sitemap・robots・metadata は高品質。JSON-LD非表示が致命的 |
| **GEO** | **44/100** | AI対応インフラあり、llms.txt あり。スキーマ非表示で機能せず |
| **MEO** | **40/100** | LocalBusiness schema 定義済みだが非表示 + NAP不統一 |
| **CV導線** | **65/100** | 電話・フォーム・LINE完備。行政書士送客が0件で機能不全 |
| **技術品質** | **70/100** | 認証・Stripe・レート制限は実装済み。Turnstile未実装が Non-Negotiable 違反 |
| **管理画面** | **60/100** | 認証・MFA・行政書士管理画面は実装済み。スクリベナーが0件 |
| **運用準備** | **50/100** | Cron設定・CI/CD完備。メール送信ドメイン未確認で通知不到達リスク |

---

## 設計書との差分

### 設計上できていること（設計 ○ 実装 ○）
- Supabase SSR auth（getUser + MFA + WebAuthn）
- Stripe Webhook（constructEvent 署名検証）
- 全47都道府県 × 1,737市区町村 ページ構造
- municipality DB データ投入
- FAQ/HowTo/BreadcrumbList/Dataset JSON-LD 定義
- llms.txt / llms-full.txt 配置
- robots.txt AI クローラー許可設定
- Upstash rate limit（API routes）
- Vercel Analytics / GTM / GA4
- Cron（linkcheck 月1, audit 日次）

### 実装済みだが不完全なもの（設計 ○ 実装 △）
- **JSON-LD** — コンポーネント定義は完全。HTML出力に反映されない（要検証）
- **行政書士ディレクトリ** — Stripe決済フロー実装済み。審査済み登録者 0件
- **メール送信** — Resend実装済み。FROM domain が `system@osohiki-navi.jp`（未確認ドメイン）
- **NAP情報** — OrganizationSchema: `045-881-9952`。LocalBusinessSchema: `045-881-9952`。公開電話番号 `0800-888-8788` とスキーマが不一致
- **kaissou/[prefecture]/page.tsx** — `force-dynamic` → ISR化を前セッションで着手、typecheck 未完了
- **estimation/page.tsx** — sitemap.ts に `/estimation` が未記載

### 未実装のもの（設計 ○ 実装 ✗）
- **Cloudflare Turnstile** — CLAUDE.md Non-Negotiable違反。全公開フォームに必須
- **行政書士ランディングページコンテンツ** — gyoseishoshi/page.tsx は「準備中」表示のみ
- **都道府県別ユニークコンテンツ** — kaissou/[prefecture] は全47都道府県同一テンプレート
- **Google Business Profile 連携確認** — sameAs に Maps URL あり、GBP実態は未確認

### 設計と実装がズレていること
- **Turnstile**: CLAUDE.md に「必須」記載あり → 実装なし（grep で0件確認）
- **メールFROMドメイン**: `system@osohiki-navi.jp` は osohiki（旧サービス名）ドメイン。ohakajimai-navi.jp への変更未完了
- **OrganizationSchema @type**: `['Organization', 'LocalBusiness']` の二重型 → 設計でFix予定だが未実装
- **ISRキャッシュ**: 設計では kaissou/[prefecture] は `revalidate = 86400` 予定 → `force-dynamic` のまま（前セッションで修正着手中）

---

## SEO監査

### 現状評価: 72/100
基本インフラ（metadata, robots, sitemap, canonical）は高品質。致命的欠陥はJSON-LD非表示と `/estimation` のsitemap除外。

### 重大課題（即時対応）
1. **JSON-LD HTML非出力** — Rich Results Test FAIL確定。SiteLens Structured Data = 0/100
   - 確認方法: `curl https://www.ohakajimai-navi.jp | grep 'application/ld+json'`
   - 根拠: GEO-AUDIT-REPORT.md + SiteLens結果。コンポーネント定義は正しいため SSR 経路の問題
   - 想定原因: PPR(Partial Prerendering)によるストリーミング境界。layout.tsx でのコンポーネント配置位置
   - 影響: Google 構造化データ = 全滅、リッチリザルト = 0件

2. **/estimation sitemap未掲載** — AIツール費用試算ページが検索エンジン・AI未発見
   - ファイル: `src/app/sitemap.ts`
   - 修正: static routes 配列に `{ url: '/estimation', priority: 0.7, changeFreq: 'monthly' }` 追加

3. **OrganizationSchema @type二重定義** — `['Organization', 'LocalBusiness']` は validator error
   - ファイル: `src/components/seo/organization-json-ld.tsx`
   - 修正: `@type: 'Organization'` のみに変更。LocalBusiness は別コンポーネントに分離済み

### 中課題（1週間以内）
4. **kaissou/[prefecture] force-dynamic** — 本番 PrismaClientInitializationError 発生中
   - Vercel logs 確認: `/kaissou/kanagawa`, `/kaissou/aichi`, `/kaissou/fukushima` が 500
   - 修正: `export const dynamic = "force-dynamic"` → `export const revalidate = 86400`（着手済み）
   - 同様に `gyoseishoshi/area/[prefecture]` も `revalidate = 3600` → `86400`（着手済み）

5. **都道府県別コンテンツが同一テンプレート** — thin content リスク
   - 全47都道府県が同じ intro テキスト
   - GEO的には prefecture-specific FAQ + 行政手続き説明が必要

6. **NAP不統一** — OrganizationSchema phone: `045-881-9952`、公開CTA phone: `0800-888-8788`
   - MEO観点でNAP一致は必須
   - 設計決定: 公開スキーマは `0800-888-8788`、company page のみ `045-881-9952`

### 軽微課題（1ヶ月以内）
7. **column/[slug] ページの author schema 検証** — AuthorJsonLd コンポーネントは実装済み、実際の出力確認が必要
8. **llms-full.txt の充実** — 現状 2,200〜2,500語。5,000語以上が推奨ライン
9. **Blog記事数 23件** — 改葬関連キーワードカバレッジを50件以上に拡充が必要

### 収益影響
- JSON-LD修正 → Google リッチリザルト獲得 → CTR +20〜40%（推定）
- estimation sitemap追加 → AI検索でのルーティング改善 → リード品質向上
- 都道府県別コンテンツ → 「神奈川 お墓じまい」系ロングテールでの順位向上

---

## GEO監査

### 現状評価: 44/100 (GEO-AUDIT-REPORT.md 実測値)

### 重大課題
1. **JSON-LD非表示** — AI検索エンジンが事業者情報を構造化データから読めない
   - 影響: AI Citability スコア壊滅。GEO score 上限が 25/100 程度に制限される
2. **行政書士ディレクトリ 0件** — `/gyoseishoshi` が「準備中」→ AIが引用できるコンテンツなし
   - AI検索で「神奈川 お墓じまい 行政書士」に答えられない

### 中課題
3. **llms.txt は存在するが FAQカバレッジ不足** — 現状50問未満。100問以上が理想
4. **外部引用なし** — Wikipedia・e-Gov・厚労省ページへのリンクなし → E-E-A-T Authority が弱い
5. **Prefecture unique FAQs** — kaissou/[prefecture] の FAQ は汎用3問。都道府県固有の改葬規定を記述すべき

### 軽微課題
6. **HowTo schema** — `howto-json-ld.tsx` 実装済み。`/flow` ページでの使用確認が必要
7. **SpeakableJsonLd** — company page に実装済み。他のページへの拡張

### AI検索に拾われるための改善（優先順）
1. JSON-LD を HTML に確実に出力する
2. `/gyoseishoshi` ディレクトリを3件以上の実データで埋める
3. llms-full.txt を 5,000語以上に拡充（改葬手続き解説・FAQ・行政書士紹介）
4. 各都道府県ページに「{prefecture}での改葬許可申請の特徴」段落を追加
5. 参照リンク: e-Gov（`https://elaws.e-gov.go.jp/document?lawid=332M50400000042`） を kaissou ページに追加

---

## MEO監査

### 現状評価: 40/100

### 重大課題
1. **LocalBusiness schema HTML非表示** — Google Business Profile との連携データが読めない
2. **NAP不統一**
   - OrganizationJsonLd: `telephone: "045-881-9952"`, `hours: "00:00-23:59"`
   - LocalBusinessJsonLd: `telephone: "045-881-9952"`, `hours: "09:00-17:00"`
   - 公開CTA: `0800-888-8788`、`24時間受付`
   - Googleは NAP一致を厳格にチェック。3種類の不一致はペナルティリスク
3. **Geo座標不正確** — OrganizationJsonLd: `35.395 / 139.534`（小数4桁）
   - LocalBusinessJsonLd: `35.3960962 / 139.5300272`（精確）
   - Google Maps sameAs から取得した精確値を Organization にも適用が必要

### 中課題
4. **areaServed が不完全** — LocalBusinessJsonLd に横浜市・藤沢市・茅ヶ崎市・鎌倉市・川崎市のみ
   - 「全国対応」を宣伝しているが、schema は神奈川主要都市のみ
   - 修正: `{ "@type": "Country", "name": "日本" }` を追加 or 主要都市リスト拡充
5. **openingHoursSpecification** — Organization は `00:00-23:59`（不自然）
   - 実際のサービス受付は `09:00-18:00` 程度が適切

### 軽微課題
6. **GBP連携確認** — Google Maps URL は sameAs に記載済み。GBP管理者権限・投稿更新の確認が必要
7. **口コミ導線** — GBP への口コミ誘導リンクが公開ページに存在しない
8. **ローカルページのアクセス情報** — `/company` に地図埋め込みあり。`/contact` には地図なし

### Google Business Profile連携前提の改善
- GBP の `電話番号・住所・営業時間` を JSON-LD と完全一致させる
- `sameAs` の Google Maps URL が正しい GBP URLか確認
- GBP 投稿: 月1〜2件のサービス紹介投稿で鮮度維持

---

## CV導線監査

### 現状評価: 65/100

### 問い合わせ導線
- **フォーム**: `/contact` → `submit-inquiry.ts` → Resend通知 → `/contact/thanks`（noindex）
- **バリデーション**: Zod schema, sanitize, honeypot, DB-based rate limit (3/hour)
- **問題**: Turnstile 未実装 → ボットスパム脆弱性

### 電話導線
- FixedCTA (floating): `tel:08008888788` — 全ページ表示
- Header: `tel:08008888788` — ナビゲーション内
- ページ内CTA: flow, price, gyoseishoshi, municipality detail 各所
- **評価**: 完備。ただし `0800-888-8788` の表記揺れ（ハイフンなし vs あり）を統一すべき

### 行政書士送客導線
- **現状**: 0件の行政書士データ → `/gyoseishoshi` → 「準備中」表示
- **致命的**: 最重要収益導線が機能不全
- kaissou/[prefecture] ページ下部に `scriveners.length > 0` の場合のみ表示（条件分岐あり）
- 行政書士が0件のため全47都道府県でブロックされている

### LINE導線
- `line.me/R/ti/p/@956lieqb` — LINE Official Account
- `/company` のソーシャルリンクに掲載
- `/estimation` の AIEstimationWizard 完了後に QR コード表示
- **評価**: estimation後のLINE誘導は優秀。他ページへの展開が不足

### 離脱要因
1. `/gyoseishoshi` が「準備中」→ 期待裏切り → 離脱
2. `/estimation` が sitemap 外 → 入口が少ない
3. フォーム送信後メール未着（Resend FROM ドメイン問題）→ 顧客からの返信が届かない

### 改善案
- **即時**: 行政書士を最低3件 seed → `/gyoseishoshi` を機能させる
- **即時**: Resend FROM を検証済みドメインに変更
- **短期**: LINE誘導を `/flow`, `/price`, `/contact` 完了後にも配置
- **中期**: 「無料相談を申し込む」CTAを kaissou/[municipality] ページの above-the-fold に追加

---

## 技術・セキュリティ監査

### 現状評価: 70/100

### release blocker（リリース条件未達）
**R-1: Cloudflare Turnstile 未実装**
- CLAUDE.md: `"Cloudflare Turnstile is required for all public forms. Do not use react-google-recaptcha."`
- grep結果: `turnstile` = 0件
- 対象ファイル: `src/components/features/contact/contact-form.tsx`, `src/actions/submit-inquiry.ts`
- CLOUDFLARE_TURNSTILE_SECRET_KEY が .env.local に必要

### P0（本番障害）
**P0-1: /kaissou/[prefecture] 本番500エラー**
- エラー: `PrismaClientInitializationError` (Vercel runtime logs 確認済み)
- 影響: `/kaissou/kanagawa`, `/kaissou/aichi`, `/kaissou/fukushima` が500
- 根拠: `force-dynamic` → 全リクエストがDBヒット → Supabase connection pool 枯渇
- Fix: `revalidate = 86400` に変更（着手済み、typecheck 未完了）

**P0-2: Resend FROM ドメイン問題**
- `from: 'お墓じまいナビ <system@osohiki-navi.jp>'`
- `osohiki-navi.jp` は Resend で未確認ドメイン（TODO コメント確認済み）
- 問い合わせ送信後の自動返信・管理者通知が不到達
- Fix: `noreply@ohakajimai-navi.jp` または `system@seiren.ne.jp` に変更

### P1（品質問題）
**P1-1: JSON-LD HTML非出力**
- 全スキーマコンポーネントが SSR で出力されていない
- Rich Results Test, Google Search Console = エラー
- 調査: `curl https://www.ohakajimai-navi.jp | grep 'ld+json'` で確認

**P1-2: OrganizationSchema @type二重定義**
- `@type: ['Organization', 'LocalBusiness']` は schema.org validator でエラー
- Fix: Organization のみに変更

**P1-3: NAP情報不統一**
- 3系統の電話番号・時間情報が混在（前述）

### P2（改善事項）
**P2-1: ignoreBuildErrors = true**
- `next.config.ts` で TypeScript エラーを build 時に無視
- CI の typecheck で担保しているが、Vercel preview でエラーが見えない

**P2-2: unsafe-eval / unsafe-inline in CSP**
- GTM・Clarity の要件で許可されているが、XSS耐性が下がる
- 長期的には nonce ベースに移行検討

**P2-3: DB-based rate limit (submit-inquiry)**
- Upstash rate limit ではなく DB クエリによる実装（3/hour per IP）
- 機能的には問題ないが、DB負荷になる可能性

### 保留
- WebAuthn 実装状況（@simplewebauthn 依存関係あり、管理者登録フロー未検証）
- `api/scrivener/ai-profile` — auth + rate limit 確認済み、AI生成精度は未検証
- Three.js コンポーネント (`ssr: false`) のパフォーマンス影響

---

## 実装計画

> 前提: 1日3〜5時間、営業・法人営業と並行、1ヶ月以内に完成化

---

### Phase 1: 収益化最優先（Day 1〜5）

**Day 1: 本番エラー修正 + sitemap修正**
- [ ] `kaissou/[prefecture]/page.tsx`: `force-dynamic` → `revalidate = 86400` + typecheck通過
- [ ] `gyoseishoshi/area/[prefecture]/page.tsx`: `revalidate = 3600` → `86400`
- [ ] `src/app/sitemap.ts`: `/estimation` を static routes に追加（priority: 0.7）
- [ ] `npm run typecheck && npm run lint` 通過確認
- [ ] Vercel deploy → `/kaissou/kanagawa` 200確認

**Day 2: Resend メール FROM ドメイン修正**
- [ ] `src/actions/submit-inquiry.ts`: FROM を `noreply@ohakajimai-navi.jp` に変更
- [ ] `src/actions/submit-gyoseishoshi-inquiry.ts`: 同様の FROM 確認・修正
- [ ] Resend dashboard で `ohakajimai-navi.jp` ドメイン確認ステータス確認
- [ ] テスト: `/contact` フォーム送信 → 管理者・ユーザー両方にメール着信確認

**Day 3: 行政書士ダミーデータ投入（運用開始条件）**
- [ ] `npx prisma studio` で行政書士レコードを最低3件手動投入（isApproved=true, isActive=true, paymentStatus=PAID）
- [ ] 対象都道府県: 神奈川・東京・大阪（最重要）
- [ ] `/gyoseishoshi` ページで3件表示確認
- [ ] `/kaissou/kanagawa` 下部の行政書士セクション表示確認

**Day 4: JSON-LD HTML出力問題の調査と修正**
- [ ] `curl https://www.ohakajimai-navi.jp | grep -c 'ld+json'` で現状確認
- [ ] layout.tsx の JSON-LD コンポーネント配置を `<head>` vs `<body>` で確認
- [ ] PPR streaming boundary が原因か検証（`<Suspense>` ラップ外に配置）
- [ ] `npm run dev` → localhost で `view-source:` 確認
- [ ] Google Rich Results Test を staging URL で実行

**Day 5: OrganizationSchema 修正 + NAP統一**
- [ ] `organization-json-ld.tsx`: `@type: 'Organization'`（単一型に変更）
- [ ] `organization-json-ld.tsx`: `telephone: '0800-888-8788'`（公開番号に統一）
- [ ] `organization-json-ld.tsx`: `geo` を精確値 `35.3960962 / 139.5300272` に更新
- [ ] `organization-json-ld.tsx`: `hours: '09:00-17:00'` に修正
- [ ] `local-business-json-ld.tsx`: `telephone: '0800-888-8788'` に統一
- [ ] Google Rich Results Test で Organization + LocalBusiness 検証

---

### Phase 2: SEO/GEO/MEO強化（Day 6〜10）

**Day 6: Turnstile CAPTCHA 実装（Non-Negotiable対応）**
- [ ] `contact-form.tsx`: Cloudflare Turnstile widget 追加（`@marsidev/react-turnstile`）
- [ ] `submit-inquiry.ts`: サーバー側 Turnstile verification 追加
- [ ] `submit-gyoseishoshi-inquiry.ts`: 同様
- [ ] CLOUDFLARE_TURNSTILE_SECRET_KEY を .env.local + Vercel env に設定
- [ ] フォーム送信テスト（正常 + ボット検知）

**Day 7: GEO — llms.txt 拡充**
- [ ] `/public/llms.txt`: 現状 2,200語 → 5,000語以上に拡充
  - 追加内容: 改葬手続きガイド全文、FAQ 100問、行政書士費用相場、都道府県別改葬申請書情報
- [ ] `/public/llms-full.txt`: 同様に更新
- [ ] e-Gov 改葬規制法令URL `https://elaws.e-gov.go.jp/document?lawid=332M50400000042` を kaissou ページに参照追加

**Day 8: 都道府県ページ コンテンツ強化（SEO/GEO）**
- [ ] `kaissou/[prefecture]/page.tsx`: 都道府県別 intro テキストを `PREFECTURES` データから生成
  - 例: 神奈川県なら「神奈川県内の改葬許可申請は各市区町村の環境衛生課または市民課が担当。横浜市は特に独自書式を使用。」
- [ ] 都道府県別FAQを3問から6問に拡充
- [ ] `geoFaqs` 配列に: 「{prefecture}の改葬許可申請に必要な書類は？」「{prefecture}の申請窓口は？」「{prefecture}の改葬で使える行政書士は？」を追加

**Day 9: MEO — areaServed 拡充 + GBP確認**
- [ ] `local-business-json-ld.tsx`: areaServed に `{ "@type": "Country", "name": "日本" }` 追加
- [ ] `local-business-json-ld.tsx`: 全47都道府県を `serviceArea` として追加
- [ ] GBP（Google Business Profile）管理者ログイン → 電話番号・住所・営業時間が JSON-LD と一致確認
- [ ] GBP 投稿: サービス紹介記事1件投稿

**Day 10: CV導線強化 — LINE誘導 + CTA追加**
- [ ] `/flow/page.tsx`: フロー最後に LINE QR コード追加
- [ ] `/price/page.tsx`: 「まずLINEで相談する」ボタン追加
- [ ] `contact-form.tsx`: フォームの上に電話番号 + LINE ショートカットリンク追加
- [ ] kaissou/[municipality]/page.tsx: above-the-fold に「無料相談はこちら」CTA 追加

---

### Phase 3: 運用品質（Day 11〜14）

**Day 11: 技術品質 — 型安全・Lint完全通過**
- [ ] `npm run verify:ci` で全項目通過
- [ ] `gyoseishoshi/area/[prefecture]/page.tsx` の `prisma as any` キャスト（line 18）を型安全に修正
- [ ] `estimation/page.tsx` の H1 タグ追加（SEO ルール: H1 は必須）

**Day 12: パフォーマンス検証**
- [ ] `npm run verify:perf` → Lighthouse LCP < 2.5s, CLS < 0.1 確認
- [ ] Vercel Speed Insights で Core Web Vitals 確認
- [ ] `/kaissou/kanagawa` のレスポンスタイム測定（ISR化後の改善確認）

**Day 13: スキーマ完全検証**
- [ ] Google Rich Results Test: ホームページ, /company, /kaissou/kanagawa, /gyoseishoshi/[id]
- [ ] Schema.org validator で全スキーマ型検証
- [ ] Google Search Console で「構造化データ」レポート確認
- [ ] sitemap が Search Console に送信済みか確認

**Day 14: E2E・リリースゲート**
- [ ] `npm run test:e2e` — お問い合わせフロー、行政書士検索フロー
- [ ] `npm run verify:ci` 全通過
- [ ] 本番環境で /kaissou/kanagawa, /gyoseishoshi, /estimation すべて 200 確認
- [ ] 管理画面アクセス（/admin）MFA フロー確認

---

### Phase 4: 1ヶ月内の完成化（Week 3〜4）

**Week 3: コンテンツ充実**
- [ ] ブログ記事 23件 → 30件以上（改葬関連キーワードカバレッジ拡充）
- [ ] 行政書士 3件 → 10件以上（営業活動と連動）
- [ ] 都道府県別コンテンツ: 関東圏（東京・神奈川・埼玉・千葉）を優先的に強化
- [ ] HowTo schema が `/flow` ページで正常出力されているか確認・追加

**Week 4: GEO 評価向上**
- [ ] GEO-AUDIT-REPORT.md を再監査ツールで更新（目標: 44 → 65+ 点）
- [ ] llms.txt を主要AI検索エンジンがインデックスしているか確認
- [ ] Perplexity / ChatGPT / Gemini で「神奈川県 お墓じまい 行政書士」検索 → サイト引用確認
- [ ] 外部リンク獲得計画: 地域ニュースサイト・仏事業界メディアへのプレスリリース検討

---

## 担当分け

### Codex向き（コード生成 + 機械的実装）

**Task C-1: Turnstile CAPTCHA実装**
- reason: 手順が明確。既存フォームに追加するだけ。型安全に実装しやすい
- files:
  - `src/components/features/contact/contact-form.tsx`
  - `src/actions/submit-inquiry.ts`
  - `src/actions/submit-gyoseishoshi-inquiry.ts`
- acceptance criteria:
  - `CLOUDFLARE_TURNSTILE_SECRET_KEY` でサーバー検証通過
  - ボット送信を reject できる
  - `npm run typecheck` 通過

**Task C-2: OrganizationSchema + NAP修正**
- reason: 値の置き換えのみ。ロジック変更なし
- files:
  - `src/components/seo/organization-json-ld.tsx`
  - `src/components/seo/local-business-json-ld.tsx`
- acceptance criteria:
  - `@type: 'Organization'`（単一）
  - `telephone: '0800-888-8788'` 全スキーマ統一
  - `geo: { latitude: '35.3960962', longitude: '139.5300272' }`
  - `openingHoursSpecification opens: '09:00', closes: '17:00'`
  - Google Rich Results Test PASS

**Task C-3: sitemap.ts + 都道府県FAQ拡充**
- reason: データ操作のみ。既存パターンに追加するだけ
- files:
  - `src/app/sitemap.ts`
  - `src/app/kaissou/[prefecture]/page.tsx`
- acceptance criteria:
  - `/estimation` が sitemap に含まれる
  - `geoFaqs` が6問に拡充（都道府県名を使った質問）

**Task C-4: Resend FROM ドメイン修正**
- reason: 文字列の変更のみ
- files:
  - `src/actions/submit-inquiry.ts`（2箇所）
  - `src/actions/submit-gyoseishoshi-inquiry.ts`（存在確認後）
- acceptance criteria:
  - FROM が `noreply@ohakajimai-navi.jp` または承認済みドメイン
  - テスト送信でメール着信

**Task C-5: kaissou/[prefecture] ISR化（typecheck完了）**
- reason: 前セッションで変更着手済み。typecheck 通過まで仕上げるだけ
- files:
  - `src/app/kaissou/[prefecture]/page.tsx`（`revalidate = 86400` 変更済み）
  - `src/app/gyoseishoshi/area/[prefecture]/page.tsx`（`revalidate = 86400` 変更済み）
- acceptance criteria:
  - `npm run typecheck` 通過
  - deploy 後 /kaissou/kanagawa が 200

---

### Claude Code向き（調査 + 判断が必要な実装）

**Task CC-1: JSON-LD HTML出力問題の診断と修正**
- reason: SSR/PPR/Suspense境界の問題か、コンポーネント実装問題かの判断が必要
- files:
  - `src/app/layout.tsx`
  - `src/components/seo/organization-json-ld.tsx`
  - `src/components/seo/local-business-json-ld.tsx`
  - `src/components/seo/website-json-ld.tsx`
- acceptance criteria:
  - `curl https://www.ohakajimai-navi.jp | grep 'ld+json'` が 3件以上ヒット
  - Google Rich Results Test PASS

**Task CC-2: 行政書士ダミーデータ投入 + onboardingフロー確認**
- reason: Prisma Studio を使った手動投入 + スクリベナーのonboardingバグ調査が必要
- files:
  - Prisma Studio (GUI操作)
  - `src/actions/scrivener/auth.ts`
  - `src/actions/scrivener/profile.ts`
  - `src/actions/scrivener/payment.ts`
- acceptance criteria:
  - `/gyoseishoshi` が 3件以上表示
  - `/kaissou/kanagawa` の行政書士セクションが表示
  - Stripe test modeでの決済フロー確認

**Task CC-3: llms.txt 拡充 + e-Gov外部参照追加**
- reason: 内容の質判断が必要（どのFAQを追加するか、法令引用が正確かの確認）
- files:
  - `public/llms.txt`
  - `public/llms-full.txt`
  - `src/app/kaissou/page.tsx`（e-Gov参照リンク追加）
- acceptance criteria:
  - llms.txt が 5,000語以上
  - FAQ 100問以上
  - e-Gov法令リンクが正確

---

### Antigravity向き（UI改善 + コンテンツ設計）

**Task A-1: CV導線 LINE誘導UIの追加**
- reason: ユーザー体験を考慮したUI設計が必要。既存デザインシステムとの整合性確認
- screens:
  - `/flow` ページ末尾
  - `/price` ページ CTA エリア
  - `/contact` ページ フォーム上部
- acceptance criteria:
  - モバイル 375px でタップしやすい（48px以上）
  - Tailwind v4 + shadcn/ui のデザインシステムに沿う
  - LINE QR コード表示（estimation ページの実装を流用）

**Task A-2: /gyoseishoshi ページ 準備中→実データUIへの更新**
- reason: 3件のデータが入った後、どう見せるかのUIデザインが必要
- screens: `/gyoseishoshi`
- acceptance criteria:
  - ScrivenerCard の表示が適切
  - 「すべての行政書士を見る」CTA の配置
  - prefecture filter UI

**Task A-3: kaissou/[municipality] CTA強化**
- reason: above-the-fold への「無料相談」CTA 追加はページレイアウトへの影響あり
- screens: `/kaissou/kanagawa/yokohama-shi`
- acceptance criteria:
  - H1 + 市区町村情報の視認性を維持
  - 「無料相談はこちら」ボタンが above-the-fold に収まる
  - モバイル/PCどちらでも機能

---

## 優先順位

| ID | タスク | Priority | 担当 | 工数 |
|----|--------|----------|------|------|
| P0-1 | kaissou ISR化(typecheck完了) + deploy | **P0** | Codex | 1h |
| P0-2 | Resend FROM ドメイン修正 | **P0** | Codex | 0.5h |
| P0-3 | 行政書士ダミーデータ投入 | **P0** | Claude Code | 1h |
| P0-4 | JSON-LD HTML出力診断・修正 | **P0** | Claude Code | 2〜4h |
| P1-1 | Turnstile CAPTCHA実装 | **P1** | Codex | 2h |
| P1-2 | OrganizationSchema + NAP統一 | **P1** | Codex | 1h |
| P1-3 | sitemap + estimation追加 | **P1** | Codex | 0.5h |
| P2-1 | llms.txt拡充 | **P2** | Claude Code | 3h |
| P2-2 | 都道府県別FAQ拡充 | **P2** | Codex | 2h |
| P2-3 | MEO areaServed拡充 | **P2** | Codex | 1h |
| P2-4 | LINE導線UI追加 | **P2** | Antigravity | 2h |
| P3-1 | GBP確認・投稿 | **P3** | 人間（手動） | 1h |
| P3-2 | ブログ記事追加 | **P3** | 人間 or AI | 継続的 |
| P3-3 | 外部リンク獲得 | **P3** | 人間（営業） | 継続的 |

---

## 1日3〜5時間での現実的スケジュール

### 午前または夜にやる作業（集中が必要）
- JSON-LD診断（`curl` + `npm run dev` + Chrome DevTools でのHTML確認）
- Turnstile実装（サーバー側検証ロジック）
- 行政書士データ投入と表示確認

### 営業移動中にできる作業（スマホ・ノートで完結）
- GBP管理ページでの情報確認・投稿
- llms.txt の FAQ 追加（テキスト作業）
- ブログ記事の下書き

### 週末にまとめてやる作業
- 都道府県別コンテンツ拡充（関東5都県）
- E2E テスト実行 + Google Search Console 確認
- GEO 再監査（44点 → 65点目標）

### 先に外注またはAIに任せる作業
- ブログ記事の量産（AI生成 + 人間校正）
- 行政書士向け営業資料・LP（Antigravity で生成）
- llms-full.txt の FAQカバレッジ拡充（Claude Code に依頼）

---

## リスク

| リスク | 確率 | 影響 | 対策 |
|--------|------|------|------|
| **技術リスク** | | | |
| JSON-LD問題がPPR設計の深い部分に起因する | 中 | 高 | 最悪 layout.tsx に直接 script タグ埋め込みに変更 |
| Supabase connection pool が ISR化後も枯渇 | 低 | 高 | Supabase pooler URL（pgbouncer=true）への変更を検討 |
| Turnstile がモバイルUXを阻害 | 低 | 中 | invisible mode を使用 |
| **SEOリスク** | | | |
| JSON-LD修正後もインデックス反映に4〜8週かかる | 高 | 中 | Google Search Console で URL検査 → 即時インデックス要求 |
| force-dynamic → ISR変更でcanonical が変わる | 低 | 中 | canonical は path パラメータで生成済みのため影響なし |
| **GEOリスク** | | | |
| llms.txt を AI がインデックスするまで数週かかる | 高 | 低 | 改善は継続的プロセス。即効性は期待しない |
| スキーマ修正後 AI引用が増えない | 中 | 中 | 外部引用（e-Gov等）の追加でAuthority強化 |
| **MEOリスク** | | | |
| GBP と JSON-LD の NAP不一致でペナルティ | 中 | 高 | Day 5 の NAP統一 + GBP確認で解消 |
| **CVリスク** | | | |
| 行政書士が集まらず送客導線が機能しない | 中 | 高 | まずダミーデータでUI完成 → 営業活動と並行 |
| Resendドメイン変更で迷惑メール判定増加 | 低 | 中 | SPF/DKIM/DMARC設定を確認してから変更 |
| **運用リスク** | | | |
| Cron（linkcheck・audit）がエラーを出し続ける | 中 | 低 | Vercel ログで確認。必要に応じて Cron 修正 |

---

## 次に承認すべき1タスク

**task:** `/kaissou/[prefecture]/page.tsx` の ISR化 typecheck完了 + deploy

**担当:** Codex（または Claude Code）

**理由:**
- 本番で `/kaissou/kanagawa`, `/kaissou/aichi`, `/kaissou/fukushima` が 500 になっている
- 修正（`force-dynamic` → `revalidate = 86400`）は前セッションで完了済み
- typecheck が blocked されたまま（未commit・未deploy）
- 最短工数（30分以内）で本番500を解消できる最高優先度タスク
- deploy 後に行政書士投入・JSON-LD診断が続く

**触るファイル:**
- `src/app/kaissou/[prefecture]/page.tsx`（変更済み、commit待ち）
- `src/app/gyoseishoshi/area/[prefecture]/page.tsx`（変更済み、commit待ち）

**完了条件:**
- `npm run typecheck` 通過
- `npm run lint` 通過
- commit & push → Vercel deploy
- `https://www.ohakajimai-navi.jp/kaissou/kanagawa` が 200 返答

---

## Codexへ渡す最初の実装プロンプト

```
Agent: Codex
Task: kaissou/[prefecture] ISR化 + OrganizationSchema NAP修正 + sitemap estimation追加

## Context

Repository: seiren-ohakajimai-navi (Next.js 15 / TypeScript / Prisma 5)
Branch: feat/seo-meo-isr-fix (新規作成すること)
Public URL: https://www.ohakajimai-navi.jp

## Background

前セッションで以下2ファイルが変更済み（commit前）:
- src/app/kaissou/[prefecture]/page.tsx: `force-dynamic` → `revalidate = 86400`
- src/app/gyoseishoshi/area/[prefecture]/page.tsx: `revalidate = 3600` → `86400`

本番 /kaissou/kanagawa が 500 Error (PrismaClientInitializationError) になっている。
Vercel runtime logs で確認済み。原因: force-dynamic による DB connection pool 枯渇。

## Tasks

### Task 1: 変更済みファイルの確認とtypecheck通過

1. 以下を確認:
   - src/app/kaissou/[prefecture]/page.tsx に `export const revalidate = 86400` があること
   - src/app/gyoseishoshi/area/[prefecture]/page.tsx に `export const revalidate = 86400` があること
2. `npm run typecheck` を実行し、エラーがあれば修正
3. `npm run lint` を実行し、エラーがあれば修正

### Task 2: OrganizationSchema NAP統一

ファイル: src/components/seo/organization-json-ld.tsx

以下を変更:
- `'@type': ['Organization', 'LocalBusiness']` → `'@type': 'Organization'`
- `telephone: '045-881-9952'` → `telephone: '0800-888-8788'`
- `geo.latitude: '35.395'` → `geo.latitude: '35.3960962'`
- `geo.longitude: '139.534'` → `geo.longitude: '139.5300272'`
- `hoursAvailable.opens: '00:00', closes: '23:59'` → `opens: '09:00', closes: '17:00'`

ファイル: src/components/seo/local-business-json-ld.tsx

以下を確認・変更:
- `telephone` が `'0800-888-8788'` であること（違う場合は変更）
- `openingHoursSpecification.opens: '09:00', closes: '17:00'` であること

### Task 3: sitemap.ts に /estimation 追加

ファイル: src/app/sitemap.ts

static routes の配列に以下を追加（/contact の後に挿入）:
```typescript
{
  url: `${baseUrl}/estimation`,
  lastModified: now,
  changeFrequency: "monthly" as const,
  priority: 0.7,
},
```

### Task 4: Resend FROM ドメイン修正

ファイル: src/actions/submit-inquiry.ts

2箇所の `from:` フィールドを変更:
```typescript
// Before:
from: 'お墓じまいナビ <system@osohiki-navi.jp>'

// After:
from: 'お墓じまいナビ <noreply@ohakajimai-navi.jp>'
```

## Verification

すべてのタスク完了後:

```bash
npm run typecheck
npm run lint
npm run verify
```

すべて通過後に commit:
```
feat(seo): ISR化・OrganizationSchema NAP統一・sitemap estimation追加・Resend FROM修正

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Rules

- TypeScript の any 型使用禁止
- 既存のコードパターンから外れない
- DB schema変更・env変更・dependency追加は禁止
- 変更したファイルのみ commit する
- npm run typecheck が通るまで commit しない
```
