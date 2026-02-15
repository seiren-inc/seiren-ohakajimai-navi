// @ts-nocheck
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { z } from 'zod'

console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})

// Validation Schema
const municipalitySchema = z.object({
    jisCode: z.string().length(6),
    name: z.string().min(1),
    prefectureCode: z.string().length(2),
    prefectureName: z.string().min(1),
    prefectureSlug: z.string().min(1),
    municipalitySlug: z.string().min(1),
    url: z.string().url().optional().or(z.literal("")),
    pdfUrl: z.string().url().optional().or(z.literal("")),
    status: z.string().transform(val => val === "true"),
    linkStatus: z.enum(["OK", "NEEDS_REVIEW", "BROKEN", "UNKNOWN"]).optional().default("UNKNOWN"),
})

async function main() {
    const csvFilePath = path.join(__dirname, 'seeds/municipalities.csv')
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8')

    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
    }) as any[]

    console.log(`Found ${records.length} records in municipalities.csv`)

    let successCount = 0
    let errorCount = 0

    for (const record of records) {
        try {
            const validated = municipalitySchema.parse(record)

            await prisma.municipality.upsert({
                where: { jisCode: validated.jisCode },
                update: {
                    name: validated.name,
                    prefectureCode: validated.prefectureCode,
                    prefectureName: validated.prefectureName,
                    prefectureSlug: validated.prefectureSlug,
                    municipalitySlug: validated.municipalitySlug,
                    url: validated.url || null,
                    pdfUrl: validated.pdfUrl || null,
                    isPublished: validated.status, // CSV 'status' maps to isPublished
                    linkStatus: validated.linkStatus || 'UNKNOWN',
                },
                create: {
                    jisCode: validated.jisCode,
                    name: validated.name,
                    prefectureCode: validated.prefectureCode,
                    prefectureName: validated.prefectureName,
                    prefectureSlug: validated.prefectureSlug,
                    municipalitySlug: validated.municipalitySlug,
                    url: validated.url || null,
                    pdfUrl: validated.pdfUrl || null,
                    isPublished: validated.status,
                    linkStatus: validated.linkStatus || 'UNKNOWN',
                },
            })
            successCount++
        } catch (e) {
            console.error(`Validation error for record ${record.jisCode}:`, e)
            errorCount++
        }
    }

    console.log(`Seeding completed. Success: ${successCount}, Errors: ${errorCount}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
