"use client"

import { Mail, ArrowRight, ShieldCheck, MessageSquare } from "lucide-react"
import { BeforeAfter } from "../BeforeAfter"
import { IconBubble, PillLink, Reveal, SectionHead, Tag, Wrap } from "../primitives"

type Case = {
  id: string
  region: string
  type: string
  period: string
  price: string
  comment: string
  desc: string
  before: string
  after: string
}

const CASES: Case[] = [
  {
    id: "c1",
    region: "神奈川県横浜市",
    type: "寺院墓地",
    period: "施工期間: 5日",
    price: "墓石撤去費用：18万円",
    comment: "「管理しやすい形へ整理しました」",
    desc: "築40年の和型墓石。寺院との離檀調整から、お骨の取り出し・整地まで一括対応。",
    before: "/images/pricing-before.webp",
    after: "/images/pricing-after.webp",
  },
  {
    id: "c2",
    region: "東京都内",
    type: "民営霊園",
    period: "施工期間: 3日",
    price: "墓石撤去費用：14万円",
    comment: "「遠方の方でも進めやすい工程に整えました」",
    desc: "区画返還の手続きまで一貫対応。粉骨後、樹木葬への改葬へお繋ぎしました。",
    before: "/images/pricing-before.webp",
    after: "/images/pricing-after.webp",
  },
  {
    id: "c3",
    region: "千葉県北部",
    type: "公営墓地",
    period: "施工期間: 4日",
    price: "墓石撤去費用：22万円",
    comment: "「ご家族で納得した上で進められました」",
    desc: "ご家族間の意見をまとめる段階からご相談。海洋散骨へ引き継ぎ。",
    before: "/images/pricing-before.webp",
    after: "/images/pricing-after.webp",
  },
]

function CaseCard({ c }: { c: Case }) {
  return (
    <article className="flex flex-col rounded-[22px] border border-[#ECE7DE] bg-white p-5 shadow-[0_1px_2px_rgba(30,42,56,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-seiren-accent/35 hover:shadow-[0_6px_22px_rgba(30,42,56,0.06)]">
      <BeforeAfter before={c.before} after={c.after} height={240} />

      <div className="flex flex-col gap-3 px-1.5 pt-5">
        <div className="flex flex-wrap gap-1.5">
          <Tag tone="navy">{c.region}</Tag>
          <Tag tone="gold">{c.type}</Tag>
          <Tag tone="green">{c.period}</Tag>
        </div>
        <p className="m-0 text-[13.5px] leading-[1.85] text-[#525762]">{c.desc}</p>

        <div className="mt-1 flex items-center justify-between gap-3.5 rounded-xl border border-seiren-accent/30 bg-[#FFFBF1] px-4 py-3.5">
          <span className="text-[12.5px] font-medium text-[#8A6F37]">施工費用</span>
          <span
            className="font-bold text-seiren-cta-hover"
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 18,
              letterSpacing: "-0.01em",
            }}
          >
            {c.price.replace("墓石撤去費用：", "")}
          </span>
        </div>

        <blockquote className="m-0 mt-2 border-l-2 border-seiren-green pl-4 font-serif text-[14.5px] font-medium leading-[1.7] text-seiren-main">
          {c.comment}
        </blockquote>
      </div>
    </article>
  )
}

export function Cases() {
  return (
    <section id="cases" className="bg-[#F3F0EA]">
      <Wrap className="py-20 md:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              eyebrow="CASE STUDIES"
              eyebrowJp="墓石撤去 実例"
              title="実際の施工事例を、Before / Afterで。"
              sub="ご家族と相談しながら整理した、清蓮の施工事例です。お墓の場所・規模・ご事情に合わせ、必要な工程と費用を最初にお伝えします。"
            />
            <PillLink variant="ghost" size="md" href="#contact">
              実例をもっと見る
              <ArrowRight size={14} className="text-seiren-main" strokeWidth={1.75} />
            </PillLink>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center gap-3.5 rounded-xl border border-[#E5E0D6] bg-white px-5 py-4">
            <IconBubble tone="green" size={36}>
              <ShieldCheck size={18} strokeWidth={1.75} />
            </IconBubble>
            <p className="m-0 min-w-[280px] flex-1 text-[13px] leading-[1.7] text-[#374151]">
              <strong className="text-seiren-main">区画と所在は概略で表示</strong>
              しています。プライバシー配慮のため詳細は伏せ、お見積りや手続きの参考にしていただける形式で掲載しています。
            </p>
            <span className="text-xs text-[#8A8478]">※ 写真は本人・ご家族の同意のもと掲載</span>
          </div>
        </Reveal>

        <div className="mt-9 grid grid-cols-1 gap-[22px] md:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c, i) => (
            <Reveal as="div" key={c.id} delay={i * 0.08}>
              <CaseCard c={c} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-14 rounded-[18px] border border-[#E5E0D6] bg-white px-7 py-8 text-center">
            <h3 className="m-0 font-serif text-xl font-bold text-seiren-main">
              似たご状況の事例を、お見積もり前にお見せできます。
            </h3>
            <p className="mx-auto mt-3.5 max-w-[540px] text-sm leading-[1.85] text-[#525762]">
              地域・墓地の種類・ご予算をお伝えください。近い条件の施工事例と、想定される工程・費用感を整理してお返しします。
            </p>
            <div className="mt-[22px] inline-flex flex-wrap justify-center gap-3">
              <PillLink variant="cta" size="lg" href="#contact">
                <Mail size={16} className="text-white" strokeWidth={1.75} /> 事例を見ながら相談する
              </PillLink>
              <PillLink variant="line" size="lg" href="#line">
                <MessageSquare size={18} className="text-white" strokeWidth={1.75} /> LINEで写真を送る
              </PillLink>
            </div>
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}
