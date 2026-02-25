'use server'

import { inquirySchema } from "@/lib/validations/inquiry"
import { prisma } from "@/lib/prisma"
import { Resend } from 'resend'
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { sanitizeObject } from "@/lib/sanitize"

const resend = new Resend(process.env.RESEND_API_KEY)

export type State = {
    success: boolean
    message?: string
    errors?: {
        [key: string]: string[]
    }
}

export async function submitInquiry(prevState: State | null, formData: FormData): Promise<State> {
    // Convert FormData to object
    const rawData: Record<string, unknown> = {}
    formData.forEach((value, key) => {
        // Handle checkbox arrays or single values
        if (rawData[key]) {
            if (!Array.isArray(rawData[key])) {
                rawData[key] = [rawData[key]] as unknown[]
            }
            (rawData[key] as unknown[]).push(value)
        } else {
            rawData[key] = value
        }
    })

    // Normalize specific fields (checkboxes return "on" sometimes, or string "true"/"false")
    if (rawData.ritanConsultation === "on") rawData.ritanConsultation = true
    else rawData.ritanConsultation = false

    // Handle Honeypot
    if (rawData.confirmEmail && rawData.confirmEmail !== "") {
        // Spam detected, pretend success
        return { success: true, message: "お問い合わせを受け付けました。" }
    }

    // Sanitize input
    const sanitizedRawData = sanitizeObject(rawData);

    // Validate fields
    const validatedFields = inquirySchema.safeParse(sanitizedRawData)

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "入力内容に誤りがあります。",
        }
    }

    const { data } = validatedFields
    const ip = (await headers()).get("x-forwarded-for") || "unknown"
    const userAgent = (await headers()).get("user-agent") || "unknown"

    // Simple Rate Limiting (IP base: max 3 requests per hour)
    try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
        const recentInquiries = await prisma.inquiry.count({
            where: {
                ipAddress: ip,
                createdAt: { gt: oneHourAgo },
            },
        })

        if (recentInquiries >= 3) {
            return {
                success: false,
                message: "短時間に多数の送信が行われました。しばらく時間をおいて再度お試しください。",
            }
        }

        // Save to DB
        await prisma.inquiry.create({
            data: {
                lastName: data.lastName,
                firstName: data.firstName,
                lastNameKana: data.lastNameKana,
                firstNameKana: data.firstNameKana,
                email: data.email,
                phone: data.phone,
                postalCode: data.postalCode,
                prefecture: data.prefecture,
                city: data.city,
                addressDetail: data.addressDetail,
                cemeteryType: data.cemeteryType,
                considerationPeriod: data.considerationPeriod,
                content: data.content,
                destinationType: data.destinationType,
                boneServiceType: data.boneServiceType,
                containerType: data.containerType,
                ritanConsultation: data.ritanConsultation,
                ipAddress: ip,
                userAgent: userAgent,
                status: "NEW", // Default
            }
        })

        // Email content (Simplified for now)
        const adminMailBody = `
新しいお問い合わせがありました。

■お客様情報
氏名: ${data.lastName} ${data.firstName}
カナ: ${data.lastNameKana} ${data.firstNameKana}
Email: ${data.email}
電話: ${data.phone}
住所: 〒${data.postalCode} ${data.prefecture}${data.city} ${data.addressDetail || ""}

■ご相談内容
墓地種別: ${data.cemeteryType}
検討時期: ${data.considerationPeriod}
内容:
${data.content}

■オプション
改葬先: ${data.destinationType || "未定"}
遺骨: ${data.boneServiceType || "不要"}
容器: ${data.containerType || "未定"}
離檀相談: ${data.ritanConsultation ? "希望する" : "希望しない"}

--------------------------------
IP: ${ip}
`

        const userMailBody = `
${data.lastName} ${data.firstName} 様

この度は「お墓じまいナビ」にお問い合わせいただき、誠にありがとうございます。
内容を確認の上、担当者より2営業日以内にご連絡させていただきます。

以下の内容で受け付けました。

--------------------------------
氏名: ${data.lastName} ${data.firstName}
Email: ${data.email}
ご相談内容:
${data.content}
--------------------------------

お急ぎの場合は、お電話（0120-000-000）でも承っております。

株式会社清蓮 お墓じまいナビ運営事務局
`

        // Send emails
        // Admin notification
        await resend.emails.send({
            from: 'お墓じまいナビ <system@osohiki-navi.jp>', // TODO: Update with verified domain later
            to: process.env.ADMIN_EMAIL || 'info@seiren.jp', // Fallback
            subject: `【新規問合】${data.lastName} ${data.firstName}様より`,
            text: adminMailBody,
        })

        // User auto-reply
        await resend.emails.send({
            from: 'お墓じまいナビ <system@osohiki-navi.jp>',
            to: data.email,
            subject: `【自動返信】お問い合わせありがとうございます`,
            text: userMailBody,
        })

    } catch (error) {
        console.error("Inquiry error:", error)
        return {
            success: false,
            message: "システムエラーが発生しました。時間をおいて再度お試しください。",
        }
    }

    // Redirect on success
    redirect("/contact/thanks")
}
