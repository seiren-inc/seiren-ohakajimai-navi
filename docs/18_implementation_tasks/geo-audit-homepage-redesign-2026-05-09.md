# GEO Audit + Homepage Frontend Redesign

| 項目 | 値 |
|------|---|
| 作成日 | 2026-05-09 |
| 最終更新 | 2026-05-09 |
| 担当 | Claude Code (Sonnet 4.6) |
| 関連ブランチ | chore/seo-eeat-and-agent-tooling |

---

## ゴール・非ゴール

- **ゴール:**
  - [x] GEO Audit の実行と GEO-AUDIT-REPORT.md の出力（本番サイト対象）
  - [x] ホームページ（HomepageClient.tsx）の美的改修（「温かみある誠実さ」方向性）
  - [x] 発見されたGEOスキーマ不整合の修正（24時間 vs 09:00–17:00）
  - [x] ホームページへの SpeakableJsonLd 追加
  - [x] llms.txt の仕様準拠（## Optional セクション追加）
  - [x] Noto Serif JP フォントの配線（layout.tsx + tailwind.config.ts）
- **非ゴール（やらないこと）:**
  - /about, /flow, /price など他ページのデザイン変更
  - EcosystemShowcase コンポーネント内部の変更
  - 新規パッケージのインストール
  - 認証・Stripe・RLS 関連の変更

---

## 美的方向性

**名称:** 温かみある誠実さ (Warm Sincerity)
**差別化アンカー:** Noto Serif JP の大見出しがエディトリアル誌の書き出しのような重さを持つ。お墓じまい業界で唯一の「本の一節」感。
**DFII スコア:** 17/20 → Excellent
**トーン2軸:** エメラルド（信頼・アクション） + アンバー（温かみ・注記）

---

## 実装チェックリスト

### Phase 1 — フォント配線（前提条件）

- [x] `tailwind.config.ts`: `fontFamily.serif` を追加（`var(--font-serif)` を使用）
- [x] `src/app/layout.tsx`: `Noto_Serif_JP` と `Noto_Sans_JP` を `next/font/google` で import
- [x] `src/app/layout.tsx`: `body` の inline `font-[...]` を削除し、font variable classes を付与

### Phase 2 — GEO スキーマ修正

- [x] `src/components/seo/local-business-json-ld.tsx`: `openingHoursSpecification` を24時間（電話/オンライン）と対面（09:00–17:00）の2仕様に分離
- [x] `src/components/seo/local-business-json-ld.tsx`: 3件の `Review` オブジェクト追加
- [x] `src/app/page.tsx`: `SpeakableJsonLd` import と追加（cssSelector: `["h1", ".typography-heading"]`）
- [x] `public/llms.txt`: `## Optional` セクションを追加（`/llms-full.txt` へのリンク）

### Phase 3 — HomepageClient.tsx デザイン改修

#### ヒーローセクション
- [x] H1: `font-serif` 適用、サイズ `text-2xl sm:text-4xl md:text-5xl lg:text-[4rem]`、`leading-[1.15]`
- [x] H1: `font-semibold` → `font-bold`
- [x] Hero オーバーレイ: グラデーションを薄くして画像をより表示
- [x] Eyebrow の下にシン区切り線を追加

#### 信頼バー
- [x] 数字カラー: `text-emerald-600` → `text-emerald-700`
- [x] 初回実績に「2008年創業・横浜」の footnote を追加

#### 選ばれる3つの理由
- [x] H2: `font-serif` 適用
- [x] H3 × 3: `font-serif` 適用
- [x] 番号ラベル（01/02/03）: pill バッジ化
- [x] 理由3「他社にない独自サービス」バッジ: amber カラーに変更

#### 中間CTA帯
- [x] `bg-emerald-600` → `bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-500`
- [x] H2: `font-serif` 適用
- [x] サブテキスト: `opacity-90` 削除 → `text-emerald-100` に統一

#### サービス内容セクション
- [x] H2: `font-serif` 適用
- [x] H3（各サービスタイトル）: `font-serif` 適用
- [x] 番号: emerald → neutral-300 モノスペース（視覚的デノイズ）
- [x] アイコンコンテナ: `ring-1 ring-emerald-100` 追加
- [x] カードホバー: `hover:border-emerald-200` 追加

#### 改葬手続きステップ
- [x] H2: `font-serif` 適用
- [x] Step ラベル: pill 化
- [x] H3: `font-serif` 適用
- [x] 情報ノート: `bg-neutral-50` → `bg-amber-50/40 border border-amber-100`（amber=注記を確立）

#### 対応範囲
- [x] H2: `font-serif` 適用
- [x] H3 × 2: `font-serif` 適用
- [x] チェックアイコン: `h-3 w-3` → `h-3.5 w-3.5`
- [x] 「行わないこと」カード: `border-2 border-amber-200` → `border border-amber-200/60`

#### ご依頼の流れ
- [x] H2: `font-serif` 適用
- [x] タイムライン接続線: `bg-gray-200` → `bg-emerald-100`
- [x] 最終ステップ円: `ring-4 ring-emerald-100` 追加
- [x] バッジ: `bg-emerald-50 text-emerald-600` → `bg-emerald-100 text-emerald-700 border border-emerald-200`
- [x] H3: `font-serif` 適用

#### 料金
- [x] セクション bg: `bg-neutral-50` → `bg-white`
- [x] H2: `font-serif` 適用
- [x] H3: `font-serif` 適用
- [x] アイコン: `bg-emerald-50 p-3 rounded-2xl` コンテナで wrap

#### ご自分で手続き
- [x] H2: `font-serif` 適用

#### お客様の声
- [x] H2: `font-serif` 適用
- [x] 引用テキスト: `font-serif` 適用、`leading-[2]`
- [x] カードボーダー: `border-neutral-200` → `border-neutral-100`

#### よくある質問
- [x] H2: `font-serif` 適用
- [x] 質問テキスト: `font-serif` 適用
- [x] 回答テキスト: `text-[15px] leading-[1.85]`
- [x] 区切り線: `divide-gray-200` → `divide-neutral-100`

#### 最終CTA
- [x] H2: `font-serif` 適用
- [x] 感情的サブノート追加

### Phase 4 — 検証

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] Chrome で H1 の computed font-family が "Noto Serif JP" であることを確認
- [ ] Network タブ: フォントが `/_next/static/` からセルフホスト配信されていること
- [ ] 375px モバイル: テキストオーバーフロー・横スクロールなし
- [ ] anchor links (#kaisou-steps, #flow, #pricing) が動作すること

---

## 変更ファイル一覧

| ファイル | 変更種別 | 説明 |
|---|---|---|
| `tailwind.config.ts` | 修正 | `fontFamily.serif` 追加 |
| `src/app/layout.tsx` | 修正 | Noto フォント配線 |
| `src/components/seo/local-business-json-ld.tsx` | 修正 | 24時間スキーマ修正 + Review 3件 |
| `src/app/page.tsx` | 修正 | SpeakableJsonLd 追加 |
| `public/llms.txt` | 修正 | ## Optional セクション追加 |
| `src/components/home/HomepageClient.tsx` | 修正 | デザイン改修（1085行） |

---

## 参照

- 計画ファイル: `~/.claude/plans/federated-mapping-teacup.md`
- SEO ロードマップ: `docs/ai/seo-geo-meo-implementation-plan.md`
