import { CANONICAL_AUTHOR } from '@/lib/authors'

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
 * Article JSON-LD — コラム記事（BlogPosting）用
 * https://schema.org/BlogPosting
 * 記事ページの唯一の Article 系スキーマ（旧 AuthorJsonLd の E-E-A-T 情報を統合済み）。
 * 著者の既定値は src/lib/authors.ts の CANONICAL_AUTHOR を単一ソースとする。
 */
interface ArticleJsonLdProps {
    headline: string
    description: string
    url: string
    datePublished?: string
    dateModified?: string
    imagePath?: string
    keywords?: string[]
    author?: { name: string; jobTitle?: string }
}

export function ArticleJsonLd({
    headline,
    description,
    url,
    datePublished = '2024-01-01',
    dateModified,
    imagePath = '/og-image.jpg',
    keywords = [],
    author,
}: ArticleJsonLdProps) {
    const BASE = 'https://www.ohakajimai-navi.jp'
    // 既定（CANONICAL_AUTHOR と同一人物）の場合のみ E-E-A-T 詳細を付与し、
    // frontmatter で別著者が指定された場合は本人に確認できる情報のみ出力する
    const isCanonicalAuthor = !author || author.name === CANONICAL_AUTHOR.name
    const authorNode = isCanonicalAuthor
        ? {
            '@type': 'Person',
            name: CANONICAL_AUTHOR.name,
            jobTitle: CANONICAL_AUTHOR.jobTitle,
            description: CANONICAL_AUTHOR.schemaDescription,
            url: CANONICAL_AUTHOR.url,
            sameAs: [...CANONICAL_AUTHOR.sameAs],
            knowsAbout: [...CANONICAL_AUTHOR.knowsAbout],
            worksFor: {
                '@id': `${BASE}/#organization`,
            },
        }
        : {
            '@type': 'Person',
            name: author.name,
            ...(author.jobTitle && { jobTitle: author.jobTitle }),
            worksFor: {
                '@id': `${BASE}/#organization`,
            },
        }
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline,
        description,
        url: url.startsWith('http') ? url : `${BASE}${url}`,
        image: imagePath.startsWith('http') ? imagePath : `${BASE}${imagePath}`,
        datePublished,
        dateModified: dateModified ?? datePublished,
        inLanguage: 'ja-JP',
        ...(keywords.length > 0 && { keywords: keywords.join(', ') }),
        author: authorNode,
        // 監修者（記事下の「執筆・監修」ブロックと対応）
        reviewedBy: {
            '@type': 'Person',
            name: CANONICAL_AUTHOR.name,
            jobTitle: CANONICAL_AUTHOR.jobTitle,
            url: CANONICAL_AUTHOR.url,
        },
        publisher: {
            '@id': `${BASE}/#organization`,
        },
        isPartOf: {
            '@type': 'Blog',
            '@id': `${BASE}/column`,
            name: 'お墓じまいナビ お役立ちコラム',
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url.startsWith('http') ? url : `${BASE}${url}`,
        },
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', 'h2', 'article p:first-of-type'],
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
