import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { constructMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import KaisoukyokaClient from '@/components/kaisoukyoka/KaisoukyokaClient'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = constructMetadata({
  title: '改葬許可申請書ダウンロード｜全国自治体一覧・書き方・改葬 自分で手続きする方へ｜お墓じまいナビ',
  description: '【2026年最新】改葬許可申請書を都道府県・市区町村別に一覧掲載。お墓じまい（改葬）・墓じまいに必要な書類・書き方・取得方法を詳しく解説。自分で改葬手続きしたい方のポータルサイト。',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ohakajimai-navi.jp'

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

      <Breadcrumb items={[{ name: '改葬許可申請書ダウンロード 全国一覧', href: '/kaisoukyoka' }]} />

      {/* ページタイトル + 説明文 */}
      <section className="border-b bg-muted/30 px-4 py-10 text-center md:py-14">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl">
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
          <a
            href="/gyoseishoshi"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            行政書士に相談する
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  )
}
