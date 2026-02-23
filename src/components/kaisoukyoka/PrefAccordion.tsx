'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import MunicipalityList from './MunicipalityList'

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

interface PrefAccordionProps {
  name: string
  municipalities: Municipality[]
  isSearchActive: boolean
}

export default function PrefAccordion({ name, municipalities, isSearchActive }: PrefAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Auto-open when search is active and matches are found
  useEffect(() => {
    if (isSearchActive && municipalities.length > 0) {
      setIsOpen(true)
    } else if (!isSearchActive) {
      setIsOpen(false)
    }
  }, [isSearchActive, municipalities])

  if (municipalities.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-slate-700">{name}</span>
          <span className="text-sm text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-md">
            {municipalities.length}件
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'group-hover:translate-y-0.5'}`}
        />
      </button>

      {/* Accordion Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100 border-t border-slate-50' : 'max-h-0 opacity-0 pointer-events-none'}`}
      >
        <div className="p-4 md:p-6 bg-slate-50/30">
          {isOpen && <MunicipalityList municipalities={municipalities} />}
        </div>
      </div>
    </div>
  )
}
