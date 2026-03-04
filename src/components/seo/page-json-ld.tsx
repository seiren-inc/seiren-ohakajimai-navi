/**
 * WebSite JSON-LD with Sitelinks SearchBox
 * https://schema.org/WebSite
 */
export function WebSiteJsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://www.ohakajimai-navi.jp/#website',
        name: 'お墓じまいナビ',
        alternateName: 'お墓じまいナビ by 清蓮',
        url: 'https://www.ohakajimai-navi.jp',
        description: '全国対応の改葬手続き代行から墓石撤去、遺骨供養までワンストップでサポート。改葬許可申請書ダウンロード・行政書士紹介も無料で対応。',
        inLanguage: 'ja-JP',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://www.ohakajimai-navi.jp/kaisoukyoka?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
        },
        publisher: {
            '@id': 'https://www.ohakajimai-navi.jp/#organization',
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}

/**
 * Article JSON-LD — 解説記事・ガイドページ用
 * https://schema.org/Article
 */
interface ArticleJsonLdProps {
    headline: string
    description: string
    url: string
    datePublished?: string
    dateModified?: string
    imagePath?: string
}

export function ArticleJsonLd({
    headline,
    description,
    url,
    datePublished = '2024-01-01',
    dateModified,
    imagePath = '/og-image.jpg',
}: ArticleJsonLdProps) {
    const BASE = 'https://www.ohakajimai-navi.jp'
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline,
        description,
        url: url.startsWith('http') ? url : `${BASE}${url}`,
        image: imagePath.startsWith('http') ? imagePath : `${BASE}${imagePath}`,
        datePublished,
        dateModified: dateModified ?? datePublished,
        inLanguage: 'ja-JP',
        author: {
            '@type': 'Organization',
            '@id': `${BASE}/#organization`,
            name: '株式会社清蓮',
        },
        publisher: {
            '@id': `${BASE}/#organization`,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url.startsWith('http') ? url : `${BASE}${url}`,
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}

/**
 * Service JSON-LD — サービスページ用
 * https://schema.org/Service
 */
interface ServiceJsonLdProps {
    name: string
    description: string
    url: string
    serviceType?: string
    areaServed?: string
}

export function ServiceJsonLd({
    name,
    description,
    url,
    serviceType = 'お墓じまい・改葬サポート',
    areaServed = '日本全国',
}: ServiceJsonLdProps) {
    const BASE = 'https://www.ohakajimai-navi.jp'
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name,
        description,
        url: url.startsWith('http') ? url : `${BASE}${url}`,
        image: `${BASE}/og-image.jpg`,
        serviceType,
        areaServed,
        provider: {
            '@id': `${BASE}/#organization`,
        },
        availableChannel: {
            '@type': 'ServiceChannel',
            serviceUrl: `${BASE}/contact`,
            servicePhone: '045-881-9952',
        },
        address: {
            '@type': 'PostalAddress',
            streetAddress: '戸塚町4170 高橋ビル1階',
            addressLocality: '横浜市戸塚区',
            addressRegion: '神奈川県',
            postalCode: '244-0003',
            addressCountry: 'JP',
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
