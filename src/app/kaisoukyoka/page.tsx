import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { constructMetadata } from '@/lib/seo'
import KaisoukyokaClient from '@/components/kaisoukyoka/KaisoukyokaClient'

export const metadata: Metadata = constructMetadata({
  title: '改葬許可申請書のダウンロード 全国自治体一覧',
  description: '【2026年最新】全国の自治体別に改葬許可申請書のダウンロード先や窓口情報を一覧で掲載。お墓じまい（改葬）に必要な行政手続きをスムーズに進めるためのポータルサイトです。',
})

export default async function KaisoukyokaPage() {
  const municipalities = await prisma.municipality.findMany({
    where: {
      isPublished: true,
      linkStatus: 'OK',
      OR: [
        { url: { not: null } },
        { pdfUrl: { not: null } }
      ]
    },
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
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 transition-all">
            改葬許可申請書ダウンロード 全国一覧
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            自治体ごとの公式案内ページや申請書PDFへ直接アクセスできます。お住まいの地域を選択してください。
          </p>
        </header>

        {/* subLinks は Prisma が JsonValue で返すが、ランタイムでは SubLink[] 構造が保証されている */}
        <KaisoukyokaClient initialData={groupedData as React.ComponentProps<typeof KaisoukyokaClient>['initialData']} />
      </div>
    </main>
  )
}
