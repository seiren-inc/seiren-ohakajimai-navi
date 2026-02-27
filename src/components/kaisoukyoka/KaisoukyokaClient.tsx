'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { AREAS } from '@/lib/areas'
import PrefAccordion from './PrefAccordion'
import {
  Search, X, Clock, History, MapPin, Phone,
  HelpCircle, AlertCircle, Globe, Building2, FileCheck,
  ArrowUp, Sparkles
} from 'lucide-react'

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

interface KaisoukyokaClientProps {
  initialData: Record<string, Municipality[]>
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

// ── 最近閲覧した自治体（改善3：既存維持） ─────────────────────────────────────
function RecentlyViewed({ onSelect }: { onSelect: (name: string) => void }) {
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('recent-municipalities')
    if (stored) {
      try { setRecent(JSON.parse(stored)) } catch { /* ignore */ }
    }
  }, [])

  if (recent.length === 0) return null

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <h3 className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        最近閲覧した自治体
      </h3>
      <div className="flex flex-wrap gap-2">
        {recent.slice(0, 5).map((name) => (
          <button
            key={name}
            onClick={() => onSelect(name)}
            className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
          >
            <History className="h-3 w-3 text-muted-foreground" />
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}

function saveToRecent(name: string) {
  const stored = localStorage.getItem('recent-municipalities')
  let arr: string[] = stored ? JSON.parse(stored) : []
  arr = [name, ...arr.filter((n) => n !== name)].slice(0, 5)
  localStorage.setItem('recent-municipalities', JSON.stringify(arr))
}

// ── フローティングCTA（既存維持） ─────────────────────────────────────────────
function FloatingCTA() {
  const [visible, setVisible] = useState(true)
  const lastScrollRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      setVisible(current < lastScrollRef.current || current < 100)
      lastScrollRef.current = current
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed z-50 transition-transform duration-300',
        'bottom-0 left-0 right-0 border-t bg-background/95 p-3 backdrop-blur-sm',
        'md:bottom-6 md:left-auto md:right-6 md:border-0 md:bg-transparent md:p-0',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:flex-col">
        {/* 新規：AI見積もり（CV特化） */}
        <a
          href="/estimation"
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 font-bold text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl active:scale-[0.98]',
            'min-h-[52px] px-6 text-sm sm:text-base',
            'md:w-auto md:rounded-full md:px-8 md:py-3.5'
          )}
        >
          <Sparkles className="h-4 w-4 text-emerald-400" />
          AI自動見積もりを試す
        </a>
        
        {/* 既存：無料相談 */}
        <a
          href="/contact"
          aria-label="無料相談・お見積りのお問い合わせ"
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 font-bold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl active:scale-[0.98]',
            'min-h-[52px] px-6 text-sm sm:text-base',
            'md:w-auto md:rounded-full md:px-8 md:py-3.5'
          )}
        >
          <Phone className="h-4 w-4" />
          無料電話・ご相談
        </a>
      </div>
    </div>
  )
}

// ── 改善6: 検索結果フィードバック ─────────────────────────────────────────────
function SearchFeedback({
  query,
  totalPrefectures,
  totalMunicipalities,
}: {
  query: string
  totalPrefectures: number
  totalMunicipalities: number
}) {
  if (!query.trim()) return null

  if (totalMunicipalities === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              「{query}」に一致する自治体が見つかりませんでした
            </p>
            <p className="mt-0.5 text-xs text-amber-600">
              都道府県名・市区町村名・自治体コードで検索できます。
              別のエリアタブを選択するか、検索キーワードを変更してください。
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <p className="text-sm text-muted-foreground">
        「<span className="font-medium text-foreground">{query}</span>」の検索結果：
        <span className="ml-1 font-semibold text-emerald-700">
          {totalPrefectures}都道府県 / {totalMunicipalities}件
        </span>
      </p>
    </div>
  )
}

