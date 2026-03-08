import { ContactForm } from "@/components/features/contact/contact-form"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { constructMetadata } from "@/lib/seo"

export const metadata = constructMetadata({
    title: "お問い合わせ・無料相談・お見積り｜お墓じまいナビ",
    description: "お墓じまい・改葬・墓じまい・墓石撤去・海洋散骨・離橉交渉のご相談・お見積りは無料。改葬許可申請・改葬手続きを自分で進めたい方・行政書士を探したい方・遠方のお墓の墒管でお困りの方もお気軽に。００８０－８８８－８７８８・２４時間受付・全国対応。",
    path: '/contact',
})

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Breadcrumb items={[{ name: "お問い合わせ", href: "/contact" }]} />
            <div className="container max-w-3xl py-12 md:py-20 px-4 md:px-6">
                <div className="text-center mb-10">
                    <h1 className="typography-heading mx-auto max-w-[28ch] text-3xl font-bold tracking-tight sm:text-4xl">お問い合わせ・無料見積り</h1>
                    <p className="typography-body mt-5 text-muted-foreground max-w-[44ch] mx-auto">
                        以下のフォームよりお気軽にご相談ください。
                        担当者が内容を確認次第、2営業日以内にご連絡させていただきます。
                    </p>
                </div>

                <div className="bg-white p-6 md:p-10 rounded-lg shadow-sm border">
                    <ContactForm />
                </div>
            </div>
        </div>
    )
}
