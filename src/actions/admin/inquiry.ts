'use server'

import { prisma } from "@/lib/prisma"
import { InquiryStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
    try {
        await prisma.inquiry.update({
            where: { id },
            data: { status },
        })
        revalidatePath("/admin/inquiries")
        revalidatePath(`/admin/inquiries/${id}`)
        return { success: true }
    } catch (error) {
        console.error("Failed to update status:", error)
        return { success: false, message: "Failed to update status" }
    }
}

export async function updateInquiryMemo(id: string, memo: string) {
    try {
        await prisma.inquiry.update({
            where: { id },
            data: { memo },
        })
        revalidatePath("/admin/inquiries")
        revalidatePath(`/admin/inquiries/${id}`)
        return { success: true }
    } catch (error) {
        console.error("Failed to update memo:", error)
        return { success: false, message: "Failed to update memo" }
    }
}
