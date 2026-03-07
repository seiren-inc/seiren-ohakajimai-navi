import { Metadata } from 'next'

export const siteConfig = {
    name: 'お墓じまいナビ',
    description: 'お墓じまい（墓じまい・改葬）の専門会社「株式会社清蓮」が運営する情報サイト。墓石撤去・改葬許可申請・遺骨のケア・海洋散骨を全国対応でワンストップサポート。改葬手続きの説明・行政書士紹介・料金シミュレーション・改葬許可申請書ダウンロードなど、お墓じまいに関わる情報を絡網的に提供。迷ったらまずここへ。視蔽料調査・お見積りは無料。',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.ohakajimai-navi.jp',
    ogImage: '/og-image.jpg',
    links: {
        twitter: 'https://twitter.com/seiren_official',
    },
}

export type SiteConfig = typeof siteConfig

export function constructMetadata({
    title = siteConfig.name,
    description = siteConfig.description,
    image = siteConfig.ogImage,
    icons = undefined,
    noIndex = false,
    path,
}: {
    title?: string
    description?: string
    image?: string
    icons?: string
    noIndex?: boolean
    /** ページのパス（例: '/about'）。指定するとcanonical URLが設定される */
    path?: string
} = {}): Metadata {
    const absoluteImageUrl = new URL(image, siteConfig.url).toString()
    const canonicalUrl = path
        ? new URL(path, siteConfig.url).toString()
        : undefined

    return {
        title: {
            default: title,
            template: `%s | ${siteConfig.name}`,
        },
        description,
        openGraph: {
            title: {
                default: title,
                template: `%s | ${siteConfig.name}`,
            },
            description,
            images: [
                {
                    url: absoluteImageUrl,
                },
            ],
            url: canonicalUrl ?? siteConfig.url,
            siteName: siteConfig.name,
            locale: 'ja_JP',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: {
                default: title,
                template: `%s | ${siteConfig.name}`,
            },
            description,
            images: [absoluteImageUrl],
        },
        ...(icons ? { icons } : {}),
        verification: {
            google: 'google-site-verification=_P2nElnAz-2wkA-U0R3BXPd1f9nICnmoPv3O1nx1agk',
        },
        metadataBase: new URL(siteConfig.url),
        ...(canonicalUrl && {
            alternates: {
                canonical: canonicalUrl,
            },
        }),
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    }
}
