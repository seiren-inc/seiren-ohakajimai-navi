# global-rules.md — seiren-ohakajimai-navi

> グループ: **A（清蓮 / Seiren）**  
> 最終更新: 2026-03-19

---

## 1. ブランドアイデンティティ

### カラーシステム

| 役割 | トークン名 | HEX | 用途 |
|------|-----------|-----|------|
| メインカラー | `--seiren-blue` | `#3399CC` | CTA・リンク・プライマリ |
| アクセント | `--seiren-pink` | `#D98CB3` | 感情訴求・アクセント |
| サポート | `--seiren-green` | `#99CC66` | 区切り・補助 |
| 背景 | `--bg-base` | `#FFFFFF` | メイン背景 |
| 深い黒 | `--text-base` | `#1A1A1A` | 本文テキスト |

> このプロジェクトはTailwind CSS v4（CSS変数ベース）を使用。
> `tailwind.config.ts` の `hsl(var(--primary))` 系トークンと整合すること。

### ブランドトーン
- 「死を避ける文化」ではなく「故人との繋がり」を大切にするトーン
- 過度に明るく・過度に暗くならない、**温かく誠実な**表現
- AI感・プレゼン感のある言葉は一切使わない

---

## 2. デザインシステム

### 基本方針
- **水彩調・滲み感**のあるビジュアルを基本とする
- 余白を広く取り、情報密度は低めに保つ
- カードや境界線は柔らかく（`rounded-2xl`以上）
- ボックスシャドウは薄く自然に（`shadow-md`程度。`shadow-xl`は原則禁止）

### 配色ルール
```css
/* CSS変数の上書き例（globals.css） */
:root {
  --primary: 201 58% 50%;           /* #3399CC */
  --primary-foreground: 0 0% 100%;
  --accent: 325 45% 65%;            /* #D98CB3 */
  --accent-foreground: 0 0% 100%;
}
```

---

## 3. アニメーション（Framer Motion v12）

このプロジェクトは `framer-motion@^12` を使用。

### 必須パターン：ゆっくりとした浮き上がり + フェード

```tsx
// components/ui/FadeUp.tsx
import { motion } from "framer-motion"

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

export function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
```

### スクロールフェード（セクション単位）

```tsx
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.0, ease: "easeOut", staggerChildren: 0.15 },
  },
}
```

### 禁止パターン
- `duration` が 0.3秒未満のトランジション（せっかちな印象を与える）
- `spring` の `stiffness > 200`（バウンドが強すぎる）
- スライドイン横移動（水平方向は原則禁止）

---

## 4. フォント

```tsx
// app/layout.tsx
import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google"

const serif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-serif",
})

const sans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
})
```

| 要素 | フォント | 理由 |
|------|---------|------|
| `h1`, `h2` | Noto Serif JP（明朝） | 格調・信頼感 |
| `h3`以下 | Noto Sans JP（ゴシック） | 可読性 |
| 本文 | Noto Sans JP | 長文で疲れない |
| 数字・価格 | Tabular Nums + Noto Sans JP | アライメント |

---

## 5. SEO / GEO（地域SEO）

### 最優先エリア
横浜市・横浜市内各区 / 鎌倉市 / 逗子市 / 葉山町 / 藤沢市 / 茅ヶ崎市 / 熱海市

### JSON-LDパターン（LocalBusiness）

```tsx
// 各エリアページで必須
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "清蓮 お墓じまいナビ",
  "description": "神奈川県・横浜・湘南エリアのお墓じまい・改葬・墓地情報",
  "areaServed": [
    { "@type": "City", "name": "横浜市" },
    { "@type": "City", "name": "鎌倉市" },
    { "@type": "City", "name": "熱海市" },
  ],
}
```

### metaキーワード指針
- `[エリア名] + お墓じまい` / `[エリア名] + 改葬` / `[エリア名] + 墓地` を基本パターンとする
- ogタイトルに必ずエリア名を含める

---

## 6. 技術スタック最適化パターン

**スタック**: Next.js 15 / React 19 / Framer Motion v12 / Radix UI / Prisma / Supabase / Tailwind CSS v4

### Server Components 優先ルール
```tsx
// デフォルトはServer Component
// アニメーション・インタラクションが必要な場合のみ "use client"
"use client"
```

### Radix UI + cn() パターン
```tsx
import { cn } from "@/lib/utils"
import * as Dialog from "@radix-ui/react-dialog"

// variant定義はcva()で行い、インラインclassは禁止
```

### Prisma クエリ最適化
```ts
// N+1を避けるため、必ず include または select を明示
const graves = await prisma.graveyard.findMany({
  select: { id: true, name: true, area: true, lat: true, lng: true },
  where: { area: { in: ["横浜市", "鎌倉市"] } },
})
```