// ── 改善8: 統計サマリーバー ─────────────────────────────────────────────────
function StatsSummary({ totalMunicipalities, dedicatedCount }: { totalMunicipalities: number; dedicatedCount: number }) {
  const stats = [
    { label: '対応自治体数', value: totalMunicipalities.toLocaleString(), icon: Building2 },
    { label: '専用案内あり', value: dedicatedCount.toLocaleString(), icon: FileCheck },
    { label: '対応都道府県', value: '47', icon: MapPin },
  ]

  return (
    <div className="mx-auto flex max-w-2xl items-center justify-center gap-3 pt-6 sm:gap-8 md:gap-10">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 sm:h-9 sm:w-9">
            <stat.icon className="h-3 w-3 text-emerald-600 sm:h-4 sm:w-4" />
          </div>
          <div>
            <p className="text-base font-bold leading-tight text-foreground sm:text-lg">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground sm:text-xs">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── 改善5: FAQセクション ───────────────────────────────────────────────────
const faqs = [
  {
    question: '改葬許可申請書はどこで入手できますか？',
    answer:
      'お墓のある市区町村の役所窓口で直接受け取るか、各自治体の公式サイトからPDFをダウンロードできます。本ページでは各自治体のダウンロードページへのリンクをまとめています。',
  },
  {
    question: '「専用案内あり」と「一般案内」の違いは何ですか？',
    answer:
      '「専用案内あり」は、その自治体が改葬手続き専用のページや申請書PDFを公開していることを示します。「一般案内」は自治体の一般的な窓口案内ページへのリンクです。専用案内がある自治体では、より詳しい手続き情報が得られます。',
  },
  {
    question: '改葬許可の申請手続きの流れを教えてください。',
    answer:
      '一般的な流れ：①改葬先の墓地を決定 → ②現在の墓地管理者から「埋葬証明書」を取得 → ③改葬先から「受入証明書」を取得 → ④市区町村に「改葬許可申請書」を提出 → ⑤「改葬許可証」を受け取り → ⑥お墓じまい・改葬を実施。詳しくは「お墓じまいとは」ページをご覧ください。',
  },
  {
    question: '申請書の様式は全国共通ですか？',
    answer:
      '基本的な記載内容は墓地埋葬法で定められていますが、申請書の様式は自治体ごとに異なります。必ずお墓のある自治体が指定する様式を使用してください。',
  },
  {
    question: '費用はどのくらいかかりますか？',
    answer:
      '改葬許可申請の手数料は無料〜数百円程度の自治体がほとんどです。お墓じまい全体の費用（墓石撤去・永代供養など）は別途かかります。詳しくは「料金」ページをご確認ください。',
  },
]

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section className="border-t bg-muted/20" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 text-center">
          <h2 id="faq-heading" className="text-xl font-bold text-foreground md:text-2xl">
            よくある質問
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            改葬許可申請に関するよくあるご質問をまとめました
          </p>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border bg-background px-5">
              <button
                className="flex w-full items-center justify-between py-4 text-left text-sm font-medium"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                aria-expanded={openIdx === i}
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                  {faq.question}
                </span>
                <span className={cn('ml-4 shrink-0 transition-transform duration-200', openIdx === i && 'rotate-180')}>
                  ▾
                </span>
              </button>
              {openIdx === i && (
                <div className="pb-5 pl-[26px] text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 改善10: スクロールトップボタン ─────────────────────────────────────────
function ScrollToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!show) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed z-50 flex h-10 w-10 items-center justify-center rounded-full border bg-background shadow-md transition-all hover:bg-muted',
        'bottom-20 right-4',
        'md:bottom-24 md:right-6'
      )}
      aria-label="ページの先頭に戻る"
    >
      <ArrowUp className="h-4 w-4 text-foreground" />
    </button>
  )
}

// ── 改善9: ソートオプション（PrefAccordion に渡すための型） ────────────────
export type SortMode = 'dedicated-first' | 'alphabetical'

