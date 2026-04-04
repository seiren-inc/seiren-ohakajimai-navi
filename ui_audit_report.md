# seiren-ohakajimai-navi 全体監査レポート

> 監査日時: 2026-04-02  
> 対象: public / admin / scrivener portal  
> スタック: Next.js App Router / TypeScript / Tailwind CSS / Supabase / Vercel

---

## 凡例

| 優先度 | 定義 |
|--------|------|
| **P0** | build不能・500・認証欠落・認可欠落・middleware bypass |
| **P1** | 主要フォーム不良・SSR/hydration問題・モバイル致命的崩れ・重要UI不良 |
| **P2** | hooks依存・anyキャスト危険箇所・empty/loading/error state弱い・軽中度レスポンシブ崩れ・不要 warning |
| **P3** | 軽微な見た目・dead code・copy修正・将来改善メモ |

---

## P0 — TypeScript / Build ブロッカー

### #P0-001 TypeScript エラー: `Button.tsx` `motion.button` 型不一致

| 項目 | 内容 |
|------|------|
| ファイル | `src/components/common/Button.tsx:65` |
| エラー | `TS2322`: `HTMLMotionProps<"button">` と `ButtonHTMLAttributes<HTMLButtonElement>` の `onDrag` 型不一致 |
| 再現 | `npx tsc --noEmit` → エラー1件 |
| 原因 | `motion.button` に `ButtonHTMLAttributes` の `DragEventHandler` がスプレッドされており framer-motion の型定義と衝突 |
| 影響 | `tsc --noEmit` 失敗。`TypeScript error 0` 未達 |
| 担当 | **Codex** |

**修正方針**: `motion.button` を使う場合は `Omit<ButtonHTMLAttributes, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>` を Props の base type にする。または `motion.button` を使わず通常の `button` に CSS transition で代替する。

---

### #P0-002 TypeScript エラー: `gtag.ts` duplicate `dataLayer` 宣言

| 項目 | 内容 |
|------|------|
| ファイル | `src/lib/analytics/gtag.ts:15` |
| エラー | `TS2687`: All declarations of 'dataLayer' must have identical modifiers |
| 再現 | `npx tsc --noEmit` → エラー1件 |
| 原因 | `declare global { interface Window { dataLayer: ... } }` が他所（GTM の型定義）と modifier 不一致 |
| 影響 | `tsc --noEmit` 失敗 |
| 担当 | **Codex** |

**修正方針**: `gtag.ts` の `Window` 拡張から `dataLayer` 宣言を削除し、GTM型定義側に一元化。

---

## P1 — ESLint エラー（完了条件違反）

### #P1-001 ESLint error: `column/[slug]/page.tsx` — `any` 型 9件

| 項目 | 内容 |
|------|------|
| ファイル | `src/app/column/[slug]/page.tsx:44-52` |
| エラー | `@typescript-eslint/no-explicit-any` × 9件 |
| 内容 | MDXコンポーネント定義で `h2`, `h3`, `p`, `ul`, `ol`, `li`, `a`, `strong`, `blockquote` の props を `any` にキャスト |
| 影響 | ESLint error 0 未達。ビルド通過でも CI でブロックされる可能性 |
| 担当 | **Codex** |

**修正方針**: MDX コンポーネントの props 型を `React.ComponentPropsWithoutRef<'h2'>` 等に変更する。

---

## P1 — 認証・認可

### #P1-002 `/scrivener/*` ルートが middleware で未保護

| 項目 | 内容 |
|------|------|
| ファイル | `src/middleware.ts` |
| 状態 | middleware は `/admin` のみ IP制限・MFA・認証を強制。`/scrivener/*` は個別ページの `supabase.auth.getUser()` 頼み |
| 現状 | 現在の `/scrivener/dashboard` `/scrivener/onboarding/plan` `/scrivener/onboarding/profile` は各々で auth + redirect を実装済み |
| リスク | 今後のページ追加時に auth チェック漏れが起きやすい設計。middleware による一元保護が望ましい |
| 担当 | **Codex** |

