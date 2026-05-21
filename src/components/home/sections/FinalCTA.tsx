"use client"

import Image from "next/image"
import { Mail, ArrowRight, Check } from "lucide-react"
import { Eyebrow, PillLink, Reveal, Wrap } from "../primitives"

const NOTES = [
  "9:00〜19:00（電話）",
  "24時間365日受付（フォーム）",
  "2営業日以内に返信",
  "ご相談・お見積り無料",
]

export function FinalCTA() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-seiren-main text-white"
    >
      <div aria-hidden className="absolute inset-0">
        <Image
          src="/images/company-hero-zen.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.18]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(30,42,56,0.85) 0%, rgba(30,42,56,0.94) 100%)",
          }}
        />
      </div>

      <Wrap className="relative py-20 text-center md:py-28">
        <Reveal>
          <Eyebrow tone="gold">CONTACT</Eyebrow>
          <h2
            className="mx-auto mt-5 max-w-[760px] font-serif font-bold text-white text-balance"
            style={{
              fontSize: "clamp(28px, 3.8vw, 48px)",
              lineHeight: 1.4,
              letterSpacing: "-0.005em",
            }}
          >
            「何から始めればいいか分からない」
            <br />
            そのままで、ご相談いただいて大丈夫です。
          </h2>
          <p className="mx-auto mt-6 max-w-[600px] text-base leading-[2] text-white/[0.78]">
            状況の整理から、お見積り、行政書士のご紹介まで。
            <br />
            清蓮が一括して、ご家族の事情に合わせて整えます。
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mx-auto mt-11 grid max-w-[820px] grid-cols-1 items-stretch gap-3.5 sm:grid-cols-3">
            <PillLink
              variant="cta"
              size="lg"
              href="/contact"
              className="w-full !min-h-[62px]"
            >
              <Mail size={18} className="text-white" strokeWidth={1.75} />
              無料で相談する
            </PillLink>
            <a
              href="#flow"
              className="inline-flex w-full min-h-[62px] items-center justify-center gap-2.5 rounded-full border border-white/45 bg-transparent px-7 py-4 text-base font-semibold leading-[1.2] tracking-[0.02em] text-white"
            >
              サービスの流れを見る
              <ArrowRight size={14} className="text-white" strokeWidth={1.75} />
            </a>
            <a
              href="#cases"
              className="inline-flex w-full min-h-[62px] items-center justify-center gap-2.5 rounded-full border border-white/15 bg-transparent px-7 py-4 text-base font-medium leading-[1.2] tracking-[0.02em] text-white/70"
            >
              施工事例を見る
              <ArrowRight size={13} className="text-white/70" strokeWidth={1.75} />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-9 inline-flex max-w-full flex-wrap justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-[18px] py-3">
            {NOTES.map((t, i) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 text-[12.5px] text-white/85"
              >
                <Check
                  size={14}
                  strokeWidth={2.4}
                  className="text-seiren-accent"
                />
                {t}
                {i < NOTES.length - 1 ? (
                  <span className="ml-2 text-white/20">·</span>
                ) : null}
              </span>
            ))}
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}
