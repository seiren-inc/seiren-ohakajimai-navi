import fs from 'fs'
import path from 'path'

const PENDING_PATH = path.join(process.cwd(), "data/imports/pending.json")
const MAP_PATH = path.join(process.cwd(), "data/imports/municipality_map.json")

const TARGET_PREFECTURES = [
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県"
]

function main() {
    if (!fs.existsSync(PENDING_PATH)) {
        console.error("pending.json not found")
        return
    }

    const data = JSON.parse(fs.readFileSync(PENDING_PATH, "utf-8"))
    const originalCount = data.length

    // Filter
    const filtered = data.filter((r: any) => TARGET_PREFECTURES.includes(r.prefecture))
    const filteredCount = filtered.length
    const removedCount = originalCount - filteredCount

    console.log(`削除件数: ${removedCount}`)
    console.log(`削除後総件数: ${filteredCount}`)

    // Save
    fs.writeFileSync(PENDING_PATH, JSON.stringify(filtered, null, 2))

    // Show Fukuoka Slugs
    if (fs.existsSync(MAP_PATH)) {
        const map = JSON.parse(fs.readFileSync(MAP_PATH, "utf-8"))

        console.log("\n--- 福岡県 municipalitySlug 例 (5件) ---")
        const fukuokaRecords = filtered.filter((r: any) => r.prefecture === "福岡県").slice(0, 5)

        fukuokaRecords.forEach((r: any) => {
            const mapEntry = map.find((m: any) => m.jisCode === r.jisCode)
            if (mapEntry) {
                console.log(`${r.municipality} (${r.jisCode}) -> ${mapEntry.municipalitySlug}`)
            } else {
                console.log(`${r.municipality} (${r.jisCode}) -> (Map entry not found)`)
            }
        })
    } else {
        console.warn("Municipality map not found, cannot show slugs.")
    }
}

main()
