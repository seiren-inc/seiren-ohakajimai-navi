// ISR: 1時間ごとに再生成（自治体データは頻繁に変わらない）
export const revalidate = 3600

import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { constructMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import KaisoukyokaClient from '@/components/kaisoukyoka/KaisoukyokaClient'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { SeirenEcosystemNextSteps } from '@/components/features/ecosystem/SeirenEcosystemNextSteps'
import { FaqJsonLd } from "@/components/seo/faq-json-ld"

export const metadata: Metadata = constructMetadata({
  title: '改葬許可申請書ダウンロード｜全国1,737市区町村対応・差し戻し防止の書き方ガイド｜お墓じまいナビ',
  description: '【2026年最新】全国1,737市区町村の改葬許可申請書を一覧掲載。横浜市・東京23区など政令指定都市は区ごとに窓口が異なります。差し戻し事例3選・必要書類チェックリスト・書き方のポイントを専門家が解説。',
  path: '/kaisoukyoka',
})

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.ohakajimai-navi.jp'

const kaisoukyokaFaqs = [
  {
    question: "改葬許可申請書はどこで入手できますか？",
    answer: "現在のお墓がある市区町村の窓口で入手するか、このページから各自治体のPDFをダウンロードできます。ただし担当課名は自治体によって「市民課」「環境衛生課」「保健福祉課」「生活環境課」など異なり、同じ市内でも年度ごとに様式が変更される場合があります。また横浜市・東京23区・大阪市などの政令指定都市では、区ごとに書式や窓口が異なるため、必ず事前に確認が必要です。詳しい確認方法と差し戻しを防ぐポイントはこのページで解説しています。",
  },
  {
    question: "改葬許可申請に必要な書類は何ですか？",
    answer: "基本は①改葬許可申請書、②埋蔵証明書（現在の墓地管理者が発行）、③受入証明書（改葬先が発行）の3点ですが、自治体によって4〜6点の書類が必要なケースがあります。特に「お寺から埋蔵証明書をもらえない」「古いお墓で埋葬記録がない」ケースは差し戻しになりやすく、追加書類の取得に数週間かかることもあります。ケース別の対処法はこのページ内で解説しています。",
  },
  {
    question: "改葬許可証はどのくらいで取得できますか？",
    answer: "書類に不備がなければ数日〜2週間程度が目安ですが、「差し戻し」が発生すると1〜2ヶ月以上かかるケースも珍しくありません。差し戻しの主な理由は①受入証明書の記載不備、②埋蔵証明書に押印がない、③申請書の記入欄の解釈違い、の3点です。事前に窓口へ電話確認し、チェックリストを使って準備することで差し戻しリスクを大幅に下げられます。",
  },
  {
    question: "改葬許可申請の代行を依頼することはできますか？",
    answer: "改葬許可申請書の作成・提出代行は行政書士が行える業務です。「平日に役所へ行けない」「お寺との交渉が難しい」「複数の遺骨をまとめて移したい」場合には代行依頼が有効です。費用は書類代行のみで5〜10万円、離檀交渉を含む複雑な案件で10〜20万円が相場です。当サイトでは地域別の提携行政書士をご紹介しています。",
  },
  {
    question: "散骨の場合でも改葬許可証は必要ですか？",
    answer: "現在埋葬されているご遺骨を取り出して散骨する場合、改葬許可証が必要です。「散骨なら許可証はいらない」という誤解があり、無許可で取り出すと墓地埋葬法違反になります。ただし「受入証明書」の書き方が通常の墓地と異なるため、散骨業者に必要書類の種類を確認してから申請することが重要です。",
  },
]

export default async function KaisoukyokaPage() {
  const municipalities = await prisma.municipality.findMany({
    select: {
      jisCode: true,
      name: true,
      prefectureName: true,
      prefectureSlug: true,
      municipalitySlug: true,
      isPublished: true,
      url: true,
      pdfUrl: true,
      subLinks: true,
      dataQualityLevel: true,
    },
    orderBy: [
      { dataQualityLevel: 'desc' },
      { jisCode: 'asc' }
    ]
  })

  // Group by prefecture
  const groupedData: Record<string, typeof municipalities> = {}
  municipalities.forEach(m => {
    if (!groupedData[m.prefectureName]) {
      groupedData[m.prefectureName] = []
    }
    groupedData[m.prefectureName].push(m)
  })

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={[
        { name: 'ホーム', url: SITE_URL },
        { name: '改葬許可申請書ダウンロード 全国一覧', url: `${SITE_URL}/kaisoukyoka` },
      ]} />
      <FaqJsonLd faqs={kaisoukyokaFaqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: '全国市区町村の改葬許可申請書情報データベース',
            description: '全国47都道府県・1,700以上の市区町村の改葬許可申請書PDFダウンロードリンク・窓口情報を掲載。自治体別の書式や記入ポイントを個別に整理しています。',
            url: `${SITE_URL}/kaisoukyoka`,
            creator: {
              '@type': 'Organization',
              name: '株式会社清蓮',
              url: SITE_URL,
            },
            license: 'https://creativecommons.org/licenses/by/4.0/',
            inLanguage: 'ja-JP',
            keywords: ['改葬許可申請書', '改葬', 'お墓じまい', '市区町村', '全国', 'ダウンロード'],
            variableMeasured: '全国市区町村の改葬許可申請書',
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            '@id': `${SITE_URL}/kaisoukyoka#howto`,
            name: '改葬許可申請書の取得・提出手順',
            description: 'お墓じまい・改葬に必要な改葬許可申請書の取得から改葬許可証を受け取るまでの手順。',
            totalTime: 'P14D',
            inLanguage: 'ja',
            supply: [
              { '@type': 'HowToSupply', name: '埋蔵証明書（現在の墓地管理者が発行）' },
              { '@type': 'HowToSupply', name: '受入証明書（改葬先が発行）' },
            ],
            step: [
              {
                '@type': 'HowToStep',
                position: 1,
                name: '申請書を入手する',
                text: '現在のお墓がある市区町村の窓口（市民課・環境衛生課など）か、本ページから申請書をダウンロードします。',
                url: `${SITE_URL}/kaisoukyoka`,
              },
              {
                '@type': 'HowToStep',
                position: 2,
                name: '必要事項を記入する',
                text: '申請書に故人の氏名・改葬元の墓地情報・改葬先の情報などを記入します。記入漏れがないよう確認してください。',
              },
              {
                '@type': 'HowToStep',
                position: 3,
                name: '添付書類を準備する',
                text: '現在の墓地管理者から「埋蔵証明書」を、改葬先から「受入証明書」を取得します。自治体によって追加書類が必要な場合があります。',
              },
              {
                '@type': 'HowToStep',
                position: 4,
                name: '市区町村窓口へ提出する',
                text: '申請書と添付書類をお墓のある市区町村の担当窓口へ提出します。審査が完了すると「改葬許可証」が交付されます。',
              },
              {
                '@type': 'HowToStep',
                position: 5,
                name: '改葬許可証を改葬先へ提出する',
                text: '交付された改葬許可証を新しい埋葬先（寺院・霊園など）または散骨業者へ提出し、改葬手続きが完了します。',
              },
            ],
          }),
        }}
      />

      <Breadcrumb items={[{ name: '改葬許可申請書ダウンロード 全国一覧', href: '/kaisoukyoka' }]} />

      {/* ページタイトル + 説明文 */}
      <section className="border-b bg-muted/30 px-4 py-10 text-center md:py-14">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-balance text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
            改葬許可申請書ダウンロード 全国一覧
          </h1>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            全国1,737市区町村の改葬許可申請書リンクを一覧化しています。
            ただし「ダウンロードして提出」だけでは<strong className="text-foreground">差し戻しになるケースが多くあります</strong>。
            このページでは自治体ごとの注意点・よくある差し戻し事例・書き方のポイントもあわせて解説します。
          </p>
        </div>
      </section>

      {/* 差し戻し防止ポイント */}
      <section className="border-b bg-amber-50 dark:bg-amber-950/20 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300 md:text-base">
            <span className="text-base">⚠️</span>
            申請前に確認すべき3つのポイント（差し戻し防止）
          </h2>
          <ol className="space-y-3 text-sm text-amber-900 dark:text-amber-200">
            <li className="flex gap-3">
              <span className="shrink-0 font-bold">①</span>
              <span>
                <strong>担当窓口の名称を必ず事前確認する</strong>
                ——「市民課」「環境衛生課」「生活環境課」など、市区町村によって異なります。特に<strong>横浜市・大阪市・名古屋市などの政令指定都市は区ごとに担当課が異なります</strong>。
              </span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold">②</span>
              <span>
                <strong>埋蔵証明書の取得先を先に確認する</strong>
                ——お寺から「証明書を出せない」と言われるケースがあります。お寺が断れる理由・断られた場合の代替書類についてはページ下部のFAQを参照してください。
              </span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold">③</span>
              <span>
                <strong>受入証明書の記載内容を改葬先に確認する</strong>
                ——永代供養墓・散骨・手元供養など、改葬先の種類によって証明書の書き方が異なります。記載不備は最も多い差し戻し理由です。
              </span>
            </li>
          </ol>
          <p className="mt-4 text-xs text-amber-700 dark:text-amber-400">
            ※ 申請書の記入方法や書類準備に不安な方は、<Link href="/gyoseishoshi" className="underline hover:no-underline">提携行政書士への無料相談</Link>もご利用ください。
          </p>
        </div>
      </section>

      {/* subLinks は Prisma が JsonValue で返すが、ランタイムでは SubLink[] 構造が保証されている */}
      <KaisoukyokaClient initialData={groupedData as React.ComponentProps<typeof KaisoukyokaClient>['initialData']} />

      <div className="border-t bg-background px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <SeirenEcosystemNextSteps context="kaisoukyoka" />
        </div>
      </div>

      {/* 清蓮への相談CTA（主導線） */}
      <section className="border-t bg-emerald-50 px-4 py-10 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-lg font-bold text-emerald-900 md:text-xl">お墓じまい・改葬で迷ったら清蓮へご相談ください</h2>
          <p className="mt-3 text-sm leading-relaxed text-emerald-800 max-w-[52ch] mx-auto">
            改葬許可申請書の準備だけでなく、墓石撤去・閉眼供養・遺骨の取り出し・粉骨・洗骨・次の納骨先選びまで、お墓じまい全体を整理してご案内します。
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-seiren-cta px-6 py-3 text-sm font-semibold text-white hover:bg-seiren-cta-hover transition-colors"
          >
            清蓮にお墓じまいを無料相談する
            <ChevronRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-emerald-700">相談・お見積りは無料。強引な勧誘はしません。</p>
        </div>
      </section>

      {/* 行政書士への導線（補助導線） */}
      <section className="border-t bg-muted/30 px-4 py-10 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm leading-relaxed text-muted-foreground">
            申請書の書き方や提出方法に不安がある方は、改葬許可申請に詳しい行政書士にご相談いただけます。
          </p>
          <p className="mt-2 text-xs text-muted-foreground">相談・ご紹介は無料。強引な勧誘はしません。</p>
          <Link
            href="/gyoseishoshi"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-slate-100 transition-colors"
          >
            行政書士に相談する
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
