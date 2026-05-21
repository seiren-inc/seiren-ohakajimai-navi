"use client"

import React from "react"
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

// ============================================================
// Eyebrow — letter-spaced uppercase micro-label with hairline
// ============================================================
type EyebrowTone = "gold" | "green"
export function Eyebrow({
  children,
  tone = "gold",
  className,
}: {
  children: React.ReactNode
  tone?: EyebrowTone
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[10px] text-[11px] font-bold uppercase",
        "tracking-[0.22em] before:inline-block before:h-px before:w-7 before:opacity-70 before:content-['']",
        tone === "green"
          ? "text-seiren-green before:bg-seiren-green"
          : "text-seiren-accent-micro before:bg-seiren-accent-micro",
        className
      )}
    >
      {children}
    </span>
  )
}

// ============================================================
// Pill — primary interactive (CTA / ghost / green / line / dark / outline)
// ============================================================
type PillVariant = "cta" | "ghost" | "green" | "green-ghost" | "line" | "dark" | "outline"
type PillSize = "sm" | "md" | "lg"
const PILL_SIZE: Record<PillSize, string> = {
  sm: "px-[18px] py-[10px] text-[13px] min-h-[40px]",
  md: "px-[26px] py-[14px] text-sm min-h-[50px]",
  lg: "px-8 py-[17px] text-base min-h-[58px]",
}
const PILL_VARIANT: Record<PillVariant, string> = {
  cta: "bg-seiren-cta text-white shadow-[0_4px_20px_rgba(201,138,46,0.28)] hover:bg-seiren-cta-hover hover:shadow-[0_6px_24px_rgba(201,138,46,0.38)]",
  ghost: "bg-white/75 text-seiren-main border border-[#E5E0D6] backdrop-blur-[6px] hover:border-seiren-accent/45 hover:bg-white",
  green: "bg-seiren-green text-white shadow-[0_4px_18px_rgba(123,157,106,0.28)] hover:bg-[#6A8B59]",
  "green-ghost": "bg-white/85 text-[#5D7A50] border border-seiren-green/35",
  line: "bg-seiren-line text-white shadow-[0_4px_22px_rgba(6,199,85,0.32)] hover:bg-seiren-line-dark",
  dark: "bg-white/[0.06] text-white border border-white/20 hover:bg-white/10",
  outline: "bg-transparent text-seiren-main border border-[#E5E0D6] hover:border-seiren-accent/45",
}
const PILL_BASE =
  "inline-flex items-center justify-center gap-[10px] rounded-full font-semibold leading-[1.2] tracking-[0.02em] cursor-pointer no-underline whitespace-nowrap"

export function PillButton({
  children,
  variant = "cta",
  size = "md",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: PillVariant
  size?: PillSize
}) {
  return (
    <button
      type="button"
      className={cn(PILL_BASE, PILL_SIZE[size], PILL_VARIANT[variant], className)}
      {...rest}
    >
      {children}
    </button>
  )
}

export function PillLink({
  children,
  variant = "cta",
  size = "md",
  className,
  href,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: PillVariant
  size?: PillSize
  href: string
}) {
  return (
    <a
      href={href}
      className={cn(PILL_BASE, PILL_SIZE[size], PILL_VARIANT[variant], className)}
      {...rest}
    >
      {children}
    </a>
  )
}

// ============================================================
// IconBubble — soft tinted circle around a lucide icon
// ============================================================
type BubbleTone = "gold" | "green" | "navy"
const BUBBLE_TONE: Record<BubbleTone, string> = {
  gold: "bg-[rgba(200,169,107,0.10)] text-seiren-accent-micro ring-1 ring-inset ring-[rgba(200,169,107,0.22)]",
  green: "bg-seiren-green-soft text-[#5D7A50] ring-1 ring-inset ring-seiren-green/25",
  navy: "bg-[#EFF1F3] text-seiren-main ring-1 ring-inset ring-seiren-main/10",
}
export function IconBubble({
  children,
  tone = "gold",
  size = 48,
  className,
}: {
  children: React.ReactNode
  tone?: BubbleTone
  size?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-[14px] shrink-0",
        BUBBLE_TONE[tone],
        className
      )}
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  )
}

