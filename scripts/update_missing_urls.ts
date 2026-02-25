import fs from 'fs'
import path from 'path'

const PENDING_PATH = path.join(process.cwd(), "data/imports/pending.json")

const UPDATES = [
    {
        jisCode: "332054", // Kasaoka
        url: "https://www.city.kasaoka.okayama.jp/soshiki/11/1510.html"
    },
    {
        jisCode: "332119", // Bizen
        url: "https://www.city.bizen.okayama.jp/soshiki/11/1077.html"
    },
    {
        jisCode: "312045", // Sakaiminato
        url: "https://www.city.sakaiminato.lg.jp/index.php?view=10373"
    },
    {
        jisCode: "352071", // Kudamatsu
        url: "https://www.city.kudamatsu.lg.jp/kankyou/kurashi/kankyou/bochi/kaisou.html"
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

    // Output the updated records for verification
    const updatedRecords = pending.filter((r: any) => UPDATES.some(u => u.jisCode === r.jisCode))
    console.log(JSON.stringify(updatedRecords, null, 2))
}

main()
