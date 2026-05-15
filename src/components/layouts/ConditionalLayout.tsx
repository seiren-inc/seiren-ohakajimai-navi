"use client"

import { usePathname } from "next/navigation"
import { Header } from "./header"
import { Footer } from "./footer"
import { EcosystemShowcase } from "@/components/features/ecosystem/EcosystemShowcase"
import { FixedCTA } from "@/components/ui/FixedCTA"

/**
 * グローバルヘッダーは全ページで共通表示。
 * トップページ（/）は独自インラインフッターを持つため、
 * グローバルフッター・EcosystemShowcase はサブページのみ表示。
 */
export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isTopPage = pathname === "/"

  return (
    <>
      <Header />
      <main className="flex-1 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </main>
      {!isTopPage && (
        <>
          <EcosystemShowcase />
          <Footer />
        </>
      )}
      <FixedCTA />
    </>
  )
}
