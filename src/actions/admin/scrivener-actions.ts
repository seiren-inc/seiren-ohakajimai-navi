'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// prisma generate 前は型未解決のため any 経由
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any

/**
 * AuditLog記録ヘルパー（Doc-16 §8, Doc-17 §8）
 * 監査ログは削除不可
 */
async function recordAuditLog(
    scrivenerId: string,
    actionType: string,
    beforeValue: Record<string, unknown> | null,
    afterValue: Record<string, unknown> | null,
    adminUserId: string = "system"
) {
    try {
        await db.scrivenerAuditLog.create({
            data: {
                scrivenerId,
                actionType,
                beforeValue,
                afterValue,
                adminUserId,
            },
        })
    } catch (error) {
        console.error("[AuditLog] 記録失敗:", error)
    }
}

/**
 * 新規行政書士登録
 * Doc-18 §4: isApproved=false（自動公開禁止）
 */
export async function createScrivener(formData: FormData) {
    const specialtiesRaw = formData.get("specialties") as string
    const specialties = specialtiesRaw
        ? specialtiesRaw.split(",").map((s: string) => s.trim()).filter(Boolean)
        : []

    const result = await db.administrativeScrivener.create({
        data: {
            officeName: formData.get("officeName") as string,
            representativeName: (formData.get("representativeName") as string) || null,
            registrationNumber: (formData.get("registrationNumber") as string) || null,
            prefecture: formData.get("prefecture") as string,
            city: (formData.get("city") as string) || null,
            addressLine: (formData.get("addressLine") as string) || null,
            phone: (formData.get("phone") as string) || null,
            email: (formData.get("email") as string) || null,
            websiteUrl: (formData.get("websiteUrl") as string) || null,
            priceRangeText: (formData.get("priceRangeText") as string) || null,
            specialties,
            profileText: formData.get("profileText") as string,
            businessHours: (formData.get("businessHours") as string) || null,
            planType: (formData.get("planType") as string) || "BASIC",
            priorityScore: Number(formData.get("priorityScore")) || 0,
            // Doc-18 §4: デフォルトは未承認・未払い
            isApproved: false,
            isActive: true,
            paymentStatus: "UNPAID",
        },
    })

    await recordAuditLog(result.id, "CREATE", null, {
        officeName: formData.get("officeName"),
        prefecture: formData.get("prefecture"),
    })

    revalidatePath("/admin/gyoseishoshi")
    redirect("/admin/gyoseishoshi")
}

/**
 * 行政書士情報更新
 */
export async function updateScrivener(id: string, formData: FormData) {
    const specialtiesRaw = formData.get("specialties") as string
    const specialties = specialtiesRaw
        ? specialtiesRaw.split(",").map((s: string) => s.trim()).filter(Boolean)
        : []

    await db.administrativeScrivener.update({
        where: { id },
        data: {
            officeName: formData.get("officeName") as string,
            representativeName: (formData.get("representativeName") as string) || null,
            registrationNumber: (formData.get("registrationNumber") as string) || null,
            prefecture: formData.get("prefecture") as string,
            city: (formData.get("city") as string) || null,
            addressLine: (formData.get("addressLine") as string) || null,
            phone: (formData.get("phone") as string) || null,
            email: (formData.get("email") as string) || null,
            websiteUrl: (formData.get("websiteUrl") as string) || null,
            priceRangeText: (formData.get("priceRangeText") as string) || null,
            specialties,
            profileText: formData.get("profileText") as string,
            businessHours: (formData.get("businessHours") as string) || null,
            planType: (formData.get("planType") as string) || "BASIC",
            priorityScore: Number(formData.get("priorityScore")) || 0,
        },
    })

    await recordAuditLog(id, "UPDATE", null, {
        officeName: formData.get("officeName"),
        prefecture: formData.get("prefecture"),
    })

    revalidatePath("/admin/gyoseishoshi")
    redirect("/admin/gyoseishoshi")
}

/**
 * 承認トグル（Doc-04 §4-2: AuditLog記録必須）
 */
export async function toggleApproval(id: string, isApproved: boolean) {
    await db.administrativeScrivener.update({
        where: { id },
        data: { isApproved },
    })

    await recordAuditLog(id, isApproved ? "APPROVE" : "UNAPPROVE", { isApproved: !isApproved }, { isApproved })

    revalidatePath("/admin/gyoseishoshi")
}

/**
 * 公開/停止トグル
 */
export async function toggleActive(id: string, isActive: boolean) {
    await db.administrativeScrivener.update({
        where: { id },
        data: { isActive },
    })

    await recordAuditLog(id, isActive ? "ACTIVATE" : "SUSPEND", { isActive: !isActive }, { isActive })

    revalidatePath("/admin/gyoseishoshi")
}

/**
 * 苦情フラグトグル（Doc-18 §7）
 */
export async function toggleComplaintFlag(id: string, complaintFlag: boolean) {
    await db.administrativeScrivener.update({
        where: { id },
        data: { complaintFlag },
    })

    await recordAuditLog(id, complaintFlag ? "COMPLAINT_FLAG_ON" : "COMPLAINT_FLAG_OFF", null, { complaintFlag })

    revalidatePath("/admin/gyoseishoshi")
}

/**
 * 支払いステータス更新（Doc-10 §8）
 * 未払い時は自動非表示
 */
export async function updatePaymentStatus(id: string, paymentStatus: string) {
    await db.administrativeScrivener.update({
        where: { id },
        data: { paymentStatus },
    })

    await recordAuditLog(id, "PAYMENT_UPDATE", null, { paymentStatus })

    revalidatePath("/admin/gyoseishoshi")
}

/**
 * 論理削除（Doc-17 §5-1, Doc-18 §11）
 * 物理削除は禁止。isActive=false で停止
 */
export async function deleteScrivener(id: string) {
    await db.administrativeScrivener.update({
        where: { id },
        data: {
            isActive: false,
            isApproved: false,
        },
    })

    await recordAuditLog(id, "DELETE_LOGICAL", null, { isActive: false, isApproved: false })

    revalidatePath("/admin/gyoseishoshi")
    redirect("/admin/gyoseishoshi")
}
