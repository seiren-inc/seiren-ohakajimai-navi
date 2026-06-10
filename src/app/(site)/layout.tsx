import { Header } from "@/components/layouts/header"
import { Footer } from "@/components/layouts/footer"
import { EcosystemShowcase } from "@/components/features/ecosystem/EcosystemShowcase"
import { FixedCTA } from "@/components/ui/FixedCTA"

/**
 * 下層ページ共通のグローバル Header / Footer。
 * 旧 ConditionalLayout の usePathname() 分岐を route groups で置換したもの。
 * トップページは (home) グループ側で独自ヘッダー・フッターを使う。
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactElement {
  return (
    <>
      <Header />
      <main className="flex-1 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
      <EcosystemShowcase />
      <Footer />
      <FixedCTA />
    </>
  )
}
