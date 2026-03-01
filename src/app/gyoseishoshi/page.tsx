import { prisma } from "@/lib/prisma"
import { constructMetadata } from "@/lib/seo"
import type { PublicScrivener } from "@/lib/scrivener-types"
import { ScrivenerCard } from "@/components/features/gyoseishoshi/ScrivenerCard"
import { GyoseishoshiInquiryForm } from "@/components/features/gyoseishoshi/GyoseishoshiInquiryForm"
import { GyoseishoshiFaqJsonLd } from "@/components/seo/gyoseishoshi-faq-json-ld"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import Link from "next/link"
import { FileText, Scale, Phone, CheckCircle2, XCircle, HelpCircle, AlertTriangle } from "lucide-react"

// ビルド時のプリレンダリングを無効化（DBクエリを含むため）
export const dynamic = "force-dynamic"

// Doc-09 §3-1: SEO Title/Description
export const metadata = constructMetadata({
    title: "改葬許可申請の行政書士相談｜お墓じまいナビ",
    description: "改葬許可申請の手続きでお悩みの方へ。専門の行政書士によるサポートをご案内します。無料相談受付中。",
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ohakajimai-navi.jp"

const faqItems = [
    {
        question: "改葬許可申請とは何ですか？",
        answer: "改葬許可申請とは、お墓に納められた遺骨を別の場所に移す際に、市区町村に提出する法的な手続きです。改葬許可証がないと遺骨の移動はできません。",
    },
    {
        question: "行政書士に依頼するメリットは？",
        answer: "改葬許可申請書類の作成や提出代行を専門家に任せることで、書類の不備による手続きの遅延を防ぎ、精神的な負担を軽減できます。複数の自治体にまたがるケースでも対応可能です。",
    },
    {
        question: "費用の目安はどのくらいですか？",
        answer: "一般的な改葬許可申請の代行費用は3万円〜10万円程度が目安です。ただし、ケースの複雑さや地域により異なりますので、まずは無料相談をご利用ください。",
    },
    {
        question: "行政書士と司法書士の違いは？",
        answer: "行政書士は官公署への書類作成・提出の代行が専門です。改葬許可申請は行政書士の業務範囲に該当します。なお、相続登記などの登記手続きは司法書士の業務範囲です。",
    },
    {
        question: "相談は無料ですか？",
        answer: "本サイト経由の初回相談は無料です。お気軽にフォームまたはお電話にてご相談ください。",
    },
    {
        question: "どの地域に対応していますか？",
        answer: "全国対応の行政書士をご紹介しています。お住まいの地域やお墓の所在地に近い行政書士を優先的にご案内します。",
    },
    {
        question: "必ず依頼しなければいけませんか？",
        answer: "相談のみでも可能です。行政書士への依頼を強制するものではありません。手続きの進め方についてのアドバイスだけでもお気軽にご利用ください。",
    },
]

export default async function GyoseishoshiPage() {
    // Doc-04 §3-2: 必要フィールドのみselect（phone/email除外: Doc-08 §8）
    // Doc-16 §10: paymentStatus = PAID 条件追加
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = prisma as any
    const scriveners: PublicScrivener[] = await db.administrativeScrivener.findMany({
        where: {
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
            planType: true,
            priorityScore: true,
            updatedAt: true,
        },
        orderBy: [
            { planType: "desc" },
            { priorityScore: "desc" },
            { updatedAt: "desc" },
        ],
    })

    return (
        <>
            {/* 構造化データ */}
            <GyoseishoshiFaqJsonLd faqItems={faqItems} />
            <BreadcrumbJsonLd items={[
                { name: "トップ", url: SITE_URL },
                { name: "行政書士マッチング", url: `${SITE_URL}/gyoseishoshi` },
            ]} />

            {/* ===== Hero（Doc-05 §3-1） ===== */}
            <section className="relative bg-linear-to-b from-emerald-50 to-white py-16 md:py-24">
                <div className="container max-w-4xl text-center px-4">
                    <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
                        行政書士マッチング
                    </p>
                    {/* Doc-05 §3-1, Doc-09 §3-1: H1 */}
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl leading-tight">
                        改葬許可申請、<br className="hidden sm:inline" />
                        ひとりで悩んでいませんか？
                    </h1>
                    <p className="mt-6 text-base md:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                        手続きの不安を行政書士がサポートします。<br className="hidden sm:inline" />
                        書類の書き方や提出先がわからなくても、専門家に安心して任せられます。
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                            href="#contact-form"
                            className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                        >
                            無料で相談する
                        </a>
                        <a
                            href="tel:08008888788"
                            className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                            <Phone className="h-4 w-4" />
                            0800-888-8788
                        </a>
                    </div>
                </div>
            </section>

            {/* ===== 問題提起セクション（Doc-05 §3-2, Doc-13 §3②） ===== */}
            <section className="py-12 md:py-16 bg-white">
                <div className="container max-w-3xl px-4">
                    <h2 className="text-2xl font-bold text-center text-neutral-900 sm:text-3xl">
                        改葬手続きでよくあるお悩み
                    </h2>
                    <ul className="mt-8 space-y-4">
                        {[
                            "改葬許可申請書の書き方がわからない",
                            "どの書類が必要か把握できていない",
                            "役所への問い合わせや提出が不安",
                            "仕事が忙しく、手続きに時間が取れない",
                            "遠方の自治体とのやり取りが不安",
                        ].map((text) => (
                            <li key={text} className="flex items-start gap-3 text-neutral-700">
                                <AlertTriangle className="h-5 w-5 mt-0.5 text-amber-500 shrink-0" />
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-8 text-center text-lg font-semibold text-emerald-700">
                        その不安、専門家に任せられます。
                    </p>
                </div>
            </section>

            {/* ===== できること / できないこと（Doc-05 §3-3） ===== */}
            <section className="py-16 md:py-20 bg-slate-50">
                <div className="container max-w-5xl px-4">
                    <h2 className="text-2xl font-bold text-center text-neutral-900 sm:text-3xl">
                        行政書士が対応できること
                    </h2>
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* できること */}
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
                            <h3 className="flex items-center gap-2 text-lg font-bold text-emerald-800">
                                <CheckCircle2 className="h-5 w-5" />
                                対応可能な業務
                            </h3>
                            <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                                {[
                                    "改葬許可申請書類の作成",
                                    "市区町村への申請書提出代行",
                                    "埋蔵証明書の取得サポート",
                                    "複数自治体にまたがる手続きの調整",
                                    "必要書類の確認・チェック",
                                ].map((text) => (
                                    <li key={text} className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-600 shrink-0" />
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* できないこと */}
                        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
                            <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-700">
                                <XCircle className="h-5 w-5" />
                                対応範囲外の業務
                            </h3>
                            <ul className="mt-4 space-y-3 text-sm text-neutral-600">
                                {[
                                    "相続登記（司法書士の業務範囲）",
                                    "墓石の撤去工事",
                                    "遺骨の供養・法要の手配",
                                    "税務相談（税理士の業務範囲）",
                                ].map((text) => (
                                    <li key={text} className="flex items-start gap-2">
                                        <XCircle className="h-4 w-4 mt-0.5 text-neutral-400 shrink-0" />
                                        {text}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs text-neutral-500">
                                ※ 上記は
                                <Link href="/flow" className="underline hover:text-emerald-700">
                                    お墓じまいの流れ
                                </Link>
                                で対応可能です。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== 料金目安（Doc-05 §3-5） ===== */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container max-w-4xl px-4">
                    <h2 className="text-2xl font-bold text-center text-neutral-900 sm:text-3xl">
                        料金の目安
                    </h2>
                    <p className="mt-4 text-center text-sm text-neutral-600">
                        ※ 料金は行政書士ごとに異なります。最終的な報酬は各行政書士と直接ご確認ください。
                    </p>
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="rounded-xl bg-white border p-6 text-center">
                            <FileText className="h-8 w-8 mx-auto text-emerald-600" />
                            <h3 className="mt-3 font-bold text-neutral-900">書類作成のみ</h3>
                            <p className="mt-2 text-2xl font-bold text-emerald-700">3万円〜</p>
                            <p className="mt-1 text-xs text-neutral-500">改葬許可申請書類の作成</p>
                        </div>
                        <div className="rounded-xl bg-white border-2 border-emerald-300 p-6 text-center shadow-sm">
                            <Scale className="h-8 w-8 mx-auto text-emerald-600" />
                            <h3 className="mt-3 font-bold text-neutral-900">申請代行</h3>
                            <p className="mt-2 text-2xl font-bold text-emerald-700">5万円〜</p>
                            <p className="mt-1 text-xs text-neutral-500">書類作成 + 提出代行</p>
                        </div>
                        <div className="rounded-xl bg-white border p-6 text-center">
                            <HelpCircle className="h-8 w-8 mx-auto text-emerald-600" />
                            <h3 className="mt-3 font-bold text-neutral-900">複雑ケース</h3>
                            <p className="mt-2 text-2xl font-bold text-emerald-700">8万円〜</p>
                            <p className="mt-1 text-xs text-neutral-500">複数自治体・特殊ケース</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== 行政書士一覧（Doc-05 §3-4） ===== */}
            <section className="py-16 md:py-20 bg-slate-50">
                <div className="container max-w-5xl px-4">
                    <h2 className="text-2xl font-bold text-center text-neutral-900 sm:text-3xl">
                        行政書士一覧
                    </h2>
                    <p className="mt-3 text-center text-sm text-neutral-600">
                        改葬許可申請に対応可能な行政書士をご案内しています。
                    </p>

                    {scriveners.length > 0 ? (
                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {scriveners.map((s) => (
                                <ScrivenerCard key={s.id} scrivener={s} />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-10 rounded-xl border-2 border-dashed border-neutral-200 p-12 text-center">
                            <p className="text-neutral-500">
                                現在、掲載準備中です。お急ぎの方は下記フォームよりご相談ください。
                            </p>
                        </div>
                    )}

                    {/* Doc-11 §3-1: 広告明示（Doc-05 §3-5 免責含む） */}
                    <p className="mt-6 text-center text-xs text-neutral-400">
                        掲載順はプランにより決定されます。本ページは行政書士の広告掲載ページです。当社は行政書士業務の受任・仲介を行いません。
                    </p>
                </div>
            </section>

            {/* ===== FAQ（Doc-05 §3-6） ===== */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container max-w-3xl px-4">
                    <h2 className="text-2xl font-bold text-center text-neutral-900 sm:text-3xl">
                        よくある質問
                    </h2>
                    <div className="mt-10 space-y-4">
                        {faqItems.map((item, i) => (
                            <details key={i} className="group rounded-xl border bg-white">
                                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden">
                                    <span className="flex items-center gap-3">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                                            Q
                                        </span>
                                        {item.question}
                                    </span>
                                    <span className="ml-4 shrink-0 text-neutral-400 transition-transform group-open:rotate-180">
                                        ▼
                                    </span>
                                </summary>
                                <div className="border-t px-6 py-4 text-sm leading-relaxed text-neutral-700">
                                    {item.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 相談フォーム（Doc-05 §3-7） ===== */}
            <section id="contact-form" className="py-16 md:py-20 bg-slate-50 scroll-mt-20">
                <div className="container max-w-3xl px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                            無料相談フォーム
                        </h2>
                        <p className="mt-4 text-sm text-neutral-600 max-w-lg mx-auto">
                            改葬許可申請についてのご相談を受け付けています。
                            内容を確認の上、2営業日以内にご連絡いたします。
                        </p>
                        <p className="mt-2 text-xs text-neutral-500">
                            ※ 本フォームは行政書士への直接依頼ではなく、相談の受付です。
                            契約は利用者と行政書士の間で直接成立します。
                        </p>
                    </div>
                    <div className="bg-white p-6 md:p-10 rounded-lg shadow-sm border">
                        <GyoseishoshiInquiryForm />
                    </div>
                </div>
            </section>
        </>
    )
}
