"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { testimonials } from "@/lib/testimonials"

const CARDS_PER_VIEW = 3

export function TestimonialCarousel() {
  const [page, setPage] = useState(0)
  const total = Math.ceil(testimonials.length / CARDS_PER_VIEW)

  const prev = () => setPage((p) => (p === 0 ? total - 1 : p - 1))
  const next = () => setPage((p) => (p === total - 1 ? 0 : p + 1))

  const visible = testimonials.slice(page * CARDS_PER_VIEW, page * CARDS_PER_VIEW + CARDS_PER_VIEW)

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="grid gap-5 md:grid-cols-3"
        >
          {visible.map((t, i) => (
            <div key={i} className="flex flex-col rounded-2xl border border-neutral-100 bg-white p-7 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex flex-wrap items-center rounded-full bg-seiren-accent/10 px-3 py-1 text-xs font-semibold text-seiren-main">
                  {t.prefecture}・{t.situation}
                </span>
                <div className="flex shrink-0 gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="font-serif mt-4 flex-1 text-[14px] leading-[2] text-neutral-600">「{t.text}」</p>
              <p className="mt-4 text-[13px] font-semibold text-neutral-400">{t.name}</p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-sm hover:bg-seiren-accent/10 hover:border-seiren-accent/40 transition-colors"
          aria-label="前へ"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm text-neutral-400">{page + 1} / {total}</span>
        <button
          onClick={next}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-sm hover:bg-seiren-accent/10 hover:border-seiren-accent/40 transition-colors"
          aria-label="次へ"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-neutral-400">※ 個人情報保護のため、一部内容を省略・修正しています。全{testimonials.length}件掲載</p>
    </div>
  )
}
