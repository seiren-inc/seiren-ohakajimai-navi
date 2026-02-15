import { ContactForm } from "@/components/features/contact/contact-form"
import { constructMetadata } from "@/lib/seo"

export const metadata = constructMetadata({
    title: "お問い合わせ・無料見積り",
    description: "お墓じまいに関するご相談・お見積りは無料です。24時間365日受付中。",
})

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <div className="container max-w-3xl py-12 md:py-20 px-4 md:px-6">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">お問い合わせ・無料見積り</h1>
                    <p className="text-muted-foreground">
                        以下のフォームよりお気軽にご相談ください。<br className="hidden sm:inline" />
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
