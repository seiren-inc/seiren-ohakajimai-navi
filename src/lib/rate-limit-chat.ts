import { headers } from 'next/headers'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

/**
 * T7-06: チャットUIのためのIPベースのレート制限
 * Redisが未設定の場合はインメモリオブジェクトでフォールバックしてローカル開発を止めない
 */
export async function getChatRateLimit() {
    const ip = (await headers()).get('x-forwarded-for') ?? 'anonymous'
    
    // Upstash Redisが設定されている場合のみ適用（本番用）
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        })
        
        // 1分間に5回まで
        const ratelimit = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(5, "1 m"),
            analytics: true,
        })
        
        const { success, limit, remaining, reset } = await ratelimit.limit(`chat_ratelimit_${ip}`)
        return { success, limit, remaining, reset, ip }
    }
    
    // Redis未設定時は常に許可 (開発用フォールバック)
    return { success: true, limit: 100, remaining: 99, reset: 0, ip }
}
