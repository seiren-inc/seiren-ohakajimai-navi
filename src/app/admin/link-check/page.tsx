import { Metadata } from 'next'
import Link from 'next/link'
import {
  AlertCircle, CheckCircle2, ExternalLink,
  Clock, Building2, RefreshCw, Shield
} from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'リンク検査レポート | 管理画面',
}

// 最新の検査実行を取得
async function getLatestRun() {
  return prisma.linkCheckRun.findFirst({
    orderBy: { startedAt: 'desc' },
  })
}

// 最新Run の壊れているURLを取得
async function getBrokenLinks() {
  const broken = await prisma.municipality.findMany({
    where: {
      linkStatus: 'BROKEN',
      isPublished: true,
    },
    select: {
      id: true,
      jisCode: true,
      name: true,
      prefectureName: true,
      url: true,
      pdfUrl: true,
      lastCheckedAt: true,
      auditLogs: {
        orderBy: { checkedAt: 'desc' },
        take: 2,
        select: {
          targetUrl: true,
          httpStatus: true,
          result: true,
          errorMessage: true,
          checkedAt: true,
        },
      },
    },
    orderBy: [{ prefectureName: 'asc' }, { name: 'asc' }],
  })
  return broken
}

const RESULT_LABEL: Record<string, string> = {
  CLIENT_ERROR: 'リンク切れ（404等）',
  SERVER_ERROR: 'サーバーエラー',
  TIMEOUT: 'タイムアウト',
  DNS_ERROR: 'DNS解決失敗',
  UNKNOWN_ERROR: '不明なエラー',
}

const RESULT_COLOR: Record<string, string> = {
  CLIENT_ERROR: 'bg-red-100 text-red-700',
  SERVER_ERROR: 'bg-orange-100 text-orange-700',
  TIMEOUT: 'bg-yellow-100 text-yellow-700',
  DNS_ERROR: 'bg-red-100 text-red-700',
  UNKNOWN_ERROR: 'bg-slate-100 text-slate-700',
}

export default async function LinkCheckPage() {
  const [latestRun, brokenLinks] = await Promise.all([getLatestRun(), getBrokenLinks()])

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">自治体リンク検査レポート</h1>
          <p className="text-sm text-slate-500 mt-1">
            毎週月曜日09:00（JST）に自動実行。手動実行は下記ボタンから。
          </p>
        </div>
        <a
          href="/api/check-links"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          今すぐ手動実行
        </a>
      </div>

      {/* 最終実行状況 */}
      {latestRun ? (
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-white border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <Building2 className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{latestRun.totalChecked.toLocaleString()}</p>
                <p className="text-xs text-slate-500">検査URL数</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white border border-emerald-200 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">
                  {(latestRun.totalChecked - latestRun.brokenCount).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">正常</p>
              </div>
            </div>
          </div>
          <div className={`rounded-xl bg-white border p-5 ${latestRun.brokenCount > 0 ? 'border-red-200' : 'border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${latestRun.brokenCount > 0 ? 'bg-red-100' : 'bg-slate-100'}`}>
                <AlertCircle className={`h-5 w-5 ${latestRun.brokenCount > 0 ? 'text-red-600' : 'text-slate-400'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${latestRun.brokenCount > 0 ? 'text-red-700' : 'text-slate-400'}`}>
                  {latestRun.brokenCount}
                </p>
                <p className="text-xs text-slate-500">エラー</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <Shield className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  {latestRun.status === 'SUCCEEDED' ? '✅ 正常終了' : latestRun.status === 'FAILED' ? '❌ 失敗' : '⏳ 実行中'}
                </p>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  {new Date(latestRun.startedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Building2 className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">まだ検査が実行されていません</p>
          <p className="mt-1 text-xs text-slate-400">上の「今すぐ手動実行」ボタンを押してください。</p>
        </div>
      )}

      {/* エラー一覧 */}
      {brokenLinks.length === 0 ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
          <p className="mt-3 text-base font-semibold text-emerald-800">
            {latestRun ? '全URLが正常です' : 'エラーのある自治体はありません'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-red-200 bg-white">
          <div className="border-b border-red-100 bg-red-50 px-5 py-4 rounded-t-xl">
            <h2 className="text-sm font-semibold text-red-800">
              リンク切れ検出 — {brokenLinks.length}件の自治体でエラー
            </h2>
            <p className="mt-1 text-xs text-red-600">
              「URL修正」から自治体データ管理ページに移動して正しいURLに更新してください。
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {brokenLinks.map((m) => (
              <div key={m.id} className="flex items-start gap-4 px-5 py-4 hover:bg-red-50/40 transition-colors">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900">{m.prefectureName}</span>
                    <span className="text-sm text-slate-700">{m.name}</span>
                  </div>
                  {m.auditLogs.map((log, i) => (
                    <div key={i} className="flex items-center gap-2 mb-0.5">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${RESULT_COLOR[log.result] ?? 'bg-slate-100 text-slate-700'}`}>
                        {RESULT_LABEL[log.result] ?? log.result}
                      </span>
                      <a
                        href={log.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-xs text-slate-500 hover:text-emerald-600 hover:underline max-w-[300px] sm:max-w-none"
                      >
                        {log.targetUrl}
                      </a>
                      <ExternalLink className="h-3 w-3 shrink-0 text-slate-400" />
                    </div>
                  ))}
                </div>
                <Link
                  href={`/admin/municipalities?search=${encodeURIComponent(m.name)}`}
                  className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  URL修正 →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
