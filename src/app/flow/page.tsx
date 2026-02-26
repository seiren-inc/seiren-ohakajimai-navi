import { constructMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { HowToJsonLd, kaisouHowToSteps } from "@/components/seo/howto-json-ld"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    MessageCircle,
    Search,
    FileSignature,
    ClipboardList,
    Hammer,
    CheckCircle2,
    Phone,
    Mail,
    ArrowRight,
    Clock,
} from "lucide-react"
import Link from "next/link"

export const metadata = constructMetadata({
    title: "ご依頼の流れ｜お墓じまい代行サービス",
    description: "お墓じまいの無料相談から工事完了まで、5つのステップをわかりやすく解説。お問い合わせから最短3ヶ月での対応が可能です。",
})

const steps = [
    {
        step: 1,
        icon: MessageCircle,
        title: "無料相談・お問い合わせ",
        duration: "当日〜翌営業日",
        description:
            "まずはお電話またはフォームよりご連絡ください。専任スタッフが丁寧にお話を伺います。お墓の場所・種別・お急ぎの度合い・ご予算感など、どんなことでもお気軽にご相談ください。",
        details: [
            "お電話は24時間365日受付",
            "フォームからのご相談は翌営業日以内に折り返し",
            "相談・見積もりはすべて無料",
            "強引な勧誘は一切行いません",
        ],
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
        borderColor: "border-blue-200",
    },
    {
        step: 2,
        icon: Search,
        title: "現地調査・お見積り",
        duration: "1〜2週間",
        description:
            "お墓の状況を専門スタッフが現地にて確認します。墓石の大きさ・施工難度・搬出経路などを確認した上で、追加費用のない明確なお見積りをご提示します。",
        details: [
            "現地調査は無料（全国対応）",
            "写真での簡易確認にも対応可（遠方の場合）",
            "見積り後の追加費用は原則発生しない明朗会計",
            "相見積もりも歓迎",
        ],
        bgColor: "bg-amber-50",
        iconColor: "text-amber-600",
        borderColor: "border-amber-200",
    },
    {
        step: 3,
        icon: FileSignature,
        title: "ご契約",
        duration: "1〜3日",
        description:
            "お見積り内容にご納得いただけましたら、ご契約となります。ご契約時に着手金をお支払いいただきます（残金は工事完了後）。",
        details: [
            "契約書面を丁寧にご説明",
            "着手金：総額の50%程度（目安）",
            "残金は工事完了後のお支払い",
            "クレジットカード・振込に対応",
        ],
        bgColor: "bg-green-50",
        iconColor: "text-green-600",
        borderColor: "border-green-200",
    },
    {
        step: 4,
        icon: ClipboardList,
        title: "行政手続き代行",
        duration: "2〜4週間",
        description:
            "「改葬許可申請」など、お墓じまいに必要な行政手続きをすべて代行します。埋蔵証明書の取得サポート、新しい供養先の受入証明書手配も含めてワンストップで対応します。",
        details: [
            "改葬許可申請書の作成・提出を代行",
            "埋蔵証明書（現在のお寺・霊園から）の取得をサポート",
            "受入証明書（新しい供養先から）の取得をサポート",
            "自治体ごとの複雑な要件にも対応",
        ],
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
        borderColor: "border-purple-200",
    },
    {
        step: 5,
        icon: Hammer,
        title: "工事・遺骨の取り出し・完了",
        duration: "1〜3日（工事）",
        description:
            "改葬許可証が発行されたら、提携石材店が墓石の解体・撤去・整地を行います。遺骨を丁寧に取り出し、新しい供養先（永代供養墓・散骨など）へお届けします。",
        details: [
            "優良石材店に依頼（独自ネットワーク）",
            "遺骨の取り出しは専門スタッフが丁寧に対応",
            "撤去後は整地・原状回復まで完了",
            "遺骨の搬送・新しい供養先への手配も対応",
        ],
        bgColor: "bg-slate-50",
        iconColor: "text-slate-600",
        borderColor: "border-slate-200",
    },
]

