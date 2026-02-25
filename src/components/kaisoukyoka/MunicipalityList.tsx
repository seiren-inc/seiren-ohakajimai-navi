'use client'

import React from 'react'
import { ExternalLink, FileCheck, FileText, Search, AlertCircle } from 'lucide-react'

interface SubLink {
  name: string
  url: string
}

interface Municipality {
  jisCode: string
  name: string
  prefectureName: string
  municipalitySlug: string
  url: string | null
  pdfUrl: string | null
  subLinks: SubLink[] | null
  dataQualityLevel: number
}

interface MunicipalityListProps {
  municipalities: Municipality[]
  onLinkClick?: (name: string) => void
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function MunicipalityList({ municipalities, onLinkClick }: MunicipalityListProps) {
  const getTargetUrl = (m: Pick<Municipality, 'url' | 'pdfUrl'>) => {
    return m.pdfUrl || m.url || '#'
  }

  return (
    <div className="space-y-2">
      {municipalities.map((m) => {
        const hasLink = !!(m.url || m.pdfUrl)
        const targetUrl = getTargetUrl(m)
        const isDedicated = m.dataQualityLevel >= 3
        const hasSubLinks = Array.isArray(m.subLinks) && m.subLinks.length > 0

        return (
          <div key={m.jisCode} className="flex flex-col gap-2">
            {hasLink ? (
              /* ── リンクあり：通常表示 ── */
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onLinkClick?.(m.name)}
                className={cn(
                  'flex items-center justify-between rounded-lg px-4 py-3 transition-colors',
                  isDedicated
                    ? 'border-l-4 border-l-emerald-500 bg-emerald-50/50 hover:bg-emerald-50'
                    : 'border border-border hover:bg-muted/50'
                )}
              >
                {/* 左側: アイコン + 名前 + JISコード */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                      isDedicated ? 'bg-emerald-100' : 'bg-muted'
                    )}
                  >
                    {isDedicated ? (
                      <FileCheck className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">#{m.jisCode}</p>
                  </div>
                </div>

                {/* 右側: ラベル + 外部リンクアイコン */}
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'hidden rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline-flex',
                      isDedicated
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isDedicated ? '専用案内あり' : '一般案内'}
                  </span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              </a>
            ) : (
              /* ── リンクなし：代替UIを表示 ── */
              <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3">
                <div className="flex items-start gap-3">
                  {/* アイコン */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </div>

                  {/* 自治体名 + ステータス */}
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{m.name}</p>
                      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        申請書リンク未登録
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">#{m.jisCode}</p>

                    {/* 代替導線 */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {/* Google 検索ボタン */}
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(m.name + ' 改葬許可申請書')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onLinkClick?.(m.name)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
                      >
                        <Search className="h-3 w-3" />
                        公式サイトで申請書を検索
                      </a>
                    </div>

                    {/* 窓口案内 */}
                    <p className="text-xs text-muted-foreground">
                      窓口：住民課・戸籍課などで入手できます。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SubLinks (Wards/Districts) */}
            {hasSubLinks && (
              <div className="ml-4 pl-4 border-l-2 border-slate-200 py-1 grid grid-cols-1 gap-2">
                {m.subLinks!.map((sub, idx) => (
                  <a
                    key={`${m.jisCode}-sub-${idx}`}
                    href={sub.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onLinkClick?.(sub.name)}
                    className="flex items-center justify-between py-2 px-3 bg-white/50 rounded-lg border border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all text-sm group/sub"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-slate-600 group-hover/sub:text-emerald-600 truncate">{sub.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-1 rounded bg-slate-50 uppercase tracking-tighter">区</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover/sub:text-emerald-500 transition-colors" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
