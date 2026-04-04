# 04 — UI/UX Rules

> Repo: seiren-ohakajimai-navi | Applies to: Claude Code, Codex, Antigravity
> UI stack: Tailwind CSS v4, shadcn/ui (Radix UI), Framer Motion v12, GSAP 3, Lenis

## Design System

### Typography
- Use `clamp()` for all heading sizes (responsive, no breakpoint jumps)
- Enforce `max-width` on text containers
- H1 appears once per page
- H1 → H2 → H3 hierarchy is strict; never skip levels
- No unnatural line breaks in headings

### Spacing
- 8px base scale: 8, 16, 24, 32, 48, 64, 96...
- Maintain consistent vertical rhythm between sections
- Adequate breathing space — no cramped layouts

### Buttons and CTAs
- Minimum height: 48px (tap target accessibility)
- CTA text must be action-driven ("申し込む", "詳細を見る", not "クリック")
- Limit primary buttons to 1 per section
- Trust signals near primary CTAs

### CTA Placement
- Hero section: required
- Mid-section: required
- Footer: required
- Each CTA must have a unique, context-relevant label

### Mobile First
- Design for 375px viewport as baseline
- All tap targets ≥ 48px
- No horizontal overflow
- Test readability at mobile font sizes

## shadcn/ui Usage

- shadcn/ui is adopted in this repo (app-type UI)
- Import only the components actually used — do not bulk-install
- Customize via CSS variables, not by overriding Radix internals
- Use `cn()` utility for conditional class merging

## Animation Rules

- Framer Motion: always add `"use client"` directive
- Framer Motion: always set `key` prop on `AnimatePresence` children
- GSAP: initialize inside `useEffect` with cleanup (`revert()` or kill)
- Lenis: configure in a dedicated SmoothScroll component, not in pages
- Respect `prefers-reduced-motion` — disable or simplify animations when set

## Prohibited

- Typography without `clamp()` or `max-width` constraints
- Multiple conflicting CTAs on the same screen
- Inconsistent spacing (mixing arbitrary pixel values with the 8px scale)
- Over-designed UI that sacrifices readability
- `useReducedMotion` hooks used but their result ignored
