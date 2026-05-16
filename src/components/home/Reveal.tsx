"use client"

import React, { useState, useEffect, useRef } from "react"

// ----------------------------------------------------------------
// Reveal Hook (IntersectionObserver)
// ----------------------------------------------------------------
function useReveal<T extends HTMLElement = HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ----------------------------------------------------------------
// Reveal Section Wrapper
// ----------------------------------------------------------------
export function Reveal({
  children,
  className = "",
  delay = 0,
  id,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  id?: string
}) {
  const { ref, visible } = useReveal()
  return (
    <section
      ref={ref}
      id={id}
      className={className}
      style={{
        transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </section>
  )
}

// ----------------------------------------------------------------
// WorryList — scroll-triggered staggered list (CSS transition, no
// framer-motion). Replaces the prior motion.div whileInView stagger.
// ----------------------------------------------------------------
export function WorryList({ items }: { items: readonly string[] }) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className="mt-8 space-y-4">
      {items.map((worry, i) => (
        <div
          key={worry}
          className="flex items-start gap-3"
          style={{
            transition: `opacity 0.3s ease-out ${i * 80}ms, transform 0.3s ease-out ${i * 80}ms`,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-8px)",
          }}
        >
          <span className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-seiren-accent/15">
            <span className="h-1.5 w-1.5 rounded-full bg-seiren-accent" />
          </span>
          <p className="text-[15px] leading-[1.7] text-seiren-body">{worry}</p>
        </div>
      ))}
    </div>
  )
}
