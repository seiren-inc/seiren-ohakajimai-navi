import { Metadata } from 'next'
import Link from 'next/link'
import { AlertCircle, CheckCircle2, ExternalLink, RefreshCw, Clock, Building2 } from 'lucide-react'
import * as fs from 'fs'
import * as path from 'path'

export const metadata: Metadata = {
  title: 'リンク検査レポート | 管理画面',
}

interface ErrorRecord {
  jisCode: string
  name: string
  prefectureName: string
  urlType: 'url' | 'pdfUrl'
  targetUrl: string
  status: number | null
  ok: boolean
  error: string | null
}

interface Report {
  checkedAt: string
  total: number
  passed: number
  failed: number
  errors: ErrorRecord[]
}

function loadReport(): Report | null {
  try {
    const p = path.join(process.cwd(), 'public', 'link-check-report.json')
    if (!fs.existsSync(p)) return null
    return JSON.parse(fs.readFileSync(p, 'utf-8'))
  } catch {
    return null
  }
}

export default function LinkCheckPage() {
  const report = loadReport()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">自治体リンク検査レポート</h1>
          <p className="text-sm text-slate-500 mt-1">
            毎週月曜日に自動実行されます。手動実行は GitHub Actions から行えます。
          </p>
        </div>
        <Link
          href="https://github.com/seiren-inc/seiren-ohakajimai-navi/actions/workflows/link-check.yml"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          手動実行（GitHub Actions）
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {!report ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-lg font-semibold text-slate-700">レポートがありません</h2>
          <p className="mt-2 text-sm text-slate-500">
            GitHub Actions のワークフローを手動実行してレポートを生成してください。<br />
            初回実行後、毎週月曜日に自動で更新されます。
          </p>
          <Link
            href="https://github.com/seiren-inc/seiren-ohakajimai-navi/actions/workflows/link-check.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            ワークフローを実行する
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* サマリーカード */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <Building2 className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{report.total.toLocaleString()}</p>
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
                  <p className="text-2xl font-bold text-emerald-700">{report.passed.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">正常</p>
                </div>
              </div>
            </div>
            <div className={`rounded-xl bg-white border p-5 ${report.failed > 0 ? 'border-red-200' : 'border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${report.failed > 0 ? 'bg-red-100' : 'bg-slate-100'}`}>
                  <AlertCircle className={`h-5 w-5 ${report.failed > 0 ? 'text-red-600' : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${report.failed > 0 ? 'text-red-700' : 'text-slate-400'}`}>
                    {report.failed}
                  </p>
                  <p className="text-xs text-slate-500">エラー</p>
                </div>
              </div>
            </div>
          </div>

          {/* 最終実行時刻 */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            最終検査日時: {new Date(report.checkedAt).toLocaleString('ja-JP', {
              timeZone: 'Asia/Tokyo',
              year: 'numeric', month: '2-digit', day: '2-digit',
              hour: '2-digit', minute: '2-digit',
            })}
          </div>

          {/* エラー一覧 */}
          {report.failed === 0 ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
              <p className="mt-3 text-base font-semibold text-emerald-800">全URLが正常です</p>
              <p className="mt-1 text-sm text-emerald-600">リンク切れは検出されませんでした。</p>
            </div>
          ) : (
            <div className="rounded-xl border border-red-200 bg-white">
              <div className="border-b border-red-100 bg-red-50 px-5 py-4 rounded-t-xl">
                <h2 className="text-sm font-semibold text-red-800">
                  エラー検出 — {report.failed}件のリンク切れが見つかりました
                </h2>
                <p className="mt-1 text-xs text-red-600">
                  以下のURLを修正してください。自治体管理ページから直接URLを更新できます。
                </p>
              </div>
              <div className="divide-y divide-slate-100">
                {report.errors.map((err, i) => (
                  <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-red-50/50 transition-colors">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">{err.prefectureName}</span>
                        <span className="text-sm text-slate-700">{err.name}</span>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {err.urlType === 'pdfUrl' ? 'PDFリンク' : '申請ページ'}
                        </span>
                        {err.status && (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                            HTTP {err.status}
                          </span>
                        )}
                        {err.error && (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                            {err.error}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <a
                          href={err.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-xs text-slate-500 hover:text-emerald-600 hover:underline"
                        >
                          {err.targetUrl}
                        </a>
                        <ExternalLink className="h-3 w-3 shrink-0 text-slate-400" />
                      </div>
                    </div>
                    <Link
                      href={`/admin/municipalities?search=${encodeURIComponent(err.name)}`}
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
      )}
    </div>
  )
}
