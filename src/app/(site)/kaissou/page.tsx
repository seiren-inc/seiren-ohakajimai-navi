import Link from "next/link"
import { constructMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { FaqJsonLd } from "@/components/seo/faq-json-ld"
import { HowToJsonLd, kaisouHowToSteps } from "@/components/seo/howto-json-ld"
import { SpeakableJsonLd } from "@/components/seo/speakable-json-ld"
import { MapPin, ChevronRight, CheckCircle2, Phone, ArrowRight, Info } from "lucide-react"
import { PREFECTURES, REGIONS } from "@/lib/prefectures"
import { Breadcrumb } from "@/components/ui/Breadcrumb"

// Revalidate the page every 24 hours
export const revalidate = 86400

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ohakajimai-navi.jp"

export const metadata = constructMetadata({
  title: "改葬とは｜手続き・費用・流れを解説｜清蓮に相談できること",
  description: "改葬（お墓じまい）の手続き・費用・流れを徹底解説。改葬許可申請の方法、墓石撤去、遺骨の供養先選びまで。清蓮では改葬全体の相談から墓石撤去・粉骨・洗骨・散骨まで無料相談受付中。",
  path: "/kaissou",
})

const collectionPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/kaissou#collectionpage`,
  name: "全国都道府県別 改葬手続き情報",
  description: "全国47都道府県・市区町村別の改葬許可申請書情報と手続きガイド。",
  url: `${SITE_URL}/kaissou`,
  inLanguage: "ja",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  hasPart: PREFECTURES.map((p) => ({
    "@type": "WebPage",
    name: `${p.name}の改葬手続き情報`,
    url: `${SITE_URL}/kaissou/${p.slug}`,
  })),
}

const kaissouFaqs = [
  {
    question: "改葬とは何ですか？",
    answer: "改葬とは、現在埋葬されている遺骨を取り出し、別の場所（墓地・納骨堂・散骨など）へ移す手続きのことです。法律上は「墓地、埋葬等に関する法律（墓地埋葬法）」に基づき、改葬許可証を取得した上で行う必要があります。",
  },
  {
    question: "改葬の手続きに必要な書類は何ですか？",
    answer: "基本的な必要書類は①改葬許可申請書、②埋葬証明書（現在の墓地管理者が発行）、③受入証明書（改葬先が発行）の3点です。ただし自治体によって追加書類が必要なケースがあります。横浜市など政令指定都市は区ごとに窓口・書式が異なるため、事前確認が重要です。",
  },
  {
    question: "改葬にかかる費用の目安はいくらですか？",
    answer: "改葬にかかる費用は、墓石撤去工事（10万〜50万円）＋閉眼供養のお布施（3万〜5万円）＋行政書士費用（5万〜12万円、依頼した場合）＋改葬先の費用（10万〜100万円）を合わせると、合計30万〜150万円程度が一般的な目安です。清蓮では現地調査後に確定見積りを無料でご提示します。",
  },
  {
    question: "改葬許可申請は自分でできますか？",
    answer: "改葬許可申請書への記入・提出はご自身で行えます。ただし「埋葬証明書の取得でお寺に断られた」「書類の記入に不安がある」「平日に役所へ行けない」といった場合は、行政書士への依頼も選択肢です。清蓮では申請書のダウンロード先案内・記入ポイントの説明を無料でサポートします。",
  },
  {
    question: "清蓮にはどこまで相談できますか？",
    answer: "清蓮では、お墓じまい全体の流れ整理・墓石撤去工事・閉眼供養の手配・遺骨の取り出し・粉骨・洗骨・海洋散骨・永代供養など次の供養先のご案内まで対応しています。改葬許可申請書の書類作成代行は行政書士の業務のため、必要な場合は提携行政書士をご紹介します。",
  },
  {
    question: "改葬と墓じまいの違いは何ですか？",
    answer: "「改葬」は法律用語で、遺骨を別の場所へ移す手続き全般を指します。「墓じまい」は一般に使われる言葉で、お墓を撤去・廃止する行為を指すことが多いです。墓じまいの後に遺骨を別の場所へ移す場合、その手続きが改葬になります。実務上はほぼ同義で使われます。",
  },
]

const costItems = [
  { item: "墓石撤去工事", range: "10万〜50万円", note: "墓石の大きさ・立地による" },
  { item: "閉眼供養（魂抜き）お布施", range: "3万〜5万円", note: "宗派・寺院によって異なる" },
  { item: "離檀料", range: "0〜30万円", note: "法的義務なし・任意のお布施" },
  { item: "改葬許可申請（自分で行う場合）", range: "数百円〜", note: "証明書取得の実費のみ" },
  { item: "行政書士費用（依頼した場合）", range: "5万〜12万円", note: "書類作成・申請代行" },
  { item: "改葬先の費用", range: "5万〜100万円", note: "永代供養・納骨堂・散骨等で異なる" },
]

