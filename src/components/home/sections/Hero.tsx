"use client"

import Image from "next/image"
import { Mail, ArrowRight, ShieldCheck, Check } from "lucide-react"
import { Eyebrow, PillLink, Wrap, Reveal } from "../primitives"

const HERO_BULLETS = [
  "改葬手続きサポート",
  "提携行政書士のご紹介",
  "墓石撤去工事",
  "ご遺骨の洗骨・粉骨",
  "散骨・納骨先のご案内",
]

const STATS = [
  { v: "300", u: "件以上", l: "施工実績", f: "2008年創業・横浜" },
  { v: "47", u: "都道府県", l: "全国対応", f: null },
  { v: "0", u: "円", l: "お見積り", f: null },
]

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-seiren-bg"
    >
      {/* Right-half photo */}
      <div className="absolute inset-y-0 left-0 right-0 lg:left-[48%]">
        <Image
          src="/images/hero-garden-v3.webp"
          alt="新緑のなか、お墓の前に並んで立つご家族のうしろ姿"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 52vw"
          className="object-cover object-[30%_center] opacity-70 lg:opacity-100"
        />
        {/* Soft cream fade on left edge — only on desktop */}
        <div
          aria-hidden
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(to right, #FAFAF8 0%, rgba(250,250,248,0.55) 12%, rgba(250,250,248,0.15) 30%, rgba(250,250,248,0) 55%)",
          }}
        />
        {/* On mobile/tablet, full cream wash for legibility */}
        <div
          aria-hidden
          className="absolute inset-0 bg-seiren-bg/85 lg:hidden"
        />
        {/* Bottom warm vignette */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(30,42,56,0.12), transparent 35%)",
          }}
        />
      </div>

      <Wrap className="relative z-[1]">
        <div className="grid items-center gap-y-8 py-16 md:py-24 lg:min-h-[min(720px,calc(100vh-84px))] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-14 lg:py-[88px]">
          {/* Left column */}
          <div className="max-w-[540px]">
            <Reveal as="div" className="block">
              <Eyebrow tone="green">SEIREN · OHAKAJIMAI NAVI</Eyebrow>
            </Reveal>
            <Reveal as="div" delay={0.1}>
              <h1
                className="mt-6 font-serif font-bold text-seiren-main text-balance"
                style={{
                  fontSize: "clamp(32px, 4.2vw, 54px)",
                  lineHeight: 1.32,
                  letterSpacing: "-0.005em",
                  wordBreak: "keep-all",
                }}
              >
                お墓じまい、
                <br />
                何から始めれば
                <br className="hidden sm:inline" />
                いいか
                <br className="sm:hidden" />
                わからない方へ。
              </h1>
              <p
                className="mt-7 max-w-[500px] text-base font-normal text-seiren-body text-pretty"
                style={{ lineHeight: 1.95 }}
              >
                改葬手続き、行政書士紹介、墓石撤去、粉骨、納骨先のご相談まで、まとめて整理します。
              </p>
            </Reveal>

            <Reveal as="ul" delay={0.2} className="mt-8 flex list-none flex-col gap-3.5 p-0">
              {HERO_BULLETS.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-base font-medium text-seiren-main"
                  style={{ lineHeight: 1.7 }}
                >
                  <span className="mt-1 inline-flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-seiren-green-50">
                    <Check size={13} strokeWidth={2.4} className="text-seiren-green" />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </Reveal>

            <Reveal as="div" delay={0.3} className="mt-10 flex flex-wrap items-center gap-3.5">
              <PillLink variant="cta" size="lg" href="#contact">
                <Mail size={17} className="text-white" strokeWidth={1.75} />
                清蓮に無料相談する
              </PillLink>
              <PillLink variant="ghost" size="lg" href="#flow">
                サービスの流れを見る
                <ArrowRight size={15} className="text-seiren-main" strokeWidth={1.75} />
              </PillLink>
            </Reveal>

            <Reveal
              as="div"
              delay={0.4}
              className="mt-6 flex max-w-[500px] items-start gap-3 rounded-2xl border border-seiren-green/20 bg-seiren-green-soft/55 px-[18px] py-4"
            >
              <ShieldCheck size={18} className="mt-0.5 flex-shrink-0 text-seiren-green" strokeWidth={1.75} />
              <p className="m-0 text-[13px] font-medium text-[#3F4A37]" style={{ lineHeight: 1.85 }}>
                状況整理から始められるので、何から手を付ければよいか分からない方でも進めやすい構成です。
              </p>
            </Reveal>
          </div>

          {/* Right column — glass trust card */}
          <Reveal
            as="div"
            delay={0.3}
            className="relative flex h-full items-end justify-start pb-9 lg:pb-9"
          >
            <div
              className="relative w-full min-w-0 rounded-[18px] border border-white/70 bg-white/88 px-7 pt-[22px] pb-5 backdrop-blur-[10px] lg:min-w-[400px] lg:-ml-10"
              style={{
                boxShadow:
                  "0 18px 50px rgba(30,42,56,0.16), 0 4px 12px rgba(30,42,56,0.06)",
                backdropFilter: "blur(10px) saturate(110%)",
                WebkitBackdropFilter: "blur(10px) saturate(110%)",
              }}
            >
              <div className="mb-4 flex items-center gap-2.5">
                <span className="inline-block h-px w-[22px] bg-seiren-accent-micro" />
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-seiren-accent-micro">
                  清蓮の実績
                </span>
              </div>
              <div className="flex gap-[22px]">
                {STATS.map((it, i) => (
                  <div
                    key={it.l}
                    className={`flex-1 text-center ${
                      i > 0 ? "border-l border-[#E5E0D6] pl-[22px]" : ""
                    }`}
                  >
                    <div className="flex items-baseline justify-center gap-0.5">
                      <span
                        className="font-bold text-seiren-main"
                        style={{
                          fontFamily:
                            "var(--font-inter), Inter, system-ui, sans-serif",
                          fontSize: 32,
                          lineHeight: 1,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {it.v}
                      </span>
                      <span className="text-xs font-medium text-seiren-sub">{it.u}</span>
                    </div>
                    <p className="mt-1.5 text-xs font-medium text-[#525762]">{it.l}</p>
                    {it.f ? (
                      <span className="mt-0.5 block text-[10px] text-seiren-sub/70">{it.f}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Wrap>
    </section>
  )
}
