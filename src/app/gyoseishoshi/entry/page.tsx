import { Metadata } from "next"
import { constructMetadata } from "@/lib/seo"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { ScrivenerEntryForm } from "@/components/features/gyoseishoshi/ScrivenerEntryForm"
import { ShieldCheck, Clock, BadgeCheck } from "lucide-react"

export const metadata: Metadata = constructMetadata({
    title: "行政書士 掲載申込｜お墓じまいナビ",
    description:
        "改葬許可申請専門サイト「お墓じまいナビ」への行政書士掲載申込ページ。プラン選択から事務所情報入力・決済まで、WEB上で完結できます。",
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ohakajimai-navi.jp"

const MERITS = [
    {
        Icon: BadgeCheck,
        title: "改葬手続き専門サイトへの掲載",
        description: "改葬許可申請を検索しているユーザーに直接リーチできます。",
    },
    {
        Icon: Clock,
        title: "最短翌営業日に審査開始",
        description: "申込・決済完了後、速やかに審査を行います。",
    },
    {
        Icon: ShieldCheck,
        title: "いつでも解約可能",
        description: "月額制のため、不要になった際はいつでも解約できます。",
    },
]

export default function ScrivenerEntryPage() {
    return (
        <>
            <BreadcrumbJsonLd
                items={[
                    { name: "トップ", url: SITE_URL },
                    { name: "行政書士マッチング", url: `${SITE_URL}/gyoseishoshi` },
                    { name: "掲載申込", url: `${SITE_URL}/gyoseishoshi/entry` },
                ]}
            />

            {/* Hero */}
            <section className="bg-linear-to-b from-emerald-50 to-white">
                <Breadcrumb
                    items={[
                        { name: "行政書士マッチング", href: "/gyoseishoshi" },
                        { name: "掲載申込", href: "/gyoseishoshi/entry" },
                    ]}
                />
                <div className="container max-w-3xl px-4 py-10 md:py-14 text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
                        行政書士向け
                    </p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                        掲載プランお申込み
                    </h1>
                    <p className="mt-4 text-base text-neutral-600 max-w-xl mx-auto">
                        プランを選んで事務所情報を入力するだけ。
                        Stripe決済後、審査を経て掲載が開始されます。
                    </p>
                </div>
            </section>

            {/* メリット */}
            <section className="bg-white border-b py-10">
                <div className="container max-w-4xl px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {MERITS.map(({ Icon, title, description }) => (
                            <div key={title} className="flex flex-col items-center text-center gap-2 p-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                                    <Icon className="h-6 w-6 text-emerald-600" />
                                </div>
                                <p className="font-semibold text-neutral-900 text-sm">{title}</p>
                                <p className="text-xs text-neutral-600">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 申込フォーム */}
            <section className="py-12 md:py-16 bg-slate-50">
                <div className="container max-w-2xl px-4">
                    <div className="bg-white rounded-xl shadow-sm border p-6 md:p-10">
                        <ScrivenerEntryForm />
                    </div>

                    <p className="mt-6 text-center text-xs text-neutral-400">
                        掲載申込・決済に関するご質問は{" "}
                        <a href="/contact" className="underline hover:text-emerald-700">
                            お問い合わせ
                        </a>{" "}
                        よりお気軽にご連絡ください。
                    </p>
                </div>
            </section>
        </>
    )
}
