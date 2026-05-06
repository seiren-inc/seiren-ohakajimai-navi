import Link from "next/link"
import { ExternalLink } from "lucide-react"
import {
    type EcosystemNextStepsContext,
    ECOSYSTEM_NEXT_STEPS_BY_CONTEXT,
} from "@/config/seiren-ecosystem"

type Props = {
    context: EcosystemNextStepsContext
}

function isExternalHref(href: string): boolean {
    return href.startsWith("http://") || href.startsWith("https://")
}

export function SeirenEcosystemNextSteps({ context }: Props) {
    const cards = ECOSYSTEM_NEXT_STEPS_BY_CONTEXT[context]

    return (
        <aside
            className="rounded-2xl border bg-muted/40 px-5 py-6 md:px-8 md:py-8"
            data-ecosystem-block="next-steps"
            data-ecosystem-context={context}
        >
            <h3 className="text-base font-bold text-foreground md:text-lg">
                このあとのステップ・関連サービス（清蓮グループ）
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground md:text-sm">
                行政・公的な手続き情報と、運営グループによる支援サービスの案内は異なります。
                下記リンクのうち別ドメインへ移動するものは、新しいタブで開きます。
            </p>
            <ul className="mt-5 space-y-3">
                {cards.map((card) => {
                    const external = isExternalHref(card.href)
                    return (
                        <li key={card.id}>
                            {external ? (
                                <a
                                    href={card.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-ecosystem-link={card.id}
                                    data-ecosystem-from={context}
                                    className="flex items-start gap-3 rounded-xl border border-border/80 bg-background px-4 py-3 text-sm shadow-sm transition-colors hover:bg-muted/60"
                                >
                                    <ExternalLink
                                        className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                                        aria-hidden
                                    />
                                    <span>
                                        <span className="font-semibold text-foreground">{card.title}</span>
                                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                                            {card.description}
                                        </span>
                                    </span>
                                </a>
                            ) : (
                                <Link
                                    href={card.href}
                                    data-ecosystem-link={card.id}
                                    data-ecosystem-from={context}
                                    className="flex items-start gap-3 rounded-xl border border-border/80 bg-background px-4 py-3 text-sm shadow-sm transition-colors hover:bg-muted/60"
                                >
                                    <span className="mt-0.5 font-mono text-xs text-muted-foreground" aria-hidden>
                                        →
                                    </span>
                                    <span>
                                        <span className="font-semibold text-foreground">{card.title}</span>
                                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                                            {card.description}
                                        </span>
                                    </span>
                                </Link>
                            )}
                        </li>
                    )
                })}
            </ul>
        </aside>
    )
}