**修正方針**: middleware の保護対象に `/scrivener/dashboard(.*)` `/scrivener/onboarding(.*)` を追加し、未認証時は `/scrivener/login` へリダイレクト。`/scrivener/login` `/scrivener/signup` は対象外にする。

---

### #P1-003 `/api/debug-auth` に admin 権限チェックなし

| 項目 | 内容 |
|------|------|
| ファイル | `src/app/api/debug-auth/route.ts` |
| 状態 | 認証済みの任意ユーザーが叩ける。Prisma admin レコードを返す可能性 |
| リスク | 一般行政書士ユーザーが admin 情報を確認できる |
| 担当 | **Codex** |

**修正方針**: 本番環境（`NODE_ENV === 'production'`）では 404 を返すか、admin role チェックを追加する。

---

## P1 — 主要フォーム不良

### #P1-004 お問い合わせフォーム: 都道府県セレクトが5件のみ

| 項目 | 内容 |
|------|------|
| ファイル | `src/components/features/contact/contact-form.tsx:231-238` |
| 状態 | 東京都・神奈川県・埼玉県・千葉県・その他 のみ。残り42都道府県が欠落 |
| 影響 | 全国対応を謳うサービスとして機能不良。大阪・愛知・福岡等のユーザーが「その他」しか選べない |
| コード | `{/* Populate pref list properly later, simplified for brevity */}` のコメントが残存 |
| 担当 | **Codex** |

**修正方針**: 既存の `src/lib/prefectures.ts` (PREFECTURES 配列) が存在することをコードベースで確認済み。`contact-form.tsx` の prefectures Select に PREFECTURES をインポートして全47都道府県を列挙する。

---

## P1 — モバイル UI

### #P1-005 ConditionalLayout: ホームページで Header が二重描画

| 項目 | 内容 |
|------|------|
| ファイル | `src/components/layouts/ConditionalLayout.tsx:17-25` |
| 状態 | `hideGlobalLayout` は `pathname === "/"` で `true` になるが、`<Header />` は条件なしで常時描画される。Footer のみ条件付き非表示 |
| コメント | 「トップページのみ共通ヘッダー・フッターを非表示にする」と書かれているが Header 非表示が実装されていない |
| 影響 | ホームページで `HomepageClient` 内ヘッダーと共通 `Header` が二重に表示される可能性が高い |
| 担当 | **Antigravity** |

**修正方針**:
```tsx
{!hideGlobalLayout && <Header />}
<main ...>{children}</main>
{!hideGlobalLayout && <Footer />}
```

---

### #P1-006 お問い合わせフォーム: 姓/名グリッドがモバイル対応なし

| 項目 | 内容 |
|------|------|
| ファイル | `src/components/features/contact/contact-form.tsx:117, 146` |
| 状態 | `grid grid-cols-2 gap-4` に `sm:` 接頭辞なし。375px 以下でも2カラム固定 |
| 影響 | iPhone SE (375px) 以下で入力欄が狭い。姓/名・セイ/メイの4フィールドが詰まる |
| 担当 | **Antigravity** |

**修正方針**: `grid grid-cols-1 sm:grid-cols-2 gap-4` に変更。

---

### #P1-007 郵便番号+都道府県グリッドがモバイルで破綻リスク

| 項目 | 内容 |
|------|------|
| ファイル | `src/components/features/contact/contact-form.tsx:204` |
| 状態 | `grid grid-cols-[120px_1fr] gap-4 items-end` — モバイルでも常に2カラム固定 |
| 影響 | 120px 固定幅の郵便番号欄 + 1fr の都道府県 Select が狭い画面で窮屈 |
| 担当 | **Antigravity** |

**修正方針**: `grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4` に変更。

---

### #P1-008 Scrivener ダッシュボード: モバイルナビ欠落

| 項目 | 内容 |
|------|------|
| ファイル | `src/app/scrivener/dashboard/page.tsx:60-86` |
| 状態 | サイドバーが `hidden w-64 flex-col border-r bg-white md:flex` — モバイルでは非表示 |
| 影響 | モバイルからログアウトができない。決済・プラン管理へのアクセス不能 |
| 担当 | **Antigravity** |

