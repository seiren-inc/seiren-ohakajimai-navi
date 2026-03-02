"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Phone, Mail } from "lucide-react"

export function FixedCTA() {
  const pathname = usePathname()
  
  // 非表示にするパスのリスト
  const hidePaths = ["/estimation"]
  if (hidePaths.includes(pathname)) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 p-3 backdrop-blur-xl md:hidden print:hidden">
      <div className="flex gap-2">
        <a
          href="tel:08008888788"
          className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full border-2 border-emerald-600 text-sm font-bold text-emerald-600"
        >
          <Phone className="h-4 w-4" />
          電話で相談
        </a>
        <Link
          href="/contact"
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white"
        >
          <Mail className="mr-2 h-4 w-4" />
          無料相談フォーム
        </Link>
      </div>
    </div>
  )
}
