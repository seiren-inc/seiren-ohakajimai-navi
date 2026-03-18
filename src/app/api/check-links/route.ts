/**
 * Vercel Cron Job: 自治体リンク自動検査
 * スケジュール: 毎週月曜日 00:00 UTC (= 09:00 JST)
 * vercel.json で設定済み
 *
 * 結果はDBの LinkCheckRun + AuditLog + Municipality.linkStatus に書き込む。
 * 管理画面 /admin/link-check でレポートを確認できる。
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const TIMEOUT_MS = 10000
const CONCURRENCY = 15

interface CheckResult {
  municipalityId: string
  jisCode: string
  name: string
  prefectureName: string
  urlType: 'url' | 'pdfUrl'
  targetUrl: string
  httpStatus: number | null
  ok: boolean
  auditResult: 'OK' | 'REDIRECT' | 'CLIENT_ERROR' | 'SERVER_ERROR' | 'TIMEOUT' | 'DNS_ERROR' | 'UNKNOWN_ERROR'
  errorMessage: string | null
}

async function checkUrl(url: string): Promise<{
  httpStatus: number | null
  ok: boolean
  auditResult: CheckResult['auditResult']
  errorMessage: string | null
}> {
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

    // 405 = HEADを拒否してGETのみ許可している自治体サイト → 正常とみなす
    if (res.ok || res.status === 405) {
      return { httpStatus: res.status, ok: true, auditResult: 'OK', errorMessage: null }
    }
    if (res.status >= 300 && res.status < 400) {
      return { httpStatus: res.status, ok: true, auditResult: 'REDIRECT', errorMessage: null }
    }
    if (res.status >= 400 && res.status < 500) {
      return { httpStatus: res.status, ok: false, auditResult: 'CLIENT_ERROR', errorMessage: `HTTP ${res.status}` }
    }
    if (res.status >= 500) {
      return { httpStatus: res.status, ok: false, auditResult: 'SERVER_ERROR', errorMessage: `HTTP ${res.status}` }
    }
    return { httpStatus: res.status, ok: false, auditResult: 'UNKNOWN_ERROR', errorMessage: `HTTP ${res.status}` }
  } catch (e: unknown) {
    if (e instanceof Error) {
      if (e.name === 'AbortError') {
        return { httpStatus: null, ok: false, auditResult: 'TIMEOUT', errorMessage: 'TIMEOUT' }
      }
      if (e.message.includes('getaddrinfo') || e.message.includes('ENOTFOUND')) {
        return { httpStatus: null, ok: false, auditResult: 'DNS_ERROR', errorMessage: e.message }
      }
    }
    return { httpStatus: null, ok: false, auditResult: 'UNKNOWN_ERROR', errorMessage: String(e) }
  }
}

async function runWithConcurrency<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results: T[] = []
  const queue = [...tasks]
  const pool: Promise<void>[] = []

  async function runNext(): Promise<void> {
    const task = queue.shift()
    if (!task) return
    const result = await task()
    results.push(result)
    await runNext()
  }

  for (let i = 0; i < Math.min(limit, queue.length); i++) {
    pool.push(runNext())
  }
  await Promise.all(pool)
  return results
}

export async function GET(req: NextRequest) {
  // セキュリティ: Vercel Cron認証ヘッダーを確認
  // Vercelは自動でAuthorization: Bearer <CRON_SECRET>を付与する
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startedAt = new Date()

  // 実行レコードを作成
  const run = await prisma.linkCheckRun.create({
    data: {
      status: 'RUNNING',
    },
  })

  try {
    // URLを持つ全自治体を取得
    const municipalities = await prisma.municipality.findMany({
      select: {
        id: true,
        jisCode: true,
        name: true,
        prefectureName: true,
        url: true,
        pdfUrl: true,
      },
      where: {
        OR: [{ url: { not: null } }, { pdfUrl: { not: null } }],
        isPublished: true,
      },
    })

    // チェックタスクを生成
    const tasks: (() => Promise<CheckResult>)[] = []
    for (const m of municipalities) {
      if (m.url) {
        tasks.push(async () => {
          const r = await checkUrl(m.url!)
          return {
            municipalityId: m.id,
            jisCode: m.jisCode,
            name: m.name,
            prefectureName: m.prefectureName,
            urlType: 'url' as const,
            targetUrl: m.url!,
            ...r,
          }
        })
      }
      if (m.pdfUrl) {
        tasks.push(async () => {
          const r = await checkUrl(m.pdfUrl!)
          return {
            municipalityId: m.id,
            jisCode: m.jisCode,
            name: m.name,
            prefectureName: m.prefectureName,
            urlType: 'pdfUrl' as const,
            targetUrl: m.pdfUrl!,
            ...r,
          }
        })
      }
    }

    const results = await runWithConcurrency(tasks, CONCURRENCY)

    const broken = results.filter(r => !r.ok)
    const fixed = results.filter(r => r.ok)

    // AuditLogに結果を一括保存
    await prisma.auditLog.createMany({
      data: results.map(r => ({
        municipalityId: r.municipalityId,
        targetUrl: r.targetUrl,
        httpStatus: r.httpStatus,
        result: r.auditResult,
        errorMessage: r.errorMessage,
      })),
    })

    // MunicipalityのlinkStatusを更新（壊れているものをBROKEN、直ったものをOKに）
    await Promise.all(
      municipalities.map(async (m) => {
        const mResults = results.filter(r => r.municipalityId === m.id)
        const hasBroken = mResults.some(r => !r.ok)
        const newStatus = hasBroken ? 'BROKEN' : 'OK'
        await prisma.municipality.update({
          where: { id: m.id },
          data: {
            linkStatus: newStatus,
            lastCheckedAt: new Date(),
          },
        })
      })
    )

    // 実行結果を更新
    await prisma.linkCheckRun.update({
      where: { id: run.id },
      data: {
        status: 'SUCCEEDED',
        finishedAt: new Date(),
        totalChecked: results.length,
        brokenCount: broken.length,
        fixedCount: fixed.length,
        notes: `所要時間: ${Math.round((Date.now() - startedAt.getTime()) / 1000)}秒`,
      },
    })

    return NextResponse.json({
      success: true,
      total: results.length,
      passed: fixed.length,
      failed: broken.length,
      runId: run.id,
    })
  } catch (error) {
    // 失敗時はステータスを更新
    await prisma.linkCheckRun.update({
      where: { id: run.id },
      data: {
        status: 'FAILED',
        finishedAt: new Date(),
        notes: String(error),
      },
    })
    console.error('Link check failed:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
