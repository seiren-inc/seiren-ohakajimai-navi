import * as fs from 'fs'
import * as path from 'path'

const PENDING_SRC = path.join(process.cwd(), 'data/imports/pending.json')

function main() {
    const data: any[] = JSON.parse(fs.readFileSync(PENDING_SRC, 'utf-8'))

    const TARGET_JIS = ["133817", "134015"]

    let modifiedCount = 0

    for (const record of data) {
        if (TARGET_JIS.includes(record.jisCode)) {
            const before = JSON.parse(JSON.stringify(record))

            // Fix PDF URL assignment
            if (record.url && record.url.toLowerCase().endsWith('.pdf')) {
                record.pdfUrl = record.url
                record.url = null
            }

            // Set linkStatus to PDF_ONLY if not already
            if (record.linkStatus !== 'PDF_ONLY') {
                record.linkStatus = 'PDF_ONLY'
            }

            // linkType remains 'PDF'
            if (record.linkType !== 'PDF') {
                record.linkType = 'PDF'
            }

            // Handle notes
            if (record.notes === 'prevUrl: null') {
                delete record.notes
            } else if (record.notes && record.notes.includes('prevUrl: null')) {
                record.notes = record.notes.replace('prevUrl: null', '').replace(/\|\s*$/, '').trim()
                if (record.notes === '') {
                    delete record.notes
                }
            }

            const after = JSON.parse(JSON.stringify(record))
            console.log(`\n--- Before & After for JIS: ${record.jisCode} (${record.municipality}) ---`)
            console.log("Before:", JSON.stringify(before, null, 2))
            console.log("After:", JSON.stringify(after, null, 2))

            modifiedCount++
        }
    }

    if (modifiedCount > 0) {
        fs.writeFileSync(PENDING_SRC, JSON.stringify(data, null, 2))
        console.log(`\nModified ${modifiedCount} records. Saved to pending.json.`)
    } else {
        console.log("No matching records were modified.")
    }
}

main()
