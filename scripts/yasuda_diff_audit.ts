import * as fs from 'fs'
import * as path from 'path'

const YASUDA_SRC = path.join(process.cwd(), 'data/imports/yasuda_municipality_links.json')
const PENDING_SRC = path.join(process.cwd(), 'data/imports/pending.json')
const MAP_SRC = path.join(process.cwd(), 'data/imports/municipality_map.json')
const OUT_REPORT = path.join(process.cwd(), 'data/imports/yasuda_diff_report.md')
const OUT_CANDIDATE = path.join(process.cwd(), 'data/imports/yasuda_clean_candidate.json')

interface YasudaRecord {
    prefecture?: string
    municipality: string
    url: string
}

interface PendingRecord {
    prefecture: string
    municipality: string
    jisCode: string
    url: string
    pdfUrl: string
    [key: string]: any
}

interface MapRecord {
    jisCode: string
    name: string
    prefectureName: string
    municipalitySlug: string
}

function cleanName(name: string): string {
    return name.replace(/[\s　]+/g, '').trim()
}

function isPdf(url: string): boolean {
    if (!url) return false;
    const lower = url.toLowerCase()
    return lower.endsWith('.pdf') || lower.includes('.pdf?') || lower.includes('=pdf') || lower.includes('pdf=')
}

