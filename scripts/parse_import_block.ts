import fs from 'fs'
import path from 'path'

// 1. Load File
const targetFile = process.argv[2]
if (!targetFile) {
    console.error("Please provide a file content path as an argument.")
    process.exit(1)
}

const BLOCK_PATH = path.resolve(targetFile)
if (!fs.existsSync(BLOCK_PATH)) {
    console.error(`File ${BLOCK_PATH} not found.`)
    process.exit(1)
}

console.log(`Processing file: ${targetFile}`)
const rawText = fs.readFileSync(BLOCK_PATH, "utf-8")

// 2. Load Map
const MAP_PATH = path.join(process.cwd(), "data/imports/municipality_map.json")
const map: { jisCode: string, name: string, prefectureName: string }[] = JSON.parse(fs.readFileSync(MAP_PATH, "utf-8"))

// 3. Load Pending
const PENDING_PATH = path.join(process.cwd(), "data/imports/pending.json")
let pending: any[] = []
if (fs.existsSync(PENDING_PATH)) {
    pending = JSON.parse(fs.readFileSync(PENDING_PATH, "utf-8"))
}

// 4. Parse HTML links
const links: { href: string, text: string }[] = []

// Simple regex for href
const regex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi

let match
while ((match = regex.exec(rawText)) !== null) {
    const href = match[1]
    const rawTextContent = match[2]
    const text = cleanText(rawTextContent)
    links.push({ href, text })
}

function cleanText(str: string) {
    return str.replace(/<[^>]+>/g, '').trim()
}

console.log(`Found ${links.length} links in text block.`)

// 5. Match and Append
let newCount = 0
let updatedCount = 0
let dupCount = 0

for (const link of links) {
    // Exact match or match without spaces
    const found = map.find(m => m.name === link.text || m.name === link.text.replace(/\s/g, ''))

    if (found) {
        const isPdf = link.href.toLowerCase().endsWith(".pdf")

        // Check pending for existing
        const existingIdx = pending.findIndex(e => e.jisCode === found.jisCode)

        if (existingIdx >= 0) {
            // Update logic: if current is empty and new is not, update.
            // Or if new is PDF and current is not, update pdfUrl.
            const current = pending[existingIdx]
            let updated = false

            if (!current.url && !isPdf) {
                current.url = link.href
                updated = true
            }
            if (!current.pdfUrl && isPdf) {
                current.pdfUrl = link.href
                updated = true
            }
            // If current url is same as new, it's just duplicate

            if (updated) updatedCount++
            else dupCount++

        } else {
            pending.push({
                prefecture: found.prefectureName,
                municipality: found.name,
                jisCode: found.jisCode,
                url: isPdf ? "" : link.href,
                pdfUrl: isPdf ? link.href : ""
            })
            newCount++
        }
    }
}

fs.writeFileSync(PENDING_PATH, JSON.stringify(pending, null, 2))

console.log(JSON.stringify({
    status: "success",
    totalInPending: pending.length,
    new: newCount,
    updated: updatedCount,
    duplicates: dupCount
}, null, 2))
