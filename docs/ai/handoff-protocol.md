# Handoff Protocol

> For the handoff workflow, use `.claude/skills/handoff-flow/SKILL.md`

## When to Hand Off

- End of a work session (close without completing the task)
- Switching from Claude Code to Antigravity or vice versa
- A task spans multiple sessions

## Standard Handoff Checklist

Before handing off, confirm:
- [ ] `npm run verify` passes (or failures are documented)
- [ ] No uncommitted changes that should be committed
- [ ] No pending Prisma migrations left unapplied
- [ ] Active skills listed
- [ ] Next steps documented

## State to Transfer

1. What was done
2. What files were changed (full paths)
3. What the build/test status is
4. What the next agent should do
5. Any open questions or decisions pending

## Re-entry Protocol

When picking up another agent's handoff note:
1. Read the handoff note in full
2. Run `npm run verify` to confirm current state
3. Check `git status` for uncommitted changes
4. Load the relevant `.claude/skills/` for the next task
5. Do not assume the previous agent's context — verify the state independently
