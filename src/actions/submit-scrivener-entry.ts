'use server'

import { scrivenerEntrySchema } from "@/lib/validations/scrivener-entry"
import { prisma } from "@/lib/prisma"
import { getStripe, STRIPE_PRICE_IDS } from "@/lib/stripe"
import { headers } from "next/headers"
import { sanitizeObject } from "@/lib/sanitize"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@seiren.jp"
const FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS || "system@ohakajimai-navi.jp"
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://seiren-ohakajimai-navi.vercel.app"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any

export type ScrivenerEntryState = {
    success: boolean
    message?: string
    checkoutUrl?: string
    errors?: { [key: string]: string[] }
}

/**
 * 行政書士掲載申込 Server Action
 * 1. バリデーション
 * 2. DBに保存（isApproved=false, paymentStatus=UNPAID）
 * 3. Stripe Checkout URLを発行して返す
 * 4. 管理者へ通知メール送信（非同期・失敗しても続行）
 */
export async function submitScrivenerEntry(
    prevState: ScrivenerEntryState | null,
    formData: FormData
): Promise<ScrivenerEntryState> {
    const rawData: Record<string, unknown> = {}
    formData.forEach((value, key) => {
        rawData[key] = value
    })

    // Honeypot
    if (rawData["confirmEmail"] && rawData["confirmEmail"] !== "") {
        return { success: true, message: "お申し込みを受け付けました。" }
    }

    const sanitized = sanitizeObject(rawData)
    const validated = scrivenerEntrySchema.safeParse(sanitized)

    if (!validated.success) {
        return {
            success: false,
            errors: validated.error.flatten().fieldErrors,
            message: "入力内容に誤りがあります。",
        }
    }

    const { data } = validated
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

    // === DB保存 ===
    let scrivener: { id: string; officeName: string; email: string | null; planType: string }
    try {
        const specialties = data.specialties
            ? data.specialties.split(",").map((s: string) => s.trim()).filter(Boolean)
            : []

        scrivener = await db.administrativeScrivener.create({
            data: {
                officeName: data.officeName,
                representativeName: data.representativeName || null,
                registrationNumber: data.registrationNumber || null,
                prefecture: data.prefecture,
                city: data.city || null,
                email: data.email,
                phone: data.phone,
                websiteUrl: data.websiteUrl || null,
                profileText: data.profileText,
                specialties,
                priceRangeText: data.priceRangeText || null,
                businessHours: data.businessHours || null,
                planType: data.planType,
                priorityScore: 0,
                isApproved: false,
                isActive: true,
                paymentStatus: "UNPAID",
            },
            select: {
                id: true,
                officeName: true,
                email: true,
                planType: true,
            },
        })
    } catch (dbError) {
        console.error("[submitScrivenerEntry] DB保存失敗:", dbError)
        return {
            success: false,
            message: "システムエラーが発生しました。時間をおいて再度お試しください。",
        }
    }

    // 監査ログ記録
    try {
        await db.scrivenerAuditLog.create({
            data: {
                scrivenerId: scrivener.id,
                actionType: "CREATE",
                beforeValue: null,
                afterValue: { source: "web-entry", planType: data.planType },
                adminUserId: `ip:${ip}`,
            },
        })
    } catch {
        // 監査ログ失敗は継続
    }

    // === Stripe Checkout URL発行 ===
    const priceId = STRIPE_PRICE_IDS[scrivener.planType]
    if (!priceId) {
        console.error(`[submitScrivenerEntry] STRIPE_PRICE_ID_${scrivener.planType} が未設定`)
        // 価格ID未設定の場合もDB保存は成功扱い（管理者がフォロー）
        void sendAdminNotification(scrivener, data.email, true)
        return {
            success: true,
            message: "お申し込みを受け付けました。担当者よりご連絡いたします。",
        }
    }

    let checkoutUrl: string
    try {
        // Stripe Customer作成
        const customer = await getStripe().customers.create({
            email: scrivener.email ?? undefined,
            name: scrivener.officeName,
            metadata: { scrivenerId: scrivener.id },
        })

        await db.administrativeScrivener.update({
            where: { id: scrivener.id },
            data: { stripeCustomerId: customer.id },
        })

        // Checkout Session生成（サブスクリプション）
        const session = await getStripe().checkout.sessions.create({
            mode: "subscription",
            customer: customer.id,
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${BASE_URL}/gyoseishoshi/entry/thanks?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${BASE_URL}/gyoseishoshi/entry?payment=cancelled`,
            metadata: { scrivenerId: scrivener.id },
            locale: "ja",
        })

        if (!session.url) {
            throw new Error("Stripe session URL が取得できませんでした")
        }
        checkoutUrl = session.url
    } catch (stripeError) {
        console.error("[submitScrivenerEntry] Stripe エラー:", stripeError)
        // Stripe失敗してもDB保存済みなので管理者通知して継続
        void sendAdminNotification(scrivener, data.email, true)
        return {
            success: true,
            message: "お申し込みを受け付けました。担当者よりご連絡いたします。",
        }
    }

    // === 管理者通知メール ===
    void sendAdminNotification(scrivener, data.email, false)

    return {
        success: true,
        checkoutUrl,
    }
}

async function sendAdminNotification(
    scrivener: { id: string; officeName: string; planType: string },
    email: string,
    isStripeError: boolean
) {
    const subject = isStripeError
        ? `【要対応】行政書士掲載申込（Stripeエラー）- ${scrivener.officeName}`
        : `【行政書士掲載申込】${scrivener.officeName} 様より`

    const body = `行政書士掲載の新規申込がありました。

■ 申込情報
事務所名: ${scrivener.officeName}
プラン: ${scrivener.planType}
管理画面: ${process.env.NEXT_PUBLIC_BASE_URL || "https://seiren-ohakajimai-navi.vercel.app"}/admin/gyoseishoshi/${scrivener.id}

${isStripeError ? "⚠️ Stripe決済URLの発行に失敗しました。管理画面から手動で発行してください。" : "Stripe決済URLを発行し、申込者に自動遷移させました。"}

承認はこちら: ${process.env.NEXT_PUBLIC_BASE_URL || "https://seiren-ohakajimai-navi.vercel.app"}/admin/gyoseishoshi/${scrivener.id}`

    try {
        await resend.emails.send({
            from: `お墓じまいナビ <${FROM_ADDRESS}>`,
            to: ADMIN_EMAIL,
            subject,
            text: body,
        })
    } catch (err) {
        console.error("[submitScrivenerEntry] 管理者通知メール失敗:", err)
    }
}
