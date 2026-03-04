import { Metadata } from "next"
import { constructMetadata } from "@/lib/seo"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = constructMetadata({
    title: "掲載申込完了｜行政書士 お墓じまいナビ",
    description: "掲載申込が完了しました。審査完了後、掲載を開始いたします。",
})

export default function ScrivenerEntryThanksPage() {
    return (
        <section className="min-h-[60vh] flex items-center justify-center py-16 bg-slate-50">
            <div className="container max-w-lg px-4 text-center">
                <div className="flex justify-center mb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                    お申し込みありがとうございます
                </h1>

                <div className="mt-6 rounded-xl bg-white border p-6 text-left space-y-3 text-sm text-neutral-700">
                    <p className="font-semibold text-neutral-900">今後の流れ</p>
                    <ol className="space-y-3">
                        {[
                            {
                                step: "1",
                                text: "決済完了メールがStripeから届きます。",
                            },
                            {
                                step: "2",
                                text: "当社にて審査を行います（2〜5営業日）。審査完了後、担当者よりご連絡いたします。",
                            },
                            {
                                step: "3",
                                text: "審査通過後、掲載を開始します。掲載内容の変更は運営事務局までお問い合わせください。",
                            },
                        ].map(({ step, text }) => (
                            <li key={step} className="flex gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                                    {step}
                                </span>
                                <span>{text}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                <p className="mt-6 text-sm text-neutral-600">
                    ご不明な点は
                    <Link href="/contact" className="text-emerald-700 underline hover:text-emerald-800 mx-1">
                        お問い合わせ
                    </Link>
                    よりご連絡ください。
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/gyoseishoshi"
                        className="inline-flex items-center justify-center rounded-full border-2 border-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                        行政書士マッチングへ戻る
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                    >
                        トップページへ
                    </Link>
                </div>
            </div>
        </section>
    )
}
