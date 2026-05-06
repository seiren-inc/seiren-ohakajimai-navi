# AGENTS.md — seiren-ohakajimai-navi

## Execution Flow
Analysis → Plan → Explicit Approval → Execution → Verification
Execution requires explicit approval.

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
