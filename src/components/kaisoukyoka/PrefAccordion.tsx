'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, FileCheck } from 'lucide-react'
import MunicipalityList from './MunicipalityList'

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

interface PrefAccordionProps {
  name: string
  municipalities: Municipality[]
  isSearchActive: boolean
  onLinkClick?: (name: string) => void
}

export default function PrefAccordion({ name, municipalities, isSearchActive, onLinkClick }: PrefAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const prevSearchActive = useRef(isSearchActive)

  useEffect(() => {
    if (prevSearchActive.current !== isSearchActive) {
      prevSearchActive.current = isSearchActive
      if (isSearchActive && municipalities.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- ref-guarded: runs only on prop transition, not every render
        setIsOpen(true)
      } else if (!isSearchActive) {
        setIsOpen(false)
      }
    }
  }, [isSearchActive, municipalities])

  if (municipalities.length === 0) return null

  const dedicatedCount = municipalities.filter(m => m.dataQualityLevel >= 3).length

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      {/* Accordion Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-muted/30 data-[state=open]:bg-muted/30 transition-colors"
        data-state={isOpen ? 'open' : 'closed'}
      >
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-foreground">{name}</span>
          <span className="text-sm text-muted-foreground">{municipalities.length}件</span>
          {dedicatedCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
              <FileCheck className="h-3 w-3" />
              専用案内 {dedicatedCount}件
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Accordion Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[4000px] opacity-100 border-t border-border' : 'max-h-0 opacity-0 pointer-events-none overflow-hidden'}`}
      >
        <div className="px-4 pb-4 pt-2">
          {isOpen && (
            <MunicipalityList
              municipalities={[...municipalities].sort((a, b) =>
                a.dataQualityLevel > b.dataQualityLevel ? -1 : 1
              )}
              onLinkClick={onLinkClick}
            />
          )}
        </div>
      </div>
    </div>
  )
}
