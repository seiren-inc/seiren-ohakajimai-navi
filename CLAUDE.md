# seiren-ohakajimai-navi Project Guide

## Overview
Next.js 15 (App Router) application using npm, React 19, Tailwind CSS v4, and Supabase SSR auth.
Auth includes WebAuthn (@simplewebauthn). Payment via Stripe. AI via Vercel AI SDK v6 (@ai-sdk/openai).

## Non-Negotiables
- Supabase RLS must remain enabled on all tables. Do not grant excessive permissions to the anon role.
- Stripe Webhook: verify using constructEvent() on every incoming event. Do not skip signature validation.
- Cloudflare Turnstile is required for all public forms. Do not use react-google-recaptcha.
- Use getUser() for Supabase Auth. getSession() is forbidden.
- Upstash Rate Limit must be applied to all AI API endpoints.
- All user input must be sanitized with the xss package before sending to AI APIs.
- PPR is NOT enabled (requires Next.js canary; this repo runs stable 15.5.12). Do not add experimental.ppr on stable — it breaks the production build. Re-evaluate when PPR ships in a stable release.
- WebAuthn (@simplewebauthn) must not be removed or bypassed without explicit approval.

## Project-Specific Implementation Rules
- Use npm for all commands. pnpm and yarn are forbidden.
- Build runs prisma generate before next build. Do not remove that step.
- Fonts are Noto Serif JP (--font-serif) and Noto Sans JP (--font-sans). Do not change font families without explicit approval.
- Tailwind CSS v4. shadcn/ui components live in src/components/ui/.
- Directory: src/app/ for pages only. src/components/features/ for business logic. src/actions/ for Server Actions. src/types/ for type definitions.
- Three.js components must use dynamic import with ssr: false and Suspense.
- Secrets must be in .env.local. CLOUDFLARE_TURNSTILE_SECRET_KEY must be set there.

## Stop Conditions
- If requirements are unclear, you must stop and ask for clarification.
- If a change may affect RLS, Stripe webhook verification, or Turnstile, you must stop.
- If a change may remove or bypass WebAuthn, you must stop.
- If a change may affect auth flow, you must stop.
- If a change may break existing UI or production build behavior, you must stop.
- If you cannot verify the change, you must stop.

## Local Commands
- npm run dev
- npm run build
- npm run start
- npm run lint
- npm run typecheck
- npm run verify
- npm run verify:ci
- npm run test
- npm run test:e2e
- npm run verify:perf
- npx prisma migrate dev
- npx prisma studio

## Troubleshooting
- Prisma schema change: run npx prisma generate and npx prisma migrate dev --name <name>.
- Supabase session failure: replace getSession() with getUser(). Verify createServerClient cookieStore config.
- Framer Motion: AnimatePresence requires key prop. Add "use client" if useReducedMotion errors occur.
- Build errors: run typecheck, then lint, then verify:ci.
