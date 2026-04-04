# Skills Selection Policy

> Local pointer. Full policy: `/Users/takumashinnyo/workspace/projects/docs/ai/skills-selection-policy.md`

## This Repo's Core Shelf (8 skills)

Located in `.claude/skills/`:

| Skill | Trigger |
|-------|---------|
| `commit-writer` | Any commit |
| `bugfix-flow` | Any bug |
| `implementation-flow` | Any feature |
| `ui-qa-check` | Any UI change |
| `db-safe-update` | Any DB / auth / payment change |
| `docs-writer` | Any documentation task |
| `handoff-flow` | Session end or agent switch |
| `context-trim-flow` | Context getting large |

## Runtime Shelf

See `.claude/skills-runtime/README.md` for the task-grouped runtime catalog.

## Legacy Source

`.agent/skills/` remains only as a legacy placeholder in this repo and is currently empty. Do not treat it as the canonical core shelf or as an active local fallback.
