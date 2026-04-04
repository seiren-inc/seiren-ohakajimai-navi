# 05 — Data and DB Safety Rules

> Repo: seiren-ohakajimai-navi | Applies to: Claude Code, Codex, Antigravity
> DB stack: Prisma 5.x + Supabase PostgreSQL, Supabase Auth SSR

## Prisma Rules

1. After any schema change, always run: `npx prisma generate && npx prisma migrate dev --name <name>`
2. Never edit the generated Prisma client directly.
3. Use the global Prisma singleton pattern — never instantiate `new PrismaClient()` outside of `src/lib/prisma.ts`.
4. `prisma.$connect()` must be called before use when using the singleton.
5. Never commit migrations without reviewing them first.
6. Destructive migrations (DROP COLUMN, DROP TABLE) require explicit user approval.

## Supabase Auth Rules

1. Always use `getUser()` — never `getSession()` (deprecated, insecure).
2. Use `createServerClient` from `@supabase/ssr` with correct `cookieStore` configuration.
3. PKCE flow is active — do not bypass it.
4. RLS (Row Level Security) must be enabled on all tables that hold user data.
5. Never grant the `anon` role excessive permissions on user-scoped tables.

## WebAuthn Rules

1. WebAuthn (@simplewebauthn) requires HTTPS in production.
2. Challenge must be stored server-side; never in client storage.
3. Always verify authenticator response on the server before granting access.

## Stripe Rules

1. Always verify Stripe Webhook signatures with `constructEvent()`.
2. Never trust client-side payment status — verify server-side via the Stripe API.
3. Store only Stripe customer/subscription IDs in the database, not card data.

## Security Rules

1. `.env.local` holds all secrets. Never commit to git.
2. Upstash Rate Limit must be applied to all API routes.
3. XSS: sanitize all user input with the `xss` package before rendering or sending to AI.
4. Cloudflare Turnstile: required on all user-facing forms (registration, contact).
5. CLOUDFLARE_TURNSTILE_SECRET_KEY must be validated server-side.

## Structured Data (SEO)

1. Use JSON-LD only — no Microdata or RDFa.
2. Schema must exactly match displayed content. No dummy values, no future information.
3. Run Rich Results Test before every release.
4. Required base fields: `@context`, `@id`, `url`, `name`, `description`, `image`, `inLanguage`.
5. One primary schema per page purpose.
