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

/**
 * 後方互換性および簡易的なアクセスのためのプロキシオブジェクト
 */
export const stripe = {
    customers: {
        create: (params: Stripe.CustomerCreateParams) => getStripe().customers.create(params),
    },
    checkout: {
        sessions: {
            create: (params: Stripe.Checkout.SessionCreateParams) => getStripe().checkout.sessions.create(params),
        },
    },
    subscriptions: {
        retrieve: (id: string) => getStripe().subscriptions.retrieve(id),
    },
    webhooks: {
        constructEvent: (payload: string, header: string, secret: string) =>
            getStripe().webhooks.constructEvent(payload, header, secret),
    },
}

// Doc-35: プランティア別 Stripe Price ID
export const STRIPE_PRICE_IDS: Record<string, string | undefined> = {
    BASIC:    process.env.STRIPE_PRICE_ID_BASIC,
    STANDARD: process.env.STRIPE_PRICE_ID_STANDARD,
    PREMIUM:  process.env.STRIPE_PRICE_ID_PREMIUM,
}
