# 07 — Reporting and Delivery Rules

> Repo: seiren-ohakajimai-navi | Applies to: Claude Code, Codex, Antigravity

## Completion Report Format

Every task completion must follow this structure:

```
### Files Modified
- /full/path/to/file1.ts
- /full/path/to/file2.tsx

### Diff
[actual before/after or patch output — not a summary]

### Verification
Commands run:
$ npm run typecheck
$ npm run lint

Output: [actual output]

### Scope Confirmation
Changes were limited to the approved scope: [yes/no + explanation]

### Skill Usage Report
Used: [skill-name] — reason
Not used: [skill-name] — reason (if considered and rejected)
```

**Free-form summaries without this structure are not valid completion reports.**

## Skill Usage Report

Every task completion must include a Skill Usage Report section:
- List skills used and why
- If no skill was used, state why
- If a skill was considered but not used, explain when relevant

Omitting the Skill Usage Report is a completion failure.

## Structured Data Reporting

After any JSON-LD schema change:
- Schema type used
- Reason for that type
- Validation result (PASS/FAIL from Rich Results Test)
- Unresolved items or known mismatches

## MCP Usage Reporting

After any Chrome DevTools MCP session:
1. Target URL
2. Actions performed
3. Tools used
4. Findings (console / network / UI / performance)
5. Screenshots or results summary
6. Reason MCP was chosen over static analysis

## PR / Commit Description

When creating commits or PRs, include:
- What changed (concise)
- Why (motivation, not obvious from the code)
- How to verify (what to run or check)
