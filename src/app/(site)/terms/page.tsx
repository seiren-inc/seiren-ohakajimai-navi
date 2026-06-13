import { constructMetadata } from "@/lib/seo"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ohakajimai-navi.jp"

export const metadata = constructMetadata({
  title: "コンテンツ利用条件｜株式会社清蓮 お墓じまいナビ",
  description:
    "お墓じまいナビに掲載するコンテンツおよび改葬許可申請書データの著作権・利用条件・免責事項。各自治体の改葬手続き情報の出典と二次利用の取り扱いについて。",
  path: "/terms",
})

const LAST_UPDATED = "2026年6月13日"
const EFFECTIVE_DATE = "2026年6月13日"

type Section = {
  id: string
  title: string
  body?: string
  items?: string[]
}

const sections: Section[] = [
  {
    id: "01",
    title: "著作権の帰属",
    body: `本サイト「お墓じまいナビ」（以下「本サービス」）に掲載されている文章・図表・編集著作物、および各自治体の改葬手続きに関する情報を当社が調査・整理・編集したデータ（以下「本コンテンツ」）の著作権は、株式会社清蓮（以下「当社」）に帰属します。

なお、各自治体が公開する改葬許可申請書の様式・公式ページそのものの権利は、各自治体に帰属します。本サービスは、それらへのリンクおよび手続き窓口情報の案内を行うものです。`,
  },
  {
    id: "02",
    title: "改葬許可申請書データについて",
    body: `各自治体別ページに掲載する「改葬許可申請書データ」は、当社が各自治体の公式情報を調査し、申請書のダウンロード先や手続き窓口情報を編集して提供するものです。

掲載情報は作成時点のものであり、内容の正確性・完全性・最新性を保証するものではありません。実際の申請にあたっては、必ず各自治体の公式情報を最終的にご確認ください。`,
  },
  {
    id: "03",
    title: "利用条件",
    items: [
      "個人的・非商業的な範囲での閲覧・参照は、ご自由にご利用いただけます。",
      "当社の事前の書面による許諾なく、本コンテンツの複製・転載・改変・再配布、データの自動収集（スクレイピング等）、および商用目的での二次利用を行うことを禁止します。",
      "報道・研究等で引用される場合は、出典として「お墓じまいナビ（株式会社清蓮）」を明示し、該当ページへのリンクを付してください。",
    ],
  },
  {
    id: "04",
    title: "免責事項",
    body: `当社は、本コンテンツの利用により生じたいかなる損害についても、責任を負いかねます。

改葬手続きの最終的な可否・必要書類・費用等は、各自治体および関係機関の指示に従ってください。`,
  },
  {
    id: "05",
    title: "お問い合わせ",
    body: `本コンテンツの転載・利用許諾に関するご相談は、お問い合わせフォームよりご連絡ください。`,
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "コンテンツ利用条件", url: `${SITE_URL}/terms` },
        ]}
      />
      <Breadcrumb items={[{ name: "コンテンツ利用条件", href: "/terms" }]} />

      {/* ── Hero ── */}
      <div className="border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="mt-6 text-xl font-bold tracking-tight text-neutral-900 md:text-3xl lg:text-4xl">
            Content Terms
          </h1>
          <p className="mt-3 text-lg font-medium text-neutral-900">コンテンツ利用条件</p>

          <div className="mt-8 flex flex-col gap-1">
            <p className="text-sm text-neutral-500">
              <span className="font-medium text-neutral-700">制定日：</span>
              {EFFECTIVE_DATE}
            </p>
            <p className="text-sm text-neutral-500">
              <span className="font-medium text-neutral-700">最終更新：</span>
              {LAST_UPDATED}
            </p>
            <p className="text-sm text-neutral-500">
              <span className="font-medium text-neutral-700">事業者：</span>株式会社清蓮
            </p>
          </div>
        </div>
      </div>

      {/* ── 本文 ── */}
      <div className="mx-auto max-w-3xl px-6 py-16">
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={`section-${section.id}`}
            className={`py-12 ${index !== sections.length - 1 ? "border-b border-neutral-100" : ""}`}
          >
            <div className="mb-6 flex items-baseline gap-4">
              <span className="shrink-0 text-xs font-semibold tabular-nums text-neutral-400">{section.id}</span>
              <h2 className="text-xl font-bold text-neutral-900">{section.title}</h2>
            </div>

            {section.body && (
              <div className="pl-8">
                {section.body.split("\n\n").map((para, i) => (
                  <p key={i} className="mb-4 whitespace-pre-line text-base leading-relaxed text-neutral-600 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            )}

            {section.items && (
              <ul className="space-y-3 pl-8">
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-base leading-relaxed text-neutral-600">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
