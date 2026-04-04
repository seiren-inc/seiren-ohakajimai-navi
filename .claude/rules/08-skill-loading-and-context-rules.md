# 08 — Skill Loading and Context Rules

> Repo: seiren-ohakajimai-navi | Applies to: Claude Code, Codex, Antigravity

## Skill Load Order

1. Check `.claude/skills/` — core shelf, always available (canonical target)
2. Check `.claude/skills-runtime/` — for the current task type
3. Ignore local `.agent/skills/` unless it is intentionally repopulated and documented; in the current repo it is an empty legacy placeholder
4. Check workspace `.agent/skills/` at `[workspace-root]/.agent/skills/` — last resort

## .agents/skills Compatibility Bridge

`.agents/skills` is a symlink → `../.claude/skills` (the curated core shelf).
Any agent or tool that follows the `.agents/skills` path will land on the correct 8-skill shelf.
Do NOT manually retarget this symlink to `.agent/skills` — that is the legacy vault.

## Core Shelf (this repo)

Always-available skills in `.claude/skills/`:
- `commit-writer` — use for any commit task
- `bugfix-flow` — use for any bug investigation
- `implementation-flow` — use for any feature implementation
- `ui-qa-check` — use for any UI change
- `db-safe-update` — use for any database or auth change
- `docs-writer` — use for documentation tasks
- `handoff-flow` — use for session hand-off
- `context-trim-flow` — use when context is becoming large

## Context Budget Rules

1. Default maximum active skills: 3 per task. Do not load more without justification.
2. Never load the full skill vault for a task.
3. Manifest-first: check skill name and description before loading the full SKILL.md.
4. Load runtime skills only for the duration of the relevant task type. Unload when done.
5. If a skill is >3,000 words, treat it as runtime-only.

## Skill Selection Heuristics

| Task type | Primary skill |
|-----------|--------------|
| Any commit | `commit-writer` |
| Bug investigation | `bugfix-flow` |
| Feature implementation | `implementation-flow` |
| UI change or review | `ui-qa-check` |
| Database/auth change | `db-safe-update` |
| Documentation | `docs-writer` |
| Session hand-off | `handoff-flow` |
| Context getting large | `context-trim-flow` |
| Animation work | (runtime) `gsap-core`, `gsap-react` |
| Testing sprint | (runtime) `playwright`, `test-driven-development` |
| Performance sprint | (runtime) `vercel-performance-optimizer` |
| Design implementation | (runtime) `figma-implement-design` |

## Skill Autonomy Rule

Proactively select skills even when the user does not name one. The rule: if a skill exists for the task type, use it. Report the selection and reason.
