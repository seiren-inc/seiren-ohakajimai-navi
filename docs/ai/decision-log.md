# Decision Log — seiren-ohakajimai-navi

## 2026-04-02 — Agent OS Migration: Full Target Structure Implemented

**Context**: Workspace-wide agent operating system migration. This repo was selected as the pilot.

**Decisions**:

1. **AGENTS.md replaced with compact pointer contract**
   - Previous: ~800 line monolithic policy document (clone of project-template)
   - New: ~60 line pointer contract referencing `.claude/rules/` and `docs/ai/`
   - Rationale: Eliminates maintenance fragility; policy lives in one layer, not 15 copies

2. **`.claude/rules/` created with 9 rule files**
   - Extracted from previous AGENTS.md policy sections
   - Each rule file scoped to a single concern area
   - Rationale: Layered loading; agents load only relevant rules for the task

3. **`.claude/skills/` created with 8 core workflow skills**
   - Replaces the `.agent/skills/` directory as the canonical core shelf
   - Skills are workflow-oriented (not library-reference docs)
   - 8 selected: commit-writer, bugfix-flow, implementation-flow, ui-qa-check, db-safe-update, docs-writer, handoff-flow, context-trim-flow
   - Rationale: 8 covers the full operation surface without overloading context

4. **`.claude/skills-runtime/` created**
   - Staging directory for task-scoped skills
   - README documents 13 task-type runtime groups
   - `.agent/skills/` preserved as migration source

5. **`docs/ai/` created with 7 governance documents**
   - workspace-overview, architecture-summary, execution-contract, handoff-protocol, skills-selection-policy, runtime-shelf, decision-log (this file)
   - Rationale: Stable context that agents can reference without loading full conversation history

**Rollback**: AGENTS.md previous content available in `project-template/AGENTS.md`. `.claude/` additions can be removed without affecting source code.
