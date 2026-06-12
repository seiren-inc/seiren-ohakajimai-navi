/**
 * (site) 配下全ルート共通の Suspense フォールバック（M-5）。
 * Header / Footer は (site)/layout.tsx 側に残るため、コンテンツ領域のみ
 * スケルトン表示になる。ISR キャッシュミス（新規公開の自治体ページ等）や
 * 動的ルートへの遷移時に即時フィードバックを返す。
 * サーバーコンポーネント・クライアントJSゼロを維持すること。
 */
export default function Loading(): React.ReactElement {
    return (
        <div
            className="mx-auto w-full max-w-5xl min-h-[50vh] px-4 py-16"
            aria-busy="true"
            aria-live="polite"
        >
            <div className="animate-pulse space-y-8">
                {/* タイトル帯 */}
                <div className="space-y-3">
                    <div className="h-4 w-24 rounded bg-neutral-200" />
                    <div className="h-8 w-2/3 rounded bg-neutral-200" />
                    <div className="h-4 w-1/2 rounded bg-neutral-100" />
                </div>
                {/* 本文ブロック */}
                <div className="space-y-3">
                    <div className="h-4 w-full rounded bg-neutral-100" />
                    <div className="h-4 w-11/12 rounded bg-neutral-100" />
                    <div className="h-4 w-4/5 rounded bg-neutral-100" />
                </div>
                {/* カード列 */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="h-32 rounded-2xl bg-neutral-100" />
                    <div className="h-32 rounded-2xl bg-neutral-100" />
                </div>
            </div>
            <span className="sr-only">読み込み中…</span>
        </div>
    )
}
