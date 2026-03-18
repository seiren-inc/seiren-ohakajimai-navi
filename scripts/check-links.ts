/**
 * 自治体リンク検査スクリプト
 * 使用: npx tsx scripts/check-links.ts
 *
 * Prisma DB から全自治体の url / pdfUrl を取得し、
 * HEADリクエストで死活確認 → 結果を public/link-check-report.json に書き出す。
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()
const TIMEOUT_MS = 8000
const CONCURRENCY = 20

interface CheckResult {
  jisCode: string
  name: string
  prefectureName: string
  urlType: 'url' | 'pdfUrl'
  targetUrl: string
  status: number | null
  ok: boolean
  error: string | null
}

async function checkUrl(url: string): Promise<{ status: number | null; ok: boolean; error: string | null }> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OhakajimaNaviBot/1.0; +https://www.ohakajimai-navi.jp)',
      },
    })
    clearTimeout(timer)
    // 一部の政府系サイトはHEADを拒否しGETのみ許可しているので405もOKとみなす
    const ok = res.ok || res.status === 405
    return { status: res.status, ok, error: null }
  } catch (e: unknown) {
    if (e instanceof Error && e.name === 'AbortError') {
      return { status: null, ok: false, error: 'TIMEOUT' }
    }
    return { status: null, ok: false, error: String(e) }
  }
}

async function runWithConcurrency<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results: T[] = []
  const executing: Promise<void>[] = []

  for (const task of tasks) {
    const p = task().then(result => {
      results.push(result)
    })
    executing.push(p)
    if (executing.length >= limit) {
      await Promise.race(executing)
      // Remove settled promises
      for (let i = executing.length - 1; i >= 0; i--) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((executing[i] as any)._settled) executing.splice(i, 1)
      }
    }
  }
  await Promise.all(executing)
  return results
}

async function main() {
  console.log('🔍 自治体リンク検査を開始します...')

  const municipalities = await prisma.municipality.findMany({
    select: {
      jisCode: true,
      name: true,
      prefectureName: true,
      url: true,
      pdfUrl: true,
    },
    where: {
      OR: [{ url: { not: null } }, { pdfUrl: { not: null } }],
    },
  })

  console.log(`📋 検査対象: ${municipalities.length}件の自治体`)

  // フラットなタスクリストを生成
  const allTasks: (() => Promise<CheckResult>)[] = []
  for (const m of municipalities) {
    if (m.url) {
      allTasks.push(async () => {
        const r = await checkUrl(m.url!)
        process.stdout.write('.')
        return { jisCode: m.jisCode, name: m.name, prefectureName: m.prefectureName, urlType: 'url' as const, targetUrl: m.url!, ...r }
      })
    }
    if (m.pdfUrl) {
      allTasks.push(async () => {
        const r = await checkUrl(m.pdfUrl!)
        process.stdout.write('.')
        return { jisCode: m.jisCode, name: m.name, prefectureName: m.prefectureName, urlType: 'pdfUrl' as const, targetUrl: m.pdfUrl!, ...r }
      })
    }
  }

  console.log(`\n🚀 ${allTasks.length}件のURLを並列チェック中 (並列数: ${CONCURRENCY})...`)
  const results = await runWithConcurrency(allTasks, CONCURRENCY)
  console.log(`\n✅ チェック完了`)

  const failed = results.filter(r => !r.ok)
  const passed = results.filter(r => r.ok)

  console.log(`\n📊 結果: ${passed.length}件OK / ${failed.length}件エラー`)

  // レポートをpublicに書き出し（管理画面から読み込むため）
  const report = {
    checkedAt: new Date().toISOString(),
    total: results.length,
    passed: passed.length,
    failed: failed.length,
    errors: failed.sort((a, b) => a.prefectureName.localeCompare(b.prefectureName, 'ja')),
  }

  const outputPath = path.join(process.cwd(), 'public', 'link-check-report.json')
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8')
  console.log(`\n💾 レポート保存: ${outputPath}`)

  if (failed.length > 0) {
    console.log('\n⚠️  エラーが検出されました:')
    failed.forEach(f => {
      console.log(`  ❌ [${f.prefectureName}] ${f.name} (${f.urlType}): ${f.targetUrl} → ${f.status ?? f.error}`)
    })
    // GitHub Actions で失敗ステータスを返す
    process.exit(1)
  } else {
    console.log('\n🎉 全URLが有効です！')
    process.exit(0)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
