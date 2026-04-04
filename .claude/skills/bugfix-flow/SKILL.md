---
name: bugfix-flow
description: Use for any bug investigation, unexpected behavior, test failure, or error. Mandates root cause investigation before any fix. Covers Next.js, Prisma, Supabase, Stripe, and Framer Motion error patterns.
---

# Bugfix Flow

## When to Use

Use for: bug reports, test failures, unexpected behavior, runtime errors, build failures, type errors. Do not skip to a fix without completing root cause investigation.

**Iron Law: no fix without root cause.**

## Workflow

**Phase 1 — Reproduce**
1. Identify the exact error message, stack trace, or symptom
2. Confirm the reproduction steps
3. Identify which component, route, action, or query is involved

**Phase 2 — Investigate root cause**
1. Read the affected file before editing it
2. Check related files (parent component, types, schema, API route)
3. Run relevant validation:
   ```bash
   npm run typecheck    # type errors
   npm run lint         # lint errors
   ```
4. Form a specific hypothesis: "The error occurs because X causes Y"

**Phase 3 — Confirm hypothesis**
1. Test the hypothesis without changing production code if possible
2. Check for related Prisma/Supabase/Stripe error patterns (see below)

**Phase 4 — Implement the fix**
1. Make the smallest change that fixes the root cause
2. Do not refactor surrounding code
3. Add a test if the bug was untested

**Phase 5 — Verify**
```bash
npm run typecheck
npm run lint
npm run verify
```
Confirm the original error no longer occurs.

## Common Error Patterns

**Prisma**
- `Cannot read properties of undefined` → check global singleton in `src/lib/prisma.ts`
- After schema change → `npx prisma generate && npx prisma migrate dev --name <name>`

**Supabase Auth**
- Session not found → use `getUser()` not `getSession()`
- PKCE flow issues → check `createServerClient` cookieStore config

**Framer Motion**
- `useReducedMotion is not a function` → add `"use client"` directive
- `AnimatePresence` not working → add `key` prop to child elements

**Next.js Build**
- Type errors first: `npm run typecheck`
- Then: `npm run lint`
- Then: `npm run build`

## Output

- Root cause identified and documented
- Fix implemented (smallest correct change)
- Verification commands run and passing
- Completion report with files modified and diff
