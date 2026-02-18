import { prisma } from '../src/lib/prisma'
import fs from 'fs'
import path from 'path'

const MASTER_PATH = path.join(process.cwd(), "data/imports/master_municipalities.json")

async function main() {
    // 1. Fetch Fukuoka (401307)
    const fukuoka = await prisma.municipality.findUnique({
        where: { jisCode: "401307" }
    })

    console.log("--- 1) 福岡市（jisCode=401307）のレコード ---")
    if (fukuoka) {
        console.log(`prefecture: ${fukuoka.prefectureName}`)
        console.log(`municipality: ${fukuoka.name}`)
        console.log(`jisCode: ${fukuoka.jisCode}`)
        console.log(`municipalitySlug: ${fukuoka.municipalitySlug}`)
        console.log(`url: ${fukuoka.url}`)
        console.log(`pdfUrl: ${fukuoka.pdfUrl}`)
    } else {
        console.log("Record not found")
    }
    console.log("")

    // 2. Slug Generation Logic (Mocking the function used in update script)
    console.log("--- 2) slug生成ルールの実装箇所 ---")
    const codeSnippet = `
    // Determine target suffix
    const kanji = m.name_kanji
    let targetSuffix = ""
    if (kanji.endsWith("市")) targetSuffix = "-shi"
    else if (kanji.endsWith("区")) targetSuffix = "-ku"
    else if (kanji.endsWith("町")) targetSuffix = "-cho"
    else if (kanji.endsWith("村")) targetSuffix = "-son"
    
    // ... (Base name extraction) ...
    
    const newSlug = (baseName + targetSuffix).toLowerCase()
    `
    console.log(codeSnippet)
    console.log("")

    // 3. 5 Examples
    console.log("--- 3) 直近で提示した slug生成例（福岡県5件）の再出力 ---")
    const examples = ["401005", "401307", "402028", "402036", "402044"]
    const records = await prisma.municipality.findMany({
        where: { jisCode: { in: examples } }
    })

    // Order them
    const ordered = examples.map(code => records.find(r => r.jisCode === code))

    ordered.forEach(r => {
        if (r) {
            console.log(`${r.name}: ${r.municipalitySlug}`)
        }
    })
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
