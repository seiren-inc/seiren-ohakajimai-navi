import fs from 'fs'
import path from 'path'

const PENDING_PATH = path.join(process.cwd(), "data/imports/pending.json")

function main() {
    if (!fs.existsSync(PENDING_PATH)) {
        console.error("pending.json not found")
        return
    }

    const pending = JSON.parse(fs.readFileSync(PENDING_PATH, "utf-8"))
    const jisCode = "174076" // Nakanoto

    const record = pending.find((r: any) => r.jisCode === jisCode)
    if (record) {
        record.url = null
        // pdfUrl remains as is
        record.linkStatus = "NEEDS_REVIEW"
        record.notes = "公式ページ未特定（PDF直リンクのみ）"

        console.log(`Updated ${record.municipality} (${jisCode}):`)
        console.log(JSON.stringify(record, null, 2))
    } else {
        console.error(`Record not found for JIS ${jisCode}`)
    }

    fs.writeFileSync(PENDING_PATH, JSON.stringify(pending, null, 2))
}

main()
