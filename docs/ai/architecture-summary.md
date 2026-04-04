# Architecture Summary — seiren-ohakajimai-navi

## Application Type

A grave site search and purchase platform. Users search for burial plots, inquire, and purchase online. Features include authenticated user accounts, Stripe payment integration, WebAuthn passwordless auth, and email notifications.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, PPR enabled) |
| Language | TypeScript 5, React 19 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Framer Motion v12, GSAP 3, Lenis |
| 3D | Three.js + @react-three/fiber |
| Database | Prisma 5 + Supabase PostgreSQL |
| Auth | Supabase Auth SSR + WebAuthn (@simplewebauthn) |
| Payment | Stripe |
| Email | Resend |
| Cache / Rate Limit | Upstash Redis |
| Analytics | Vercel Analytics + Speed Insights |
| Testing | Vitest + Playwright |
| Package Manager | npm |
| Node | ≥20.0.0 |

## Directory Structure

```
src/
  app/           ← Pages and layouts only (no logic)
  components/
    ui/           ← shadcn/ui wrappers
    common/       ← Shared: Button, SmoothScroll, etc.
    features/     ← Feature components with business logic
  lib/            ← Utilities, Prisma singleton, Supabase client
  actions/        ← Server Actions
  types/          ← Type definitions
```

## Key Architectural Decisions

- **PPR (Partial Prerendering)** enabled — static shell + streaming dynamic content
- **Prisma global singleton** — single `PrismaClient` instance via `src/lib/prisma.ts`
- **Supabase Auth SSR** — `createServerClient` with cookie handling for Next.js
- **WebAuthn** — passwordless auth alongside traditional email/password
- **Server Components by default** — `"use client"` only when required
- **Stripe webhook verification** — `constructEvent()` server-side on every event

## Security Architecture

- Upstash Rate Limit on all API routes
- Supabase RLS on all user-data tables
- Cloudflare Turnstile on all user-facing forms
- XSS sanitization (`xss` package) before AI input
- Stripe webhook signature validation

## Cross-References

- Full stack details: `CLAUDE.md`
- Operating rules: `.claude/rules/`
- Data safety rules: `.claude/rules/05-data-and-db-safety-rules.md`
- Test strategy: `.claude/rules/06-testing-and-validation-rules.md`
