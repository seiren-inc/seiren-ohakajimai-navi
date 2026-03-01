import { NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any

/**
 * POST /api/stripe/webhook
 * Stripe Webhook受信エンドポイント
 * - checkout.session.completed → paymentStatus = PAID
 * - customer.subscription.deleted → paymentStatus = SUSPENDED
 */
export async function POST(req: NextRequest) {
    const body = await req.text()
    const sig = req.headers.get("stripe-signature")

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 })
    }

    let event
    try {
        event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
        console.error("[webhook] Signature verification failed:", err)
        return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object
                const scrivenerId = session.metadata?.scrivenerId
                if (!scrivenerId) break

                const subscriptionId = session.subscription as string | null

                // サブスクリプション期間取得
                let currentPeriodEnd: Date | undefined
                if (subscriptionId) {
                    const sub = await getStripe().subscriptions.retrieve(subscriptionId)
                    currentPeriodEnd = new Date((sub as any).current_period_end * 1000)
                }

                await db.administrativeScrivener.update({
                    where: { id: scrivenerId },
                    data: {
                        paymentStatus: "PAID",
                        contractStartDate: new Date(),
                        stripeSubscriptionId: subscriptionId ?? undefined,
                        currentPeriodEnd: currentPeriodEnd,
                    },
                })

                // 監査ログ記録
                await db.scrivenerAuditLog.create({
                    data: {
                        scrivenerId,
                        actionType: "PAYMENT_UPDATE",
                        afterValue: { paymentStatus: "PAID", stripeSubscriptionId: subscriptionId },
                        adminUserId: "stripe-webhook",
                    },
                })
                break
            }

            case "customer.subscription.deleted": {
                const sub = event.data.object
                const subscriptionId = sub.id

                const scrivener = await db.administrativeScrivener.findFirst({
                    where: { stripeSubscriptionId: subscriptionId },
                    select: { id: true },
                })
                if (!scrivener) break

                await db.administrativeScrivener.update({
                    where: { id: scrivener.id },
                    data: {
                        paymentStatus: "SUSPENDED",
                        contractEndDate: new Date(),
                    },
                })

                await db.scrivenerAuditLog.create({
                    data: {
                        scrivenerId: scrivener.id,
                        actionType: "PAYMENT_UPDATE",
                        afterValue: { paymentStatus: "SUSPENDED" },
                        adminUserId: "stripe-webhook",
                    },
                })
                break
            }

            default:
                // 未対象イベントは無視
                break
        }
    } catch (err) {
        console.error("[webhook] Handler error:", err)
        return NextResponse.json({ error: "Handler error" }, { status: 500 })
    }

    return NextResponse.json({ received: true })
}
