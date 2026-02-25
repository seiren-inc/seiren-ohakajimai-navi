import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Municipality Data Integrity (1737 items)', () => {
    let municipalities: Record<string, unknown>[] = []

    beforeAll(async () => {
        municipalities = await prisma.municipality.findMany()
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    it('contains exactly 1737 records', () => {
        expect(municipalities.length).toBe(1737)
    })

    it('ensures all records have valid slugs and prefecture data', () => {
        municipalities.forEach((m) => {
            expect(m.municipalitySlug).toBeTruthy()
            expect(m.municipalitySlug.trim()).not.toBe('')
            expect(m.prefectureSlug).toBeTruthy()
            expect(m.prefectureName).toBeTruthy()
            expect(m.name).toBeTruthy()
        })
    })

    it('ensures URLs starting with http if they exist', () => {
        municipalities.forEach((m) => {
            if (m.url) {
                expect(m.url.startsWith('http')).toBe(true)
            }
            if (m.pdfUrl) {
                expect(m.pdfUrl.startsWith('http')).toBe(true)
            }
        })
    })

    it('verifies uniqueness of JIS code', () => {
        const jisCodes = municipalities.map(m => m.jisCode)
        const uniqueJisCodes = new Set(jisCodes)
        expect(uniqueJisCodes.size).toBe(municipalities.length)
    })
})
