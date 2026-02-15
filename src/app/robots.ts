import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.osohiki-navi.jp'
    const isProduction = process.env.VERCEL_ENV === 'production'

    return {
        rules: isProduction
            ? {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            }
            : {
                userAgent: '*',
                disallow: ['/'],
            },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
