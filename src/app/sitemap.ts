import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.ohakajimai-navi.jp'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 静的ページ（優先度・更新頻度を明示）
    // lastModified は意図的に省略 — ビルドごとに now を刻むと全URLが「毎日更新」に見え、
    // lastmod 全体の信頼性が下がる（Google は不正確な lastmod を無視するようになる）
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
        { url: `${BASE_URL}/contact`,      priority: 0.7, changeFrequency: 'monthly' as const },
        { url: `${BASE_URL}/estimation`,  priority: 0.7, changeFrequency: 'monthly' as const },
        { url: `${BASE_URL}/tokutei`,     priority: 0.4, changeFrequency: 'yearly'  as const },
        { url: `${BASE_URL}/privacy`,     priority: 0.4, changeFrequency: 'yearly'  as const },
    ]

    // 都道府県ハブの lastmod = 配下自治体の最新 updatedAt（実データ由来の日付）
    let prefectureLastmod = new Map<string, Date>()
    try {
        const groups = await prisma.municipality.groupBy({
            by: ['prefectureSlug'],
            where: { isPublished: true },
            _max: { updatedAt: true },
        })
        prefectureLastmod = new Map(
            groups.flatMap((g) => (g._max.updatedAt ? [[g.prefectureSlug, g._max.updatedAt] as const] : []))
        )
    } catch {
        // DB接続エラー時は lastmod なしで続行
    }

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

    const prefectureRoutes: MetadataRoute.Sitemap = prefectures.map((pref) => {
        const lastModified = prefectureLastmod.get(pref)
        return {
            url: `${BASE_URL}/kaissou/${pref}`,
            ...(lastModified ? { lastModified } : {}),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }
    })

    // 行政書士詳細ページ（承認済み・支払済みのみ）
    let scrivenerRoutes: MetadataRoute.Sitemap = []
    try {
        const scriveners = await prisma.administrativeScrivener.findMany({
            where: { isApproved: true, isActive: true, paymentStatus: 'PAID' },
            select: { id: true, updatedAt: true },
        })
        scrivenerRoutes = scriveners.map((s) => ({
            url: `${BASE_URL}/gyoseishoshi/${s.id}`,
            lastModified: s.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))
    } catch {
        // DB接続エラー時はスキップ
    }

    let municipalityRoutes: MetadataRoute.Sitemap = []
    try {
        const municipalities = await prisma.municipality.findMany({
            where: { isPublished: true },
            select: { prefectureSlug: true, municipalitySlug: true, updatedAt: true },
        })
        municipalityRoutes = municipalities.map((m) => ({
            url: `${BASE_URL}/kaissou/${m.prefectureSlug}/${m.municipalitySlug}`,
            lastModified: m.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.55,
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

    return [
        ...staticRoutes,
        ...prefectureRoutes,
        ...municipalityRoutes,
        ...scrivenerRoutes,
        ...getGyoseishoshiPrefRoutes(BASE_URL),
        ...blogRoutes,
    ]
}

function getGyoseishoshiPrefRoutes(baseUrl: string): MetadataRoute.Sitemap {
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
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))
}

