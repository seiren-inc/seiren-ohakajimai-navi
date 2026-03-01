import { NextRequest, NextResponse } from "next/server"
import { getStripe, STRIPE_PRICE_IDS } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://seiren-ohakajimai-navi.vercel.app"

/**
 * POST /api/stripe/checkout
 * 管理画面から行政書士向けの決済リンクを発行する
 * Body: { scrivenerId: string }
 */
export async function POST(req: NextRequest) {
    try {
        const { scrivenerId } = await req.json()
        if (!scrivenerId) {
            return NextResponse.json({ error: "scrivenerId is required" }, { status: 400 })
        }

        const scrivener = await db.administrativeScrivener.findUnique({
            where: { id: scrivenerId },
            select: {
                id: true,
                officeName: true,
                email: true,
                planType: true,
                stripeCustomerId: true,
            },
        })

        if (!scrivener) {
            return NextResponse.json({ error: "Scrivener not found" }, { status: 404 })
        }

        const priceId = STRIPE_PRICE_IDS[scrivener.planType]
        if (!priceId) {
            return NextResponse.json(
                { error: `STRIPE_PRICE_ID_${scrivener.planType} is not configured` },
                { status: 500 }
            )
        }

        // 既存のStripe Customerを再利用 or 新規作成
        let customerId = scrivener.stripeCustomerId
        if (!customerId) {
            const customer = await getStripe().customers.create({
                email: scrivener.email ?? undefined,
                name: scrivener.officeName,
                metadata: { scrivenerId: scrivener.id },
            })
            customerId = customer.id
            await db.administrativeScrivener.update({
                where: { id: scrivenerId },
                data: { stripeCustomerId: customerId },
            })
        }

        // Checkout Session 生成（サブスクリプション）
        const session = await getStripe().checkout.sessions.create({
            mode: "subscription",
            customer: customerId,
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${BASE_URL}/admin/gyoseishoshi/${scrivenerId}?payment=success`,
            cancel_url: `${BASE_URL}/admin/gyoseishoshi/${scrivenerId}?payment=cancelled`,
            metadata: { scrivenerId: scrivener.id },
            locale: "ja",
        })

        return NextResponse.json({ url: session.url })
    } catch (err) {
        console.error("[stripe/checkout]", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
