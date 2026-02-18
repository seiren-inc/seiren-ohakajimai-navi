'use client'

import React from 'react'
import { ExternalLink, FileText, BadgeCheck, Info, MessageSquare } from 'lucide-react'

interface Municipality {
  jisCode: string
  name: string
  prefectureName: string
  municipalitySlug: string
  url: string | null
  pdfUrl: string | null
  subLinks: any // Should be an array of objects if exists
  dataQualityLevel: number
}

interface MunicipalityListProps {
  municipalities: Municipality[]
}

const QualityBadge = ({ level }: { level: number }) => {
  switch (level) {
    case 3:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-tighter">
          <BadgeCheck className="w-3 h-3" />
          専用案内あり
        </span>
      )
    case 2:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-tighter">
          <Info className="w-3 h-3" />
          一般案内
        </span>
      )
    case 1:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-tighter">
          <MessageSquare className="w-3 h-3" />
          窓口案内
        </span>
      )
    default:
      return null
  }
}

export default function MunicipalityList({ municipalities }: MunicipalityListProps) {
  const getTargetUrl = (m: Pick<Municipality, 'url' | 'pdfUrl'>) => {
    return m.pdfUrl || m.url || '#'
  }

  const isPdf = (m: Pick<Municipality, 'url' | 'pdfUrl'>) => {
    return !!m.pdfUrl
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {municipalities.map((m) => {
        const targetUrl = getTargetUrl(m)
        const hasSubLinks = Array.isArray(m.subLinks) && m.subLinks.length > 0

        return (
          <div key={m.jisCode} className="flex flex-col gap-2">
            {/* Main Municipality Link */}
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 transition-all hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-800 group-hover:text-blue-600 truncate">
                    {m.name}
                  </span>
                  <QualityBadge level={m.dataQualityLevel} />
                </div>
                <span className="text-[10px] text-slate-400 font-mono tracking-tight">#{m.jisCode}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0">
                {isPdf(m) ? <FileText className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
              </div>
            </a>

            {/* SubLinks (Wards/Districts) */}
            {hasSubLinks && (
              <div className="ml-4 pl-4 border-l-2 border-slate-200 py-1 grid grid-cols-1 gap-2">
                {m.subLinks.map((sub: any, idx: number) => (
                  <a
                    key={`${m.jisCode}-sub-${idx}`}
                    href={sub.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-2 px-3 bg-white/50 rounded-lg border border-slate-100 hover:bg-blue-50/50 hover:border-blue-200 transition-all text-sm group/sub"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-slate-600 group-hover/sub:text-blue-600 truncate">{sub.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-1 rounded bg-slate-50 uppercase tracking-tighter">区</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover/sub:text-blue-400 transition-colors" />
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
