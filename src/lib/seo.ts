import { Metadata } from 'next'

export const siteConfig = {
    name: 'お墓じまいナビ',
    description: '全国対応の改葬手続き代行から墓石撤去、遺骨供養までワンストップでサポート。',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.osohiki-navi.jp',
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
    icons = '/favicon.ico',
    noIndex = false,
}: {
    title?: string
    description?: string
    image?: string
    icons?: string
    noIndex?: boolean
} = {}): Metadata {
    const absoluteImageUrl = new URL(image, siteConfig.url).toString()

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
            url: siteConfig.url,
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
        icons,
        metadataBase: new URL(siteConfig.url),
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    }
}
