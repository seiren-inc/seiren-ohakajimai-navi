# 03 — Architecture and Stack Rules

> Repo: seiren-ohakajimai-navi | Applies to: Claude Code, Codex, Antigravity
> Stack: Next.js 15 / React 19 / TypeScript 5 / Tailwind v4 / shadcn/ui / Prisma 5 / Supabase / Stripe / WebAuthn

## Directory Conventions

```
src/app/           ← Pages and layouts only. No business logic.
src/components/
  ui/              ← shadcn/ui wrappers (generic)
  common/          ← Shared components (Button, SmoothScroll)
  features/        ← Feature components with business logic
src/lib/           ← Utilities and helpers
src/actions/       ← Server Actions only
src/types/         ← Type definitions
```

## Component Rules

- Server Component is the default. Use `"use client"` only for interactivity, animation, or browser APIs.
- Never add `"use client"` to layouts or pages that can remain server-side.
- Interactive components (forms, modals, carousels) must be Client Components.
- Framer Motion always requires `"use client"` and `key` prop on `AnimatePresence`.

## TypeScript Rules

- `any` type is forbidden. Use `unknown` and narrow.
- All functions must have explicit return types.
- All interfaces and types must be declared (no implicit objects).
- Path alias: `@/*` → `./src/*`

## Import Patterns

```ts
// ✅ Correct
import { cn } from "@/lib/utils"
import type { ActionResult } from "@/types"

// ❌ Forbidden
const data: any = {}
const fn = async () => {}  // missing return type
```

## PPR and Image Optimization

```ts
// next.config.ts
experimental: { ppr: true }  // Partial Prerendering
images: {
  formats: ["image/avif", "image/webp"],
  minimumCacheTTL: 60 * 60 * 24 * 30,
}
```

## Package Manager

npm. Do not use pnpm or yarn commands in this repo.
