/**
 * (public) グループの layout.tsx
 *
 * トップページはHomepageClientに独自ヘッダー・フッターを含むため、
 * ルートlayout.tsxのHeader/Footerを上書きして除外します。
 * OrganizationJsonLdはSEOのため継続して適用。
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
