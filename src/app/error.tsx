"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">Error</p>
      <h1 className="mt-4 text-2xl font-bold text-neutral-900 md:text-3xl">
        エラーが発生しました
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
        申し訳ございません。一時的な問題が発生しています。
        しばらくしてから再度お試しいただくか、お問い合わせください。
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          もう一度試す
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          トップページへ
        </Link>
      </div>
    </div>
  )
}
