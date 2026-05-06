---
name: ui-qa-check
description: Use for any UI change, component addition, or design review. Validates against the Design System (typography, spacing, buttons, CTAs, mobile-first). Catches violations before they reach review.
---

# UI QA Check

## When to Use

Use after any UI change before marking the task complete. Use proactively when implementing new components.

## Checklist

### Typography
- [ ] All headings use `clamp()` for responsive sizing
- [ ] Text containers have `max-width` applied
- [ ] H1 appears exactly once per page
- [ ] Heading hierarchy is H1 → H2 → H3 (no skips)
- [ ] No unnatural line breaks in headings

### Spacing
- [ ] All spacing values are on the 8px scale (8, 16, 24, 32, 48, 64, 96...)
- [ ] No arbitrary pixel values (`mt-[23px]` etc.) unless justified
- [ ] Consistent vertical rhythm between sections

### Buttons and CTAs
- [ ] All interactive buttons are ≥ 48px tall
- [ ] CTA text is action-driven (not "click here")
- [ ] Maximum 1 primary button per section
- [ ] Trust signals present near primary CTA

### CTA Placement (full pages)
- [ ] CTA in hero section
- [ ] CTA in mid-section
- [ ] CTA in footer

### Mobile (375px viewport)
- [ ] No horizontal overflow
- [ ] All tap targets ≥ 48px
- [ ] Text readable at mobile sizes
- [ ] No overcrowded layouts

### shadcn/ui
- [ ] Only used components are installed
- [ ] `cn()` utility used for conditional classes
- [ ] No internal Radix component overrides

### Animation
- [ ] `"use client"` directive on Framer Motion components
- [ ] `key` prop set on `AnimatePresence` children
- [ ] GSAP effects cleaned up in `useEffect` return
- [ ] `prefers-reduced-motion` respected

## Output

Report: PASS / FAIL per section. List all violations with suggested fixes.

## Prohibited

- Typography without `clamp()` or `max-width`
- Multiple conflicting CTAs
- Arbitrary spacing values without justification
- Animations that ignore `prefers-reduced-motion`
