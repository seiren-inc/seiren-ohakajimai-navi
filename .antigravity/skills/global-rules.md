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
