import { constructMetadata } from "@/lib/seo"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export const metadata = constructMetadata({
    title: "ご相談ありがとうございます",
    description: "行政書士マッチングへのご相談を受け付けました。",
    noIndex: true,
})

export default function GyoseishoshiThanksPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <div className="container max-w-2xl py-20 px-4 text-center">
                <CheckCircle2 className="h-16 w-16 mx-auto text-emerald-600" />
                <h1 className="mt-6 text-2xl font-bold text-neutral-900 sm:text-3xl">
                    ご相談ありがとうございます
                </h1>
                <p className="mt-4 text-neutral-600 leading-relaxed">
                    内容を確認の上、2営業日以内に担当者よりご連絡させていただきます。
                    <br />
                    ご入力いただいたメールアドレスに、受付確認のメールをお送りしています。
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                    >
                        トップページに戻る
                    </Link>
                    <Link
                        href="/gyoseishoshi"
                        className="inline-flex items-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                        行政書士マッチングに戻る
                    </Link>
                </div>
            </div>
        </div>
    )
}
