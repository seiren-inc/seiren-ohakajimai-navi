import * as fs from 'fs'
import * as path from 'path'

const CANDIDATE_SRC = path.join(process.cwd(), 'data/imports/yasuda_clean_candidate.json')
const PENDING_SRC = path.join(process.cwd(), 'data/imports/pending.json')
const OUT_REPORT = path.join(process.cwd(), 'data/imports/yasuda_apply_report.md')

interface UpdateCandidate {
    prefecture: string
    municipality: string
    jisCode: string
    municipalitySlug: string
    url: string
    pdfCandidate: boolean
    _pendingUrl: string
    _pendingPdfUrl: string
    _diffReason: string
}

function isValidUrl(url: string): boolean {
    if (!url) return false;
    try {
        const parsed = new URL(url)
        return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
        return false;
    }
}

function matchesDomainCriteria(url: string): boolean {
    // Basic check: should ideally contain .lg.jp, .jp, etc., but just ensure it's not a known bad domain.
    // In v2.1, standard govt domains were lg.jp, or specific town.xx.jp, city.xx.jp, etc.
    const lower = url.toLowerCase()
    return lower.includes('.jp') || lower.includes('.com') || lower.includes('.org') || lower.includes('.net') || lower.includes('.info')
}

async function main() {
    if (!fs.existsSync(CANDIDATE_SRC)) {
        console.error("Not found:", CANDIDATE_SRC)
        process.exit(1)
    }

    const candidateData = JSON.parse(fs.readFileSync(CANDIDATE_SRC, 'utf-8'))
    const updates: UpdateCandidate[] = candidateData.updates || []

    if (updates.length !== 3) {
        console.log(`Warning: expected exactly 3 updates, found ${updates.length}. Proceeding anyway to check them.`)
    }

    const pendingData: any[] = JSON.parse(fs.readFileSync(PENDING_SRC, 'utf-8'))

    const reportLines: string[] = []
    reportLines.push(`# Yasuda Diff Apply Report`)
    reportLines.push(`Date: ${new Date().toLocaleString('ja-JP')}`)
    reportLines.push(``)
    reportLines.push(`## 反映対象 (3件想定)`)

    let appliedCount = 0

    // Build JIS lookup for pending
    const pendingMap = new Map<string, any>()
    pendingData.forEach((p, idx) => {
        pendingMap.set(p.jisCode, { record: p, index: idx })
    })

    for (const update of updates) {
        const yasudaUrl = update.url
        const resultLines: string[] = []
        resultLines.push(`### ${update.prefecture} ${update.municipality} (JIS: ${update.jisCode})`)
        resultLines.push(`- Yasuda URL: ${yasudaUrl}`)
        resultLines.push(`- Pending URL: ${update._pendingUrl}`)

        let isAcceptable = true
        let rejectReason = ""

        if (!isValidUrl(yasudaUrl)) {
            isAcceptable = false
            rejectReason = "Invalid URL formats"
        } else if (!matchesDomainCriteria(yasudaUrl)) {
            isAcceptable = false
            rejectReason = "Domain fails basic inclusion criteria (.jp etc)"
        }

        if (isAcceptable) {
            const hasKeyword = /kaisou|改葬|墓地|埋葬|許可/i.test(decodeURIComponent(yasudaUrl))
            resultLines.push(`- 判定: 採用 (キーワード加点: ${hasKeyword ? "あり" : "なし"})`)

            // Apply to pending
            const targetInfo = pendingMap.get(update.jisCode)
            if (targetInfo) {
                const targetRecord = targetInfo.record

                // Add note
                const oldNote = targetRecord.notes ? targetRecord.notes + " | " : ""
                targetRecord.notes = oldNote + `prevUrl: ${targetRecord.url}`

                // Update url
                targetRecord.url = yasudaUrl

                appliedCount++
                resultLines.push(`- 変更完了: Pending側のURLを更新し、旧URLをnotesに退避しました。`)
            } else {
                resultLines.push(`- 変更失敗: Pending内にJIS=${update.jisCode}が見つかりませんでした。`)
            }
        } else {
            resultLines.push(`- 判定: 破棄 (理由: ${rejectReason})`)
        }

        reportLines.push(resultLines.join('\n'))
        reportLines.push(``)
    }

    reportLines.push(`## サマリー`)
    reportLines.push(`- 処理対象件数: ${updates.length}`)
    reportLines.push(`- 採用・変更件数: ${appliedCount}`)
    reportLines.push(`- 破棄件数: ${updates.length - appliedCount}`)

    fs.writeFileSync(OUT_REPORT, reportLines.join('\n'))

    if (appliedCount > 0) {
        fs.writeFileSync(PENDING_SRC, JSON.stringify(pendingData, null, 2))
        console.log(`Success: Applied ${appliedCount} updates to pending.json`)
    } else {
        console.log("No updates were applied.")
    }
}

main().catch(console.error)
