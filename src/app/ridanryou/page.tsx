import { constructMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { FaqJsonLd } from "@/components/seo/faq-json-ld"
import { SpeakableJsonLd } from "@/components/seo/speakable-json-ld"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import Link from "next/link"
import { ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ohakajimai-navi.jp"

export const metadata = constructMetadata({
  title: "離檀料とは？相場・支払い義務・トラブル対策を解説｜お墓じまいナビ",
  description: "離檀料の法的な義務・相場（3万〜20万円）・高額請求された場合の対処法を解説。お墓じまい（改葬・墓じまい）で寺院との離檀交渉が必要になる方へ。トラブル事例と円満な離檀の進め方も掲載。株式会社清蓮（全国対応）提供。",
  path: "/ridanryou",
})

const faqs = [
  {
    question: "離檀料を支払う法的義務はありますか？",
    answer: "いいえ、離檀料を支払う法的義務は一切ありません。離檀料とは、これまでのお礼として寺院側が「お布施」として求めるものであり、法律上の費用ではありません。支払いを強制することは法律的に認められていないため、もし高額な請求があった場合はすぐに支払う必要はありません。",
  },
  {
    question: "離檀料の相場はいくらですか？",
    answer: "一般的な離檀料の相場は3万〜20万円程度です。お布施の金額は宗派・寺院・地域・これまでのお付き合いの深さによって異なります。100万円以上の高額請求は法的根拠がなく、支払い義務はありません。",
  },
  {
    question: "寺院から高額な離檀料を請求されました。どうすればよいですか？",
    answer: "高額な離檀料請求にはすぐに応じないでください。まず「法的義務があるか」を確認し、相手方の主張の根拠を確認しましょう。解決しない場合は、行政書士や弁護士への相談、寺院の宗派の本山への相談なども有効な手段です。株式会社清蓮でも離檀交渉サポートを提供しています。",
  },
  {
    question: "離檀せずにお墓じまいはできますか？",
    answer: "原則として、寺院墓地のお墓を撤去する場合は離檀の手続きが必要です。寺院の許可なく工事を進めることはできません。ただし、公営霊園や民間墓地の場合は離檀という概念がなく、管理者への手続きのみで進められます。",
  },
  {
    question: "離檀の進め方はどうすればよいですか？",
    answer: "①住職への事前相談（突然の工事日通知は避ける）→②離檀の意思を伝える→③閉眼法要（お墓の魂抜き）の依頼→④改葬許可証の準備→⑤墓石の撤去工事 という流れが一般的です。住職との関係性を大切に、丁寧なコミュニケーションを心がけましょう。",
  },
]

export default function RidanryouPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: BASE_URL },
          { name: "離檀料とは", url: `${BASE_URL}/ridanryou` },
        ]}
      />
      <FaqJsonLd faqs={faqs} />
      <SpeakableJsonLd
        pageUrl={`${BASE_URL}/ridanryou`}
        cssSelector={["h1", "h2"]}
      />

      <div className="min-h-screen bg-white">
        <div className="border-b border-neutral-100 bg-neutral-50">
          <Breadcrumb items={[{ name: "離檀料とは", href: "/ridanryou" }]} />
          <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Ridan-ryo</p>
            <h1 className="mt-4 text-xl font-bold tracking-tight text-neutral-900 md:text-3xl lg:text-4xl">
              離檀料とは？相場・支払い義務・対処法
            </h1>
            <p className="mt-6 text-base leading-relaxed text-neutral-600 max-w-[50ch]">
              お墓じまい・改葬でよく問題になる「離檀料」について、
              法的な義務・相場・高額請求への対処法を解説します。
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-16 space-y-16">

          {/* 重要ポイント */}
          <section className="rounded-2xl bg-emerald-50 border border-emerald-100 p-8">
            <h2 className="text-xl font-bold text-emerald-900">結論：離檀料に法的な支払い義務はありません</h2>
            <p className="mt-4 text-sm leading-relaxed text-emerald-800">
              離檀料とは、寺院の檀家関係を解消する際に求められる「お布施（お気持ち）」であり、
              法律上の義務費用ではありません。高額な請求を受けても、すぐに応じる必要はありません。
            </p>
            <div className="mt-6 space-y-2">
              {[
                "離檀料の支払いに法的根拠はない",
                "一般的な相場は3万〜20万円程度（あくまで慣習）",
                "100万円超の請求は事実上の拒否権がある",
                "寺院側も強制徴収する法的手段を持たない",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-emerald-800">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 説明グリッド */}
          <section>
            <h2 className="text-lg font-bold text-neutral-900 md:text-2xl">離檀・離檀料の基礎知識</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "離檀とは",
                  body: "これまで所属していた寺院の「檀家（だんか）」から離れることを「離檀」といいます。お墓じまい（改葬）の際に寺院墓地のお墓を撤去する場合、必然的に離檀の手続きが伴います。",
                },
                {
                  title: "離檀料とは",
                  body: "離檀の際に寺院から求められる「お布施（感謝の気持ち）」のことを一般的に「離檀料」と呼びます。法律上の費用ではなく、あくまで慣習的なものです。金額の根拠も法的には存在しません。",
                },
                {
                  title: "離檀料の相場",
                  body: "一般的には10万〜20万円程度が相場とされています。ただし、これまでのお付き合いが浅い場合は3万〜10万円程度、長年の檀家の場合はそれ以上になることもあります。あくまで「お気持ち」であるため正解はありません。",
                },
                {
                  title: "高額請求への対処法",
                  body: "寺院から100万円以上の高額な離檀料を求められた場合、支払い義務はありません。対処法：①「法的根拠はありますか？」と確認する、②宗派の本山や相談窓口に相談する、③行政書士・弁護士に相談する。",
                },
                {
                  title: "円満な離檀の進め方",
                  body: "突然の連絡を避け、まず住職に離檀の意向を丁寧に伝えることが最重要です。閉眼法要（魂抜き）の依頼、これまでの感謝を伝えるなど、誠実な対応が円満解決への近道です。",
                },
                {
                  title: "離檀交渉サポート",
                  body: "株式会社清蓮では、寺院との離檀交渉が難航しているケースのサポートも提供しています。法律の範囲内で、関係者全員が納得できる形での解決をサポートします。（法的代理交渉は弁護士業務のため対象外）",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-neutral-200 p-6">
                  <h3 className="text-base font-bold text-neutral-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 注意点 */}
          <section>
            <h2 className="text-lg font-bold text-neutral-900 md:text-2xl">注意点・よくあるトラブル</h2>
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 space-y-3">
              {[
                "突然の離檀通知・墓石撤去は感情的なトラブルに発展しやすい",
                "「埋蔵証明書の発行を拒否する」と言われた場合は法的に問題あり（行政書士・弁護士へ相談）",
                "寺院との関係が壊れると閉眼法要を断られるケースあり（第三者の僧侶を手配することも可能）",
                "高額な「修繕費」「護持会費」の一括請求は事前に確認しておく",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-800">{item}</p>
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
              離檀交渉サポートを相談する <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/gyoseishoshi" className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-200 px-8 py-4 text-sm font-semibold text-neutral-700 hover:border-neutral-300 transition-colors">
              行政書士に相談する <ArrowRight className="h-4 w-4" />
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
                { href: "/kaisougo", label: "改葬後の供養先" },
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
