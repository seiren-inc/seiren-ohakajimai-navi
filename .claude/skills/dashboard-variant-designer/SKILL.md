---
name: dashboard-variant-designer
description: Design and generate multiple dashboard variants using a branching questionnaire. Use when the user wants "Animo-like dashboards", asks for several dashboard styles from one intake flow, or wants to choose UI direction by answering questions first and then produce one or more concrete dashboard specs/components.
---

# Dashboard Variant Designer

Run a branching questionnaire first, then generate one or more dashboard blueprints with concrete UI structure, component map, and implementation steps.

## Core Rule

Do not jump to a single design immediately. Always:
1. Ask the intake questions.
2. Branch by answers.
3. Present 2-4 matched variants.
4. Let the user choose one.
5. Produce implementation-ready output.

## Step 1: Intake Questions (required)

Ask these in order and keep answers short.

1. **Primary purpose**
   - Sales/Revenue
   - Operations/Monitoring
   - Marketing/SEO/GEO/MEO
   - Executive overview
   - Project/Task management

2. **Main user persona**
   - Executive
   - Manager
   - Operator/Analyst
   - Client-facing

3. **Decision cadence**
   - Realtime (minutes)
   - Daily
   - Weekly
   - Monthly/Quarterly

4. **Data density preference**
   - Light (quick scan)
   - Balanced
   - Dense (power user)

5. **Visual style**
   - Animo-like minimal dark
   - Clean light enterprise
   - High-contrast operational
   - Editorial card-heavy

6. **Critical modules** (multi-select)
   - KPI cards
   - Trend charts
   - Table/list
   - Alerts/incidents
   - Funnel/conversion
   - Map/geo
   - Tasks/actions

7. **Device priority**
   - Desktop-first
   - Mobile-first
   - Equal

8. **Constraints**
   - Keep existing layout
   - Keep existing component system
   - No routing changes
   - No SEO metadata changes

## Step 2: Branching Logic

Use this rule table to select a base variant family.

- If purpose is Marketing/SEO/GEO/MEO -> `Growth Intelligence`
- If purpose is Operations/Monitoring and cadence is Realtime -> `Ops Command Center`
- If purpose is Executive overview and density is Light/Balanced -> `Executive Snapshot`
- If purpose is Project/Task management -> `Execution Board`
- Else -> `Balanced Performance Hub`

Then apply style modifier:
- Animo-like minimal dark -> dark neutral tokens, restrained chroma, compact cards
- Clean light enterprise -> high readability, soft borders, white surfaces
- High-contrast operational -> stronger status colors and alert prominence
- Editorial card-heavy -> larger cards, narrative sections, softer rhythm

## Step 3: Output Format (required)

Return exactly these sections:

1. `Selected Branch`
2. `Variant Options (2-4)`  
   For each option include:
   - Concept name
   - Best for
   - Layout skeleton (Header / KPI row / Middle / Bottom)
   - Key widgets
   - Risk/tradeoff
3. `Recommended Option`
4. `Wireframe Spec` (text wireframe)
5. `Component Mapping` (shadcn/ui or project components)
6. `Token Direction` (color, spacing, radius, chart palette)
7. `Implementation Plan` (smallest safe diff)

## Step 4: Implementation Guardrails

- Preserve existing routing, metadata, JSON-LD, canonical, sitemap, robots unless explicitly requested.
- Preserve existing component structure unless change is approved.
- Prefer minimal diffs and reuse current UI primitives.
- If user asks code generation, provide files-to-modify/create first and wait for approval before editing.

## Quick Variant Templates

### Growth Intelligence
- Top: KPI cards (traffic, CVR, CAC, local rank)
- Middle: trend + source/funnel split
- Bottom: keyword/municipality table + action queue

### Ops Command Center
- Top: uptime/error/latency incident KPIs
- Middle: realtime stream + alerts
- Bottom: runbook actions and ownership table

### Executive Snapshot
- Top: 4-6 north-star KPIs
- Middle: monthly trend and variance
- Bottom: insights and priority decisions

### Execution Board
- Top: throughput, SLA, blocked tasks
- Middle: kanban or stage pipeline
- Bottom: owner workload and deadline risk list

## Completion Checklist

- Intake completed
- Branch selected with reason
- 2-4 variants presented
- Recommendation with tradeoff
- Implementation-ready spec included
