import { prisma } from '../src/lib/prisma'

async function main() {
    console.log("Starting reclassification of Data Quality Levels...")

    const municipalities = await prisma.municipality.findMany({
        select: {
            id: true,
            jisCode: true,
            name: true,
            url: true,
            linkStatus: true,
            notes: true,
            prefectureName: true
        }
    })

    console.log(`Processing ${municipalities.length} records...`)

    let level3Count = 0
    let level2Count = 0
    let level1Count = 0
    let level0Count = 0

    for (const m of municipalities) {
        let level = 0

        // Level 3: linkStatus=OK and dedicated reburial page
        // We assume linkStatus OK means we found something. 
        // Based on the user instruction: "改葬専用ページ → 3", "墓地/埋葬一般案内 → 2"
        // Since we don't have a structured flag for "dedicated reburial page" vs "general", 
        // we'll use heuristic: If linkStatus=OK and url/notes don't imply "window only" or "general".
        // Actually, during supplementation, we set linkStatus=OK for reburial guidance.
        // For general cemetery/burial guidance, we might have used OK but added general notes.
        
        if (m.linkStatus === 'OK') {
            const highPriorityKeywords = ['改葬許可', '改葬手続', '墓じまい', '改葬専用']
            const isDedicated = highPriorityKeywords.some(k => m.url?.includes('kaisou') || m.url?.includes('kaiso') || m.notes?.includes(k))

            if (isDedicated) {
                level = 3
                level3Count++
            } else {
                level = 2
                level2Count++
            }
        } 
        else if (m.linkStatus === 'NEEDS_REVIEW' && m.url) {
            const isWindowOnly = m.notes?.includes('窓口案内のみ') || m.notes?.includes('担当課')
            if (isWindowOnly) {
                level = 1
                level1Count++
            } else {
                level = 1 // Default to 1 if it has a URL but NEEDS_REVIEW
                level1Count++
            }
        }
        else {
            level = 0
            level0Count++
        }

        await prisma.municipality.update({
            where: { id: m.id },
            data: { dataQualityLevel: level }
        })
    }

    console.log("\n--- Classification Result ---")
    console.log(`Level 3 (Dedicated): ${level3Count}`)
    console.log(`Level 2 (General):   ${level2Count}`)
    console.log(`Level 1 (Window):    ${level1Count}`)
    console.log(`Level 0 (Other):     ${level0Count}`)
    console.log("----------------------------")

    // Generate Prefecture Distribution
    const stats = await prisma.municipality.groupBy({
        by: ['prefectureName', 'dataQualityLevel'],
        _count: { _all: true },
        orderBy: [
            { prefectureName: 'asc' },
            { dataQualityLevel: 'desc' }
        ]
    })

    console.log("\n--- Prefecture Distribution ---")
    let currentPref = ""
    for (const s of stats) {
        if (s.prefectureName !== currentPref) {
            currentPref = s.prefectureName || "Unknown"
            process.stdout.write(`\n${currentPref}: `)
        }
        process.stdout.write(`L${s.dataQualityLevel}(${s._count._all}) `)
    }
    console.log("\n")
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
