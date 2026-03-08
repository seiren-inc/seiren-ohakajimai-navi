/**
 * WebSite + SearchAction JSON-LD
 * Googleのサイトリンク検索ボックス対応とAI検索エンジン向けサイト情報を提供する
 */
export function WebSiteJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://www.ohakajimai-navi.jp/#website",
        name: "お墓じまいナビ",
        url: "https://www.ohakajimai-navi.jp",
        description: "お墓じまい・改葬・海洋散骨の費用・手順・地域別手続き方法を解説するナビゲーションサイト。都道府県・市区町村別の改葬許可情報や行政書士の紹介も。",
        publisher: {
            "@id": "https://www.ohakajimai-navi.jp/#organization",
        },
        inLanguage: "ja",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: "https://www.ohakajimai-navi.jp/kaissou?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