export default function FlowPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <BreadcrumbJsonLd
                items={[
                    { name: "ホーム", url: process.env.NEXT_PUBLIC_BASE_URL || "https://www.osohiki-navi.jp" },
                    { name: "ご依頼の流れ", url: `${process.env.NEXT_PUBLIC_BASE_URL}/flow` },
                ]}
            />
            <HowToJsonLd
                name="改葬（お墓じまい）手続きの方法"
                description="現在のお墓からご遺骨を取り出し、別の納骨先へ移す「改葬」の正式手続きの流れ。改葬許可申請書の取得から墓石撤去・新しい供養先への納骨まで5ステップで解説。"
                totalTime="P3M"
                steps={kaisouHowToSteps}
            />

            {/* Hero */}
            <section className="py-20 bg-gradient-to-b from-blue-50/50 to-white">
                <div className="container px-4 md:px-6 text-center">
                    <h1 className="typography-heading mx-auto max-w-[28ch] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        ご依頼の流れ
                    </h1>
                    <p className="typography-body mt-5 text-muted-foreground text-[17px] max-w-[48ch] mx-auto">
                        お問い合わせから工事完了まで、専任スタッフが一貫してサポートします。
                        目安として、お電話から<span className="font-bold text-foreground">最短3ヶ月</span>での対応が可能です。
                    </p>
                </div>
            </section>

            {/* Steps */}
            <section className="py-16 bg-white">
                <div className="container px-4 md:px-6 max-w-4xl mx-auto">
                    <div className="relative">
                        {/* Vertical connector line */}
                        <div className="absolute left-[27px] top-16 bottom-16 w-0.5 bg-slate-200 hidden md:block" />

                        <div className="space-y-12">
                            {steps.map((s) => {
                                const Icon = s.icon
                                return (
                                    <div key={s.step} className="flex gap-6 items-start">
                                        {/* Step icon */}
                                        <div className={`relative z-10 flex-shrink-0 w-14 h-14 rounded-full ${s.bgColor} border-2 ${s.borderColor} flex items-center justify-center`}>
                                            <Icon className={`h-6 w-6 ${s.iconColor}`} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 pb-4">
                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                    STEP {s.step}
                                                </span>
                                            <h2 className="typography-heading text-xl font-bold">{s.title}</h2>
                                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded-full">
                                                    <Clock className="h-3 w-3" /> {s.duration}
                                                </span>
                                            </div>
                                            <p className="typography-body text-muted-foreground mb-4 max-w-[52ch]">{s.description}</p>
                                            <Card className={`border ${s.borderColor} ${s.bgColor}`}>
                                                <CardContent className="pt-4">
                                                    <ul className="space-y-1.5">
                                                        {s.details.map((d, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                                <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${s.iconColor}`} />
                                                                <span>{d}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Total time estimate */}
            <section className="py-12 bg-slate-50 border-y">
                <div className="container px-4 md:px-6 max-w-3xl mx-auto text-center">
                    <h2 className="typography-heading text-2xl font-bold mb-4">全体の目安期間</h2>
                    <p className="typography-body mx-auto max-w-[44ch] text-muted-foreground mb-6">
                        行政手続きの期間はお住まいの自治体や各書類の取得状況により異なります。
                        お急ぎの場合は、まずお電話でご相談ください。
                    </p>
                    <div className="inline-flex items-center gap-3 bg-white border rounded-xl px-8 py-5 shadow-sm">
                        <Clock className="h-8 w-8 text-primary" />
                        <div className="text-left">
                            <p className="text-xs text-muted-foreground">一般的な目安</p>
                            <p className="text-2xl font-bold">2〜4ヶ月</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-slate-900 text-white">
                <div className="container px-4 md:px-6 text-center">
                    <h2 className="typography-heading text-2xl md:text-3xl font-bold mb-4">まずはお気軽にご相談ください</h2>
                    <p className="typography-body text-slate-300 mb-8 max-w-[44ch] mx-auto">相談・見積りは無料。強引な勧誘は一切行いません。</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                        <Button size="lg" variant="secondary" className="w-full h-14 text-lg font-bold" asChild>
                            <Link href="/contact">
                                <Mail className="mr-2 h-5 w-5" /> 無料相談フォーム
                            </Link>
                        </Button>
                    </div>
                    <div className="mt-6">
                        <p className="text-sm text-slate-400 mb-1">お電話（24時間受付）</p>
                        <a href="tel:0120-000-000" className="text-2xl font-bold hover:text-blue-300 transition-colors">
                            <Phone className="inline mr-2 h-5 w-5" />0120-000-000
                        </a>
                    </div>
                </div>
            </section>

            {/* Sub nav */}
            <section className="py-8 bg-white border-t">
                <div className="container px-4 md:px-6 flex flex-wrap justify-center gap-6 text-sm">
                    <Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                        ← トップへ戻る
                    </Link>
                    <Link href="/price" className="text-primary font-medium hover:underline flex items-center gap-1">
                        料金について <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/contact" className="text-primary font-medium hover:underline flex items-center gap-1">
                        無料相談・お見積り <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
