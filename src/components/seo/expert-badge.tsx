/**
 * 外部専門家の監修バッジコンポーネント（E-E-A-T強化）
 * コラム記事等に配置し、外部の専門家（行政書士・弁護士等）の監修を明示する。
 */

import { ShieldCheck } from "lucide-react"

interface ExpertBadgeProps {
  /** 専門家の氏名 */
  name: string
  /** 資格（例: "行政書士"、"弁護士"） */
  qualification: string
  /** 事務所名 */
  officeName?: string
  /** 監修コメント */
  comment?: string
  /** 専門家の詳細ページURL */
  profileUrl?: string
}

export function ExpertBadge({
  name,
  qualification,
  officeName,
  comment,
  profileUrl,
}: ExpertBadgeProps) {
  return (
    <div className="my-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
            専門家監修
          </p>
          <p className="mt-1 text-base font-bold text-neutral-900">
            {qualification} {name}
          </p>
          {officeName && (
            <p className="mt-0.5 text-sm text-neutral-600">{officeName}</p>
          )}
          {comment && (
            <p className="mt-3 text-sm leading-relaxed text-neutral-700">
              {comment}
            </p>
          )}
          {profileUrl && (
            <a
              href={profileUrl}
              className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              プロフィールを見る →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
