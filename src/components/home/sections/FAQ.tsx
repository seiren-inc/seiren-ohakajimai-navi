"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { homepageFaqs } from "@/components/seo/faq-json-ld"
import { Reveal, SectionHead, Wrap } from "../primitives"

/**
 * 表示するFAQは `homepageFaqs` を単一ソースとして利用。
 * 構造化データ（FaqJsonLd）と完全一致させるための重要な約束。
 */

function FAQItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string
  a: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-[#ECE7DE] last:border-b-0">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-4 bg-transparent px-1.5 py-5 text-left"
      >
        <span
          className="w-6 flex-shrink-0 text-[13px] font-bold tracking-[0.08em] text-seiren-accent-micro"
          style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          Q
        </span>
        <span className="flex-1 font-serif text-base font-semibold leading-[1.6] text-seiren-main">
          {q}
        </span>
        <span
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
            open ? "bg-seiren-accent/15 rotate-45" : "bg-[#F3F0EA] rotate-0"
          }`}
        >
          <Plus size={16} strokeWidth={2} className="text-seiren-accent-micro" />
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div className="overflow-hidden">
          <div className="flex gap-4 px-1.5 pb-6 pl-[46px]">
            <span
              className="-ml-10 w-6 flex-shrink-0 text-[13px] font-bold tracking-[0.08em] text-seiren-green"
              style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
            >
              A
            </span>
            <p className="m-0 text-[14.5px] leading-[1.95] text-[#374151]">{a}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="bg-[#F3F0EA]">
      <Wrap narrow className="py-20 md:py-28">
        <Reveal>
          <SectionHead
            eyebrow="FAQ"
            eyebrowJp="よくあるご質問"
            title="ご相談前に多くいただく質問にお答えします。"
            sub="ここに無い質問も、お気軽にお問い合わせください。"
            align="center"
          />
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-12 rounded-[22px] border border-[#ECE7DE] bg-white px-6 py-2 shadow-[0_1px_2px_rgba(30,42,56,0.03)]">
            {homepageFaqs.map((f, i) => (
              <FAQItem
                key={i}
                q={f.question}
                a={f.answer}
                open={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}
