/**
 * SmoothScroll.tsx — Lenis 慣性スクロール初期設定（グループA：清蓮系）
 * 配置先: src/components/common/SmoothScroll.tsx
 *
 * 使用方法:
 * // app/layout.tsx で 全ページに適用
 * import { SmoothScroll } from "@/components/common/SmoothScroll"
 * export default function RootLayout({ children }) {
 *   return <SmoothScroll>{children}</SmoothScroll>
 * }
 */
"use client"

import Lenis from "lenis"
import { useEffect, useRef } from "react"
import { useReducedMotion } from "framer-motion"

interface SmoothScrollProps {
  children: React.ReactNode
  /** Lenis の lerp 値。清蓮系は 0.06〜0.08 でゆったりと設定 */
  lerp?: number
}

/**
 * Lenis 慣性スクロール ラッパー（清蓮グループ向け）
 * - prefers-reduced-motion 有効時は Lenis を起動しない（通常スクロール）
 * - GSAP ScrollTrigger 連携済みパターン
 */
export function SmoothScroll({ children, lerp = 0.07 }: SmoothScrollProps) {
  const prefersReduced = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // OSのアクセシビリティ設定を尊重
    if (prefersReduced) return

    const lenis = new Lenis({
      lerp,
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false,
    })

    lenisRef.current = lenis

    // requestAnimationFrame ループ
    let raf: number
    function onRaf(time: number) {
      lenis.raf(time)
      raf = requestAnimationFrame(onRaf)
    }
    raf = requestAnimationFrame(onRaf)

    // GSAP ScrollTrigger 連携（GSAP を使用している場合のみ有効化）
    // gsap.registerPlugin(ScrollTrigger)
    // lenis.on("scroll", ScrollTrigger.update)
    // gsap.ticker.lagSmoothing(0)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [lerp, prefersReduced])

  return <>{children}</>
}

/**
 * 任意の要素へのスムーズスクロール
 * @example scrollTo("#contact")
 */
export function scrollTo(target: string | HTMLElement, offset = 0) {
  const lenis = (window as unknown as { lenis?: Lenis }).lenis
  if (lenis) {
    lenis.scrollTo(target, { offset })
  } else {
    const el =
      typeof target === "string" ? document.querySelector(target) : target
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}
