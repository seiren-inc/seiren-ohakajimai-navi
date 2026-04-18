import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { constructMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import KaisoukyokaClient from '@/components/kaisoukyoka/KaisoukyokaClient'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = constructMetadata({
  title: '改葬許可申請書ダウンロード｜全国自治体一覧・書き方・改葬 自分で手続きする方へ｜お墓じまいナビ',
  description: '【2026年最新】改葬許可申請書を都道府県・市区町村別に一覧掲載。お墓じまい（改葬）・墓じまいに必要な書類・書き方・取得方法を詳しく解説。自分で改葬手続きしたい方のポータルサイト。',
  path: '/kaisoukyoka',
})

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.ohakajimai-navi.jp'

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
    <main className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={[
        { name: 'ホーム', url: SITE_URL },
        { name: '改葬許可申請書ダウンロード 全国一覧', url: `${SITE_URL}/kaisoukyoka` },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: '全国市区町村の改葬許可申請書情報データベース',
            description: '全国47都道府県・1,700以上の市区町村の改葬許可申請書PDFダウンロードリンク・窓口情報を掃羅。また・西自治体別の申請書書式と記入方法を敒参記載。',
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
    </main>
  )
}
