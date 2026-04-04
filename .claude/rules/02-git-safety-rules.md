# 02 — Git Safety Rules

> Repo: seiren-ohakajimai-navi | Applies to: Claude Code, Codex, Antigravity

## Commit Rules

1. Always check current branch before committing: `git branch --show-current`
2. Never commit directly to `main` unless explicitly instructed.
3. Create a feature branch for all non-trivial work.
4. Use conventional commit format: `<type>(<scope>): <subject>`
5. Include `Co-Authored-By: Claude <noreply@anthropic.com>` in AI-generated commits.
6. Keep commit messages under 100 characters per line.

## Commit Types

| Type | Use |
|------|-----|
| `feat` | New feature |
| `fix` | Bug fix |
| `ref` | Refactor (no behavior change) |
| `perf` | Performance improvement |
| `docs` | Documentation only |
| `test` | Tests |
| `build` | Build system or dependencies |
| `ci` | CI configuration |
| `chore` | Maintenance |

## Branch Safety

- `main` is protected. Never force-push.
- Before destructive git operations, confirm the intent with the user.
- Never use `--no-verify` unless the user explicitly requests it.
- Never skip signing or hooks without explicit instruction.

## Verification Before Commit

Run before committing:
```bash
npm run typecheck    # TypeScript errors
npm run lint         # ESLint
npm run verify       # lint + typecheck
```

For CI-level changes: `npm run verify:ci`
