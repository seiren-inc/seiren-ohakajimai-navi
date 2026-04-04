# Skills Runtime Shelf — seiren-ohakajimai-navi

This directory is the runtime (task-scoped) skill staging area. Skills here are loaded on-demand for specific task types, not at session start.

## How to Use

Load a runtime skill group when starting the corresponding task type. Unload when the task is done.

```
[Agent] Starting animation sprint → loading gsap-core, gsap-react, gsap-scrolltrigger
[Agent] Sprint complete → releasing animation skills
```

## Runtime Skill Groups

Skills listed below are available in `.agent/skills/` (migration source) until they are promoted here.

| Task Type | Skills to load |
|-----------|---------------|
| Animation sprint | `gsap-core`, `gsap-react`, `gsap-scrolltrigger` |
| SEO / schema audit | `seo-audit`, `seo-checklist`, `schema-markup`, `homepage-audit` |
| DB schema design | `supabase-schema-designer`, `supabase-query-builder`, `supabase-postgres-best-practices` |
| Design implementation | `figma`, `figma-implement-design` |
| Performance sprint | `vercel-performance-optimizer`, `next-cache-components` |
| Security review | `security-audit`, `security-best-practices` |
| Test sprint | `playwright`, `test-driven-development`, `unit-test-generator` |
| Code review | `code-review-automation`, `lint-and-validate` |
| Refactor sprint | `refactor-engine`, `typescript-expert` |
| PR / GitHub CI | `pull-request-manager`, `gh-fix-ci`, `gh-address-comments` |
| Mobile audit | `mobile-first-design-rules` |
| Storage / realtime | `supabase-storage-manager`, `supabase-realtime-handler` |
| Content / email | `humanizer` |

## Context Budget

Do not load more than 3 runtime skills at once unless a sprint explicitly requires a full group. Prefer the primary skill first; add supporting skills only when needed.

## Adding Skills Here

To promote a skill from `.agent/skills/` to this runtime shelf:
1. Copy the skill directory from `.agent/skills/<skill-name>/` to `.claude/skills-runtime/<skill-name>/`
2. Record the promotion in `docs/ai/decision-log.md`
