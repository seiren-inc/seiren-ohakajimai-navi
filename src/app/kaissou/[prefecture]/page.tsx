import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { constructMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { FaqJsonLd } from "@/components/seo/faq-json-ld"
import { ChevronRight, FileText, MapPin, UserCheck } from "lucide-react"
import { PREFECTURES } from "@/lib/prefectures"

import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { Card, CardContent } from "@/components/ui/card"

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ohakajimai-navi.jp"

// ビルド時のプリレンダリングを無効化（DBクエリを含むため）
export const dynamic = "force-dynamic"

// Correct type definition for params in Next.js 15
type PageProps = {
    params: Promise<{ prefecture: string }>
}

// Pref name mapping from constant
function getPrefectureData(slug: string) {
    return PREFECTURES.find((p) => p.slug === slug)?.name
}

export async function generateMetadata(props: PageProps) {
    const params = await props.params
    const prefName = getPrefectureData(params.prefecture)

    if (!prefName) return constructMetadata({ title: "ページが見つかりません" })

    return constructMetadata({
        title: `${prefName}でのお墓じまい・改葬手続き情報一覧｜行政書士・窓口対応`,
        description: `${prefName}内の各市区町村（自治体）の改葬許可申請書のダウンロード先や手続き窓口を掲載。${prefName}の改葬代行に対応可能な行政書士情報も紹介しています。お墓じまいのご相談は無料です。`,
        path: `/kaissou/${params.prefecture}`
    })
}

export default async function PrefecturePage(props: PageProps) {
    const params = await props.params
    const prefName = getPrefectureData(params.prefecture)

    if (!prefName) {
        notFound()
    }

    const municipalities = await prisma.municipality.findMany({
        where: {
            prefectureSlug: params.prefecture,
            isPublished: true,
        },
        select: {
            id: true,
            name: true,
            prefectureSlug: true,
            municipalitySlug: true,
        },
        orderBy: { jisCode: "asc" },
    })

    // 都道府県対応の行政書士を取得（E-E-A-T強化）
    const scriveners = await prisma.administrativeScrivener.findMany({
        where: { prefecture: prefName, isApproved: true, isActive: true },
        take: 3,
        orderBy: { priorityScore: "desc" }
    })

    // 都道府県ごとの動的FAQ
    const geoFaqs = [
        {
            question: `${prefName}の改葬許可申請はどこで行いますか？`,
            answer: `${prefName}内の現在お墓がある市区町村の役所（市民課・環境衛生課など）で行います。本ページから該当の自治体を選択し、申請書や窓口の詳細な情報をご確認ください。`,
        },
        {
            question: `${prefName}のお墓じまい手続きを代行してもらえますか？`,
            answer: `はい、可能です。お墓じまいナビでは、${prefName}を対応エリアとする提携行政書士をご紹介し、改葬許可申請などの行政手続きをサポートします。また、墓石撤去などの工事も全国提携の石材店ネットワークでお引き受けできます。`,
        },
        {
            question: `${prefName}の手続きで必要な書類は何ですか？`,
            answer: `基本的には①改葬許可申請書、②現在の墓地管理者が発行する「埋蔵証明書」、③新しい改葬先が発行する「受入証明書」の3点です。自治体によって独自の添付書類（申請者の戸籍謄本や墓地の写真など）が求められる場合がありますので、必ず各市区町村の規定をご確認ください。`,
        }
    ]

    const geoJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${SITE_URL}/kaissou/${params.prefecture}#service`,
        name: `${prefName}の改葬手続きサポート`,
        description: `${prefName}の市区町村別改葬許可申請書情報と手続きガイド。${prefName}のお墓じまい・改葬をワンストップでサポート。`,
        url: `${SITE_URL}/kaissou/${params.prefecture}`,
        serviceType: '改葬手続きサポート',
        areaServed: {
            '@type': 'AdministrativeArea',
            name: prefName,
        },
        provider: {
            '@id': `${SITE_URL}/#organization`,
        },
        inLanguage: 'ja',
    }

    return (
        <div className="bg-white">
            <BreadcrumbJsonLd
                items={[
                    { name: "ホーム", url: SITE_URL },
                    { name: "改葬手続き情報", url: `${SITE_URL}/kaissou` },
                    { name: prefName, url: `${SITE_URL}/kaissou/${params.prefecture}` },
                ]}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(geoJsonLd) }}
            />
            <Breadcrumb items={[
                { name: "改葬手続き情報", href: "/kaissou" },
                { name: prefName, href: `/kaissou/${params.prefecture}` },
            ]} />

            <div className="max-w-4xl mx-auto space-y-10">
                <div className="space-y-4">
                    <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">{prefName}の改葬手続き情報</h1>
                    <p className="text-muted-foreground text-lg">
                        手続きを行う市区町村を選択してください。
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {municipalities.map((city) => (
                        <Link
                            key={city.id}
                            href={`/kaissou/${city.prefectureSlug}/${city.municipalitySlug}`}
                            className="group flex flex-col p-4 rounded-lg border bg-white shadow-sm hover:shadow-md hover:border-primary/50 transition-all custom-shadow"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{city.name}</h3>
                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary" />
                            </div>
                            <div className="mt-auto flex items-center text-xs text-muted-foreground">
                                <FileText className="h-3 w-3 mr-1" />
                                <span>申請書情報の確認へ</span>
                            </div>
                        </Link>
                    ))}
                    {municipalities.length === 0 && (
                        <div className="col-span-full py-10 text-center text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                            現在、{prefName}のデータは準備中です。
                        </div>
                    )}
                </div>

                {/* E-E-A-T: 地元専門家の表示 */}
                {scriveners.length > 0 && (
                    <div className="mt-16 pt-10 border-t">
                        <div className="flex items-center gap-2 mb-6">
                            <UserCheck className="h-6 w-6 text-primary" />
                            <h2 className="text-lg font-bold md:text-2xl">{prefName}対応の提携行政書士</h2>
                        </div>
                        <p className="text-muted-foreground mb-6">
                            改葬の手続きに不安がある方は、地元の専門家に代行を依頼することができます。
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {scriveners.map(s => (
                                <Link key={s.id} href={`/gyoseishoshi/${s.id}`}>
                                    <Card className="hover:border-primary/50 transition-colors h-full flex flex-col cursor-pointer">
                                        <CardContent className="p-5 flex flex-col flex-1">
                                            <h3 className="font-bold text-lg mb-2 line-clamp-2">{s.officeName}</h3>
                                            <div className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {s.prefecture}{s.city || ''}
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                                                {s.profileText}
                                            </p>
                                            <div className="text-primary text-sm font-medium flex items-center justify-end mt-auto">
                                                詳細を見る <ChevronRight className="h-4 w-4 ml-1" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-6 text-center">
                            <Link href="/gyoseishoshi" className="text-primary hover:underline text-sm font-medium">
                                その他の行政書士を探す →
                            </Link>
                        </div>
                    </div>
                )}
            </div>
            {/* GEO対策用のFAQ構造化データ */}
            <FaqJsonLd faqs={geoFaqs} />
        </div>
    )
}
