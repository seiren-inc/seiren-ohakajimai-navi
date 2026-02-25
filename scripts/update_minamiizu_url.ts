import fs from 'fs'
import path from 'path'

const PENDING_PATH = path.join(process.cwd(), "data/imports/pending.json")

const UPDATES = [
    {
        jisCode: "223042", // Minamiizu
        url: "https://www.town.minamiizu.shizuoka.jp/docs/2013030800128/"
    }
]

function main() {
    if (!fs.existsSync(PENDING_PATH)) {
        console.error("pending.json not found")
        return
    }

    const pending = JSON.parse(fs.readFileSync(PENDING_PATH, "utf-8"))
    let updateCount = 0

    for (const update of UPDATES) {
        const record = pending.find((r: any) => r.jisCode === update.jisCode)
        if (record) {
            record.url = update.url
            updateCount++
            console.log(`Updated ${record.municipality} (${record.jisCode}): set url to ${update.url}`)
        } else {
            console.log(`Record not found for JIS ${update.jisCode}`)
        }
    }

    fs.writeFileSync(PENDING_PATH, JSON.stringify(pending, null, 2))
    console.log(`\nTotal updated: ${updateCount}`)
}

main()
