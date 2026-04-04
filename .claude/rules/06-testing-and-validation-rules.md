# 06 — Testing and Validation Rules

> Repo: seiren-ohakajimai-navi | Applies to: Claude Code, Codex, Antigravity
> Test stack: Vitest (unit), Playwright (E2E)

## Validation Before Any Commit

Always run in order:
```bash
npm run typecheck    # TypeScript — fix first
npm run lint         # ESLint — fix second
npm run verify       # lint + typecheck combined
```

For CI-level confidence:
```bash
npm run verify:ci    # verify + prisma validate + quality:gate + SEO checks
```

## Unit Testing (Vitest)

- Test file co-location: `*.test.ts` next to the module being tested
- Run: `npm run test`
- Cover all Server Actions and utility functions
- Do not mock the database in integration tests — use a real test database

## E2E Testing (Playwright)

- Run: `npm run test:e2e`
- E2E tests cover critical user flows: auth, payment, form submission
- Always run E2E before releasing a payment or auth change
- Use Playwright's `--headed` flag for debugging locally

## Performance Validation

```bash
npm run verify:perf  # Lighthouse against localhost:3000
```

Run after any significant UI change. Target: LCP < 2.5s, CLS < 0.1.

## AI Quality Audit

```bash
npm run audit:ai     # AI-based quality audit script
npm run quality:gate # Quality gate verification
```

## Schema Validation

- Run Rich Results Test on any page with JSON-LD changes.
- Validate via Google Search Console after deployment.
- Confirm title / H1 / schema subject alignment.

## What "Verified" Means

A change is verified when:
1. `npm run verify` passes (no typecheck or lint errors)
2. Affected unit tests pass (`npm run test`)
3. No visual regressions observed (manual or screenshot comparison)
4. For payment/auth changes: Playwright E2E passes
5. For schema changes: Rich Results Test passes