const seirenServices = [
  "お墓じまい全体の流れ整理・相談",
  "墓石撤去工事（全国対応・提携石材店ネットワーク）",
  "閉眼供養・開眼供養の手配サポート",
  "遺骨の取り出し・ケア",
  "粉骨・洗骨（自社サービス）",
  "海洋散骨（グループ会社の散骨クルーズと連携）",
  "永代供養・樹木葬・納骨堂などの供養先相談",
  "離檀交渉の進め方整理・情報提供",
  "提携行政書士のご紹介（改葬許可申請代行が必要な場合）",
]

export default function KaissouPage() {
  const groupedPrefectures = REGIONS.map((regionName) => ({
    name: regionName,
    prefectures: PREFECTURES.filter((p) => p.region === regionName),
  }))

  return (
    <div className="bg-white">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "改葬とは｜手続き・費用・流れ", url: `${SITE_URL}/kaissou` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />
      <HowToJsonLd
        name="改葬手続きの方法｜改葬許可申請から墓石撤去・納骨まで"
        description="現在のお墓から遺骨を取り出し、別の納骨先へ移す改葬の正式手続きを解説。"
        totalTime="P3M"
        steps={kaisouHowToSteps}
      />
      <FaqJsonLd faqs={kaissouFaqs} />
      <SpeakableJsonLd
        pageUrl={`${SITE_URL}/kaissou`}
        cssSelector={["h1", "h2"]}
      />

      <Breadcrumb items={[{ name: "改葬とは｜手続き・費用・流れ", href: "/kaissou" }]} />

      {/* ─── Hero ─── */}
      <section className="border-b border-neutral-100 bg-neutral-50 px-6 py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Reinterment Guide</p>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-neutral-900 md:text-3xl lg:text-4xl">
            改葬とは｜手続き・費用・流れを徹底解説
          </h1>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-neutral-600">
            改葬は、現在のお墓から遺骨を取り出し、別の場所に移す手続きです。
            墓石撤去・改葬許可申請・供養先選びまで、清蓮がわかりやすく解説します。
          </p>

          {/* この記事の結論 */}
          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">この記事の結論</p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                改葬には改葬許可証の取得が法律上必要です（墓地埋葬法）。
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                費用の目安は30万〜150万円。内訳は墓石撤去・書類手続き・供養先によって変わります。
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                清蓮では墓石撤去・粉骨・洗骨・散骨・納骨先相談まで、お墓じまい全体を無料相談できます。
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                改葬許可申請の書類作成に不安がある場合は、提携行政書士への相談も選択肢です。
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── コンテンツ本文 ─── */}
      <div className="mx-auto max-w-4xl space-y-16 px-6 py-16">

        {/* 改葬とは何か */}
        <section>
          <h2 className="text-lg font-bold text-neutral-900 md:text-2xl">改葬とは何か</h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 max-w-[52ch]">
            改葬とは、現在埋葬されている遺骨を取り出し、別の場所（墓地・納骨堂・永代供養墓・散骨など）へ移す手続きのことです。
            法律上は「墓地、埋葬等に関する法律（墓地埋葬法）」第9条に基づき、
            <strong className="text-neutral-900">改葬許可証を取得した上で行うことが義務付けられています</strong>。
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 max-w-[52ch]">
            「墓じまい」という言葉は一般に使われる表現ですが、法的には「改葬」に分類されます。
            単に墓石を撤去するだけでなく、遺骨の移動を伴う場合はすべて改葬許可の手続きが必要です。
          </p>

          <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 max-w-xl">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-xs leading-relaxed text-amber-800">
              <strong>注意：</strong>改葬許可を取得せずに遺骨を移動させた場合、墓地埋葬法違反になる可能性があります。
              手続きを進める前に必ず確認してください。
            </p>
          </div>
        </section>

        {/* 改葬の流れ */}
        <section>
          <h2 className="text-lg font-bold text-neutral-900 md:text-2xl">改葬の流れ</h2>
          <p className="mt-2 text-sm text-neutral-500">全体の目安：2〜4ヶ月</p>
          <ol className="mt-6 space-y-4">
            {[
              {
                num: 1,
                title: "新しい供養先を決める",
                desc: "まず改葬先（永代供養墓・納骨堂・樹木葬・散骨など）を決め、「受入証明書」を発行してもらいます。",
              },
              {
                num: 2,
                title: "現在の墓地管理者から「埋葬証明書」をもらう",
                desc: "現在のお墓がある寺院・霊園の管理者から証明書を取得します。お寺が協力的でない場合の対処法は清蓮にご相談ください。",
              },
              {
                num: 3,
                title: "市区町村役所で「改葬許可証」を取得する",
                desc: "現在のお墓がある市区町村の窓口に申請書・添付書類を提出します。自治体ごとに書式・窓口が異なります。",
                link: { href: "/kaisoukyoka", label: "全国の申請書をダウンロードする" },
              },
              {
                num: 4,
                title: "閉眼供養（魂抜き）を行う",
                desc: "墓石を撤去する前に、宗教者にお墓の魂抜き（閉眼供養）を依頼します。宗派・ご状況に応じてサポートします。",
              },
              {
                num: 5,
                title: "墓石の撤去工事・原状回復",
                desc: "石材店が墓石を解体・撤去し、墓地区画を原状回復します。清蓮の提携石材店ネットワークで全国対応しています。",
              },
              {
                num: 6,
                title: "遺骨の取り出し・粉骨・洗骨",
                desc: "遺骨を丁寧に取り出し、改葬先の仕様に合わせて粉骨・洗骨を行います。清蓮は粉骨・洗骨を自社サービスとして提供しています。",
              },
              {
                num: 7,
                title: "新しい供養先へ移送または海洋散骨",
                desc: "改葬先へ遺骨を移送します。海洋散骨を選択した場合は、グループ会社の散骨クルーズと連携して対応します。",
              },
            ].map(({ num, title, desc, link }) => (
              <li key={num} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {num}
                </span>
                <div>
                  <p className="font-semibold text-neutral-900">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">{desc}</p>
                  {link && (
                    <Link href={link.href} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900">
                      {link.label} <ChevronRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 改葬費用 */}
        <section>
          <h2 className="text-lg font-bold text-neutral-900 md:text-2xl">改葬にかかる費用の目安</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            改葬費用は墓石の大きさ・立地・供養先の選択によって大きく異なります。以下は一般的な費用目安です。
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-100">
                  <th className="border border-neutral-200 px-4 py-2 text-left font-semibold text-neutral-700">費用項目</th>
                  <th className="border border-neutral-200 px-4 py-2 text-left font-semibold text-neutral-700">目安</th>
                  <th className="border border-neutral-200 px-4 py-2 text-left font-semibold text-neutral-700">備考</th>
                </tr>
              </thead>
              <tbody>
                {costItems.map((row) => (
                  <tr key={row.item} className="even:bg-neutral-50">
                    <td className="border border-neutral-200 px-4 py-2 text-neutral-700">{row.item}</td>
                    <td className="border border-neutral-200 px-4 py-2 font-medium text-neutral-900">{row.range}</td>
                    <td className="border border-neutral-200 px-4 py-2 text-neutral-500 text-xs">{row.note}</td>
                  </tr>
                ))}
                <tr className="bg-emerald-50">
                  <td className="border border-neutral-200 px-4 py-2 font-bold text-neutral-900">合計目安</td>
                  <td className="border border-neutral-200 px-4 py-2 font-bold text-emerald-700">30万〜150万円</td>
                  <td className="border border-neutral-200 px-4 py-2 text-neutral-500 text-xs">供養先・規模によって大きく変わります</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            ※ 離檀料に法的義務はありません。高額請求があった場合はご相談ください。
          </p>
        </section>

        {/* 清蓮CTA（中盤） */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8 md:px-10">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">お墓じまい・改葬で迷ったら清蓮へ</p>
          <h2 className="mt-3 text-lg font-bold text-neutral-900 md:text-xl">
            清蓮にお墓じまい・改葬を無料相談する
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 max-w-[48ch]">
            改葬は、改葬許可申請だけでなく、墓石撤去・閉眼供養・遺骨の取り出し・粉骨・洗骨・次の供養先選びまで関係します。
            清蓮では、お墓じまい全体の流れを整理し、ご状況に合わせた進め方をご案内します。
          </p>
          <ul className="mt-4 space-y-1.5">
            {seirenServices.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-neutral-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-seiren-cta px-8 text-sm font-semibold text-white hover:bg-seiren-cta-hover transition-colors"
            >
              清蓮に無料相談する <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:08008888788"
              className="inline-flex min-h-[52px] flex-col items-center justify-center rounded-full border-2 border-neutral-300 px-8 text-sm font-semibold text-neutral-700 hover:border-neutral-500 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                0800-888-8788
              </span>
              <span className="text-xs font-normal text-neutral-400 mt-0.5">フリーコール｜9:00〜19:00</span>
            </a>
          </div>
          <p className="mt-3 text-xs text-neutral-500">相談・現地調査・見積りは無料。強引な勧誘はしません。</p>

          {/* 補助導線 */}
          <div className="mt-5 border-t border-emerald-200 pt-5">
            <p className="text-xs text-neutral-600">
              改葬許可申請書の作成・提出代行に不安がある場合は、行政書士への相談も選択肢です。
            </p>
            <Link
              href="/gyoseishoshi"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 underline underline-offset-2 hover:text-neutral-900"
            >
              行政書士に無料相談する <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* 改葬許可申請 */}
        <section>
          <h2 className="text-lg font-bold text-neutral-900 md:text-2xl">改葬許可申請の進め方</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 max-w-[52ch]">
            改葬許可申請は、現在のお墓がある市区町村の役所窓口に申請します。
            横浜市・川崎市・東京23区などの政令指定都市では、<strong className="text-neutral-900">区ごとに窓口・書式が異なります</strong>。
            申請書のダウンロードと差し戻しを防ぐ注意点は、以下のページでご確認ください。
          </p>
          <Link
            href="/kaisoukyoka"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
          >
            改葬許可申請書ダウンロード（全国1,700以上の市区町村） <ChevronRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-xs text-neutral-500">
            ※ 差し戻し事例3選・必要書類チェックリスト・書き方のポイントも掲載しています。
          </p>
        </section>

        {/* 都道府県別ナビ */}
        <section>
          <h2 className="text-xl font-bold border-b pb-3 text-neutral-900">
            都道府県別 改葬許可申請書・窓口情報
          </h2>
          <p className="mt-3 text-sm text-neutral-500">
            都道府県を選択すると、市区町村ごとの申請書ダウンロード先・窓口情報を確認できます。
          </p>

          <div className="mt-6 grid gap-8">
            {groupedPrefectures.map((region) => (
              <div key={region.name}>
                <h3 className="flex items-center gap-2 text-base font-bold border-b pb-2 text-neutral-800">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  {region.name}
                </h3>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {region.prefectures.map((pref) => (
                    <Link
                      key={pref.slug}
                      href={`/kaissou/${pref.slug}`}
                      className="flex items-center justify-center p-3 rounded-md bg-white border shadow-sm hover:shadow-md hover:border-emerald-300 hover:bg-emerald-50 transition-all font-medium text-center text-sm"
                    >
                      {pref.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-lg font-bold text-neutral-900 md:text-2xl">よくある質問</h2>
          <div className="mt-6 divide-y divide-neutral-100 rounded-2xl border border-neutral-200">
            {kaissouFaqs.map((item, i) => (
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

        {/* 関連記事 */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">関連ページ・解説記事</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: "/flow", label: "お墓じまいの流れ（7ステップ）" },
              { href: "/price", label: "お墓じまいの費用・料金" },
              { href: "/kaisoukyoka", label: "改葬許可申請書ダウンロード" },
              { href: "/kaisougo", label: "改葬後の供養先を比較する" },
              { href: "/sankotsu", label: "海洋散骨について" },
              { href: "/ridanryou", label: "離檀料について" },
              { href: "/column/kaisou-kanagawa-guide", label: "神奈川県の改葬ガイド" },
              { href: "/column/kaisou-yokohama-guide", label: "横浜市の改葬ガイド" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                <ChevronRight className="h-4 w-4 shrink-0 text-emerald-500" />
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ─── 末尾 CTA ─── */}
      <div className="border-t border-neutral-100 bg-neutral-900">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-xl font-bold text-white md:text-2xl">
            お墓じまい・改葬で迷ったら清蓮へご相談ください
          </h2>
          <p className="mt-3 max-w-[44ch] mx-auto text-sm text-neutral-400">
            墓石撤去・遺骨取り出し・粉骨・洗骨・散骨・永代供養など、
            お墓じまい全体の流れを整理し、ご状況に合わせてご案内します。
          </p>
          <p className="mt-1 text-xs text-neutral-500">相談・現地調査・見積りは無料。強引な勧誘はしません。</p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-seiren-cta px-8 text-base font-semibold text-white hover:bg-seiren-cta-hover transition-colors sm:w-auto"
            >
              清蓮に無料相談する <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:08008888788"
              className="inline-flex min-h-[52px] w-full flex-col items-center justify-center rounded-full border-2 border-neutral-600 px-8 text-sm font-semibold text-white hover:border-neutral-400 transition-colors sm:w-auto"
            >
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                0800-888-8788
              </span>
              <span className="text-xs font-normal text-neutral-400 mt-0.5">フリーコール｜9:00〜19:00</span>
            </a>
          </div>

          {/* 補助導線 */}
          <div className="mt-8 border-t border-neutral-800 pt-8">
            <p className="text-sm text-neutral-400">
              改葬許可申請書の書類作成・申請代行に不安がある場合は、行政書士への相談も選択肢です。
            </p>
            <Link
              href="/gyoseishoshi"
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-neutral-700 px-6 py-2.5 text-sm font-semibold text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors"
            >
              行政書士に無料相談する <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
