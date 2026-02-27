'use server'

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { municipalityImportSchema, type MunicipalityImportData } from "@/lib/validations/municipality"
import { revalidatePath } from "next/cache"
// csv-parse is available for future server-side parsing needs.

// Result Types
type AnalysisResult = {
    total: number
    newCount: number
    updateCount: number
    errors: { row: number; message: string }[]
    validData: MunicipalityImportData[]
}

type ExecutionResult = {
    success: boolean
    message: string
    logId?: string
    importStats?: {
        total: number
        success: number
        failed: number
    }
}

// Ensure Admin
async function requireAdmin() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll() {
                    // Server Actions can't always set cookies unless in a specific context, 
                    // but for reading auth it's fine.
                }
            }
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const adminUser = await prisma.adminUser.findUnique({
        where: { supabaseUserId: user.id },
    })
    if (!adminUser || !adminUser.isActive) throw new Error("Unauthorized")

    return adminUser
}

export async function analyzeImport(data: Record<string, unknown>[]): Promise<AnalysisResult> {
    await requireAdmin()

    const analysis: AnalysisResult = {
        total: data.length,
        newCount: 0,
        updateCount: 0,
        errors: [],
        validData: []
    }

    // 1. Validate all rows first
    for (let i = 0; i < data.length; i++) {
        const row = data[i]
        const result = municipalityImportSchema.safeParse(row)

        if (!result.success) {
            analysis.errors.push({
                row: i + 1,
                message: result.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ")
            })
        } else {
            analysis.validData.push(result.data)
        }
    }

    // 2. Check for existence (New vs Update)
    // Optimization: Fetch all jisCodes present in validData
    if (analysis.validData.length > 0) {
        const jisCodes = analysis.validData.map(d => d.jisCode)
        const existing = await prisma.municipality.findMany({
            where: { jisCode: { in: jisCodes } },
            select: { jisCode: true }
        })
        const existingSet = new Set(existing.map((e: { jisCode: string }) => e.jisCode))

        for (const item of analysis.validData) {
            if (existingSet.has(item.jisCode)) {
                analysis.updateCount++
            } else {
                analysis.newCount++
            }
        }
    }

    return analysis
}

export async function executeImport(
    filename: string,
    data: MunicipalityImportData[]
): Promise<ExecutionResult> {
    const adminUser = await requireAdmin()

    let successCount = 0
    let failedCount = 0
    const errorDetails: string[] = []

    // Execution
    for (const item of data) {
        try {
            await prisma.municipality.upsert({
                where: { jisCode: item.jisCode },
                update: {
                    name: item.name,
                    prefectureCode: item.prefectureCode,
                    prefectureName: item.prefectureName,
                    prefectureSlug: item.prefectureSlug,
                    municipalitySlug: item.municipalitySlug,
                    url: item.url || null,
                    pdfUrl: item.pdfUrl || null,
                    region: item.region || null,
                    isPublished: item.isPublished,
                    linkStatus: item.linkStatus,
                    notes: item.notes || null,
                    seoDescription: item.seoDescription || null,
                },
                create: {
                    jisCode: item.jisCode,
                    name: item.name,
                    prefectureCode: item.prefectureCode,
                    prefectureName: item.prefectureName,
                    prefectureSlug: item.prefectureSlug,
                    municipalitySlug: item.municipalitySlug,
                    url: item.url || null,
                    pdfUrl: item.pdfUrl || null,
                    region: item.region || null,
                    isPublished: item.isPublished,
                    linkStatus: item.linkStatus,
                    notes: item.notes || null,
                    seoDescription: item.seoDescription || null,
                },
            })
            successCount++
        } catch (e: unknown) {
            failedCount++
            const message = e instanceof Error ? e.message : String(e)
            errorDetails.push(`Failed to upsert ${item.jisCode}: ${message}`)
        }
    }

    // Log to DB
    try {
        const log = await prisma.importLog.create({
            data: {
                adminUserId: adminUser.id,
                filename,
                fileType: filename.endsWith('.json') ? 'json' : 'csv',
                totalCount: data.length,
                successCount,
                failedCount,
                errorLog: errorDetails.length > 0 ? JSON.stringify(errorDetails) : null
            }
        })

        revalidatePath('/admin/municipalities')
        revalidatePath('/kaissou') // Update public pages if needed

        return {
            success: true,
            message: "Import completed",
            logId: log.id,
            importStats: {
                total: data.length,
                success: successCount,
                failed: failedCount
            }
        }
    } catch (e) {
        console.error("Failed to save import log", e)
        return {
            success: true, // Import itself finished, just log failed
            message: "Import finished but log saving failed",
            importStats: {
                total: data.length,
                success: successCount,
                failed: failedCount
            }
        }
    }
}
