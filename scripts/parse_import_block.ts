import fs from "fs"
import path from "path"

interface MunicipalityMap {
    jisCode: string
    name: string
    prefectureName: string
    municipalitySlug: string
}

interface OutputRecord {
    prefecture: string
    municipality: string
    jisCode: string
    url: string
    pdfUrl: string
}

const IMPORTS_DIR = path.join(process.cwd(), "data/imports")
const MAP_PATH = path.join(IMPORTS_DIR, "municipality_map.json")
const PENDING_PATH = path.join(IMPORTS_DIR, "pending.json")

// Load Map
function loadMap(): MunicipalityMap[] {
    if (!fs.existsSync(MAP_PATH)) return []
    return JSON.parse(fs.readFileSync(MAP_PATH, "utf-8"))
}

function cleanText(text: string): string {
    return text.replace(/<[^>]*>/g, "").trim()
}

// Extract all <a href="...">text</a>
function extractLinks(html: string): { text: string, href: string }[] {
    const links: { text: string, href: string }[] = []
    const regex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi
    let match
    while ((match = regex.exec(html)) !== null) {
        links.push({
            href: match[1],
            text: cleanText(match[2])
        })
    }
    return links
}

async function main() {
    // Read stdin
    const rawText = fs.readFileSync(0, "utf-8")
    if (!rawText) return

    const map = loadMap() // list of all municipalities

    // Load existing pending
    let pending: OutputRecord[] = []
    if (fs.existsSync(PENDING_PATH)) {
        try {
            pending = JSON.parse(fs.readFileSync(PENDING_PATH, "utf-8"))
        } catch (e) {
            console.warn("Failed to parse existing pending.json, starting fresh.")
        }
    }

    const extracted: OutputRecord[] = []
    let newCount = 0
    let dupCount = 0
    let updatedCount = 0

    // Parse HTML links
    const links: { href: string, text: string }[] = []

    // Regex: Match simple <a ... href="...">Text</a>
    const regex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi

    let match
    while ((match = regex.exec(rawText)) !== null) {
        const href = match[1]
        const rawTextContent = match[2]
        const text = cleanText(rawTextContent)
        links.push({ href, text })
    }

    // Filter and Map
    for (const link of links) {
        // Find match in map
        const found = map.find(m => m.name === link.text || m.name === link.text.replace(/\s/g, ''))

        if (found) {
            const isPdf = link.href.toLowerCase().endsWith(".pdf")

            // Check duplication in PENDING (not just current batch)
            const existingIdx = pending.findIndex(e => e.jisCode === found.jisCode)

            if (existingIdx >= 0) {
                // Duplicate found.
                // If the new one is PDF and existing is not, maybe update?
                // Or if we want to capture "latest", we might update.
                // For now, if we already have it, we skip or count as dup.
                // But wait, if we are reparsing the SAME block, it will be all dupes.
                // The user is "Re-saving full text block".
                // I should probably just update if the URL is different?
                const existing = pending[existingIdx]
                if (existing.url !== link.href && !existing.pdfUrl) {
                    // If new is PDF, update pdfUrl?
                    if (isPdf) {
                        pending[existingIdx].pdfUrl = link.href
                        updatedCount++
                    } else {
                        // Different URL? maybe update it?
                        pending[existingIdx].url = link.href
                        updatedCount++
                    }
                } else {
                    dupCount++
                }
                continue
            }

            // Check duplication in current extracted batch (for consistency)
            // (The extracted array is just for this run, but we are appending to pending immediately? No)

            // It's easier to just work on `pending` array directly.

            pending.push({
                prefecture: found.prefectureName,
                municipality: found.name,
                jisCode: found.jisCode,
                url: link.href,
                pdfUrl: isPdf ? link.href : ""
            })
            newCount++
        }
    }

    fs.writeFileSync(PENDING_PATH, JSON.stringify(pending, null, 2))

    console.log(JSON.stringify({
        status: "success",
        totalInPending: pending.length,
        new: newCount,
        updated: updatedCount,
        duplicates: dupCount,
        sample: pending.slice(0, 3)
    }, null, 2))
}

main()
