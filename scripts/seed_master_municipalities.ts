import fs from 'fs'
import path from 'path'
import { prisma } from '../src/lib/prisma'

interface MasterMunicipality {
    code: string
    name_kanji: string
    name_kana: string
    name_romaji: string
    lat: string
    lon: string
    prefecture_kanji: string
    prefecture_kana: string
    prefecture_romaji: string
}

async function main() {
    const jsonPath = path.join(process.cwd(), 'data/imports/master_municipalities.json')
    if (!fs.existsSync(jsonPath)) {
        console.error("Master JSON not found at " + jsonPath)
        process.exit(1)
    }

    const raw = fs.readFileSync(jsonPath, 'utf-8')
    const data: MasterMunicipality[] = JSON.parse(raw)

    console.log(`Loaded ${data.length} master municipalities.`)

    // Optimized strategy:
    // 1. Get existing JIS codes
    // 2. Filter new records
    // 3. CreateMany

    console.log("Fetching existing municipalities...")
    const existing = await prisma.municipality.findMany({
        select: { jisCode: true }
    })
    const existingSet = new Set(existing.map(e => e.jisCode))

    const newRecords = []

    for (const m of data) {
        if (existingSet.has(m.code)) continue

        const prefSlug = m.prefecture_romaji.toLowerCase().replace(/\s+/g, '-')
        const munSlug = m.name_romaji.toLowerCase().replace(/\s+/g, '-')
        const prefCode = m.code.substring(0, 2)

        newRecords.push({
            jisCode: m.code,
            name: m.name_kanji,
            prefectureCode: prefCode,
            prefectureName: m.prefecture_kanji,
            prefectureSlug: prefSlug,
            municipalitySlug: munSlug,
            isPublished: true,
            linkStatus: 'UNKNOWN',
            url: null,
            pdfUrl: null
        })
    }

    console.log(`Found ${newRecords.length} new municipalities to insert.`)

    if (newRecords.length > 0) {
        // createMany (supabase supports it)
        // Batch if too large? 1700 is fine for one batch usually, but let's do 500 safety.
        const CHUNK_SIZE = 500
        for (let i = 0; i < newRecords.length; i += CHUNK_SIZE) {
            const chunk = newRecords.slice(i, i + CHUNK_SIZE)
            // Need to cast to any to avoid some strict type checks if optional fields mismatch?
            // But schema matches.
            await prisma.municipality.createMany({
                data: chunk as any,
                skipDuplicates: true
            })
            console.log(`Inserted chunk ${i} - ${i + chunk.length}`)
        }
    }

    console.log(`Completed seeding.`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
