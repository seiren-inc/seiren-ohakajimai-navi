# AGENTS.md — seiren-ohakajimai-navi

## Execution Flow
Analysis → Plan → Explicit Approval → Execution → Verification
Execution requires explicit approval.
- For orchestrated skill runs, route through `/taskmaster` (`task-intake-and-routing`) and branch into specialized flows such as bugfix-flow, implementation-flow, or docs-writer when appropriate.
- When the user designates an attached roadmap/plan markdown (e.g. Cursor Plans) as the source of truth for implementation work, agents must **not edit that plan file**. Record progress via existing todos, `docs/`, and code only.
- **実装計画書**の作業項目は Markdown チェックリストで書く: 未着手 `- [ ]`、完了 `- [x]`（エディタでトグル可能）。マスターはルート `PLAN.md`、新規は `docs/templates/implementation-plan-template.md` を流用する。

## Core Objective
- Preserve maximum quality for SEO, GEO, and MEO outcomes
- Optimize for Context Management and Token Save
- Keep AGENTS.md as a thin execution contract only

## Non-Negotiables
- Do not break existing SEO, GEO, or MEO foundations
- Do not modify routing, metadata, JSON-LD, canonical, sitemap, or robots behavior without approval
- No DB schema / Supabase changes without approval
- No unsafe API exposure
- Type safety required (no `any`)

## UI Protection
- Do not change layout, spacing, typography, or component structure without explicit request

## Data Protection
- Do not change municipality data structure without approval
- Do not change `url`, `pdfUrl`, `linkStatus`, `linkType`, or slug handling without approval
- Preserve municipality ID, slug, and link integrity
- Do not introduce breaking changes to import, sync, audit, or pending flows

## Search Quality Protection
- Canonical production URLs for this property are treated as https://www.ohakajimai-navi.jp (www subdomain as primary reference for audits and citations).
- **清蓮グループ関連サービス**の公式 URL・横断リンクは `src/config/seiren-ecosystem.ts` に集約する（フッター・JSON-LD `sameAs`・計測用 data 属性の散在増殖を避ける）。
- Preserve structured data and indexable content quality
- Do not weaken local-search relevance, entity clarity, or geographic consistency
- Do not remove content that supports SEO, GEO, or MEO evaluation
- Maintain stable URLs and content meaning

## Security
- Never expose secrets or internal endpoints
- Validate all external data before use
- No PII in logs or external APIs

## Validation
- Build must pass
- No SEO / GEO / MEO regression
- No municipality data regression
- No broken PDF or external link handling

## Stop Conditions
- Unclear requirements
- Search-quality impact uncertainty
- DB or data integrity risk
- Municipality data structure impact
- Cross-page, routing, or sync-flow side effects
