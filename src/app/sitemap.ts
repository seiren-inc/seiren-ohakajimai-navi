import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.osohiki-navi.jp'

    // 固定ページの定義
    const staticRoutes = [
        '',
        '/about',
        '/flow',
        '/price',
        '/kaissou',
        '/company',
        '/privacy',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }))

    // TODO: Phase 4で自治体データをDBから取得して追加
    // const municipalities = await prisma.municipality.findMany(...)

    return [
        ...staticRoutes,
        // ...dynamicRoutes
    ]
}
