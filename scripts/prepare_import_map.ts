import fs from "fs"
import path from "path"
import { prisma } from "../src/lib/prisma"

const OUTPUT_DIR = path.join(process.cwd(), "data/imports")
const OUTPUT_FILE = path.join(OUTPUT_DIR, "municipality_map.json")

async function main() {
    console.log("Fetching municipalities...")
    const municipalities = await prisma.municipality.findMany({
        select: {
            jisCode: true,
            name: true,
            prefectureName: true,
            municipalitySlug: true
        }
    })

    const data = municipalities.map(m => ({
        jisCode: m.jisCode,
        name: m.name,
        prefectureName: m.prefectureName,
        municipalitySlug: m.municipalitySlug
    }))

    const mapPath = path.join(process.cwd(), "data/imports/municipality_map.json")
    fs.writeFileSync(mapPath, JSON.stringify(data, null, 2))
    console.log(`Exported ${municipalities.length} municipalities to ${mapPath}`)
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
