'use server'

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { InquiryStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { sanitizeInput } from "@/lib/sanitize"

async function requireAdmin() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll() {
                    // Server Action では認証確認のみ行う
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Unauthorized")
    }

    const adminUser = await prisma.adminUser.findUnique({
        where: { supabaseUserId: user.id },
    })

    if (!adminUser || !adminUser.isActive) {
        throw new Error("Unauthorized")
    }
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
    try {
        await requireAdmin()
        await prisma.inquiry.update({
            where: { id },
            data: { status },
        })
        revalidatePath("/admin/inquiries")
        revalidatePath(`/admin/inquiries/${id}`)
        return { success: true }
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return { success: false, message: "Unauthorized" }
        }
        console.error("Failed to update status:", error)
        return { success: false, message: "Failed to update status" }
    }
}

export async function updateInquiryMemo(id: string, memo: string) {
    try {
        await requireAdmin()
        const sanitizedMemo = sanitizeInput(memo)
        await prisma.inquiry.update({
            where: { id },
            data: { memo: sanitizedMemo },
        })
        revalidatePath("/admin/inquiries")
        revalidatePath(`/admin/inquiries/${id}`)
        return { success: true }
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return { success: false, message: "Unauthorized" }
        }
        console.error("Failed to update memo:", error)
        return { success: false, message: "Failed to update memo" }
    }
}
