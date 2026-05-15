# AGENTS.md

## Project

This repository is for お墓じまいナビ, a Japanese web service that supports users with grave closure, reburial permit information, municipality guidance, administrative scrivener discovery, and related end-of-life services.

## Source of Truth

Read this file first for every task.

Use detailed files only when needed:

- `.agent/rules/` for non-negotiable rules
- `.agent/memory/` for project context and current status
- `.agent/workflows/` for repeatable procedures
- `.agent/skills/` for reusable task-specific operations
- `docs/` for product, design, SEO, data, and architecture details

Do not duplicate large context into this file.

## Execution Contract

Before implementation:

- Identify affected files
- Explain the intended diff
- Preserve existing UI and behavior unless explicitly requested
- Use the smallest safe change
- Do not refactor unrelated files
- Do not rename routes, components, schema fields, or data keys without approval

After implementation:

- Report changed files
- Report validation commands
- Report known risks or unverified areas
- Suggest the next smallest step

## Data Rules

For municipality links:

- Do not store direct PDF links in `url`
- Store PDF links in `pdfUrl`
- For PDF-only records:
  - `url = null`
  - `pdfUrl = PDF URL`
  - `linkStatus = PDF_ONLY`
  - `linkType = PDF`

Do not remove or rewrite municipality data without explicit reason.

## UI Rules

Preserve:

- Layout
- Typography
- Spacing
- Color system
- Responsive behavior
- SEO metadata
- Existing routes

Do not apply broad visual redesign unless the task explicitly asks for it.

## Context Policy

Keep context small.

Read only the files needed for the current task.

Use search tools, Serena, and MCP-style retrieval instead of loading all docs into the prompt.

## Safety

If the task may affect production data, SEO routes, database schema, public pages, or municipality records, create a plan first and stop before applying changes unless implementation was explicitly requested.