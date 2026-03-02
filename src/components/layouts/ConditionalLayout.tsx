"use client"

import { usePathname } from "next/navigation"
import { Header } from "./header"
import { Footer } from "./footer"
import { FixedCTA } from "@/components/ui/FixedCTA"

/**
 * トップページ（/）では独自のヘッダー・フッターを使うため、
 * ルートレイアウトの Header / Footer を条件付きで除外します。
 * ルートレイアウトはサーバーコンポーネントのため、
 * usePathname を使うためにクライアントコンポーネントとして分離しています。
 */
export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // トップページのみ共通ヘッダー・フッターを非表示にする
  const hideGlobalLayout = pathname === "/"

  return (
    <>
      {!hideGlobalLayout && <Header />}
      <main className={hideGlobalLayout ? "" : "flex-1"}>{children}</main>
      {!hideGlobalLayout && <Footer />}
      <FixedCTA />
    </>
  )
}
