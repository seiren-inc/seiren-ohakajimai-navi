type Props = {
    /** 例: 東京都 渋谷区 */
    localityLabel: string
    updatedAt: Date
    /** 自治体公式案内・申請書ページ（一次情報） */
    officialUrl: string | null
}

function formatJaDate(d: Date): string {
    try {
        return new Intl.DateTimeFormat("ja-JP", {
            dateStyle: "medium",
            timeZone: "Asia/Tokyo",
        }).format(d)
    } catch {
        return d.toISOString().slice(0, 10)
    }
}

/** 市区町村ページ用：一次情報・当サイトDB最終更新の明示（E-E-A-T） */
export function ContentProvenance({ localityLabel, updatedAt, officialUrl }: Props) {
    const dateStr = formatJaDate(updatedAt)

    return (
        <aside
            className="rounded-xl border border-border/80 bg-muted/30 px-4 py-5 text-sm md:px-6"
            aria-label="情報の出典と更新"
        >
            <h3 className="font-semibold text-foreground">情報の出典と更新</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground md:text-sm">
                手続きは自治体により異なります。必ず公式の案内をご確認ください。
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-muted-foreground md:text-sm">
                <li>当サイトの自治体データ最終更新（DB）: {dateStr}</li>
                {officialUrl ? (
                    <li>
                        一次情報（{localityLabel}の公式案内）:{" "}
                        <a
                            href={officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary underline underline-offset-2"
                        >
                            公式ページを開く
                        </a>
                    </li>
                ) : (
                    <li>一次情報URL: 未取得のため窓口・電話でご確認ください。</li>
                )}
            </ul>
        </aside>
    )
}