async function main() {
    if (!fs.existsSync(YASUDA_SRC)) {
        console.error("Not found:", YASUDA_SRC)
        process.exit(1)
    }

    const yasudaData: any[] = JSON.parse(fs.readFileSync(YASUDA_SRC, 'utf-8'))
    const pendingData: PendingRecord[] = fs.existsSync(PENDING_SRC)
        ? JSON.parse(fs.readFileSync(PENDING_SRC, 'utf-8'))
        : []
    const mapData: MapRecord[] = fs.existsSync(MAP_SRC)
        ? JSON.parse(fs.readFileSync(MAP_SRC, 'utf-8'))
        : []

    // 1. JSONの列構造を解析
    const keys = Array.from(new Set(yasudaData.flatMap(Object.keys)))
    const totalCount = yasudaData.length
    const emptyMunicipalityCount = yasudaData.filter(r => !r.municipality || r.municipality.trim() === '').length
    const emptyUrlCount = yasudaData.filter(r => !r.url || r.url.trim() === '').length

    // 2. 自治体名を municipality_map.json と照合
    const pendingMap = new Map(pendingData.map(p => [p.jisCode, p]))

    // Create lookup for map data
    // Map uses { cleanName -> MapRecord[] } since names can duplicate across prefectures
    const nameMap = new Map<string, MapRecord[]>()
    for (const m of mapData) {
        const c = cleanName(m.name)
        if (!nameMap.has(c)) nameMap.set(c, [])
        nameMap.get(c)!.push(m)
    }

    const unmatched: any[] = []
    const duplicates: any[] = []
    const updates: any[] = []
    const newCandidates: any[] = []

    // For tracking yasuda duplicates by JIS limit
    const seenJisCodes = new Map<string, number>()

    let matchCount = 0
    let pdfCount = 0

    for (const row of yasudaData) {
        const rawMuni = row.municipality || ''
        const rawPref = row.prefecture || ''
        const rawUrl = row.url || ''

        const isUrlPdf = isPdf(rawUrl)
        if (isUrlPdf) pdfCount++

        if (!rawMuni) {
            unmatched.push({ ...row, _reason: "EMPTY_MUNICIPALITY" })
            continue
        }

        const cName = cleanName(rawMuni)
        const possibleMatches = nameMap.get(cName) || []

        let match: MapRecord | undefined = undefined
        if (possibleMatches.length === 1) {
            match = possibleMatches[0]
        } else if (possibleMatches.length > 1) {
            if (rawPref) {
                match = possibleMatches.find(p => p.prefectureName === rawPref)
            }
            if (!match) {
                // Cannot disambiguate without prefecture or mismatch
                unmatched.push({ ...row, _reason: "DUPLICATE_NAME_IN_MASTER" })
                continue
            }
        }

        if (!match) {
            // try some fuzzy logic if needed, but per prompt: 完全一致で name に当てる
            unmatched.push({ ...row, _reason: "NO_MATCH_IN_MASTER" })
            continue
        }

        matchCount++

        const candidate = {
            prefecture: match.prefectureName,
            municipality: match.name,
            jisCode: match.jisCode,
            municipalitySlug: match.municipalitySlug,
            url: rawUrl,
            pdfCandidate: isUrlPdf
        }

        // Check for duplicates within yasuda data itself
        if (seenJisCodes.has(match.jisCode)) {
            seenJisCodes.set(match.jisCode, seenJisCodes.get(match.jisCode)! + 1)
            duplicates.push({ ...candidate, _reason: "MULTIPLE_IN_SRC" })
        } else {
            seenJisCodes.set(match.jisCode, 1)

            // 3. pending.json と比較
            const existing = pendingMap.get(match.jisCode)
            if (existing) {
                const urlDiff = existing.url !== rawUrl
                const existingPdf = isPdf(existing.url) || !!existing.pdfUrl
                const pdfDiffType = (!existingPdf && isUrlPdf)

                if (urlDiff || pdfDiffType) {
                    updates.push({
                        ...candidate,
                        _pendingUrl: existing.url,
                        _pendingPdfUrl: existing.pdfUrl,
                        _diffReason: urlDiff ? "URL_MISMATCH" : "PDF_DISCOVERY"
                    })
                }
            } else {
                newCandidates.push(candidate)
            }
        }
    }

    const reportLines: string[] = []
    reportLines.push(`# Yasuda Diff Audit Report`)
    reportLines.push(`Date: ${new Date().toLocaleString('ja-JP')}`)
    reportLines.push(``)

    reportLines.push(`## 1. 入力データ概要`)
    reportLines.push(`- 検出キー: [${keys.join(', ')}]`)
    reportLines.push(`- 総行数: ${totalCount}`)
    reportLines.push(`- 自治体名空値: ${emptyMunicipalityCount}`)
    reportLines.push(`- URL空値: ${emptyUrlCount}`)
    reportLines.push(``)

    reportLines.push(`## 2. 照合サマリー`)
    reportLines.push(`- 照合成功: ${matchCount} (${(((matchCount / totalCount) || 0) * 100).toFixed(1)}%)`)
    reportLines.push(`- PDF判定数: ${pdfCount}`)
    reportLines.push(`- 重複（同一JIS複数）: ${duplicates.length}`)
    reportLines.push(`- 照合不能: ${unmatched.length}`)
    reportLines.push(``)

    reportLines.push(`## 3. 差分結果`)
    reportLines.push(`- 新規候補 (Pending非該当): ${newCandidates.length}`)
    reportLines.push(`- 上書き候補 (Pending有・URL/PDF差分有): ${updates.length}`)
    reportLines.push(``)

    reportLines.push(`### 照合不能リスト (上位50件)`)
    unmatched.slice(0, 50).forEach(u => {
        reportLines.push(`- [${u._reason}] ${u.prefecture || ''}${u.municipality || 'N/A'}`)
    })

    fs.writeFileSync(OUT_REPORT, reportLines.join('\n'))

    const cleanCandidateJson = {
        summary: {
            total: totalCount,
            matched: matchCount,
            newCandidates: newCandidates.length,
            updates: updates.length,
            duplicates: duplicates.length,
            unmatched: unmatched.length,
            pdfCount
        },
        unmatched,
        duplicates,
        updates,
        newCandidates
    }

    fs.writeFileSync(OUT_CANDIDATE, JSON.stringify(cleanCandidateJson, null, 2))

    console.log("=== Yasuda Diff Audit Summary ===")
    console.log(`総件数: ${totalCount}`)
    console.log(`照合成功: ${matchCount} (${(((matchCount / totalCount) || 0) * 100).toFixed(1)}%)`)
    console.log(`上書き候補件数 (updates): ${updates.length}`)
    console.log(`新規候補件数 (newCandidates): ${newCandidates.length}`)
    console.log(`重複候補件数 (duplicates): ${duplicates.length}`)
    console.log(`照合不能件数 (unmatched): ${unmatched.length}`)
    console.log(`pdfCandidate件数: ${pdfCount}`)
}

main().catch(console.error)
