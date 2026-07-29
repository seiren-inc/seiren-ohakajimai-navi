import Link from "next/link"
import { constructMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { MapPin, ChevronRight } from "lucide-react"
import { PREFECTURES, REGIONS } from "@/lib/prefectures"
import { Breadcrumb } from "@/components/ui/Breadcrumb"

// Revalidate the page every 24 hours
export const revalidate = 86400

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ohakajimai-navi.jp"

export const metadata = constructMetadata({
    title: "改葬手続き・改葬許可申請書ダウンロード｜全国都道府県・市区町村別まとめ",
    description: "お墓じまい・改葬（墓じまい）に必要な改葬許可申請書を全国自治体別に掲載。改葬手続きの流れ・申請書の書き方・提出先・改葬許可証の取得方法を都道府県・市区町村ごとに解説。自分で改葬手続きを行いたい方の情報ポータル。株式会社清蓮（全国対応）監修。",
  path: '/kaissou',
})

const collectionPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/kaissou#collectionpage`,
    name: '全国都道府県別 改葬手続き情報',
    description: '全国47都道府県・市区町村別の改葬許可申請書情報と手続きガイド。',
    url: `${SITE_URL}/kaissou`,
    inLanguage: 'ja',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    hasPart: PREFECTURES.map((p) => ({
        '@type': 'WebPage',
        name: `${p.name}の改葬手続き情報`,
        url: `${SITE_URL}/kaissou/${p.slug}`,
    })),
}

export default function KaissouPage() {
    const groupedPrefectures = REGIONS.map((regionName) => ({
        name: regionName,
        prefectures: PREFECTURES.filter((p) => p.region === regionName),
    }))

    return (
        <div className="bg-white">
            <BreadcrumbJsonLd
                items={[
                    { name: "ホーム", url: SITE_URL },
                    { name: "改葬手続き情報", url: `${SITE_URL}/kaissou` },
                ]}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
            />
            <Breadcrumb items={[{ name: "改葬手続き情報", href: "/kaissou" }]} />

            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="typography-heading mx-auto max-w-[28ch] text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">全国の改葬手続き情報</h1>
                    <p className="typography-body mx-auto max-w-[48ch] text-muted-foreground text-[17px]">
                        都道府県から該当の市区町村を選択してください。
                        各自治体の改葬許可申請書のダウンロード先や、窓口情報を確認できます。
                    </p>
                </div>

                <div className="grid gap-8">
                    {groupedPrefectures.map((region) => (
                        <section key={region.name} className="space-y-4">
                            <h2 className="text-xl font-bold border-b pb-2 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                {region.name}
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {region.prefectures.map((pref) => (
                                    <Link
                                        key={pref.slug}
                                        href={`/kaissou/${pref.slug}`}
                                        className="flex items-center justify-center p-3 rounded-md bg-white border shadow-sm hover:shadow-md hover:border-primary/50 hover:bg-slate-50 transition-all font-medium text-center"
                                    >
                                        {pref.name}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* 清蓮へのお墓じまい相談CTA（主導線） */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                  <h2 className="text-lg font-bold text-neutral-900">お墓じまい・改葬は清蓮にご相談ください</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-[52ch] mx-auto">
                    改葬許可申請の書類手続きだけでなく、墓石撤去、閉眼供養、遺骨の取り出し、粉骨・洗骨、次の納骨先選びまで、清蓮ではお墓じまい全体をワンストップでご相談いただけます。横浜を拠点に全国対応。
                  </p>
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-seiren-cta px-6 py-3 text-sm font-semibold text-white hover:bg-seiren-cta-hover transition-colors"
                  >
                    お墓じまいを清蓮に無料相談する
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <p className="mt-3 text-xs text-muted-foreground">現地調査・見積もりも無料。強引な勧誘はしません。</p>
                </div>

                {/* 行政書士紹介CTA（補助導線） */}
                <div className="rounded-xl border bg-slate-50 p-6 text-center">
                  <h2 className="text-lg font-bold text-neutral-900">書類作成・申請手続きに不安がある方は行政書士に相談できます</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-[48ch] mx-auto">
                    改葬許可申請書の作成・提出代行は行政書士が行える業務です。お墓じまいナビでは全国の提携行政書士をご紹介しています。
                  </p>
                  <Link
                    href="/gyoseishoshi"
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    行政書士マッチングを利用する
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <p className="mt-3 text-xs text-muted-foreground">ご紹介は無料。強引な勧誘はしません。</p>
                </div>
            </div>
        </div>
    )
}
