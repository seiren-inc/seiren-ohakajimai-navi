---
name: db-safe-update
description: Use for any database schema change, migration, Supabase Auth change, Stripe integration change, or WebAuthn change. Enforces safe migration patterns and prevents data loss.
---

# DB Safe Update

## When to Use

Use for: Prisma schema changes, database migrations, Supabase RLS changes, auth flow changes, Stripe webhook changes, WebAuthn changes. Any change that touches persistence, authentication, or payment state.

## Workflow

**Step 1 — Understand current state**
```bash
npx prisma studio   # review current data shape
```
Read the current schema file before making changes.

**Step 2 — Plan the migration**
- Identify which tables/columns change
- Identify whether the migration is additive (safe) or destructive (requires approval)
- Destructive = DROP COLUMN, DROP TABLE, NOT NULL on existing column without default

**Step 3 — Implement schema changes**
```bash
# After editing prisma/schema.prisma:
npx prisma generate                              # regenerate client
npx prisma migrate dev --name <descriptive-name> # create and apply migration
```

**Step 4 — Verify RLS**
After any Supabase table change, confirm:
- RLS is enabled on the table
- `anon` role does not have excessive permissions
- `authenticated` role has correct CRUD permissions for the use case

**Step 5 — Verify auth**
For Supabase Auth changes:
- Use `getUser()` not `getSession()`
- Test login, logout, and session persistence
- Confirm PKCE flow is intact

**Step 6 — Verify Stripe**
For Stripe changes:
- Webhook signature: `Stripe.constructEvent()` is called
- Payment status verified server-side (never trust client)
- No card data stored in the database

**Step 7 — Run verification**
```bash
npm run typecheck
npm run verify:ci    # includes prisma validate
```

## Safety Rules

1. Never run a destructive migration without explicit user approval
2. Never edit the generated Prisma client
3. Always use the global Prisma singleton (`src/lib/prisma.ts`)
4. Never expose Supabase service role key to the client
5. `.env.local` holds all secrets — never commit

## Output

- Migration file created and applied
- RLS verified
- Auth flow verified
- Verification commands passing
- Completion report with migration name, files changed, and diff
