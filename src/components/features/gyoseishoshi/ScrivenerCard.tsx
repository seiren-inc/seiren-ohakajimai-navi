import Link from "next/link"
import { MapPin, Globe, MessageCircle } from "lucide-react"
import type { PublicScrivener } from "@/lib/scrivener-types"

type Props = {
    scrivener: PublicScrivener
}

const planBadge: Record<string, { label: string; className: string }> = {
    PREMIUM: { label: "プレミアム", className: "bg-amber-100 text-amber-800 border-amber-300" },
    STANDARD: { label: "スタンダード", className: "bg-emerald-100 text-emerald-800 border-emerald-300" },
    BASIC: { label: "", className: "" },
}

/**
 * 行政書士カード（公開ページ用）
 * Doc-08 §8: phone/email/registrationNumber は表示しない
 * Doc-05 §3-4: 相談ボタン付き
 */
export function ScrivenerCard({ scrivener }: Props) {
    const badge = planBadge[scrivener.planType] || planBadge.BASIC

    return (
        <div className={`rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
            scrivener.planType === "PREMIUM" ? "border-amber-200 ring-1 ring-amber-100" :
            scrivener.planType === "STANDARD" ? "border-emerald-100" : ""
        }`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-neutral-900 truncate">
                            <Link href={`/gyoseishoshi/${scrivener.id}`} className="hover:text-emerald-700 transition-colors">
                                {scrivener.officeName}
                            </Link>
                        </h3>
                        {badge.label && (
                            <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}>
                                {badge.label}
                            </span>
                        )}
                    </div>
                    {scrivener.representativeName && (
                        <p className="mt-1 text-sm text-neutral-500">
                            代表: {scrivener.representativeName}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-600">
                <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-neutral-400" />
                    {scrivener.prefecture}{scrivener.city && ` ${scrivener.city}`}
                </span>
                {scrivener.websiteUrl && (
                    <a href={scrivener.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors">
                        <Globe className="h-4 w-4 text-neutral-400" />
                        ウェブサイト
                    </a>
                )}
            </div>

            {scrivener.profileText && (
                <p className="mt-4 text-sm leading-relaxed text-neutral-700 line-clamp-3">
                    {scrivener.profileText}
                </p>
            )}

            {scrivener.specialties.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {scrivener.specialties.map((tag: string) => (
                        <span key={tag} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {scrivener.priceRangeText && (
                <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold text-neutral-500">料金目安</p>
                    <p className="mt-0.5 text-sm font-medium text-neutral-800">{scrivener.priceRangeText}</p>
                </div>
            )}

            {/* Doc-05 §3-4: 相談ボタン + 詳細リンク */}
            <div className="mt-5 flex gap-3">
                <a
                    href="#contact-form"
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors flex-1 justify-center"
                >
                    <MessageCircle className="h-4 w-4" />
                    相談する
                </a>
                <Link
                    href={`/gyoseishoshi/${scrivener.id}`}
                    className="inline-flex items-center rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                    詳細
                </Link>
            </div>
        </div>
    )
}