// ── メインクライアント ────────────────────────────────────────────────────────
export default function KaisoukyokaClient({ initialData }: KaisoukyokaClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  // 改善7: デフォルトを "all" に変更
  const [activeArea, setActiveArea] = useState('all')
  // 改善12: スクロールアンカー ref
  const listTopRef = useRef<HTMLDivElement>(null)
  // リンク有無フィルタ
  const [linkFilter, setLinkFilter] = useState<'all' | 'with-link' | 'no-link'>('all')

  // 改善7: "all" 対応のフィルタ
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase()

    // activeArea が "all" の場合は全エリアのデータを使用
    const sourceEntries =
      activeArea === 'all'
        ? Object.entries(initialData)
        : Object.entries(initialData).filter(([pref]) =>
            AREAS.find((a) => a.id === activeArea)?.prefectures.includes(pref)
          )

    if (!query) {
      return Object.fromEntries(sourceEntries)
    }

    const filtered: Record<string, Municipality[]> = {}
    sourceEntries.forEach(([pref, items]) => {
      const matchPref = pref.includes(query)
      let matchingItems = items.filter(
        (item) => item.name.includes(query) || matchPref
      )
      // リンク有無フィルタ適用
      if (linkFilter === 'with-link') {
        matchingItems = matchingItems.filter((item) => !!(item.url || item.pdfUrl))
      } else if (linkFilter === 'no-link') {
        matchingItems = matchingItems.filter((item) => !(item.url || item.pdfUrl))
      }
      if (matchingItems.length > 0) {
        filtered[pref] = matchingItems
      }
    })
    return filtered
  }, [searchQuery, initialData, activeArea, linkFilter])

  const totalMunicipalities = useMemo(
    () => Object.values(filteredData).flat().length,
    [filteredData]
  )
  const totalPrefectures = useMemo(
    () => Object.keys(filteredData).length,
    [filteredData]
  )

  // 統計（実データから計算）
  const allMunicipalities = useMemo(() => Object.values(initialData).flat(), [initialData])
  const totalAll = allMunicipalities.length
  const dedicatedCount = useMemo(
    () => allMunicipalities.filter((m) => m.dataQualityLevel >= 3).length,
    [allMunicipalities]
  )

  // 改善12: タブ切替時スクロール
  const handleAreaChange = (areaId: string) => {
    setActiveArea(areaId)
    setTimeout(() => {
      listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleLinkClick = (name: string) => {
    saveToRecent(name)
  }

  // エリアタブ一覧（改善7: "すべて" を先頭に追加）
  const areaTabs = [
    { id: 'all', name: 'すべて', isAll: true },
    ...AREAS.map((a) => ({ id: a.id, name: a.name, isAll: false })),
  ]

  // 表示する都道府県一覧（activeArea が "all" の場合はすべて）
  const displayPrefectures: string[] =
    activeArea === 'all'
      ? Object.keys(initialData)
      : AREAS.find((a) => a.id === activeArea)?.prefectures ?? []

  return (
    <div className="pb-28 md:pb-12">
      {/* 改善8: 統計サマリーバー */}
      <StatsSummary totalMunicipalities={totalAll} dedicatedCount={dedicatedCount} />

      {/* Search Bar */}
      <div className="relative mx-auto max-w-2xl px-4 pt-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="自治体名や都道府県名を検索..."
            aria-label="自治体検索"
            className="h-12 w-full rounded-xl border bg-background pl-10 pr-4 text-sm shadow-sm transition-shadow placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-muted"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* 改善6: 検索結果フィードバック */}
      <SearchFeedback
        query={searchQuery}
        totalPrefectures={totalPrefectures}
        totalMunicipalities={totalMunicipalities}
      />

      {/* リンク有無フィルタ */}
      {(() => {
        const withLinkCount = allMunicipalities.filter((m) => !!(m.url || m.pdfUrl)).length
        const noLinkCount   = allMunicipalities.filter((m) => !(m.url  || m.pdfUrl)).length
        const filterOptions: { id: 'all' | 'with-link' | 'no-link'; label: string; count: number }[] = [
          { id: 'all',       label: 'すべて',       count: totalAll },
          { id: 'with-link', label: 'リンクあり',   count: withLinkCount },
          { id: 'no-link',   label: 'リンクなし',   count: noLinkCount },
        ]
        return (
          <div className="mx-auto max-w-5xl px-4 pt-4">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-muted-foreground">表示:</span>
              {filterOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setLinkFilter(opt.id)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    linkFilter === opt.id
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  {opt.label}
                  <span className="ml-1 opacity-70">{opt.count.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        )
      })()}

      {/* 最近閲覧した自治体（改善3） */}
      <RecentlyViewed onSelect={(name) => setSearchQuery(name)} />


      {/* エリアタブ（改善4 + 改善7: "すべて" 追加、横スクロール） */}
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <div className="relative">
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-linear-to-l from-background to-transparent md:hidden" />
          <div
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:overflow-x-visible md:pb-0"
            role="tablist"
          >
            {areaTabs.map((area) => {
              const areaCount =
                area.isAll
                  ? totalAll
                  : AREAS.find((a) => a.id === area.id)?.prefectures.reduce(
                      (acc, pref) => acc + (initialData[pref]?.length || 0),
                      0
                    ) ?? 0
              return (
                <button
                  key={area.id}
                  role="tab"
                  aria-selected={activeArea === area.id}
                  onClick={() => handleAreaChange(area.id)}
                  className={cn(
                    'inline-flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all',
                    activeArea === area.id
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                      : 'border-border bg-background text-foreground hover:bg-muted'
                  )}
                >
                  {area.isAll ? (
                    <Globe className="h-3.5 w-3.5" />
                  ) : (
                    <MapPin className="h-3.5 w-3.5" />
                  )}
                  {area.name}
                  {areaCount > 0 && (
                    <span className={cn(
                      'ml-0.5 text-xs',
                      activeArea === area.id ? 'text-emerald-100' : 'text-muted-foreground'
                    )}>
                      {areaCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 改善12: スクロールアンカー */}
      <div ref={listTopRef} className="scroll-mt-20" />

      {/* 自治体一覧（改善1+2 + 改善9: ソートオプション付き） */}
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-12">
        {activeArea === 'all' ? (
          // "すべて" の場合: エリアごとのセクション区切りを表示
          AREAS.map((area) => {
            const hasMunicipalities = area.prefectures.some(
              (p) => (filteredData[p]?.length ?? 0) > 0
            )
            if (!hasMunicipalities) return null
            return (
              <section key={area.id} id={area.id} className="scroll-mt-24">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                  {area.name}
                </h2>
                <div className="space-y-2">
                  {area.prefectures.map((pref) => {
                    const items = filteredData[pref]
                    if (!items || items.length === 0) return null
                    return (
                      <PrefAccordion
                        key={pref}
                        name={pref}
                        municipalities={items}
                        isSearchActive={!!searchQuery}
                        onLinkClick={handleLinkClick}
                      />
                    )
                  })}
                </div>
              </section>
            )
          })
        ) : (
          // 特定エリア選択時
          <section id={activeArea} className="scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-emerald-600 rounded-full" />
              {AREAS.find((a) => a.id === activeArea)?.name}
            </h2>
            <div className="space-y-2">
              {displayPrefectures.map((pref) => {
                const items = filteredData[pref]
                if (searchQuery && !items) return null
                return (
                  <PrefAccordion
                    key={pref}
                    name={pref}
                    municipalities={items || []}
                    isSearchActive={!!searchQuery}
                    onLinkClick={handleLinkClick}
                  />
                )
              })}
            </div>
          </section>
        )}
      </div>

      {/* 改善5: FAQ */}
      <FAQSection />

      {/* 改善10: スクロールトップ */}
      <ScrollToTop />

      {/* フローティングCTA */}
      <FloatingCTA />
    </div>
  )
}
