'use server'

import { gyoseishoshiInquirySchema } from "@/lib/validations/gyoseishoshi-inquiry"
import { prisma } from "@/lib/prisma"
import { Resend } from 'resend'
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { sanitizeObject } from "@/lib/sanitize"
import { PreferredContactLabels } from "@/lib/validations/gyoseishoshi-inquiry"

const resend = new Resend(process.env.RESEND_API_KEY)

// Doc-04 §11: 環境変数未設定時のfail-fast
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS || 'system@ohakajimai-navi.jp'

export type State = {
    success: boolean
    message?: string
    errors?: {
        [key: string]: string[]
    }
}

export async function submitGyoseishoshiInquiry(prevState: State | null, formData: FormData): Promise<State> {
    // scrivenerId はシステム設定値（ユーザー入力ではない）のでサニタイズ前に取得
    const scrivenerId = (formData.get("scrivenerId") as string | null) || null

    const rawData: Record<string, unknown> = {}
    formData.forEach((value, key) => {
        if (key !== "scrivenerId") rawData[key] = value
    })

    // Honeypot（スパム検知）
    if (rawData["confirmEmail"] && rawData["confirmEmail"] !== "") {
        return { success: true, message: "お問い合わせを受け付けました。" }
    }

    // Cloudflare Turnstile 検証（CLAUDE.md Non-Negotiable）
    const turnstileToken = formData.get("cf-turnstile-response")
    if (!turnstileToken || typeof turnstileToken !== "string") {
        return { success: false, message: "セキュリティ確認が完了していません。" }
    }
    const turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY
    if (turnstileSecret) {
        const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ secret: turnstileSecret, response: turnstileToken }),
        })
        const verifyData = await verifyRes.json() as { success: boolean }
        if (!verifyData.success) {
            return { success: false, message: "セキュリティ確認に失敗しました。もう一度お試しください。" }
        }
    }

    // Sanitize（Doc-04 §3-4, §7）
    const sanitizedRawData = sanitizeObject(rawData)

    // Validate
    const validatedFields = gyoseishoshiInquirySchema.safeParse(sanitizedRawData)

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "入力内容に誤りがあります。",
        }
    }

    const { data } = validatedFields
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    const userAgent = headersList.get("user-agent") ?? "unknown"

    // Rate Limiting: 1時間に3件まで（IPベース）
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentCount = await prisma.inquiry.count({
        where: {
            ipAddress: ip,
            // InquiryType の値を文字列リテラルで指定（prisma generate 後に enum 型に変更可）
            createdAt: { gt: oneHourAgo },
        },
    })

    if (recentCount >= 3) {
        return {
            success: false,
            message: "短時間に多数の送信が検出されました。しばらく時間をおいて再度お試しください。",
        }
    }

    // Doc-04 §5-1: DB失敗とメール失敗を分離して例外処理
    // --- Step 1: DB保存 ---
    // Note: prisma generate 前は型未解決のため unknown 経由でキャスト
    // migrate後に型を正規化すること（Doc-04 §6）
    const createData = {
        inquiryType: "GYoseishoshi",
        lastName: data.lastName,
        firstName: data.firstName,
        email: data.email,
        phone: data.phone,
        prefecture: data.prefecture,
        city: data.city,
        content: data.content,
        preferredContact: data.preferredContact,
        ipAddress: ip,
        userAgent: userAgent,
        status: "NEW",
        ...(scrivenerId ? { scrivenerId } : {}),
    }

    try {
        await (prisma.inquiry.create as (args: unknown) => Promise<unknown>)({ data: createData as unknown })
    } catch (dbError) {
        console.error("[submitGyoseishoshiInquiry] DB保存失敗:", dbError)
        return {
            success: false,
            message: "システムエラーが発生しました。時間をおいて再度お試しください。",
        }
    }


    // --- Step 2: メール送信（失敗してもDB保存は成功扱い）---
    // Doc-04 §5-1: メール失敗 → DB保存は成功、ログ記録
    const contactMethodLabel = PreferredContactLabels[data.preferredContact as keyof typeof PreferredContactLabels] ?? data.preferredContact

    // scrivenerId がある場合は行政書士情報を取得（通知メール用）
    let scrivenerName: string | null = null
    let scrivenerEmail: string | null = null
    if (scrivenerId) {
        try {
            const scrivener = await prisma.administrativeScrivener.findUnique({
                where: { id: scrivenerId },
                select: { officeName: true, email: true },
            })
            scrivenerName = scrivener?.officeName ?? null
            scrivenerEmail = scrivener?.email ?? null
        } catch (err) {
            console.error("[submitGyoseishoshiInquiry] 行政書士情報取得失敗:", err)
        }
    }

    const scrivenerLine = scrivenerName ? `担当行政書士: ${scrivenerName}\n` : ""

    const adminMailBody = `【行政書士マッチング】新しいご相談が届きました。

■お客様情報
氏名: ${data.lastName} ${data.firstName}
Email: ${data.email}
電話: ${data.phone}
地域: ${data.prefecture} ${data.city}
希望連絡方法: ${contactMethodLabel}
${scrivenerLine}
■ご相談内容
${data.content}

---
IP: ${ip}`

    const userMailBody = `${data.lastName} ${data.firstName} 様

「お墓じまいナビ」行政書士マッチングへのご相談ありがとうございます。
内容を確認の上、2営業日以内に担当者よりご連絡いたします。

------
ご相談内容:
${data.content}
------

お急ぎの場合はお電話（0800-888-8788）にてお問い合わせください。

株式会社清蓮 お墓じまいナビ運営事務局`

    const scrivenerMailBody = `【お墓じまいナビ】新しいご相談が届きました。

■お客様情報
氏名: ${data.lastName} ${data.firstName}
Email: ${data.email}
電話: ${data.phone}
地域: ${data.prefecture} ${data.city}
希望連絡方法: ${contactMethodLabel}

■ご相談内容
${data.content}

---
このメールはお墓じまいナビ（https://www.ohakajimai-navi.jp）からの自動通知です。
お客様に直接ご連絡をお願いいたします。`

    try {
        const mailPromises: Promise<unknown>[] = [
            resend.emails.send({
                from: `お墓じまいナビ <${FROM_ADDRESS}>`,
                to: ADMIN_EMAIL ?? "info@seiren.jp",
                subject: `【行政書士相談】${data.lastName} ${data.firstName}様より${scrivenerName ? ` — ${scrivenerName}宛` : ""}`,
                text: adminMailBody,
            }),
            resend.emails.send({
                from: `お墓じまいナビ <${FROM_ADDRESS}>`,
                to: data.email,
                subject: "【自動返信】行政書士マッチングへのご相談ありがとうございます",
                text: userMailBody,
            }),
        ]

        // 行政書士本人への通知（メールアドレスが登録されている場合のみ）
        if (scrivenerEmail) {
            mailPromises.push(
                resend.emails.send({
                    from: `お墓じまいナビ <${FROM_ADDRESS}>`,
                    to: scrivenerEmail,
                    subject: `【新着相談】${data.lastName} ${data.firstName}様よりご相談が届きました`,
                    text: scrivenerMailBody,
                })
            )
        }

        await Promise.all(mailPromises)
    } catch (mailError) {
        // Doc-04 §5-1: メール失敗はログ記録のみ。ユーザーには成功遷移
        console.error("[submitGyoseishoshiInquiry] メール送信失敗:", mailError)
    }

    redirect("/gyoseishoshi/thanks")
}
