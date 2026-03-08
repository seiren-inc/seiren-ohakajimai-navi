import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.ohakajimai-navi.jp'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date()

    // 静的ページ（優先度・更新頻度を明示）
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/`,            priority: 1.0, changeFrequency: 'weekly'  as const },
        { url: `${BASE_URL}/about`,       priority: 0.9, changeFrequency: 'monthly' as const },
        { url: `${BASE_URL}/flow`,        priority: 0.9, changeFrequency: 'monthly' as const },
        { url: `${BASE_URL}/price`,       priority: 0.8, changeFrequency: 'monthly' as const },
        { url: `${BASE_URL}/kaisoukyoka`, priority: 0.8, changeFrequency: 'weekly'  as const },
        { url: `${BASE_URL}/kaissou`,     priority: 0.8, changeFrequency: 'weekly'  as const },
        { url: `${BASE_URL}/gyoseishoshi`, priority: 0.8, changeFrequency: 'weekly' as const },
        { url: `${BASE_URL}/sankotsu`,     priority: 0.8, changeFrequency: 'monthly' as const },
        { url: `${BASE_URL}/ridanryou`,    priority: 0.7, changeFrequency: 'monthly' as const },
        { url: `${BASE_URL}/kaisougo`,     priority: 0.7, changeFrequency: 'monthly' as const },
        { url: `${BASE_URL}/company`,     priority: 0.7, changeFrequency: 'monthly' as const },
        { url: `${BASE_URL}/column`,      priority: 0.8, changeFrequency: 'weekly'  as const },
        { url: `${BASE_URL}/contact`,     priority: 0.7, changeFrequency: 'monthly' as const },
        { url: `${BASE_URL}/tokutei`,     priority: 0.4, changeFrequency: 'yearly'  as const },
    ].map((r) => ({ ...r, lastModified: now }))

    // 改葬手続き情報の都道府県ページ
    const prefectures = [
        'hokkaido', 'aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima',
        'ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa',
        'niigata', 'toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano',
        'shizuoka', 'aichi', 'gifu', 'mie',
        'shiga', 'kyoto', 'osaka', 'hyogo', 'nara', 'wakayama',
        'tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi',
        'tokushima', 'kagawa', 'ehime', 'kochi',
        'fukuoka', 'saga', 'nagasaki', 'kumamoto', 'oita', 'miyazaki', 'kagoshima', 'okinawa',
    ]

    const prefectureRoutes: MetadataRoute.Sitemap = prefectures.map((pref) => ({
        url: `${BASE_URL}/kaissou/${pref}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    // 行政書士詳細ページ（承認済み・支払済みのみ）
    let scrivenerRoutes: MetadataRoute.Sitemap = []
    try {
        const scriveners = await db.administrativeScrivener.findMany({
            where: { isApproved: true, isActive: true, paymentStatus: 'PAID' },
            select: { id: true, updatedAt: true },
        })
        scrivenerRoutes = scriveners.map((s: { id: string; updatedAt: Date }) => ({
            url: `${BASE_URL}/gyoseishoshi/${s.id}`,
            lastModified: s.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))
    } catch {
        // DB接続エラー時はスキップ
    }

    // ブログ（コラム）の動的ページ
    let blogRoutes: MetadataRoute.Sitemap = []
    try {
        const { getBlogSummaries } = await import('@/lib/blog')
        const blogPosts = getBlogSummaries()
        blogRoutes = blogPosts.map((post) => ({
            url: `${BASE_URL}/column/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }))
    } catch {
        // blog モジュールが利用できない場合はスキップ
    }

    return [...staticRoutes, ...prefectureRoutes, ...scrivenerRoutes, ...getGyoseishoshiPrefRoutes(BASE_URL, now), ...blogRoutes]
}

function getGyoseishoshiPrefRoutes(baseUrl: string, now: Date): MetadataRoute.Sitemap {
    const prefectures = [
        'hokkaido', 'aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima',
        'ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa',
        'niigata', 'toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano',
        'shizuoka', 'aichi', 'gifu', 'mie',
        'shiga', 'kyoto', 'osaka', 'hyogo', 'nara', 'wakayama',
        'tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi',
        'tokushima', 'kagawa', 'ehime', 'kochi',
        'fukuoka', 'saga', 'nagasaki', 'kumamoto', 'oita', 'miyazaki', 'kagoshima', 'okinawa',
    ]
    return prefectures.map((pref) => ({
        url: `${baseUrl}/gyoseishoshi/area/${pref}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))
}

