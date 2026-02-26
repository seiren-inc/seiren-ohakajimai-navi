import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.osohiki-navi.jp'

    return {
        rules: [
            // 一般クローラー
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
            // Bingbot（ChatGPT Atlas が参照）
            {
                userAgent: 'Bingbot',
                allow: '/',
            },
            // GPTBot（ChatGPT のクロール）
            {
                userAgent: 'GPTBot',
                allow: '/',
            },
            // PerplexityBot（Perplexity Comet）
            {
                userAgent: 'PerplexityBot',
                allow: '/',
            },
            // Google-Extended（Gemini AI 学習）
            {
                userAgent: 'Google-Extended',
                allow: '/',
            },
            // ClaudeBot（Claude AI）
            {
                userAgent: 'ClaudeBot',
                allow: '/',
            },
            // Googlebot（通常の検索インデックス）
            {
                userAgent: 'Googlebot',
                allow: '/',
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