**修正方針**: モバイル用のログアウトボタンとプラン管理リンクをメインコンテンツ上部に追加する（サイドバーの代替）。

---

### #P1-009 Price ページ sticky nav が header と重なる可能性

| 項目 | 内容 |
|------|------|
| ファイル | `src/app/price/PricingPageClient.tsx:170, 282` |
| 状態 | anchor クリック時のスクロールオフセットが `-80` ハードコード (`const y = ... - 80`）。sticky nav は `top-0 z-40`。Header は `sticky top-0 z-50` |
| 影響 | PC/モバイル共に anchor スクロール後にコンテンツがヘッダーに隠れる可能性 |
| 担当 | **Antigravity** |

**修正方針**: オフセットをヘッダー高さ（約64px）+ サブナブ高さ（約48px）= `112px` 相当に変更。

---

## P2 — コード品質・警告

### #P2-001 ESLint warnings 多数（未使用変数・import）

| ファイル | 内容 |
|---------|------|
| `HomepageClient.tsx` | `menuOpen`, `scrolled`, `relatedOpen`, `modalOpen`, `setModalOpen`, `scrollTo`, `navLinks`, `kaisouSubItems`, `HomepageComingSoonModal`, `relatedServices`, `useCallback`, `Menu` — 12件の未使用 |
| `PricingPageClient.tsx` | `Banknote`, `Users`, `Plus`, `Mail` — 4件の未使用 import |
| `sankotsu/page.tsx` | `CheckCircle2` — 1件 |
| `company/page.tsx` | `style` — 1件 |
| `ScrivenerEntryForm.tsx` | `useActionState` — 1件 |

担当: **Codex**

---

### #P2-002 `prisma as any` キャストが11ファイルに分散

| 項目 | 内容 |
|------|------|
| 対象ファイル | `admin/gyoseishoshi/page.tsx`, `admin/gyoseishoshi/[id]/page.tsx`, `scrivener/actions/submit-scrivener-entry.ts`, `actions/admin/scrivener-actions.ts`, `api/stripe/webhook/route.ts`, `api/stripe/checkout/route.ts`, `sitemap.ts`, `gyoseishoshi/page.tsx`, `gyoseishoshi/[id]/page.tsx`, `gyoseishoshi/area/[prefecture]/page.tsx`, `api/simulation-log/route.ts` |
| リスク | Prisma スキーマ変更時の型エラーが検出されない |
| 担当 | **Codex** |

**修正方針**: `prisma generate` を実行して型生成を最新化し、`as any` を削除できる箇所から順に修正。`db` 変数パターンを廃止。

---

### #P2-003 `eslint-disable` コメントが stale（無効化対象なし）

| 項目 | 内容 |
|------|------|
| ファイル | `src/actions/submit-gyoseishoshi-inquiry.ts:92` |
| 状態 | `// eslint-disable-next-line @typescript-eslint/no-explicit-any` が存在するが、対象行に `any` がなくなった |
| 担当 | **Codex** |

---

### #P2-004 `@ts-expect-error` コメント (5件)

| ファイル | 内容 |
|---------|------|
| `layout.tsx:46` | `fetchpriority` — HTML仕様上は正当。React型定義の追従待ち（低リスク） |
| `api/chat/route.ts:48,72` | AI SDK バージョン差異 — SDK アップグレードで解消予定 |
| `PasskeyButton.tsx:44,58` | Supabase experimental passkey API — 安定版に移行時に修正 |

担当: **Codex**（chat route の SDK は優先度高め）

---

### #P2-005 FixedCTA が admin / scrivener 画面でも表示される

| 項目 | 内容 |
|------|------|
| ファイル | `src/components/ui/FixedCTA.tsx:11` |
| 状態 | 非表示パスが `/estimation` のみ。admin / scrivener 画面でも電話・フォームCTAが表示される |
| 影響 | admin や scrivener ダッシュボードに公開向けCTAが表示され UX 阻害 |
| 担当 | **Antigravity** |

**修正方針**: `hidePaths` に `/admin`, `/scrivener` プレフィックスを追加。`pathname.startsWith('/admin') || pathname.startsWith('/scrivener')` で非表示。

---

### #P2-006 ScrivenerEntryForm: React Compiler memoization 警告

| 項目 | 内容 |
|------|------|
| ファイル | `src/components/features/gyoseishoshi/ScrivenerEntryForm.tsx:70` |
| 状態 | `form.watch()` は memoize 不可の関数を返すため React Compiler が Compilation Skipped |
| 担当 | **Codex**（react-hook-form pattern review） |

---

## P3 — 軽微・将来改善

### #P3-001 Admin テーブルはモバイル非対応（水平スクロールのみ）

`admin/inquiries/page.tsx`, `admin/gyoseishoshi/page.tsx` のテーブルは `overflow-x-auto` で対応しているが、モバイルでの視認性は低い。将来的にカード表示への切り替えを検討。

担当: **Antigravity**（将来フェーズ、現在は P3）

---

### #P3-002 AdminAuditLog テーブルの beforeValue/afterValue truncate

`admin/gyoseishoshi/[id]/page.tsx:345,350` の `max-w-[160px] truncate` により長い JSON が読めない。Tooltip またはモーダル表示を検討。

担当: **Antigravity**（P3）

---

### #P3-003 Footer で `/kaissou` と `/kaissou/tokyo` が混在

`footer.tsx:36` に `/kaissou`（全国対応）へのリンクがあるが URL が `/kaissou` と `/kaissou/tokyo` 等で混在しているため SEO 正規化を確認。

---

## 分類サマリー

### Codex 担当

| ID | 内容 |
|----|------|
| P0-001 | Button.tsx TS2322 修正 |
| P0-002 | gtag.ts TS2687 修正 |
| P1-001 | column/[slug]/page.tsx ESLint any 9件修正 |
| P1-002 | middleware に scrivener 保護追加 |
| P1-003 | debug-auth API に admin チェック追加 |
| P1-004 | contact-form 都道府県 Select 全47件追加 |
| P2-001 | 未使用変数・import 整理 |
| P2-002 | prisma as any 段階的修正 |
| P2-003 | stale eslint-disable 削除 |

### Antigravity 担当

| ID | 内容 |
|----|------|
| P1-005 | ConditionalLayout Header 二重描画修正 |
| P1-006 | contact-form 姓/名グリッド responsive 修正 |
| P1-007 | 郵便番号+都道府県グリッド responsive 修正 |
| P1-008 | Scrivener dashboard モバイルナビ追加 |
| P1-009 | Price ページ anchor スクロールオフセット修正 |
| P2-005 | FixedCTA admin/scrivener 非表示追加 |

---

## 完了条件チェックリスト（現状）

| 条件 | 現状 |
|------|------|
| TypeScript error 0 | ❌ 2件 (P0-001, P0-002) |
| ESLint error 0 | ❌ 9件 (P1-001) |
| build blocker 0 | ❌ TS エラーが原因 |
| 重大 warning 0 | ⚠️ 複数（P2-001） |
| 重大な認証欠落 0 | ⚠️ scrivener middleware 保護なし (P1-002) |
| 重大な認可欠落 0 | ⚠️ debug-auth API 無防備 (P1-003) |
| owner-scoped action に所有者検証あり | ✅ payment.ts, profile.ts は authUserId で owner check あり |
| admin-scoped action に role check あり | ✅ admin layout + middleware で admin 限定 |
| 主要 API / server action が未認証通過しない | ✅（debug-auth 除く） |
| public/admin/scrivener 主要導線に機能不良なし | ❌ contact form 都道府県不完全 (P1-004) |
| PC/mobile に致命的崩れなし | ❌ Header 二重描画 (P1-005), モバイルダッシュボードナビなし (P1-008) |
| 404/500 導線が破綻していない | ✅ not-found.tsx / error.tsx あり |
| middleware が意図しない通過なし | ✅（scrivener は個別 check あり、設計は改善余地あり） |
| 主要フォーム送信・バリデーション・エラー成立 | ❌ 都道府県データ不完全 (P1-004) |