### Supabase RLS
- すべてのテーブルにRLSポリシーを必ず設定すること
- `anon` ロールへの過剰な権限付与を禁止

### Upstash Rate Limit
```ts
// API Routeには必ずrate limitを適用
import { Ratelimit } from "@upstash/ratelimit"
const ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "10 s") })
```

---

## 7. コンポーネント設計ルール

- ファイル命名: `PascalCase.tsx`（コンポーネント）/ `kebab-case.ts`（ユーティリティ）
- `src/components/ui/` → Radix UIラッパー（汎用）
- `src/components/features/` → ビジネスロジック含むコンポーネント
- `src/app/` → Page / Layout のみ（ロジックを持たない）
- Props は必ず TypeScript 型定義（`interface` or `type`）を使用
- `any` 型の使用禁止

---

## 8. 禁止事項

- ハードコードされた個人情報・APIキーのコミット
- `console.log` の本番コードへの混入
- `!important` の使用（Tailwind競合解決は `cn()` で行う）
- `useEffect` 内での非同期データフェッチ（Server Componentまたは `use()` を使用）
- 画像の `<img>` タグ直接使用（`next/image` を必ず使用）

---

## 9. アニメーション アクセシビリティ基準（2026追加）

### useReducedMotion 必須ルール

**すべてのアニメーションコンポーネントに `useReducedMotion` を実装すること。**

```tsx
// lib/motion.ts — 全プロジェクト共通のモーション設定
import { useReducedMotion } from "framer-motion"

/**
 * OS の「視差効果を減らす」設定を尊重する共通フック。
 * アニメーションが有効か否かをboolean で返す。
 */
export function useMotionSafe() {
  const prefersReduced = useReducedMotion()
  return !prefersReduced
}
```

```tsx
// 使用例：FadeUpコンポーネントでの適用
"use client"
import { motion, useReducedMotion } from "framer-motion"

export function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 24 }}
      whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
      transition={prefersReduced ? {} : { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  )
}
```

### Suspense による複雑エフェクトの遅延

**Lighthouse パフォーマンスに影響する複雑なエフェクトは必ず `Suspense` でラップする。**

```tsx
// Three.js・重いCanvas・インタラクティブマップは必ずこのパターン
import { Suspense } from "react"
import dynamic from "next/dynamic"

const HeavyEffect = dynamic(() => import("@/components/HeavyEffect"), { ssr: false })

export function PageSection() {
  return (
    <section>
      {/* LCP対象コンテンツは先に表示 */}
      <h2>見出し</h2>
      {/* 重いエフェクトはSuspense + dynamic import */}
      <Suspense fallback={<div className="animate-pulse bg-gray-100 h-64 rounded-2xl" />}>
        <HeavyEffect />
      </Suspense>
    </section>
  )
}
```

### パフォーマンス基準
- `animation-duration` が不要に長い場合（2秒超）は `useReducedMotion` がOFF時も短縮を検討
- `will-change: transform` は必要な要素のみに適用（多用禁止）
- LCP要素（hero画像・h1）にアニメーションを付けることは禁止

---

## Tailwind CSS v4 アニメーション定義（2026追加）

> このプロジェクトはTailwind CSS v4 対応のため、以下の @keyframes を `app/globals.css` に追加する。
> ※ seiren-ohakajimai-navi は tailwind.config.ts でも定義済み（両方利用可）。

### app/globals.css への追記

```css
/* =============================================
   2026: Shimmer・Floating・Glow アニメーション（清蓮向け）
   ============================================= */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

@keyframes floating {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
}

@keyframes floating-slow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-6px) rotate(0.5deg); }
  66%       { transform: translateY(-3px) rotate(-0.3deg); }
}

/* 清蓮専用: 水の輝き（pulse-glow） */
@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; filter: blur(14px); }
  50%       { opacity: 1;   filter: blur(8px); }
}

/* =============================================
   Shimmer ユーティリティ（スケルトンUI用）
   ============================================= */
@utility shimmer-bg {
  background: linear-gradient(
    90deg,
    #e8f4f8 25%,
    #f5f9fb 50%,
    #e8f4f8 75%
  );
  background-size: 200% 100%;
}

@utility animate-shimmer       { animation: shimmer 2.0s linear infinite; }
@utility animate-floating      { animation: floating 5.0s ease-in-out infinite; }
@utility animate-floating-slow { animation: floating-slow 10.0s ease-in-out infinite; }
@utility animate-pulse-glow    { animation: pulse-glow 4.0s ease-in-out infinite; }
```

### 使用例

```tsx
// スケルトンローディング（清蓮ブランドカラーベース）
<div className="animate-shimmer shimmer-bg h-48 rounded-2xl" />

// 浮遊するアイコン・バッジ
<div className="animate-floating">
  <Image src="/icon-lotus.svg" alt="清蓮" width={48} height={48} />
</div>
```

