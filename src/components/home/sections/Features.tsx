"use client"

import { Landmark, UserCheck, ClipboardList, Check } from "lucide-react"
import { IconBubble, Reveal, SectionHead, Wrap } from "../primitives"

const FEATURES = [
  {
    tone: "green" as const,
    Icon: Landmark,
    eyebrow: "01 / 進め方が見える",
    title: "相談から手続き、施工、供養先まで、一本の流れで整理します。",
    body: "改葬や供養の工程を、相談しながら順序立てて確認できます。次に何をするか、誰に頼むかが、画面と書面の両方で見える状態を作ります。",
    points: ["相談入口でステップを共有", "メールで進捗の見える化", "書類の保管・受け渡しまで案内"],
    checkColor: "text-seiren-green",
  },
  {
    tone: "gold" as const,
    Icon: UserCheck,
    eyebrow: "02 / 有資格者と連携",
    title: "改葬許可申請は、提携の行政書士が責任を持って対応します。",
    body: "「代理提出」や「行政手続きの代行」は、行政書士などの有資格者が行う業務です。清蓮は無資格での代行を行わず、適切な専門家へお繋ぎします。",
    points: ["提携行政書士の紹介", "費用は事前に明示", "やり取りはご家族のご希望ペースで"],
    checkColor: "text-seiren-accent-micro",
  },
  {
    tone: "navy" as const,
    Icon: ClipboardList,
    eyebrow: "03 / 相談先を一本化",
    title: "墓地、霊園、石材店、役所のやり取りを、見通しよく整理します。",
    body: "別々の相手先と並行してやり取りをする必要のある工程を、ひとつの窓口にまとめます。優先順位と所要日数の目安もお伝えします。",
    points: ["全国の石材店ネットワーク", "霊園・寺院との連絡を支援", "工程表で進捗を可視化"],
    checkColor: "text-seiren-main",
  },
]

export function Features() {
  return (
    <section className="bg-seiren-bg">
      <Wrap className="py-20 md:py-28">
        <Reveal>
          <SectionHead
            eyebrow="WHY OHAKAJIMAI NAVI"
            eyebrowJp="お墓じまいナビの特長"
            title="相談・手続き・進行の不安を、ひとつの流れにまとめます。"
            sub="清蓮は2008年創業の専門会社として、全国の改葬・供養に向き合ってきました。手続きと感情、両面の難しさを前提に設計しています。"
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal as="article" key={f.eyebrow} delay={i * 0.1}>
              <article className="flex h-full flex-col rounded-[22px] border border-[#ECE7DE] bg-white p-8 shadow-[0_1px_2px_rgba(30,42,56,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-seiren-accent/35 hover:shadow-[0_6px_22px_rgba(30,42,56,0.06)]">
                <IconBubble tone={f.tone} size={56}>
                  <f.Icon size={24} strokeWidth={1.75} />
                </IconBubble>
                <div className="mt-[22px] text-[11px] font-bold uppercase tracking-[0.14em] text-[#8A8478]">
                  {f.eyebrow}
                </div>
                <h3 className="mt-2.5 font-serif text-[20px] font-bold leading-[1.5] text-seiren-main">
                  {f.title}
                </h3>
                <p className="mt-4 text-[14.5px] leading-[1.95] text-[#525762]">{f.body}</p>
                <ul className="mt-[22px] flex list-none flex-col gap-2.5 p-0">
                  {f.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2.5 text-[13px] leading-[1.7] text-[#374151]"
                    >
                      <Check
                        size={15}
                        strokeWidth={2.2}
                        className={`mt-1 flex-shrink-0 ${f.checkColor}`}
                      />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  )
}
