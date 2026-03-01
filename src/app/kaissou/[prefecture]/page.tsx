import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { constructMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { ChevronRight, FileText } from "lucide-react"
import { PREFECTURES } from "@/lib/prefectures"

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
        title: `${prefName}の改葬手続き情報一覧`,
        description: `${prefName}内の各市区町村の改葬許可申請書ダウンロード先や手続き窓口を掲載しています。`,
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

    // Grouping logic could be added here if needed (e.g. by city/town/village), 
    // but flat list is fine for MVP

    return (
        <div className="container py-12 px-4 md:px-6">
            <BreadcrumbJsonLd
                items={[
                    { name: "ホーム", url: process.env.NEXT_PUBLIC_BASE_URL || "https://www.osohiki-navi.jp" },
                    { name: "改葬手続き情報", url: `${process.env.NEXT_PUBLIC_BASE_URL}/kaissou` },
                    { name: prefName, url: `${process.env.NEXT_PUBLIC_BASE_URL}/kaissou/${params.prefecture}` },
                ]}
            />

            <div className="max-w-4xl mx-auto space-y-10">
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{prefName}の改葬手続き情報</h1>
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
                                <span>申請書ダウンロード可</span>
                            </div>
                        </Link>
                    ))}
                    {municipalities.length === 0 && (
                        <div className="col-span-full py-10 text-center text-muted-foreground bg-slate-50 rounded-lg">
                            現在、この都道府県のデータは準備中です。
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
