import { Metadata } from 'next'

export const siteConfig = {
    name: 'お墓じまいナビ',
    description: '全国対応の改葬手続き代行から墓石撤去、遺骨供養までワンストップでサポート。',
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
