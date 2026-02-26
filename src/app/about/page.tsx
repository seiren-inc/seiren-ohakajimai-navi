import { constructMetadata } from "@/lib/seo"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = constructMetadata({
  title: "お墓じまいとは｜改葬・墓じまいの基礎知識",
  description: "お墓じまい（改葬）とは何か、その手続きの流れや費用、注意点をわかりやすく解説します。株式会社清蓮が全国対応でサポートします。",
})

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">About</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
          お墓じまいとは
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-neutral-600">
          「お墓じまい」とは、現在のお墓からご遺骨を取り出し、別の納骨先（永代供養墓・散骨・手元供養など）へ移す一連の手続きのことです。正式には「改葬（かいそう）」と呼ばれ、行政への許可申請が必要な法的手続きです。
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {[
            {
              title: "お墓じまいが増えている背景",
              body: "少子化・核家族化の進行により、お墓の継承者がいない「無縁墓」が増加しています。また、遠方のお墓の管理が困難になったり、菩提寺との付き合いが薄れるなど、現代の生活様式の変化が背景にあります。",
            },
            {
              title: "改葬と墓じまいの違い",
              body: "「墓じまい」はお墓を撤去・解体することを指し、「改葬」はご遺骨を別の場所へ移す法的手続きのことを指します。一般的に「お墓じまい」はこの両方を含む一連の流れを意味します。",
            },
            {
              title: "改葬許可証とは",
              body: "改葬を行うには、現在のお墓がある市区町村から「改葬許可証」を取得する必要があります。必要書類（受入証明書・埋葬証明書）を揃えて申請します。",
            },
            {
              title: "費用の目安",
              body: "お墓じまいの費用は、墓石の撤去工事費、行政書士費用、新たな供養方法によって大きく異なります。目安は合計で30万〜100万円程度ですが、個別のご状況によります。",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-neutral-200 p-8">
              <h2 className="text-xl font-semibold text-neutral-900">{item.title}</h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-600">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/flow"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            ご依頼の流れを見る <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-200 px-8 py-4 text-sm font-semibold text-neutral-700 hover:border-neutral-300 transition-colors"
          >
            無料相談する <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
