# Workspace Overview

> This file is a local pointer. For the full workspace overview, see:
> `/Users/takumashinnyo/workspace/projects/docs/ai/workspace-overview.md`

## This Repo's Place in the Workspace

**Repo**: `seiren-ohakajimai-navi`
**Family**: App / Service — web
**Role**: Pilot repo for the target agent operating structure

This repo is the **reference implementation** of the full target OS (`.claude/rules/`, `.claude/skills/`, `docs/ai/`). When rolling out to other repos, use this as the template.

## Quick Orientation

1. `CLAUDE.md` — commands, tech stack, framework rules
2. `AGENTS.md` — operating contract and rule pointers
3. `.claude/rules/` — 9 scoped rule files
4. `.claude/skills/` — 8 core workflow skills
5. `.claude/skills-runtime/` — task-scoped skills catalog
6. `docs/ai/` — this directory; architecture and decisions

## Adjacent Repos

- `seiren-ohaka-navi` — sister product, similar stack (pnpm, no WebAuthn, no shadcn)
- `seiren-corporate` — corporate site for the same brand
