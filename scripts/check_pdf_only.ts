import fs from 'fs'
import path from 'path'

const PENDING_PATH = path.join(process.cwd(), "data/imports/pending.json")

function main() {
    // 1. Load File
    const targetFile = process.argv[2]
    let rawText = ""
    let blockPath = ""

    if (targetFile) {
        blockPath = path.resolve(targetFile)
        if (fs.existsSync(blockPath)) {
            rawText = fs.readFileSync(blockPath, "utf-8")
            console.log(`Checking source file: ${targetFile}`)
        } else {
            console.log(`Source file not found: ${blockPath}`)
        }
    } else {
        console.log("No source file provided for context check.")
    }

    if (!fs.existsSync(PENDING_PATH)) {
        console.error("pending.json not found")
        return
    }

    const pending = JSON.parse(fs.readFileSync(PENDING_PATH, "utf-8"))

    // 2. Find Pdf Only
    const pdfOnly = pending.filter((r: any) => !r.url && r.pdfUrl)

    console.log(`Found ${pdfOnly.length} PDF-only records (total in pending):`)
    // Filter to show only those likely from this block? 
    // Actually user wants "accumulated" or "this block"? 
    // Usually user wants to know about the ones just added or all. 
    // Let's show all but maybe highlight if they match the source text.

    const relevantPdfOnly = []

    for (const r of pdfOnly) {
        // If we have source text, check if this municipality is in it
        if (rawText && rawText.includes(r.municipality)) {
            relevantPdfOnly.push(r)
        } else if (!rawText) {
            // If no source text provided, just show all
            relevantPdfOnly.push(r)
        }
    }

    console.log(`Relevant to this block (or all if no source): ${relevantPdfOnly.length}`)
    console.log(JSON.stringify(relevantPdfOnly, null, 2))

    // 3. Check Source Context
    if (rawText && relevantPdfOnly.length > 0) {
        console.log("\n--- Source HTML Context ---")

        relevantPdfOnly.forEach((r: any) => {
            console.log(`\nChecking for: ${r.municipality}`)
            const idx = rawText.indexOf(r.municipality)
            if (idx !== -1) {
                const start = Math.max(0, idx - 200)
                const end = Math.min(rawText.length, idx + 300)
                console.log(rawText.substring(start, end).replace(/\n/g, ' '))
            } else {
                console.log("Name not found (strange, checked includes above).")
            }
        })
    }
}

main()
