import Link from "next/link"
import { constructMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { MapPin } from "lucide-react"
import { PREFECTURES, REGIONS } from "@/lib/prefectures"
import { Breadcrumb } from "@/components/ui/Breadcrumb"

// Revalidate the page every 24 hours
export const revalidate = 86400

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ohakajimai-navi.jp"

export const metadata = constructMetadata({
    title: "全国の改葬手続き情報・申請書ダウンロード",
    description: "全国の自治体の改葬許可申請書のダウンロード先や、手続き窓口の情報をまとめています。ご自身で手続きを行う際にご活用ください。",
})

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
            <Breadcrumb items={[{ name: "改葬手続き情報", href: "/kaissou" }]} />

            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="typography-heading mx-auto max-w-[28ch] text-3xl font-bold tracking-tight sm:text-4xl">全国の改葬手続き情報</h1>
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
            </div>
        </div>
    )
}
