'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getStripe, STRIPE_PRICE_IDS } from '@/lib/stripe'
import { ScrivenerPlanType } from '@prisma/client'
import { redirect } from 'next/navigation'

export async function createScrivenerCheckoutSession(prevState: unknown, formData: FormData) {
    const planType = formData.get('planType') as ScrivenerPlanType
    
    if (!planType || !STRIPE_PRICE_IDS[planType]) {
        return { error: '無効なプランが選択されました', success: false }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'ログインが必要です', success: false }
    }

    const scrivener = await prisma.administrativeScrivener.findUnique({
        where: { authUserId: user.id }
    })

    if (!scrivener) {
        return { error: 'アカウント情報が見つかりません', success: false }
    }

    const priceId = STRIPE_PRICE_IDS[planType]
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ohakajimai-navi.jp"
    
    let checkoutUrl: string

    try {
        // Stripe Customerの作成 or 取得
        let customerId = scrivener.stripeCustomerId

        if (!customerId) {
            const customer = await getStripe().customers.create({
                email: user.email,
                name: scrivener.officeName,
                metadata: { scrivenerId: scrivener.id, authUserId: user.id },
            })
            customerId = customer.id
            
            // DBアップデート
            await prisma.administrativeScrivener.update({
                where: { id: scrivener.id },
                data: { stripeCustomerId: customerId, planType: planType }
            })
        }

        // Checkout Session作成
        const session = await getStripe().checkout.sessions.create({
            mode: "subscription",
            customer: customerId,
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${baseUrl}/scrivener/onboarding/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/scrivener/onboarding/plan?cancelled=true`,
            metadata: { scrivenerId: scrivener.id, planType },
            locale: "ja",
            subscription_data: {
                trial_period_days: 14 // 14日間の無料トライアル
            }
        })

        if (!session.url) {
            throw new Error("Stripe URL missing")
        }
        
        checkoutUrl = session.url

    } catch (stripeError) {
        console.error('[createScrivenerCheckoutSession]', stripeError)
        return { error: '決済システムの通信に失敗しました。時間をおいて再試行してください。', success: false }
    }

    redirect(checkoutUrl) // Stripeへリダイレクト
}

export async function createScrivenerPortalSession() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'ログインが必要です', success: false }

    const scrivener = await prisma.administrativeScrivener.findUnique({
        where: { authUserId: user.id },
        select: { stripeCustomerId: true }
    })

    if (!scrivener || !scrivener.stripeCustomerId) {
        return { error: '決済情報が見つかりません', success: false }
    }

    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ohakajimai-navi.jp"
        const session = await getStripe().billingPortal.sessions.create({
            customer: scrivener.stripeCustomerId,
            return_url: `${baseUrl}/scrivener/dashboard`,
        })
        
        if (!session.url) throw new Error('Portal URL missing')
        
        redirect(session.url)
    } catch (error) {
        console.error('[createScrivenerPortalSession]', error)
        return { error: 'カスタマーポータルの作成に失敗しました', success: false }
    }
}
