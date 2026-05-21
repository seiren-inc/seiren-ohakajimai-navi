"use client"

import { useRef, useState, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

/**
 * BeforeAfter — accessible before/after compare slider.
 * Drag (mouse/touch) plus full keyboard: ←/→ ±5, Shift = ±10, Home/End = 2/98.
 * ARIA role=slider, aria-valuenow live-updated.
 */
export function BeforeAfter({
  before,
  after,
  beforeAlt = "施工前",
  afterAlt = "施工後",
  height = 280,
}: {
  before: string
  after: string
  beforeAlt?: string
  afterAlt?: string
  height?: number
}) {
  const [pos, setPos] = useState(50)
  const trackRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const move = useCallback((clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = clientX - rect.left
    const p = Math.max(2, Math.min(98, (x / rect.width) * 100))
    setPos(p)
  }, [])

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 5
    let next: number | null = null
    if (e.key === "ArrowLeft") next = Math.max(2, pos - step)
    else if (e.key === "ArrowRight") next = Math.min(98, pos + step)
    else if (e.key === "Home") next = 2
    else if (e.key === "End") next = 98
    if (next !== null) {
      e.preventDefault()
      setPos(next)
    }
  }

  return (
    <div
      ref={trackRef}
      className="relative w-full select-none overflow-hidden rounded-[14px] bg-[#EDE9E0]"
      style={{ height, cursor: "ew-resize" }}
      onMouseDown={(e) => {
        dragging.current = true
        move(e.clientX)
        handleRef.current?.focus()
      }}
      onMouseMove={(e) => {
        if (dragging.current) move(e.clientX)
      }}
      onMouseUp={() => {
        dragging.current = false
      }}
      onMouseLeave={() => {
        dragging.current = false
      }}
      onTouchStart={(e) => {
        dragging.current = true
        move(e.touches[0].clientX)
      }}
      onTouchMove={(e) => {
        if (dragging.current) move(e.touches[0].clientX)
      }}
      onTouchEnd={() => {
        dragging.current = false
      }}
    >
      {/* Before image — full bleed background */}
      <Image
        src={before}
        alt={beforeAlt}
        fill
        draggable={false}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
      />

      {/* After image — clipped to the left of the divider */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <div className="absolute inset-y-0 left-0" style={{ width: `${(100 / pos) * 100}%`, maxWidth: "none" }}>
          <Image
            src={after}
            alt={afterAlt}
            fill
            draggable={false}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute left-3 top-3 rounded-full bg-[rgba(30,42,56,0.75)] px-3 py-[5px] text-[10.5px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-[4px]">
        BEFORE
      </div>
      <div className="absolute right-3 top-3 rounded-full bg-[rgba(123,157,106,0.92)] px-3 py-[5px] text-[10.5px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-[4px]">
        AFTER
      </div>

      {/* Divider with handle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)]"
        style={{ left: `${pos}%`, transform: "translateX(-1px)" }}
      >
        <div
          ref={handleRef}
          role="slider"
          tabIndex={0}
          aria-label="施工前と施工後を比較するスライダー"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          className="pointer-events-auto absolute left-1/2 top-1/2 flex h-[38px] w-[38px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.20)] outline-none focus-visible:shadow-[0_0_0_3px_rgba(200,169,107,0.55),0_4px_14px_rgba(0,0,0,0.20)]"
          style={{ cursor: "ew-resize" }}
        >
          <ChevronLeft size={14} className="text-seiren-main" strokeWidth={1.75} />
          <ChevronRight size={14} className="text-seiren-main" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  )
}
