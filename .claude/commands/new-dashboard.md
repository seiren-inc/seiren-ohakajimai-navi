/new-dashboard

Run the **`dashboard-variant-designer`** skill: read `.claude/skills/dashboard-variant-designer/SKILL.md` and follow it verbatim.

## Mission
- Branching questionnaire first (never jump to one design).
- Produce 2-4 variants, recommend one, wireframe spec, component map, tokens, smallest implementation plan.

## Safety gate (before coding)
If the dashboard may touch routing, metadata, JSON-LD, canonical, sitemap, robots, or protected UI structure (layout/spacing/type), **stop for explicit approval**. Design-only is OK unless user approves shipping code.

## After user locks a variant
- Code delivery: **`implementation-flow`** (plan + approval → execute).
- Touch DB / Auth / Stripe / WebAuthn: **`db-safe-update`** alongside implementation.
- UI applied post-lock: **`ui-qa-check`**.
- Persist spec externally: **`docs-writer`** (minimal).

## Output format (mandatory)
Follow the dashboard skill sections (`Selected Branch` through `Implementation Plan`). If the user prefers the repo report footer, append:

```
1. status
2. files changed
3. why
4. validation
5. next step
```

(Use `files changed / validation` as N/A until implementation is explicitly requested and completed.)
