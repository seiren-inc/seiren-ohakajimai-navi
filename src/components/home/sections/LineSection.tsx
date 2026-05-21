"use client"

import { MessageSquare, CheckCircle, ShieldCheck, ClipboardList } from "lucide-react"
import { Eyebrow, PillLink, Reveal, Wrap } from "../primitives"

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative h-[560px] w-[280px] rounded-[42px] bg-seiren-main p-3"
      style={{ boxShadow: "0 30px 70px rgba(30,42,56,0.30), 0 12px 30px rgba(30,42,56,0.18)" }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-[#F7F8FA]">
        {/* notch */}
        <div className="absolute left-1/2 top-1.5 z-[2] h-[22px] w-[92px] -translate-x-1/2 rounded-xl bg-seiren-main" />
        {children}
      </div>
    </div>
  )
}

function LinePreview() {
  return (
    <PhoneFrame>
      {/* LINE header */}
      <div className="flex items-center gap-3 bg-seiren-line px-4 pb-3.5 pt-11 text-white">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white text-seiren-line">
          <MessageSquare size={18} strokeWidth={1.75} />
        </div>
        <div className="flex-1 leading-[1.2]">
          <div className="text-[13px] font-bold">お墓じまいナビ</div>
          <div className="text-[10px] opacity-85">by 株式会社 清蓮 · 公式</div>
        </div>
      </div>

      {/* chat */}
      <div className="flex flex-col gap-2.5 p-3.5">
        <div className="text-center text-[10px] text-[#8A8478]">2026年5月15日</div>

        <div
          className="max-w-[78%] self-start rounded-[4px_16px_16px_16px] bg-white p-2.5 px-3 text-xs leading-[1.6] text-seiren-main shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
        >
          こんにちは。お墓じまいナビです。
          <br />
          ご相談内容を教えてください。
        </div>

        <div className="max-w-[84%] self-start rounded-[4px_16px_16px_16px] bg-white p-2.5 px-3 text-[11.5px] leading-[1.6] text-seiren-main shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
          下のメニューからお選びいただけます。
          <br />
          ・お見積もり希望
          <br />
          ・改葬手続きの相談
          <br />
          ・写真を送って相談
        </div>

        <div className="max-w-[70%] self-end rounded-[16px_4px_16px_16px] bg-seiren-line p-2.5 px-3 text-xs leading-[1.6] text-white">
          費用感を教えてください
        </div>

        <div className="self-start pl-1 text-[10px] text-[#8A8478]">
          通常2営業日以内にご返信します
        </div>
      </div>
    </PhoneFrame>
  )
}

const FEATURES = [
  { Icon: MessageSquare, t: "通常2営業日以内に返信" },
  { Icon: CheckCircle, t: "ご相談・お見積り無料" },
  { Icon: ShieldCheck, t: "個人情報は厳重に管理" },
  { Icon: ClipboardList, t: "写真・PDF送信に対応" },
]

export function LineSection() {
  return (
    <section
      id="line"
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #EDF3E5 0%, #E3EFD8 100%)" }}
    >
      <div
        aria-hidden
        className="absolute -left-[10%] -top-[30%] h-[540px] w-[540px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(123,157,106,0.18), transparent 70%)",
        }}
      />

      <Wrap className="relative py-20 md:py-28">
        <div className="grid grid-cols-1 items-center gap-9 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          <Reveal>
            <Eyebrow tone="green">LINE CONSULTATION</Eyebrow>
            <h2
              className="mt-[18px] font-serif font-bold text-seiren-main text-balance"
              style={{
                fontSize: "clamp(28px, 3.4vw, 40px)",
                lineHeight: 1.4,
                letterSpacing: "-0.005em",
              }}
            >
              写真を送るだけでも大丈夫。
              <br />
              LINEで気軽にご相談ください。
            </h2>
            <p className="mt-[22px] max-w-[540px] text-base leading-[2] text-[#3F4A37]">
              現地のお写真や状況のメモを送っていただければ、概算のお見積もりと、進め方の整理をお返しします。電話やメールが苦手な方にも、ご家族間で共有しやすい連絡方法です。
            </p>

            <div className="mt-8 grid max-w-[540px] grid-cols-1 gap-3.5 sm:grid-cols-2">
              {FEATURES.map((it) => (
                <div
                  key={it.t}
                  className="flex items-center gap-2.5 rounded-xl border border-seiren-green/20 bg-white/70 px-3.5 py-3"
                >
                  <span className="text-[#5D7A50]">
                    <it.Icon size={18} strokeWidth={1.75} />
                  </span>
                  <span className="text-[13px] font-medium text-seiren-main">{it.t}</span>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <PillLink
                variant="line"
                size="lg"
                href="https://lin.ee/qSN2RLK"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare size={22} strokeWidth={1.75} className="text-white" />
                LINEで相談する
              </PillLink>
              <div className="flex items-center gap-3 rounded-full border border-seiren-green/25 bg-white/70 px-3.5 py-2.5">
                <div
                  aria-hidden
                  className="grid h-[60px] w-[60px] grid-cols-8 grid-rows-8 gap-px rounded-lg bg-white p-1"
                >
                  {/* fake QR pattern */}
                  {Array.from({ length: 64 }).map((_, i) => {
                    const filled =
                      (i * 7 + Math.floor(i / 8) * 3) % 5 < 2 || i === 0 || i === 7 || i === 56
                    const corner =
                      i < 3 ||
                      (i >= 8 && i < 11) ||
                      (i >= 16 && i < 19) ||
                      (i % 8 >= 5 && i < 24) ||
                      (Math.floor(i / 8) >= 5 && i % 8 < 3)
                    return (
                      <div
                        key={i}
                        style={{ background: filled || corner ? "#06C755" : "transparent" }}
                      />
                    )
                  })}
                </div>
                <div className="leading-[1.35]">
                  <div className="text-[11px] font-bold tracking-[0.04em] text-[#5D7A50]">
                    QRから友だち追加
                  </div>
                  <div className="text-[11px] text-seiren-sub">@seiren-ohakajimai</div>
                </div>
              </div>
            </div>

            <p className="mt-[18px] text-xs leading-[1.7] text-seiren-sub">
              ※ ご家族でやり取りを共有したい場合は、グループトークでのご対応も可能です。
            </p>
          </Reveal>

          <Reveal as="div" delay={0.12} className="-order-1 flex justify-center lg:order-none">
            <LinePreview />
          </Reveal>
        </div>
      </Wrap>
    </section>
  )
}
