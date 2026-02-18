import fs from 'fs'
import path from 'path'
import { prisma } from '../src/lib/prisma'

const PENDING_PATH = path.join(process.cwd(), "data/imports/pending.json")
const MASTER_PATH = path.join(process.cwd(), "data/imports/master_municipalities.json")

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

    const pending = JSON.parse(fs.readFileSync(PENDING_PATH, "utf-8"))
    const master: MasterMunicipality[] = JSON.parse(fs.readFileSync(MASTER_PATH, "utf-8"))
    const masterMap = new Map(master.map(m => [m.code, m]))

    // Explicit check for Kotake
    const kotakeCheck = pending.find((p: any) => p.jisCode === "404012")
    if (kotakeCheck) {
        console.log("DEBUG: Kotake found in pending.")
        const m = masterMap.get("404012")
        console.log(`DEBUG: Kotake in master: ${m ? 'Yes' : 'No'}`)
        if (m) {
            console.log(`DEBUG: Kotake Romaji: '${m.name_romaji}'`)
        }
    } else {
        console.log("DEBUG: Kotake NOT found in pending.")
    }

    console.log(`Processing ${pending.length} records...`)

    let updatedCount = 0
    let changes: string[] = []

    // Suffix definitions
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

        // Determine target suffix
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

        if (currentDb) {
            if (currentDb.municipalitySlug !== newSlug) {
                await prisma.municipality.update({
                    where: { jisCode: record.jisCode },
                    data: { municipalitySlug: newSlug }
                })
                changes.push(`${record.municipality}: ${currentDb.municipalitySlug} -> ${newSlug}`)
                updatedCount++
            } else {
                // Debug specifically for Kotake if no change
                if (record.jisCode === "404012") {
                    console.log(`DEBUG: Kotake No Change. Current: ${currentDb.municipalitySlug}, New: ${newSlug}`)
                    console.log(`DEBUG: BaseName used: '${baseName}', TargetSuffix: '${targetSuffix}'`)
                }
            }
        }
    }

    console.log(`Updated ${updatedCount} slugs.`)
    console.log("\n--- Sample Changes ---")
    changes.slice(0, 10).forEach(c => console.log(c))
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
