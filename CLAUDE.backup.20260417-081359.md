# CLAUDE.md — seiren-ohakajimai-navi（技術エージェント向け憲法）

> 最終更新: 2026-03-19 | Package Manager: npm | Node: >=20.0.0

---

## コマンド一覧

```bash
npm run dev          # 開発サーバー起動 (Next.js Turbopack)
npm run build        # prisma generate && next build
npm run start        # 本番サーバー起動
npm run lint         # ESLint（srcフォルダ対象）
npm run typecheck    # tsc --noEmit
npm run verify       # lint + typecheck
npm run verify:ci    # verify + prisma validate + quality:gate + verify:seo
npm run test         # Vitest
npm run test:e2e     # Playwright
npm run verify:perf  # Lighthouse（localhost:3000）
npm run audit:ai     # AIによる品質監査スクリプト
npm run quality:gate # 品質ゲート検証
npx prisma migrate dev    # DBマイグレーション（開発）
npx prisma studio         # DB管理UI
```

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| Framework | Next.js 15.x (App Router) |
| React | 19.x |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS v4 + tailwindcss-animate |
| UI | shadcn/ui (Radix UI ベース) |
| Animation | Framer Motion v12 / GSAP 3 / Lenis |
| 3D | Three.js / @react-three/fiber / @react-three/drei |
| Database | Prisma 5.x + Supabase (PostgreSQL) |
| Auth | Supabase Auth (SSR) + WebAuthn (@simplewebauthn) |
| AI | Vercel AI SDK v6 (@ai-sdk/openai) |
| Mail | Resend |
| Payment | Stripe |
| Cache | Upstash Redis + Rate Limit |
| Analytics | Vercel Analytics + Speed Insights |
| Testing | Vitest + Playwright |

---

## TypeScript 規約

```ts
// ✅ 型定義は interface または type を必ず使用
interface GraveyardCard { id: string; name: string; area: string }

// ❌ 禁止
const data: any = {}           // any型禁止
const fn = async () => {}      // 戻り型を省略しない

// ✅ Server Action パターン
"use server"
export async function createInquiry(data: InquiryInput): Promise<ActionResult> {}

// ✅ Server Component（デフォルト）/ Client Component（アニメーション・インタラクション時のみ）
"use client"

// ✅ パス解決
// @/* → ./src/* のエイリアスを使用
import { cn } from "@/lib/utils"
```

---

## Next.js 規約

```
src/
  app/               ← Page・Layout のみ（ロジックを持たない）
  components/
    ui/              ← shadcn/ui ラッパー（汎用）
    common/          ← Button・SmoothScroll 等の共通コンポーネント
    features/        ← ビジネスロジックを含む機能コンポーネント
  lib/               ← ユーティリティ・ヘルパー
  actions/           ← Server Actions
  types/             ← 型定義
```

### PPR（Partial Prerendering）設定

```ts
// next.config.ts
import type { NextConfig } from "next"
const config: NextConfig = {
  experimental: {
    ppr: true,  // Partial Prerendering 有効化
  },
  images: {
    formats: ["image/avif", "image/webp"],  // AVIF優先
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
}
export default config
```

### フォント最適化（next/font）

```tsx
// app/layout.tsx
import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google"
const serif = Noto_Serif_JP({ subsets: ["latin"], weight: ["400","600"], variable: "--font-serif", display: "swap" })
const sans  = Noto_Sans_JP({ subsets: ["latin"], weight: ["400","500"], variable: "--font-sans",  display: "swap" })
```

---

## エラー解決手順

### Prisma関連
```bash
# スキーマ変更後は必ず
npx prisma generate && npx prisma migrate dev --name <name>
# TypeError: Cannot read properties of undefined
→ prisma.$connect() の確認、グローバルシングルトンパターンを使用しているか確認
```

### Supabase Auth（SSR）
```bash
# セッションが取れない → createServerClient の cookieStore 設定を確認
# PKCE フロー → getSession() ではなく getUser() を使用すること
```

### Framer Motion
```bash
# "useReducedMotion is not a function" → "use client" を追加
# AnimatePresence が機能しない → key prop を必ず設定
```

### ビルドエラー
```bash
npm run typecheck   # 型エラーを先に解消
npm run lint        # ESLintエラーを解消
npm run verify:ci   # CI全チェック
```

---

## セキュリティルール

- `.env.local` に機密情報を格納（`.env` は Git 管理対象外）
- Upstash Rate Limit を API Route 全体に適用
- Supabase RLS をテーブル全体に設定（`anon` への過剰権限禁止）
- Stripe Webhook: `constructEvent()` による signature 検証必須
- XSS対策: `xss` パッケージでユーザー入力をサニタイズ
- **Cloudflare Turnstile**: `react-google-recaptcha` の代わりに Turnstile を使用
  ```bash
  npm install @marsidev/react-turnstile
  # CLOUDFLARE_TURNSTILE_SECRET_KEY を .env.local に設定
  ```
