'use client'

import React, { useState, useMemo } from 'react'
import { AREAS } from '@/lib/areas'
import PrefAccordion from './PrefAccordion'
import { Search, X } from 'lucide-react'

interface Municipality {
  jisCode: string
  name: string
  prefectureName: string
  municipalitySlug: string
  url: string | null
  pdfUrl: string | null
  subLinks: any
  dataQualityLevel: number
}

interface KaisoukyokaClientProps {
  initialData: Record<string, Municipality[]>
}

export default function KaisoukyokaClient({ initialData }: KaisoukyokaClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = useMemo(() => {
    if (!searchQuery) return initialData

    const filtered: Record<string, Municipality[]> = {}
    const query = searchQuery.toLowerCase()

    Object.entries(initialData).forEach(([pref, items]) => {
      const matchPref = pref.includes(query)
      const matchingItems = items.filter(item => 
        item.name.includes(query) || matchPref
      )

      if (matchingItems.length > 0) {
        filtered[pref] = matchingItems
      }
    })

    return filtered
  }, [searchQuery, initialData])

  const totalMatches = useMemo(() => {
    return Object.values(filteredData).flat().length
  }, [filteredData])

  const scrollToArea = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 80 // sticky header offset
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = el.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Sticky Search Bar */}
      <div className="sticky top-4 z-40">
        <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl border border-slate-200 p-2 flex items-center gap-3 max-w-2xl mx-auto transition-all hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500/20">
          <Search className="w-5 h-5 text-slate-400 ml-3" />
          <input
            type="text"
            placeholder="自治体名や都道府県名を検索..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors mr-1"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="text-center mt-2 animate-in fade-in slide-in-from-top-1">
            <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
              該当件数: {totalMatches}件
            </span>
          </div>
        )}
      </div>

      {/* Area Shortcuts */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">エリア検索</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {AREAS.map((area) => (
            <button
              key={area.id}
              onClick={() => scrollToArea(area.id)}
              className="py-2 px-4 rounded-xl bg-slate-50 text-slate-700 font-medium text-sm hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-200 transition-all text-center"
            >
              {area.name}
            </button>
          ))}
        </div>
      </div>

      {/* Area & Prefecture List */}
      <div className="space-y-12 pb-24">
        {AREAS.map((area) => (
          <section key={area.id} id={area.id} className="scroll-mt-24">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              {area.name}
            </h2>
            <div className="grid gap-4">
              {area.prefectures.map((pref) => {
                const items = filteredData[pref]
                if (searchQuery && !items) return null
                
                return (
                  <PrefAccordion 
                    key={pref} 
                    name={pref} 
                    municipalities={items || []} 
                    isSearchActive={!!searchQuery}
                  />
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
