import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { constructMetadata } from "@/lib/seo"
import { PREFECTURES } from "@/lib/prefectures"
import { ScrivenerCard } from "@/components/features/gyoseishoshi/ScrivenerCard"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { PublicScrivener } from "@/lib/scrivener-types"
import type { Metadata } from "next"

// ビルド時のプリレンダリングを無効化（DBクエリを含むため）
export const dynamic = "force-dynamic"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ohakajimai-navi.jp"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any

type PageProps = {
    params: Promise<{ prefecture: string }>
}

function getPrefectureData(slug: string) {
    return PREFECTURES.find((p) => p.slug === slug)
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params
    const pref = getPrefectureData(params.prefecture)
    if (!pref) return constructMetadata({ title: "ページが見つかりません" })

    return constructMetadata({
        title: `${pref.name}の行政書士一覧｜改葬許可申請サポート｜お墓じまいナビ`,
        description: `${pref.name}で改葬許可申請をサポートする行政書士を掲載しています。お墓じまい・改葬手続きでお困りの方はお気軽にご相談ください。`,
    })
}

export default async function PrefectureScrivenerPage(props: PageProps) {
    const params = await props.params
    const pref = getPrefectureData(params.prefecture)

    if (!pref) notFound()

    const scriveners: PublicScrivener[] = await db.administrativeScrivener.findMany({
        where: {
            prefecture: pref.name,
            isApproved: true,
            isActive: true,
            paymentStatus: "PAID",
        },
        select: {
            id: true,
            officeName: true,
            representativeName: true,
            prefecture: true,
            city: true,
            websiteUrl: true,
            priceRangeText: true,
            specialties: true,
            profileText: true,
            businessHours: true,
            planType: true,
        },
        orderBy: [
            { planType: "asc" },
            { priorityScore: "desc" },
        ],
    })

    return (
        <>
            <BreadcrumbJsonLd items={[
                { name: "トップ", url: SITE_URL },
                { name: "行政書士マッチング", url: `${SITE_URL}/gyoseishoshi` },
                { name: pref.name, url: `${SITE_URL}/gyoseishoshi/area/${pref.slug}` },
            ]} />

            <div className="bg-slate-50 border-b">
                <div className="container max-w-5xl px-4 py-3">
                    <Link
                        href="/gyoseishoshi"
                        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        行政書士一覧に戻る
                    </Link>
                </div>
            </div>

            <section className="py-12 md:py-16">
                <div className="container max-w-5xl px-4">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                            {pref.name}の行政書士一覧
                        </h1>
                        <p className="mt-2 text-sm text-neutral-500">
                            {scriveners.length}件の行政書士が掲載中
                        </p>
                    </div>

                    {scriveners.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2">
                            {scriveners.map((s) => (
                                <ScrivenerCard key={s.id} scrivener={s} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl bg-slate-50 border p-12 text-center">
                            <p className="text-neutral-500">
                                現在、{pref.name}の掲載行政書士はいません。
                            </p>
                            <Link
                                href="/gyoseishoshi"
                                className="mt-4 inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline"
                            >
                                全国の行政書士を見る
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
