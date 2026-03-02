import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`[STRIPE_WEBHOOK_ERROR] Signature verification failed: ${err.message}`)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const session = event.data.object as any

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as any
        const status = subscription.status
        
        // PaymentStatus のマッピング
        let paymentStatus: "PAID" | "SUSPENDED" | "UNPAID" = "SUSPENDED"
        if (status === "active" || status === "trialing") {
          paymentStatus = "PAID"
        } else if (status === "past_due" || status === "unpaid") {
          paymentStatus = "SUSPENDED"
        } else {
          paymentStatus = "UNPAID"
        }

        await prisma.administrativeScrivener.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            paymentStatus,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await prisma.administrativeScrivener.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            paymentStatus: "UNPAID",
          },
        })
        break
      }

      case "invoice.payment_failed": {
        // 支払い失敗時の通知や追加処理が必要な場合はここに記述
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[STRIPE_WEBHOOK_HANDLER_ERROR]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
