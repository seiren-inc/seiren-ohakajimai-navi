import { constructMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { FaqJsonLd } from "@/components/seo/faq-json-ld"
import { SpeakableJsonLd } from "@/components/seo/speakable-json-ld"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ohakajimai-navi.jp"

export const metadata = constructMetadata({
  title: "改葬後の供養先・遺骨の行き先｜永代供養・樹木葬・納骨堂・散骨を比較｜お墓じまいナビ",
  description: "お墓じまい・改葬後の遺骨の行き先を比較解説。永代供養墓・樹木葬・納骨堂・手元供養・海洋散骨それぞれの費用・メリット・デメリット・選び方をわかりやすく解説。株式会社清蓮（全国対応）が監修。",
  path: "/kaisougo",
})

const faqs = [
  {
    question: "お墓じまい後、遺骨はどこへ持っていけばよいですか？",
    answer: "主な選択肢として、永代供養墓（合祀墓）、樹木葬、納骨堂、手元供養（自宅保管）、海洋散骨があります。故人の希望・家族の状況・費用などを考慮して選びましょう。いずれも改葬許可証が必要なケースに注意が必要です。",
  },
  {
    question: "永代供養墓と合祀墓の違いは何ですか？",
    answer: "「永代供養墓」は、墓地や寺院が長期（永代）にわたって遺骨を管理・供養してくれるお墓の総称です。「合祀墓」はその中でも、複数の方の遺骨を一つにまとめて埋葬するタイプです。個別のスペースがある「個別永代供養」と区別されます。",
  },
  {
    question: "樹木葬とはどのような供養ですか？",
    answer: "樹木葬とは、墓石の代わりに樹木や花を墓標として、遺骨を土に還す自然葬の一種です。里山型（自然の山林に埋葬）とガーデン型（整備された公園墓地）があります。費用は5万〜100万円程度と施設によって大きく異なります。",
  },
  {
    question: "纳骨堂とはどのような施設ですか？",
    answer: "納骨堂とは、遺骨を収蔵する施設です。ロッカー型・仏壇型・自動搬送型（機械式）などの種類があり、都市部を中心に普及しています。費用は20万〜100万円程度。年間管理費・のちの移動の可否などを確認したうえで選びましょう。",
  },
  {
    question: "手元供養（自宅保管）は法律上問題ありませんか？",
    answer: "はい、遺骨を自宅で保管すること（手元供養）は法律上問題ありません。ただし、散骨・埋葬を行う場合は別途許可が必要です。分骨して一部を手元に、残りを別の供養先に納めるケースも増えています。",
  },
]

const options = [
  {
    name: "永代供養墓（合祀墓）",
    cost: "5万〜50万円",
    manage: "不要（寺院・霊園が管理）",
    merit: "管理費が少ない、後継者不要、宗教不問",
    demerit: "合祀後は遺骨の取り出しが困難",
    suited: "後継者がいない方・墓地管理から解放されたい方",
  },
  {
    name: "樹木葬",
    cost: "5万〜100万円",
    manage: "不要または少額",
    merit: "自然に還れる、宗教不問、デザイン性が高い",
    demerit: "施設によって立地・アクセスに差がある",
    suited: "自然志向の方・「土に還りたい」という希望がある方",
  },
  {
    name: "納骨堂",
    cost: "20万〜100万円＋年間管理費",
    manage: "年間管理費が発生する場合が多い",
    merit: "都市部に多く交通の便がよい、天候に左右されない",
    demerit: "施設の存続リスクがある、管理費が継続的にかかる",
    suited: "交通の便を重視する方・都市部在住の方",
  },
  {
    name: "海洋散骨",
    cost: "3万〜50万円",
    manage: "不要",
    merit: "管理費が一切かからない、「海に還りたい」という意思を尊重できる",
    demerit: "散骨後は遺骨の回収不可、家族全員の合意が必要",
    suited: "「自然に還りたい」という故人の意思がある場合",
  },
  {
    name: "手元供養",
    cost: "数千円〜数万円（容器代のみ）",
    manage: "不要",
    merit: "故人をいつも身近に感じられる、費用が少ない",
    demerit: "継承者が必要、引越し・相続時に対応が必要",
    suited: "すぐに別の供養先が決まらない方・故人を手元に置きたい方",
  },
]

export default function KaisougoPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: BASE_URL },
          { name: "改葬後の供養先", url: `${BASE_URL}/kaisougo` },
        ]}
      />
      <FaqJsonLd faqs={faqs} />
      <SpeakableJsonLd
        pageUrl={`${BASE_URL}/kaisougo`}
        cssSelector={["h1", "h2"]}
      />

      <div className="min-h-screen bg-white">
        <div className="border-b border-neutral-100 bg-neutral-50">
          <Breadcrumb items={[{ name: "改葬後の供養先", href: "/kaisougo" }]} />
          <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">After Reinterment</p>
            <h1 className="mt-4 text-xl font-bold tracking-tight text-neutral-900 md:text-3xl lg:text-4xl">
              改葬後の供養先・遺骨の行き先を比較
            </h1>
            <p className="mt-6 text-base leading-relaxed text-neutral-600 max-w-[50ch]">
              お墓じまい・改葬が決まったら、次は「遺骨をどこへ移すか」を決める必要があります。
              永代供養・樹木葬・納骨堂・散骨など、各選択肢の特徴を解説します。
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-16 space-y-16">

          {/* 比較表 */}
          <section>
            <h2 className="text-lg font-bold text-neutral-900 md:text-2xl">供養先の選択肢を比較</h2>
            <div className="mt-8 space-y-6">
              {options.map((opt) => (
                <div key={opt.name} className="rounded-2xl border border-neutral-200 p-6">
                  <h3 className="text-lg font-bold text-neutral-900">{opt.name}</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                    <div><span className="font-semibold text-neutral-500">費用目安：</span><span className="text-neutral-700">{opt.cost}</span></div>
                    <div><span className="font-semibold text-neutral-500">管理費：</span><span className="text-neutral-700">{opt.manage}</span></div>
                    <div><span className="font-semibold text-neutral-500 text-emerald-700">メリット：</span><span className="text-neutral-700">{opt.merit}</span></div>
                    <div><span className="font-semibold text-neutral-500 text-amber-700">デメリット：</span><span className="text-neutral-700">{opt.demerit}</span></div>
                    <div className="sm:col-span-2"><span className="font-semibold text-neutral-500">向いている方：</span><span className="text-neutral-700">{opt.suited}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-lg font-bold text-neutral-900 md:text-2xl">よくある質問</h2>
            <div className="mt-6 divide-y divide-neutral-100 rounded-2xl border border-neutral-200">
              {faqs.map((item, i) => (
                <details key={i} className="group px-6">
                  <summary className="flex min-h-[56px] cursor-pointer items-center justify-between gap-4 py-4 text-sm font-semibold text-neutral-900 list-none">
                    <span>{item.question}</span>
                    <span className="shrink-0 text-neutral-400 group-open:rotate-45 transition-transform">＋</span>
                  </summary>
                  <p className="pb-5 text-sm leading-relaxed text-neutral-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
              お墓じまいの無料相談 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/sankotsu" className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-200 px-8 py-4 text-sm font-semibold text-neutral-700 hover:border-neutral-300 transition-colors">
              海洋散骨について詳しく <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 関連リンク */}
          <div className="pt-8 border-t border-neutral-100">
            <p className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mb-4">関連ページ</p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: "/about", label: "お墓じまいとは" },
                { href: "/flow", label: "お墓じまいの流れ" },
                { href: "/sankotsu", label: "海洋散骨について" },
                { href: "/ridanryou", label: "離檀料について" },
                { href: "/price", label: "お墓じまいの料金" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-emerald-700 underline underline-offset-2 hover:text-emerald-900">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
