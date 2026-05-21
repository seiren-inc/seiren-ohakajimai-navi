"use client"

import { Check, UserCheck, ArrowRight } from "lucide-react"
import { Eyebrow, PillLink, Reveal, Tag, Wrap } from "../primitives"

const MATCHES = [
  { region: "神奈川県横浜市", name: "田中 行政書士事務所", years: "実務15年", focus: "改葬・墓地行政", fee: "55,000円〜" },
  { region: "東京都内全域", name: "佐藤 行政書士事務所", years: "実務12年", focus: "離檀・墓地行政", fee: "60,000円〜" },
  { region: "千葉県北部", name: "中村 行政書士事務所", years: "実務22年", focus: "改葬・相続", fee: "50,000円〜" },
]

const BULLETS = [
  "全国対応の提携ネットワーク",
  "ご相談・お見積りまで無料",
  "成功報酬・着手金は事前明示",
  "清蓮の窓口を通すと、書類の往復回数を削減",
]

export function Gyosei() {
  return (
    <section
      id="gyosei"
      className="relative overflow-hidden bg-seiren-main text-white"
    >
      {/* Gold decorative arc */}
      <div
        aria-hidden
        className="absolute -right-[20%] -top-1/2 h-[200%] w-[60%]"
        style={{
          background:
            "radial-gradient(circle, rgba(200,169,107,0.10), transparent 60%)",
        }}
      />

      <Wrap className="relative py-20 md:py-28">
        <div className="grid grid-cols-1 items-center gap-9 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <Eyebrow tone="gold">GYOSEISHOSHI MATCHING</Eyebrow>
            <h2
              className="mt-[18px] font-serif font-bold text-white text-balance"
              style={{
                fontSize: "clamp(26px, 3.2vw, 38px)",
                lineHeight: 1.4,
                letterSpacing: "-0.005em",
              }}
            >
              代理提出が必要なときは、
              <br />
              有資格の行政書士へお繋ぎします。
            </h2>
            <p className="mt-[22px] max-w-[480px] text-[15.5px] leading-[2] text-white/[0.78]">
              改葬許可申請の代理提出や行政書士業務は、無資格者が行うことはできません。清蓮はこの線を引いた上で、地域・案件に合った行政書士の方をお繋ぎします。
            </p>

            <ul className="mt-[30px] flex list-none flex-col gap-3 p-0">
              {BULLETS.map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-3 text-[14.5px] leading-[1.7] text-white/90"
                >
                  <Check
                    size={16}
                    strokeWidth={2.2}
                    className="mt-1 flex-shrink-0 text-seiren-accent"
                  />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              <PillLink variant="cta" size="lg" href="#contact">
                行政書士の紹介を相談する
              </PillLink>
              <PillLink variant="dark" size="lg" href="#contact">
                費用感を確認する
                <ArrowRight size={14} className="text-white" strokeWidth={1.75} />
              </PillLink>
            </div>
          </Reveal>

          {/* Match profile card */}
          <Reveal as="div" delay={0.12}>
            <div
              className="rounded-3xl border border-seiren-accent/30 bg-white/[0.04] p-7 backdrop-blur-[8px]"
            >
              <div className="mb-[22px] flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.20em] text-seiren-accent">
                  MATCH PROFILE
                </span>
                <Tag tone="gold">事例イメージ</Tag>
              </div>

              {MATCHES.map((m, i) => (
                <div
                  key={m.name}
                  className={`grid grid-cols-[44px_1fr_auto] items-center gap-3.5 py-4 ${
                    i > 0 ? "border-t border-white/10" : ""
                  }`}
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-seiren-accent/30 bg-seiren-accent/15"
                  >
                    <UserCheck size={20} strokeWidth={1.75} className="text-seiren-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold leading-[1.4] text-white">
                      {m.name}
                    </div>
                    <div className="mt-1 text-[11.5px] tracking-[0.02em] text-white/60">
                      {m.region}・{m.years}・{m.focus}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="font-bold text-seiren-accent"
                      style={{
                        fontFamily: "var(--font-inter), Inter, sans-serif",
                        fontSize: 14,
                      }}
                    >
                      {m.fee}
                    </div>
                    <div className="text-[10px] text-white/50">応相談</div>
                  </div>
                </div>
              ))}

              <p className="mt-4 border-t border-white/10 pt-4 text-[11px] leading-[1.7] text-white/45">
                ※ 表示は事例イメージです。地域・案件によって、最適な提携先をお繋ぎします。
              </p>
            </div>
          </Reveal>
        </div>
      </Wrap>
    </section>
  )
}
