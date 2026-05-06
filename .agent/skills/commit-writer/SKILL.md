---
name: commit-writer
description: Use for any commit task. Creates conventional commits with correct type, scope, subject, body, and AI attribution. Checks branch safety before committing.
---

# Commit Writer

## When to Use

Use whenever creating a git commit. Always apply this skill before running `git commit`. Never commit without it.

## Workflow

**Step 1 — Check branch**
```bash
git branch --show-current
```
If on `main` or `master`, create a feature branch first unless explicitly told otherwise.

**Step 2 — Verify before committing**
```bash
npm run typecheck
npm run lint
```
Fix all errors before proceeding.

**Step 3 — Stage changes**
Stage only relevant files. Avoid `git add -A` unless the scope is intentionally broad.

**Step 4 — Write commit message**

Format:
```
<type>(<scope>): <subject>

<body — why, not what>

Co-Authored-By: Claude <noreply@anthropic.com>
```

Types: `feat`, `fix`, `ref`, `perf`, `docs`, `test`, `build`, `ci`, `chore`, `style`

Rules:
- Subject line: ≤72 characters, imperative mood, no period
- Body: explain motivation, not mechanics
- Include Co-Authored-By for AI-generated commits

**Step 5 — Commit and confirm**
```bash
git status   # confirm staged files
git commit -m "..."
git log -1   # confirm commit was created
```

## Output

A clean commit on the correct branch with a conventional commit message and AI attribution.

## Do / Don't

✅ Always verify (typecheck + lint) before committing
✅ Always check current branch first
✅ Include Co-Authored-By for AI work
❌ Never commit to `main` without explicit instruction
❌ Never use `--no-verify`
❌ Never omit the commit type
