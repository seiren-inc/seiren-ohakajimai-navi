---
name: context-trim-flow
description: Use when the conversation context is growing large, when switching task types, or when too many skills are loaded. Identifies what can be safely removed from active context without losing critical information.
---

# Context Trim Flow

## When to Use

Use when:
- The conversation has been running for many turns and context is large
- Switching from one major task type to another (e.g., feature work → debugging)
- More than 3 skills are currently active
- Responses are becoming slow or unfocused
- A new major task begins that is unrelated to the current context

## Workflow

**Step 1 — Assess current context load**
Ask:
- How many skills are currently loaded?
- How many files have been read?
- Is the current task type still the same as when this session started?

**Step 2 — Identify what can be released**
Items that can be released:
- Runtime skills loaded for a completed sprint
- Files read for a previous, completed task
- Exploration context from discovery work

Items to keep:
- Core skill definitions (`.claude/skills/` shelf)
- The current task's relevant files
- Any pending verification results

**Step 3 — Trim the active skill set**
Reduce to: the core shelf + the 1-2 skills needed for the current task only.

**Step 4 — Write a context anchor**
Before trimming, write a brief anchor note:

```markdown
## Context Anchor — [task name]

### Decisions made
- [key decision]

### Current focus
- [what we are working on]

### Next action
- [immediate next step]
```

This becomes the re-entry point if context is re-expanded.

**Step 5 — Resume with trimmed context**
Start the next task with the anchor note + relevant files only.

## Rules

1. Never trim context mid-task — wait for a natural transition point
2. Always write the context anchor before trimming
3. The core shelf (`.claude/skills/`) is never trimmed
4. If unsure what to trim, default to keeping everything and loading only core skills

## Output

A context anchor note and a reduced active skill set appropriate for the next task.
