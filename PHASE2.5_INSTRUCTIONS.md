# Phase 2.5 実装指示書 — GEMINI CLI 用

> 作成: Antigravity
> 対象: seiren-ohakajimai-navi
> 実行者: GEMINI CLI
> 完了条件: `npm run verify` がエラー0で通ること

---

## ルール

1. **上から順番に1つずつ実行**すること
2. 各タスク完了後、`npm run typecheck` を実行して壊れていないか確認すること
3. 全タスク完了後、`npm run verify` を実行して最終確認すること
4. 修正が終わったタスクは `- [x]` に変更すること

---

## タスク一覧

### タスク1: middleware.ts — scrivener ルート保護

- [x] 対象ファイル: `src/middleware.ts`

**やること:**

1. L33 の `const isAdminRoute = ...` の直後に、以下の変数を追加:

```typescript
const isScrivenerProtectedRoute =
    request.nextUrl.pathname.startsWith("/scrivener") &&
    !request.nextUrl.pathname.startsWith("/scrivener/login") &&
    !request.nextUrl.pathname.startsWith("/scrivener/signup");
```

> ※ この変数は Antigravity が既に追加済み。存在を確認し、なければ追加。

2. L84 付近の `// Protect /admin routes` ブロックの **直後**（`}` の後）に、以下を追加:

```typescript
    // Protect /scrivener routes (except login/signup)
    if (isScrivenerProtectedRoute) {
        if (!user) {
            return NextResponse.redirect(new URL("/scrivener/login", request.url));
        }
    }
```

**確認ポイント:** `/scrivener/login` と `/scrivener/signup` はリダイレクトループしないこと。

---

### タスク2: contact-form.tsx — 都道府県47件展開

- [x] 対象ファイル: `src/components/features/contact/contact-form.tsx`

**やること:**

1. ファイル冒頭のインポートに以下を追加:

```typescript
import { PREFECTURES } from "@/lib/prefectures"
```

2. L282〜L289 あたりの都道府県 SelectContent を以下に **置き換え**:

**変更前（これを探す）:**
```tsx
<SelectContent>
    {/* Populate pref list properly later, simplified for brevity */}
    <SelectItem value="東京都">東京都</SelectItem>
    <SelectItem value="神奈川県">神奈川県</SelectItem>
    <SelectItem value="埼玉県">埼玉県</SelectItem>
    <SelectItem value="千葉県">千葉県</SelectItem>
    <SelectItem value="その他">その他</SelectItem>
</SelectContent>
```

**変更後（これに置き換え）:**
```tsx
<SelectContent>
    {PREFECTURES.map((pref) => (
        <SelectItem key={pref.code} value={pref.name}>{pref.name}</SelectItem>
    ))}
</SelectContent>
```

**確認ポイント:** 47都道府県が全て表示されること。「その他」は削除して良い。

---

### タスク3: contact-form.tsx — モバイルレスポンシブ修正

- [x] 対象ファイル: `src/components/features/contact/contact-form.tsx`（タスク2と同じファイル）

**やること:**

1. L168 あたりの姓/名グリッド:

**変更前:** `<div className="grid grid-cols-2 gap-4">`
**変更後:** `<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">`

2. L197 あたりのセイ/メイグリッド:

**変更前:** `<div className="grid grid-cols-2 gap-4">`
**変更後:** `<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">`

> ※ このファイルには `grid grid-cols-2 gap-4` が2箇所ある。両方とも変更すること。
> ※ L255 の郵便番号グリッドは既に `grid-cols-1 sm:grid-cols-[120px_1fr]` に修正済みなので触らない。

---

### タスク4: ConditionalLayout.tsx — ヘッダー二重描画修正

- [x] 対象ファイル: `src/components/layouts/ConditionalLayout.tsx`

**やること:**

L21 を変更:

**変更前:** `<Header />`
**変更後:** `{!hideGlobalLayout && <Header />}`

**完成形（return文全体）:**
```tsx
return (
    <>
      {!hideGlobalLayout && <Header />}
      <main className={hideGlobalLayout ? "pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0" : "flex-1 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0"}>{children}</main>
      {!hideGlobalLayout && <Footer />}
      <FixedCTA />
    </>
  )
```

---

### タスク5: FixedCTA.tsx — admin/scrivener 非表示

- [x] 対象ファイル: `src/components/ui/FixedCTA.tsx`

**やること:**

L11-12 を変更:

**変更前:**
```tsx
  const hidePaths = ["/estimation"]
  if (hidePaths.includes(pathname)) return null
```

**変更後:**
```tsx
  // 管理画面・行政書士ポータル・シミュレーションでは非表示
  if (
    pathname === "/estimation" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/scrivener")
  ) return null
```

---

### タスク6: PricingPageClient.tsx — スクロールオフセット修正

- [x] 対象ファイル: `src/app/price/PricingPageClient.tsx`

**やること:**

L170 を変更:

**変更前:** `const y = element.getBoundingClientRect().top + window.scrollY - 80`
**変更後:** `const y = element.getBoundingClientRect().top + window.scrollY - 112`

**理由:** Header (64px) + SubNav (48px) = 112px のオフセットが必要。

---

### タスク7: ESLint warning 修正（ボーナス）

- [x] 対象ファイル: `src/actions/submit-gyoseishoshi-inquiry.ts`

L96 あたりにある以下のコメントを **削除**:
```
// eslint-disable-next-line @typescript-eslint/no-explicit-any
```

---

## 最終確認

全タスク完了後:

```bash
npm run verify
```

エラー0、warning減少を確認。完了したら PLAN.md の作業ログに完了エントリを追記すること。
