import { constructMetadata } from "@/lib/seo"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = constructMetadata({
  title: "お墓じまいとは？改葬・墓じまいの意味・手続き・費用をわかりやすく解説｜お墓じまいナビ",
  description:
    "お墓じまい（改葬）とは現在のお墓を撤去し遺骨を別の供養先へ移す手続き。改葬と墓じまいの違い・改葬許可証の取得方法・費用相場（30万〜100万円）・注意点を解説。法令遵守の株式会社清蓮が全国対応でサポート。",
})

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="border-b border-neutral-100 bg-neutral-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">About</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            お墓じまいとは
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600 max-w-2xl">
            「お墓じまい（墓じまい）」とは、現在のお墓からご遺骨を取り出し、
            別の納骨先へ移す一連の手続きのことです。
            正式には<strong>「改葬（かいそう）」</strong>と呼ばれ、
            市区町村への<strong>改葬許可申請</strong>が必要な法的手続きです。
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16 space-y-20">

        {/* 基礎知識グリッド */}
        <section>
          <h2 className="text-2xl font-bold text-neutral-900">お墓じまい・改葬の基礎知識</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              {
                title: "お墓じまい（墓じまい）とは",
                body: "現在のお墓を解体・撤去して墓地を更地に戻し、管理者（寺院・霊園）に返還することを指します。「お墓の引越し」ともいわれます。お墓じまいには、遺骨を別の場所へ移す「改葬」の手続きが伴うことがほとんどです。",
              },
              {
                title: "改葬（かいそう）とは",
                body: "改葬とは、行政が定める「墓地埋葬法」に基づき、ご遺骨を現在の墓地から別の場所へ移すことをいいます。改葬を行うには、市区町村から「改葬許可証」を取得する必要があります。手続きなしに勝手に遺骨を移動することは法律違反となります。",
              },
              {
                title: "改葬と墓じまいの違い",
                body: "「墓じまい」はお墓の物理的な撤去・解体を指し、「改葬」は遺骨を別の場所へ移す法的手続きを指します。一般に「お墓じまい」はこの両方を含む一連の流れを意味します。改葬先が永代供養墓・樹木葬・納骨堂・海洋散骨の場合でも手続きの要否が異なります。",
              },
              {
                title: "改葬許可証とは",
                body: "改葬を行うには、現在のお墓がある市区町村から「改葬許可証」を取得する必要があります。必要書類は①受入証明書（新しい供養先から）②埋葬証明書（現在のお墓の管理者から）③改葬許可申請書。役所に提出して許可を受けます。",
              },
              {
                title: "墓石撤去工事とは",
                body: "墓石撤去工事とは、お墓の墓石・外柵・基礎コンクリートを解体・撤去し、区画を原状回復する工事です。石材店が担当し、費用は墓石の大きさ・立地・搬出難易度によって異なります。撤去後は墓地管理者へ区画を返還します。",
              },
              {
                title: "お墓の引越しにかかる費用",
                body: "お墓じまいの費用は合計で約30万〜100万円が目安です。内訳は墓石撤去工事（10〜50万円）、改葬手続きの行政書士費用（必要な場合）、新しい供養先の費用（永代供養料・散骨料など）。現地状況により大きく変動するため、まずは無料で概算をご確認ください。",
              },
              {
                title: "離檀（りだん）と離檀料",
                body: "離檀とは、これまで檀家として所属していた寺院から離れることです。改葬に際し、寺院側から「離檀料」を求められるケースがあります。法的な義務はなく、金額に合意できない場合はご相談ください。清蓮では離檀交渉サポートも行っています。",
              },
              {
                title: "改葬後の供養方法",
                body: "改葬後の主な供養先としては、永代供養墓・納骨堂・樹木葬・合祀墓・海洋散骨・手元供養などがあります。ご家族の状況・希望・費用に合わせた選択肢をご提案します。海洋散骨の場合は状況によって改葬手続きが不要となるケースもあります。",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-neutral-200 p-6">
                <h3 className="text-base font-bold text-neutral-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* お墓じまいが増えている背景 */}
        <section>
          <h2 className="text-2xl font-bold text-neutral-900">お墓じまいが増えている背景</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-neutral-600">
            <p>
              少子化・核家族化の進行により、お墓の継承者がいない「無縁墓」が社会問題となっています。
              また遠方にあるお墓の管理が困難になったり、寺院との檀家関係が形骸化するなど、
              現代の生活様式の変化が背景にあります。
            </p>
            <p>
              厚生労働省の統計では改葬件数は年々増加しており、2022年には約15万件を超えています。
              高齢化社会とともに「終活」への関心が高まり、生前にお墓じまいを検討するご家族も増えています。
            </p>
          </div>

          {/* キーワードタグ */}
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              "お墓じまい", "墓じまい", "改葬", "改葬手続き", "改葬許可申請",
              "墓石撤去", "お墓の引越し", "離檀", "離檀料", "永代供養",
              "納骨堂", "樹木葬", "海洋散骨", "全国対応", "横浜",
            ].map((kw) => (
              <span
                key={kw}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600"
              >
                {kw}
              </span>
            ))}
          </div>
        </section>

        {/* FAQ ミニ */}
        <section>
          <h2 className="text-2xl font-bold text-neutral-900">よくある質問</h2>
          <div className="mt-6 divide-y divide-neutral-100 rounded-2xl border border-neutral-200">
            {[
              { q: "お墓じまいは自分でできますか？", a: "改葬許可申請書の記入・提出自体は自分で行うことができます。た다し、書類の取得や手続きの段取りが複雑なため、専門家のサポートを受けることをお勧めします。清蓮では手続きの案内・書類サポートを提供しています。" },
              { q: "墓石はどこに頼めば撤去できますか？", a: "墓石の撤去工事は石材店に依頼します。清蓮では全国の優良提携石材店と連携しており、現地状況に合わせた墓石撤去工事を手配します。" },
              { q: "お墓の引越し先は決まっていなくても相談できますか？", a: "はい、改葬先が決まっていない段階でもご相談いただけます。永代供養墓・納骨堂・樹木葬・海洋散骨など、ご希望に合った選択肢をご提案します。" },
              { q: "墓じまいにどのくらいの期間がかかりますか？", a: "一般的に2〜4ヶ月程度が目安です。改葬許可証の発行期間（自治体により数日〜2週間）、墓石撤去工事の日程調整などが含まれます。お急ぎの場合はご相談ください。" },
            ].map((item, i) => (
              <details key={i} className="group px-6">
                <summary className="flex min-h-[56px] cursor-pointer items-center justify-between gap-4 py-4 text-sm font-semibold text-neutral-900 list-none">
                  <span>{item.q}</span>
                  <span className="shrink-0 text-neutral-400 group-open:rotate-45 transition-transform">＋</span>
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-neutral-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/flow"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            改葬・お墓じまいの流れを見る <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-200 px-8 py-4 text-sm font-semibold text-neutral-700 hover:border-neutral-300 transition-colors"
          >
            無料相談・お見積り <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
