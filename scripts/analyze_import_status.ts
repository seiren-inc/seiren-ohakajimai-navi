import fs from 'fs'
import path from 'path'

interface OutputRecord {
    prefecture: string
    municipality: string
    jisCode: string
    url: string
    pdfUrl: string
}

const PENDING_PATH = path.join(process.cwd(), "data/imports/pending.json")

function main() {
    if (!fs.existsSync(PENDING_PATH)) {
        console.log("No pending.json found.")
        return
    }

    const data: OutputRecord[] = JSON.parse(fs.readFileSync(PENDING_PATH, "utf-8"))

    console.log(`Total Records: ${data.length}\n`)

    // 1. Prefecture Counts
    const prefCounts: Record<string, number> = {}
    data.forEach(r => {
        const p = r.prefecture || "Unknown"
        prefCounts[p] = (prefCounts[p] || 0) + 1
    })
    console.log("--- 1. Prefecture Counts ---")
    Object.entries(prefCounts).forEach(([p, c]) => console.log(`${p}: ${c}`))
    console.log("")

    // 6. Duplicate JIS Codes
    const jisCounts: Record<string, number> = {}
    data.forEach(r => {
        jisCounts[r.jisCode] = (jisCounts[r.jisCode] || 0) + 1
    })
    const duplicateJis = Object.entries(jisCounts).filter(([_, c]) => c > 1)

    console.log(`--- 2/6. Duplicate JIS Codes (Total: ${duplicateJis.length}) ---`)
    // If strict duplicate (same url too), or just same municipality?
    // User asked "Duplicate municipalities" and "Same jisCode multiple times"
    duplicateJis.forEach(([code, count]) => {
        const name = data.find(r => r.jisCode === code)?.municipality
        console.log(`${name} (${code}): ${count} records`)
    })
    console.log("")

    // 3/4/5 URL stats
    let urlOnly = 0
    let pdfOnly = 0
    let bothEmpty = 0
    let bothSet = 0

    data.forEach(r => {
        const hasUrl = !!r.url
        const hasPdf = !!r.pdfUrl

        if (hasUrl && !hasPdf) urlOnly++
        else if (!hasUrl && hasPdf) pdfOnly++
        else if (!hasUrl && !hasPdf) bothEmpty++
        else bothSet++
    })

    console.log("--- URL Statistics ---")
    console.log(`3. URL only: ${urlOnly}`)
    console.log(`4. PDF URL only: ${pdfOnly}`)
    console.log(`   Both set: ${bothSet}`)
    console.log(`5. Both empty: ${bothEmpty}`)
    console.log("")

    // 7. Unique Municipalities
    console.log(`--- 7. Unique Municipalities (Normalized) ---`)
    console.log(`Unique JIS Codes: ${Object.keys(jisCounts).length}`)
    console.log("")

    // Fukuoka List
    console.log("--- Fukuoka Prefecture Records ---")
    const fukuoka = data.filter(r => r.prefecture === "福岡県")
    console.log(JSON.stringify(fukuoka, null, 2))
}

main()
