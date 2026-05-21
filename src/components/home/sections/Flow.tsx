"use client"

import Image from "next/image"
import { Reveal, SectionHead, Tag, Wrap } from "../primitives"

const STEPS = [
  {
    n: "01",
    label: "STEP 01 — 相談",
    title: "状況をうかがい、進め方を整理します。",
    body: "電話・フォーム・LINEからご相談ください。ご事情を伺いながら、必要な手続きの順序と所要期間の目安をお伝えします。",
    bullets: ["お見積り無料", "24時間365日受付", "2営業日以内に返信"],
    image: "/images/reason-compliance-v2.webp",
  },
  {
    n: "02",
    label: "STEP 02 — お見積りと手続き",
    title: "費用とスケジュールを明示し、合意の上で進めます。",
    body: "墓石撤去・改葬許可・行政書士手配・新しい納骨先の候補までを書面で整理。ご家族でご検討いただける形でお渡しします。",
    bullets: ["項目別の明朗会計", "提携行政書士のご紹介", "新しい納骨先の候補出し"],
    image: "/images/step-permit.webp",
  },
  {
    n: "03",
    label: "STEP 03 — 施工と納骨",
    title: "墓石撤去・お骨の処理・新しい供養先への引き継ぎ。",
    body: "現地立会いが難しい場合も、写真・動画でのご報告に対応します。お骨の洗骨・粉骨、散骨・納骨堂への引き継ぎまで一貫対応。",
    bullets: ["全工程に写真記録", "洗骨・粉骨に対応", "散骨・納骨先までご案内"],
    image: "/images/step-acceptance-v3.webp",
  },
]

export function Flow() {
  return (
    <section id="flow" className="bg-[#F3F0EA]">
      <Wrap className="py-20 md:py-28">
        <Reveal>
          <SectionHead
            eyebrow="STEPS"
            eyebrowJp="ご利用の流れ"
            title="3ステップで、相談から実行までを整理します。"
            sub="どの段階からでもご相談いただけます。途中まで他社で進めている方の引き継ぎにも対応しています。"
          />
        </Reveal>

        <div className="mt-14 flex flex-col gap-6">
          {STEPS.map((s, i) => (
            <Reveal as="article" key={s.n} delay={i * 0.08}>
              <article className="grid grid-cols-1 items-center gap-6 rounded-[22px] border border-[#ECE7DE] bg-white p-6 shadow-[0_1px_2px_rgba(30,42,56,0.03)] md:p-7 lg:grid-cols-[240px_1fr_1.1fr] lg:gap-8">
                {/* Image */}
                <div className="relative h-[200px] overflow-hidden rounded-2xl bg-[#EDE9E0] lg:h-[200px]">
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 240px"
                    className="object-cover"
                  />
                  <div
                    className="absolute left-3.5 top-3.5 rounded-full bg-white/92 px-3 py-1.5 text-xs font-bold tracking-[0.06em] text-seiren-main backdrop-blur-[4px]"
                    style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                  >
                    {s.n}
                  </div>
                </div>

                {/* Title block */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-seiren-accent-micro">
                    {s.label}
                  </div>
                  <h3 className="mt-2.5 font-serif text-[22px] font-bold leading-[1.5] text-seiren-main text-balance">
                    {s.title}
                  </h3>
                </div>

                {/* Body + bullets */}
                <div>
                  <p className="text-[14.5px] leading-[1.95] text-[#374151]">{s.body}</p>
                  <ul className="mt-4 flex list-none flex-wrap gap-2 p-0">
                    {s.bullets.map((b) => (
                      <li key={b}>
                        <Tag tone="gold">{b}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  )
}
