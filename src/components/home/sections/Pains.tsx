"use client"

import { Reveal, SectionHead, Wrap } from "../primitives"

const PAINS = [
  { num: "01", title: "何から始めればいいか分からない", body: "必要書類、改葬先、供養の流れを、順番に確認できるようにします。" },
  { num: "02", title: "親族の説明で揉めそう", body: "感情面の配慮が必要な場面を想定し、伝え方の整理まで支援します。" },
  { num: "03", title: "お寺や霊園への連絡が不安", body: "ご事情に合わせて、失礼のない進め方や確認項目をまとめます。" },
  { num: "04", title: "費用の見通しが立たない", body: "撤去・行政手続き・新しい納骨先まで、内訳を最初に整理します。" },
  { num: "05", title: "遠方のお墓に行けない", body: "現地調査・写真確認・書類のやり取りまで、清蓮が代行可能な範囲で支援します。" },
  { num: "06", title: "新しい納骨先が決まらない", body: "永代供養・納骨堂・樹木葬・散骨など、ご希望に沿って候補を整理します。" },
]

export function Pains() {
  return (
    <section id="about" className="bg-[#F3F0EA]">
      <Wrap className="py-20 md:py-28">
        <Reveal>
          <SectionHead
            eyebrowJp="こんなお悩みに、先にお応えします。"
            title="お墓じまいで、つまずきやすい6つのポイント。"
            sub="ご相談の入口で多いお悩みを、清蓮が事前に整理します。「分からないまま動く」前に、状況の見立てから始められます。"
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PAINS.map((p, i) => (
            <Reveal as="article" key={p.num} delay={i * 0.08}>
              <div className="h-full rounded-[22px] border border-[#ECE7DE] bg-white p-7 shadow-[0_1px_2px_rgba(30,42,56,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-seiren-accent/35 hover:shadow-[0_6px_22px_rgba(30,42,56,0.06)]">
                <div className="mb-4 flex items-center gap-3.5">
                  <span
                    className="text-[13px] font-bold tracking-[0.08em] text-seiren-accent-micro"
                    style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                  >
                    {p.num}
                  </span>
                  <span className="h-px flex-1 bg-seiren-accent/30" />
                </div>
                <h3 className="m-0 font-serif text-[18px] font-bold leading-[1.5] text-seiren-main">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-[1.85] text-[#525762]">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  )
}
