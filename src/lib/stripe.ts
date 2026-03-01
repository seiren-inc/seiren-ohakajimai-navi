import Stripe from "stripe"

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
    if (!_stripe) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is not set")
        }
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: "2026-02-25.clover",
            typescript: true,
        })
    }
    return _stripe
}

// 後方互換エクスポート（既存コードで stripe. として使えるように）
export const stripe = {
    customers: { create: (...args: Parameters<Stripe["customers"]["create"]>) => getStripe().customers.create(...args) },
    checkout: { sessions: { create: (...args: Parameters<Stripe["checkout"]["sessions"]["create"]>) => getStripe().checkout.sessions.create(...args) } },
    subscriptions: { retrieve: (...args: Parameters<Stripe["subscriptions"]["retrieve"]>) => getStripe().subscriptions.retrieve(...args) },
    webhooks: { constructEvent: (...args: Parameters<Stripe["webhooks"]["constructEvent"]>) => getStripe().webhooks.constructEvent(...args) },
}

// Doc-35: プランティア別 Stripe Price ID
export const STRIPE_PRICE_IDS: Record<string, string | undefined> = {
    BASIC:    process.env.STRIPE_PRICE_ID_BASIC,
    STANDARD: process.env.STRIPE_PRICE_ID_STANDARD,
    PREMIUM:  process.env.STRIPE_PRICE_ID_PREMIUM,
}
