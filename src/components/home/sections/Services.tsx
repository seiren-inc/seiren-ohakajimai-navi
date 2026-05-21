"use client"

import {
  FileText,
  UserCheck,
  Hammer,
  Droplets,
  Waves,
  MapPin,
  ArrowRight,
} from "lucide-react"
import { IconBubble, PillLink, Reveal, SectionHead, Tag, Wrap } from "../primitives"

const SERVICES = [
  { n: "01", Icon: FileText, tone: "gold" as const, title: "改葬手続きのご案内", body: "現在のお墓と新しい納骨先、双方の手続きを整理。必要書類の準備から提出まで導きます。", chip: "全国対応", chipTone: "gold" as const },
  { n: "02", Icon: UserCheck, tone: "green" as const, title: "提携行政書士のご紹介", body: "改葬許可申請書の代理提出が必要な場合は、有資格の行政書士をご紹介します。", chip: "有資格者連携", chipTone: "green" as const },
  { n: "03", Icon: Hammer, tone: "gold" as const, title: "墓石撤去工事の手配", body: "全国の石材店ネットワークから、地域に強い施工先を選定。工事の写真記録付き。", chip: "写真報告あり", chipTone: "gold" as const },
  { n: "04", Icon: Droplets, tone: "navy" as const, title: "ご遺骨の洗骨・粉骨", body: "長年お墓に納められていたお骨の状態を整え、納骨先に合わせた粉骨に対応します。", chip: "国内専用施設", chipTone: "gold" as const },
  { n: "05", Icon: Waves, tone: "green" as const, title: "散骨・納骨先のご案内", body: "海洋散骨・樹木葬・永代供養・納骨堂など、ご希望と費用感に沿って候補を整理します。", chip: "5プランから", chipTone: "green" as const },
  { n: "06", Icon: MapPin, tone: "gold" as const, title: "離檀・寺院との調整支援", body: "お寺との関係を尊重しつつ、改葬の意向を伝える際の進め方をサポートします。", chip: "事例蓄積", chipTone: "gold" as const },
]

export function Services() {
  return (
    <section id="services" className="bg-seiren-bg">
      <Wrap className="py-20 md:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              eyebrow="SERVICES"
              eyebrowJp="サービス一覧"
              title="改葬から供養先まで、6つの領域を一貫して。"
              sub="必要な工程だけ、ピンポイントでのご依頼も可能です。"
            />
            <PillLink variant="ghost" size="md" href="#contact">
              個別にご相談する
              <ArrowRight size={14} className="text-seiren-main" strokeWidth={1.75} />
            </PillLink>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal as="article" key={s.n} delay={i * 0.07}>
              <article className="flex h-full flex-col rounded-[22px] border border-[#ECE7DE] bg-white p-7 shadow-[0_1px_2px_rgba(30,42,56,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-seiren-accent/35 hover:shadow-[0_6px_22px_rgba(30,42,56,0.06)]">
                <div className="mb-[18px] flex items-center justify-between">
                  <IconBubble tone={s.tone} size={44}>
                    <s.Icon size={22} strokeWidth={1.75} />
                  </IconBubble>
                  <span
                    className="text-[11px] font-bold tracking-[0.06em] text-[#D4D0C6]"
                    style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                  >
                    {s.n}
                  </span>
                </div>
                <h3 className="m-0 font-serif text-[17.5px] font-bold leading-[1.55] text-seiren-main">
                  {s.title}
                </h3>
                <p className="mt-3 flex-1 text-[13.5px] leading-[1.9] text-[#525762]">
                  {s.body}
                </p>
                <div className="mt-[18px]">
                  <Tag tone={s.chipTone}>{s.chip}</Tag>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 max-w-[800px] text-[12.5px] leading-[1.85] text-[#8A8478]">
          ※
          改葬許可申請の「代理提出」「行政手続きの代行」は、行政書士等の有資格者が行う業務です。清蓮は無資格での代行を行いません。
        </p>
      </Wrap>
    </section>
  )
}
