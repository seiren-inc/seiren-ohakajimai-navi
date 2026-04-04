# 09 — Multi-Agent Collaboration Rules

> Repo: seiren-ohakajimai-navi | Applies to: Claude Code, Codex, Antigravity

## Agent Routing

| Task type | Preferred agent |
|-----------|----------------|
| Feature implementation, code edits | Claude Code or Codex |
| High-level planning, orchestration | Antigravity |
| Browser verification, UI inspection, responsive debugging | Codex (isolated Chrome DevTools MCP) |
| Final verification (console, network, performance, screenshots) | Codex only |

**Antigravity must not perform final verification.** This is a hard rule.

## Chrome DevTools MCP

Use only for:
- Responsive debugging
- Browser-specific bug investigation
- Console/network error detection
- Screenshot-based validation
- Performance bottleneck identification

**Before using:**
1. Get explicit user approval (state target URL and reason)
2. Confirm Chrome is running with remote debug enabled (port 9222): `http://127.0.0.1:9222/json`
3. Use `--isolated` flag (temporary profile, mandatory)
4. Use `--no-usageStatistics` flag (mandatory)
5. Never connect to production environment
6. Never access authenticated/sensitive pages without explicit per-page approval

**After using:** Output a Chrome DevTools Audit Report (see rule 07 for format).

## Handoff Protocol

When handing off between agents or sessions:
1. Load `handoff-flow` skill
2. Summarize: current state, what was completed, what is next
3. List files modified in this session
4. List any deferred items or open questions
5. Note which skills were active

## Codex Rules File

This repo has a `.codex/rules/default.rules` if needed. Codex-specific allowlists go there. See `TattooBase/tattoobase-os/.codex/` for reference format.

## Shared Context Boundaries

- Each agent session starts with: CLAUDE.md → AGENTS.md → relevant `.claude/rules/` files
- Do not assume the other agent read the same context
- When picking up another agent's work, run the relevant verification commands before continuing
- Do not silently undo another agent's changes without documenting why
