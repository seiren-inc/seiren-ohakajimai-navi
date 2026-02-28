import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { constructMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import Link from "next/link"
import { MapPin, Globe, MessageCircle, ArrowLeft, Clock } from "lucide-react"
import type { Metadata } from "next"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ohakajimai-navi.jp"

type PageProps = {
    params: Promise<{ id: string }>
}

/**
 * Doc-19 §3-2: 行政書士詳細ページ
 * Doc-08 §8: phone/email非表示（公開側）
 */

// Doc-09: 動的メタデータ
export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params
    const scrivener = await db.administrativeScrivener.findUnique({
        where: { id: params.id },
        select: { officeName: true, prefecture: true, city: true, profileText: true },
    })

    if (!scrivener) return constructMetadata({ title: "行政書士が見つかりません" })

    const area = scrivener.city ? `${scrivener.prefecture}${scrivener.city}` : scrivener.prefecture
    return constructMetadata({
        title: `${scrivener.officeName}｜${area}の行政書士｜お墓じまいナビ`,
        description: scrivener.profileText?.slice(0, 120) || `${area}の行政書士 ${scrivener.officeName}。改葬許可申請のご相談はお墓じまいナビへ。`,
    })
}

export default async function ScrivenerDetailPage(props: PageProps) {
    const params = await props.params
    const scrivener = await db.administrativeScrivener.findUnique({
        where: { id: params.id },
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
            isApproved: true,
            isActive: true,
            paymentStatus: true,
            updatedAt: true,
        },
    })

    // 未承認/未アクティブ/未払いは404
    if (!scrivener || !scrivener.isApproved || !scrivener.isActive || scrivener.paymentStatus !== "PAID") {
        notFound()
    }

    const area = scrivener.city ? `${scrivener.prefecture} ${scrivener.city}` : scrivener.prefecture

    // LocalBusiness JSON-LD（Doc-09 §4）
    const localBusinessJsonLd = {
        "@context": "https://schema.org",
        "@type": "LegalService",
        "name": scrivener.officeName,
        "description": scrivener.profileText,
        "areaServed": {
            "@type": "AdministrativeArea",
            "name": scrivener.prefecture,
        },
        ...(scrivener.websiteUrl ? { "url": scrivener.websiteUrl } : {}),
    }

    return (
        <>
            <BreadcrumbJsonLd items={[
                { name: "トップ", url: SITE_URL },
                { name: "行政書士マッチング", url: `${SITE_URL}/gyoseishoshi` },
                { name: scrivener.officeName, url: `${SITE_URL}/gyoseishoshi/${scrivener.id}` },
            ]} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
            />

            {/* ナビ */}
            <div className="bg-slate-50 border-b">
                <div className="container max-w-4xl px-4 py-3">
                    <Link
                        href="/gyoseishoshi"
                        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        行政書士一覧に戻る
                    </Link>
                </div>
            </div>

            {/* メインコンテンツ */}
            <section className="py-12 md:py-16">
                <div className="container max-w-4xl px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* 左カラム: 詳細情報 */}
                        <div className="md:col-span-2 space-y-8">
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                                    {scrivener.officeName}
                                </h1>
                                {scrivener.representativeName && (
                                    <p className="mt-2 text-sm text-neutral-500">
                                        代表: {scrivener.representativeName}
                                    </p>
                                )}
                                <div className="mt-3 flex flex-wrap gap-3 text-sm text-neutral-600">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4 text-neutral-400" />
                                        {area}
                                    </span>
                                    {scrivener.businessHours && (
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4 text-neutral-400" />
                                            {scrivener.businessHours}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* プロフィール */}
                            <div>
                                <h2 className="text-lg font-bold text-neutral-900 mb-3">プロフィール</h2>
                                <p className="text-sm leading-relaxed text-neutral-700 whitespace-pre-line">
                                    {scrivener.profileText}
                                </p>
                            </div>

                            {/* 得意分野 */}
                            {scrivener.specialties.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-bold text-neutral-900 mb-3">得意分野</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {scrivener.specialties.map((tag: string) => (
                                            <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 border border-emerald-100">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 料金目安 */}
                            {scrivener.priceRangeText && (
                                <div>
                                    <h2 className="text-lg font-bold text-neutral-900 mb-3">料金目安</h2>
                                    <div className="rounded-lg bg-slate-50 px-5 py-4 border">
                                        <p className="text-sm font-medium text-neutral-800">{scrivener.priceRangeText}</p>
                                        <p className="mt-2 text-xs text-neutral-500">
                                            ※ 最終的な報酬は行政書士と直接ご確認ください。
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* ウェブサイト */}
                            {scrivener.websiteUrl && (
                                <div>
                                    <h2 className="text-lg font-bold text-neutral-900 mb-3">ウェブサイト</h2>
                                    <a
                                        href={scrivener.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm text-emerald-700 hover:underline"
                                    >
                                        <Globe className="h-4 w-4" />
                                        {scrivener.websiteUrl}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* 右カラム: CTA */}
                        <div className="md:col-span-1">
                            <div className="sticky top-24 rounded-xl border bg-white p-6 shadow-sm space-y-4">
                                <h3 className="text-lg font-bold text-neutral-900">この行政書士に相談する</h3>
                                <p className="text-xs text-neutral-500">
                                    改葬許可申請についてのご相談を受け付けています。
                                </p>
                                <a
                                    href="/gyoseishoshi#contact-form"
                                    className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors w-full"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    無料で相談する
                                </a>
                                <p className="text-[10px] text-center text-neutral-400">
                                    ※ 本サービスは広告掲載です。当社は行政書士業務の受任・仲介を行いません。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
