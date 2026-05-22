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
  title: '改葬許可申請書ダウンロード｜全国自治体一覧・書き方・改葬 自分で手続きする方へ｜お墓じまいナビ',
  description: '【2026年最新】改葬許可申請書を都道府県・市区町村別に一覧掲載。お墓じまい（改葬）・墓じまいに必要な書類・書き方・取得方法を詳しく解説。自分で改葬手続きしたい方のポータルサイト。',
  path: '/kaisoukyoka',
})

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.ohakajimai-navi.jp'

const kaisoukyokaFaqs = [
  {
    question: "改葬許可申請書はどこで入手できますか？",
    answer: "改葬許可申請書は、現在のお墓がある市区町村の窓口（市民課・環境衛生課など）で入手するか、当ページから各自治体の公式PDFをダウンロードできます。全国1,700以上の市区町村分を掲載しています。",
  },
  {
    question: "改葬許可申請に必要な書類は何ですか？",
    answer: "主に①改葬許可申請書、②埋蔵証明書（現在の墓地管理者が発行）、③受入証明書（改葬先が発行）の3点が必要です。自治体によって追加書類が求められる場合があります。",
  },
  {
    question: "改葬許可証はどのくらいで取得できますか？",
    answer: "申請から交付までの期間は自治体によって異なりますが、書類に不備がなければ数日〜2週間程度が目安です。事前に窓口へ電話確認することをおすすめします。",
  },
  {
    question: "改葬許可申請の代行を依頼することはできますか？",
    answer: "改葬許可申請書の作成・提出代行は行政書士が行える業務です。当サイトでは書類の取得方法の案内と一般的な記入ポイントの説明を無料で提供しています。代行が必要な場合は、提携行政書士をご紹介します。",
  },
  {
    question: "散骨の場合でも改葬許可証は必要ですか？",
    answer: "現在埋葬されているご遺骨を取り出して散骨する場合、改葬許可証が必要です。ただし散骨のみを目的とする場合（新たな埋葬先なし）でも多くの自治体では改葬許可証が必要になります。個別の状況については当社へご相談ください。",
  },
]

export default async function KaisoukyokaPage() {
  const municipalities = await prisma.municipality.findMany({
    select: {
      jisCode: true,
      name: true,
      prefectureName: true,
      municipalitySlug: true,
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
            全国の自治体が公開している改葬許可申請書のダウンロードページや公式案内ページへのリンクを一覧にまとめました。
            お墓のある市区町村名で検索するか、エリアから探してください。
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

      {/* Doc-09 §7: 行政書士への導線 */}
      <section className="border-t bg-muted/30 px-4 py-10 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm leading-relaxed text-muted-foreground">
            申請書の書き方や提出方法に不安がある方は、改葬許可申請に詳しい行政書士にご相談いただけます。
          </p>
          <Link
            href="/gyoseishoshi"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            行政書士に相談する
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
