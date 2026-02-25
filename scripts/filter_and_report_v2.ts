import fs from 'fs'
import path from 'path'
import { prisma } from '../src/lib/prisma'

const PENDING_PATH = path.join(process.cwd(), "data/imports/pending.json")
const MASTER_PATH = path.join(process.cwd(), "data/imports/master_municipalities.json")

// Valid Prefectures (Kyushu + Chugoku + Shikoku)
// The user adds regions incrementally. We assume strict accumulation.
const VALID_PREFECTURES = [
    // Kyushu/Okinawa
    "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
    // Chugoku
    "鳥取県", "島根県", "岡山県", "広島県", "山口県",
    // Shikoku
    "徳島県", "香川県", "愛媛県", "高知県",
    // Tokai/Hokuriku
    "静岡県", "岐阜県", "愛知県", "三重県",
    "新潟県", "富山県", "石川県", "福井県",
    // Tohoku
    "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
    // Hokkaido
    "北海道"
]

interface MasterMunicipality {
    code: string
    name_kanji: string
    name_romaji: string
}

async function main() {
    if (!fs.existsSync(PENDING_PATH) || !fs.existsSync(MASTER_PATH)) {
        console.error("Required files not found.")
        return
    }

    let pending = JSON.parse(fs.readFileSync(PENDING_PATH, "utf-8"))
    const master: MasterMunicipality[] = JSON.parse(fs.readFileSync(MASTER_PATH, "utf-8"))
    const masterMap = new Map(master.map(m => [m.code, m]))

    // 1. Filter Noise
    console.log("Filtering noise...")
    const beforeCount = pending.length
    const filtered = pending.filter((r: any) => VALID_PREFECTURES.includes(r.prefecture))
    const afterCount = filtered.length
    const noiseCount = beforeCount - afterCount

    // Save filtered if needed (we'll save after slug updates too)
    pending = filtered

    // 2. Slug Update
    console.log("Updating slugs...")
    let slugFixCount = 0
    let changes: string[] = []

    const suffixesToRemove = [" Shi", " Machi", " Cho", " Mura", " Son", " Ku"]

    for (const record of pending) {
        const m = masterMap.get(record.jisCode)
        if (!m) continue

        let baseName = m.name_romaji.trim()

        for (const s of suffixesToRemove) {
            if (baseName.toLowerCase().endsWith(s.toLowerCase())) {
                baseName = baseName.substring(0, baseName.length - s.length)
                break
            }
        }
        baseName = baseName.trim().replace(/\s+/g, '-')

        // Suffix Rule
        const kanji = m.name_kanji
        let targetSuffix = ""
        if (kanji.endsWith("市")) targetSuffix = "-shi"
        else if (kanji.endsWith("区")) targetSuffix = "-ku"
        else if (kanji.endsWith("町")) targetSuffix = "-cho"
        else if (kanji.endsWith("村")) targetSuffix = "-son"

        const newSlug = (baseName + targetSuffix).toLowerCase()

        // Update DB
        const currentDb = await prisma.municipality.findUnique({
            where: { jisCode: record.jisCode },
            select: { municipalitySlug: true }
        })

        if (currentDb && currentDb.municipalitySlug !== newSlug) {
            await prisma.municipality.update({
                where: { jisCode: record.jisCode },
                data: { municipalitySlug: newSlug }
            })
            changes.push(`${record.municipality}: ${currentDb.municipalitySlug} -> ${newSlug}`)
            slugFixCount++
        }
    }

    // Save final pending
    fs.writeFileSync(PENDING_PATH, JSON.stringify(pending, null, 2))

    // 3. Stats
    console.log("--- Report ---")
    console.log(`Region Filter: Removed ${noiseCount} records. Valid Total: ${pending.length}`)
    console.log(`Slug Fixes: ${slugFixCount}`)

    // Pref Counts
    const prefCounts: Record<string, number> = {}
    pending.forEach((r: any) => {
        prefCounts[r.prefecture] = (prefCounts[r.prefecture] || 0) + 1
    })
    console.log("\n1) Prefecture Counts:")
    Object.entries(prefCounts).forEach(([p, c]) => console.log(`${p}: ${c}`))

    console.log(`\n2) Noise Count: ${noiseCount}`)

    // URL/PDF Counts (for NEW block only? No, usually total or specific. Assuming total pending)
    let urlOnly = 0
    let pdfOnly = 0
    let both = 0
    pending.forEach((r: any) => {
        if (r.url && !r.pdfUrl) urlOnly++
        else if (!r.url && r.pdfUrl) pdfOnly++
        else if (r.url && r.pdfUrl) both++
    })
    console.log(`3) URL only: ${urlOnly}, PDF only: ${pdfOnly}, Both: ${both}`)
    console.log(`4) Slug Fixes: ${slugFixCount}`)
    console.log(`5) Total Cumulative: ${pending.length}`)
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(async () => await prisma.$disconnect())
