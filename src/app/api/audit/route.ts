/**
 * Stage 6: 内部AI監査バッチ (Vercel Cron エンドポイント)
 *
 * スケジュール: 毎日 01:00 UTC (= 10:00 JST)
 * vercel.json: { "path": "/api/audit", "schedule": "0 1 * * *" }
 *
 * 【認証】
 * CRON_SECRET 環境変数が設定されている場合、
 * Vercel Cron が自動付与する Authorization: Bearer <CRON_SECRET>
 * ヘッダーを検証する（/api/check-links と同一パターン）。
 * 手動実行: curl -H "Authorization: Bearer $CRON_SECRET" /api/audit
 *
 * 【監査内容 (T6-01〜07)】
 * 1. 重大違反の事前チェック（件数・slug重複・PDF_ONLY見逃し）
 * 2. UNKNOWN/NEEDS_REVIEW/OK のサンプル50件を AI で論理矛盾チェック
 * 3. 結果は Vercel ランタイムログに蓄積（レスポンスにも含める）
 *
 * 共有ロジック（スキーマ・プロンプト）は src/lib/ai-audit.ts を参照。
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AuditResultSchema, buildAuditPrompt } from '@/lib/ai-audit'
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

const TOTAL_MUNICIPALITIES = 1737

export async function GET(req: NextRequest) {
  // 認証: /api/check-links と同一パターン（Vercel Cron 標準）
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startedAt = new Date()
  const log: string[] = []

  // ── [1/3] 重大違反の事前チェック (T6-06) ──────────────────────────────
  log.push('[1/3] 重大違反チェック（件数・slug重複・PDF_ONLY見逃し）を開始')

  const count = await prisma.municipality.count()
  if (count !== TOTAL_MUNICIPALITIES) {
    const msg = `[重大違反] 自治体件数が ${TOTAL_MUNICIPALITIES} ではありません（現在: ${count}）`
    console.error(msg)
    return NextResponse.json({ ok: false, critical: true, message: msg, log }, { status: 500 })
  }
  log.push(`✅ 件数チェック PASSED: ${count}件`)

  const allSlugs = await prisma.municipality.findMany({
    select: { prefectureSlug: true, municipalitySlug: true },
  })
  const slugPairs = allSlugs.map((s) => `${s.prefectureSlug}/${s.municipalitySlug}`)
  if (slugPairs.length !== new Set(slugPairs).size) {
    const msg = '[重大違反] Prefecture/MunicipalityのSlug組み合わせに重複が存在します。'
    console.error(msg)
    return NextResponse.json({ ok: false, critical: true, message: msg, log }, { status: 500 })
  }
  log.push('✅ slug重複チェック PASSED')

  const pdfOnlyViolations = await prisma.municipality.findMany({
    where: {
      url: { endsWith: '.pdf', mode: 'insensitive' },
      linkStatus: { not: 'PDF_ONLY' },
    },
    select: { jisCode: true, name: true, url: true, linkStatus: true },
  })
  if (pdfOnlyViolations.length > 0) {
    const msg = `[重大違反] urlが.pdfで終わるがlinkStatusがPDF_ONLYでないレコードが${pdfOnlyViolations.length}件存在します。`
    console.error(msg, pdfOnlyViolations)
    return NextResponse.json(
      { ok: false, critical: true, message: msg, violations: pdfOnlyViolations, log },
      { status: 500 },
    )
  }
  log.push('✅ PDF_ONLY見逃しチェック PASSED')

  // ── [2/3] AI による論理矛盾チェック (T6-01〜05) ──────────────────────
  log.push('[2/3] AIによる論理矛盾の監査を開始')

  if (!process.env.OPENAI_API_KEY) {
    const msg = '⚠️ OPENAI_API_KEY 未設定のためAI監査をスキップします（重大違反チェックは完了）'
    log.push(msg)
    console.warn(msg)
    return NextResponse.json({
      ok: true,
      skippedAiAudit: true,
      message: msg,
      log,
      durationMs: Date.now() - startedAt.getTime(),
    })
  }

  const targets = await prisma.municipality.findMany({
    where: { linkStatus: { in: ['UNKNOWN', 'NEEDS_REVIEW', 'OK'] } },
    take: 50,
    select: {
      jisCode: true,
      name: true,
      url: true,
      pdfUrl: true,
      linkStatus: true,
      hasDomainWarning: true,
    },
  })

  if (targets.length === 0) {
    log.push('監査対象レコードなし。正常終了。')
    return NextResponse.json({ ok: true, log })
  }

  // 共有モジュールのプロンプトビルダーを使用 (T6-02, T6-03)
  const { object } = await generateObject({
    model: openai('gpt-4o-2024-08-06'),
    schema: AuditResultSchema,
    prompt: buildAuditPrompt(targets),
    temperature: 0,
  })

  // ── [3/3] 結果ログ (T6-04, T6-05) ────────────────────────────────────
  log.push(`✅ AI監査完了: 検知異常 ${object.violations.length}件`)
  object.violations.forEach((v) => {
    const entry = `[${v.jisCode}] ${v.municipalityName}: ${v.issueType} - ${v.description}`
    log.push(entry)
    console.warn('[AI監査違反]', entry)
  })

  const durationMs = Date.now() - startedAt.getTime()
  log.push(`所要時間: ${Math.round(durationMs / 1000)}秒`)

  return NextResponse.json({
    ok: true,
    totalChecked: targets.length,
    violationCount: object.violations.length,
    violations: object.violations,
    auditedJisCodes: targets.map((t) => t.jisCode),
    log,
    durationMs,
  })
}
