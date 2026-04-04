# AGENTS.md — seiren-ohakajimai-navi

> Applies to: Claude Code, Codex, Antigravity
> This file is a compact operating contract. Details live in `.claude/rules/` and `docs/ai/`.

---

## Quick Start

1. Read `CLAUDE.md` — commands, tech stack, framework rules
2. Load `.claude/rules/` — scoped operating rules (load the relevant file for your task)
3. Check `.claude/skills/` — 8 core workflow skills
4. Read `docs/ai/architecture-summary.md` if you need architecture context

---

## Operating Rules (by concern)

| File | Scope |
|------|-------|
| `.claude/rules/01-core-operating-rules.md` | Read-before-edit, implementation flow, completion requirements |
| `.claude/rules/02-git-safety-rules.md` | Branch safety, commit format, verification before commit |
| `.claude/rules/03-architecture-and-stack-rules.md` | Directory conventions, component rules, TypeScript rules |
| `.claude/rules/04-ui-ux-rules.md` | Design system, shadcn/ui, animation rules |
| `.claude/rules/05-data-and-db-safety-rules.md` | Prisma, Supabase Auth, Stripe, WebAuthn, security |
| `.claude/rules/06-testing-and-validation-rules.md` | Vitest, Playwright, verification commands |
| `.claude/rules/07-reporting-and-delivery-rules.md` | Completion report format, skill usage report |
| `.claude/rules/08-skill-loading-and-context-rules.md` | Skill load order, context budget, selection heuristics |
| `.claude/rules/09-multi-agent-collaboration-rules.md` | Agent routing, MCP rules, handoff protocol |

---

## Core Skill Shelf

`.claude/skills/` contains 8 always-on workflow skills:

| Skill | Use when |
|-------|----------|
| `commit-writer` | Any commit |
| `bugfix-flow` | Any bug investigation |
| `implementation-flow` | Any feature work |
| `ui-qa-check` | Any UI change |
| `db-safe-update` | Any DB / auth / payment change |
| `docs-writer` | Any documentation task |
| `handoff-flow` | Session end or agent switch |
| `context-trim-flow` | Context becoming large |

Runtime skills: see `.claude/skills-runtime/README.md`

---

## Shared Policy

Full workspace operating contract: `/Users/takumashinnyo/workspace/projects/docs/ai/execution-contract.md`

---

## Key Rules (non-negotiable)

- Never start implementation without presenting a plan and getting approval
- Never claim completion without file-level verification evidence
- Never run Chrome DevTools MCP without user approval
- Antigravity must not perform final browser/console/network verification
- Skill Usage Report required in every completion response