// ============================================================
// Tag — small label chip
// ============================================================
type TagTone = "gold" | "green" | "navy" | "cream"
const TAG_TONE: Record<TagTone, string> = {
  gold: "bg-[rgba(200,169,107,0.12)] text-[#A6884C]",
  green: "bg-seiren-green-soft text-[#5D7A50]",
  navy: "bg-[#EFF1F3] text-seiren-main",
  cream: "bg-seiren-cta-soft text-seiren-cta-hover",
}
export function Tag({
  children,
  tone = "gold",
  className,
}: {
  children: React.ReactNode
  tone?: TagTone
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-[5px] text-xs font-semibold leading-[1.3] tracking-[0.02em]",
        TAG_TONE[tone],
        className
      )}
    >
      {children}
    </span>
  )
}

// ============================================================
// Reveal — framer-motion whileInView with iOS-style decel.
// Honors prefers-reduced-motion. Polymorphic `as` accepts a
// limited set of block-level tags relevant to our LP.
// ============================================================
type RevealTag = "section" | "div" | "article" | "ul"

export function Reveal({
  children,
  delay = 0,
  className,
  id,
  as = "section",
  ...rest
}: Omit<HTMLMotionProps<"div">, "ref"> & {
  delay?: number
  id?: string
  as?: RevealTag
}) {
  const reduce = useReducedMotion()
  const initial = reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
  const animate = { opacity: 1, y: 0 }
  const motionMap = {
    section: motion.section,
    div: motion.div,
    article: motion.article,
    ul: motion.ul,
  } as const
  const MotionTag = motionMap[as] as typeof motion.div
  return (
    <MotionTag
      id={id}
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -40px 0px" }}
      transition={{
        duration: reduce ? 0 : 0.7,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

// ============================================================
// SectionHead — eyebrow + h2 + optional sub paragraph
// ============================================================
export function SectionHead({
  eyebrow,
  eyebrowJp,
  title,
  sub,
  align = "left",
  tone = "gold",
  className,
}: {
  eyebrow?: string
  eyebrowJp?: string
  title: React.ReactNode
  sub?: React.ReactNode
  align?: "left" | "center"
  tone?: EyebrowTone
  className?: string
}) {
  const isCenter = align === "center"
  return (
    <div
      className={cn(
        isCenter ? "mx-auto max-w-[720px] text-center" : "text-left",
        className
      )}
    >
      {eyebrowJp ? (
        <div className="text-[13px] font-semibold tracking-[0.12em] text-seiren-green">
          {eyebrowJp}
        </div>
      ) : eyebrow ? (
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      ) : null}
      <h2
        className={cn(
          "mt-[18px] font-serif font-bold text-seiren-main",
          "text-[clamp(26px,3.4vw,40px)] leading-[1.32] tracking-[-0.005em] text-balance"
        )}
        style={{ wordBreak: "keep-all" }}
      >
        {title}
      </h2>
      {sub ? (
        <p
          className={cn(
            "mt-5 text-base leading-[1.9] text-seiren-body text-pretty",
            isCenter ? "mx-auto max-w-[640px]" : "max-w-[760px]"
          )}
        >
          {sub}
        </p>
      ) : null}
    </div>
  )
}

// ============================================================
// Container — site-wide measure
// ============================================================
export function Wrap({
  children,
  narrow,
  className,
}: {
  children: React.ReactNode
  narrow?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "mx-auto px-5 md:px-10 lg:px-16",
        narrow ? "max-w-[980px]" : "max-w-[1320px]",
        className
      )}
    >
      {children}
    </div>
  )
}

// ============================================================
// Hairline — small horizontal accent
// ============================================================
export function Hairline({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block h-px w-16 bg-seiren-accent/70", className)}
    />
  )
}
