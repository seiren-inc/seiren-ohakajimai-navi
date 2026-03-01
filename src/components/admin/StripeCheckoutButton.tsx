"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, Loader2, Copy, CheckCheck } from "lucide-react"

interface Props {
    scrivenerId: string
    disabled?: boolean
}

/**
 * Stripe Checkout URLを発行してコピーするボタン
 * 管理画面の行政書士詳細ページに配置
 */
export function StripeCheckoutButton({ scrivenerId, disabled }: Props) {
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGenerate = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scrivenerId }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "エラーが発生しました")
            setUrl(data.url)
        } catch (e) {
            setError(e instanceof Error ? e.message : "エラーが発生しました")
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = async () => {
        if (!url) return
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex flex-col gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={loading || disabled}
                className="w-fit"
            >
                {loading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />発行中...</>
                ) : (
                    <><ExternalLink className="h-4 w-4 mr-2" />決済リンク発行</>
                )}
            </Button>

            {url && (
                <div className="flex items-center gap-2 rounded-md border bg-slate-50 px-3 py-2 text-xs">
                    <span className="truncate max-w-[300px] text-slate-700">{url}</span>
                    <Button size="sm" variant="ghost" className="h-6 px-2 shrink-0" onClick={handleCopy}>
                        {copied ? (
                            <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                            <Copy className="h-3.5 w-3.5" />
                        )}
                    </Button>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="ghost" className="h-6 px-2 shrink-0">
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                    </a>
                </div>
            )}

            {error && (
                <p className="text-xs text-red-500">{error}</p>
            )}
        </div>
    )
}
