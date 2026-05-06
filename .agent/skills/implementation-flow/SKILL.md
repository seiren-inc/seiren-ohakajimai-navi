---
name: implementation-flow
description: Use for any feature implementation, component creation, or code addition. Enforces the Analysis → Plan → Approval → Execution → Verification flow. Ensures safe, scope-locked implementation.
---

# Implementation Flow

## When to Use

Use for: new features, new components, new routes, new API endpoints, new Server Actions, any substantive code addition. Do not start coding without completing the plan and receiving approval.

## Workflow

**Phase 1 — Analysis**
1. Read all relevant existing files (page, component, types, schema, action)
2. Understand the current structure before proposing changes
3. Identify the exact files that will be modified or created

**Phase 2 — Implementation Plan**

Present to the user:
```
## Implementation Plan

### Files to modify
- src/components/features/X.tsx — [reason]
- src/actions/x.ts — [reason]

### Files to create
- src/components/features/Y.tsx — [reason]

### Changes
1. [Step 1 description]
2. [Step 2 description]

### Skills to use
- [skill-name] — [reason]

### Out of scope
- [anything explicitly not changing]
```

**Phase 3 — Wait for approval**
Do not write code until the user responds with explicit approval.
Valid: "Proceed", "OK", "Go ahead", "承認", "実行して", "進めて"

**Phase 4 — Execution**
- Implement exactly what was approved
- Server Components by default; `"use client"` only when needed
- No `any` types; explicit return types on all functions
- Use `@/*` path aliases
- Follow `src/` directory conventions

**Phase 5 — Verification**
```bash
npm run typecheck
npm run lint
npm run verify
```
Confirm all modified files exist and contain the correct content.

## Output

- Clean implementation within approved scope
- All type checks and lint passing
- Completion report with full file paths, diff, and verification output
