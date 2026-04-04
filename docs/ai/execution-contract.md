# Execution Contract

> Local pointer. Full contract: `/Users/takumashinnyo/workspace/projects/docs/ai/execution-contract.md`

## Repo-Specific Additions

### Prisma Safety Gate
Any Prisma migration must be reviewed before applying. Destructive operations (DROP COLUMN, DROP TABLE) require explicit user approval before `prisma migrate dev` runs.

### Payment Safety Gate
Stripe changes require server-side verification testing before deployment. The Stripe webhook `constructEvent()` call must never be removed or bypassed.

### Auth Safety Gate
WebAuthn changes affect the passwordless login flow. Test with both WebAuthn and traditional Supabase Auth paths after any auth change.

### CI Gate
Before any PR merge, `npm run verify:ci` must pass. This runs: lint + typecheck + prisma validate + quality gate + SEO checks.
