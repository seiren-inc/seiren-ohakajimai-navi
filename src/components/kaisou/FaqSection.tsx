import type { ReactElement } from "react"

type FaqItem = {
    question: string
    answer: string
}

type FaqSectionProps = {
    faqs: FaqItem[]
    title?: string
}

// FAQPage JSON-LD（FaqJsonLd）と同一データを可視コンテンツとして表示する。
// 構造化データはページ上に表示されている内容と一致している必要がある（Google ガイドライン）。
export function FaqSection({ faqs, title = "よくある質問" }: FaqSectionProps): ReactElement | null {
    if (faqs.length === 0) return null

    return (
        <section className="mt-16 pt-10 border-t">
            <h2 className="text-lg font-bold md:text-xl">{title}</h2>
            <dl className="mt-6 space-y-4">
                {faqs.map((faq) => (
                    <div key={faq.question} className="rounded-lg bg-slate-50 p-5">
                        <dt className="font-bold leading-relaxed">{faq.question}</dt>
                        <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</dd>
                    </div>
                ))}
            </dl>
        </section>
    )
}
