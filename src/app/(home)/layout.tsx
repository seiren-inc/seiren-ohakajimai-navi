import { FixedCTA } from "@/components/ui/FixedCTA"

/**
 * トップページ専用レイアウト。HomepageClient が独自の HomeHeader / HomeFooter を
 * 持つため、グローバル Header / Footer は描画しない（旧 ConditionalLayout の
 * pathname === "/" 分岐に相当）。
 */
export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactElement {
  return (
    <>
      <main className="pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
      <FixedCTA />
    </>
  )
}
