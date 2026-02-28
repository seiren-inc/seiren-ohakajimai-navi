import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { constructMetadata } from '@/lib/seo'
import KaisoukyokaClient from '@/components/kaisoukyoka/KaisoukyokaClient'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = constructMetadata({
  title: '改葬許可申請書ダウンロード｜全国自治体一覧・書き方・改葬 自分で手続きする方へ｜お墓じまいナビ',
  description: '【2026年最新】改葬許可申請書を都道府県・市区町村別に一覧掲載。お墓じまい（改葬）・墓じまいに必要な書類・書き方・取得方法を詳しく解説。自分で改葬手続きしたい方のポータルサイト。',
})

// 改善11: パンくずリスト JSON-LD
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'ホーム',
      item: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ohakajimai-navi.com'}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'お墓じまいの手続き',
      item: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ohakajimai-navi.com'}/procedure`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: '改葬許可申請書ダウンロード 全国一覧',
    },
  ],
}

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
      {/* 改善11: パンくずリスト JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* 改善11: パンくずリスト UI */}
      <nav aria-label="パンくずリスト" className="mx-auto max-w-5xl px-4 py-3">
        <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <li>
            <a href="/" className="transition-colors hover:text-foreground">
              ホーム
            </a>
          </li>
          <li>
            <ChevronRight className="h-3 w-3" />
          </li>
          <li>
            <a href="#" className="transition-colors hover:text-foreground">
              お墓じまいの手続き
            </a>
          </li>
          <li>
            <ChevronRight className="h-3 w-3" />
          </li>
          <li>
            <span className="font-medium text-foreground" aria-current="page">
              改葬許可申請書ダウンロード 全国一覧
            </span>
          </li>
        </ol>
      </nav>

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
