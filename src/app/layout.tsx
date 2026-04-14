import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import { ConditionalLayout } from '@/components/layouts/ConditionalLayout'
import { cn } from '@/lib/utils'
import { constructMetadata } from '@/lib/seo'
import { OrganizationJsonLd } from '@/components/seo/organization-json-ld'
import { WebSiteJsonLd } from '@/components/seo/website-json-ld'
import { LocalBusinessJsonLd } from '@/components/seo/local-business-json-ld'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'
// Doc-19 §2.8: 内部AI監査30日安定稼働の前提条件が満たされた場合のみ有効化する
// NEXT_PUBLIC_ENABLE_RAG_CHAT=true を明示的に設定するまでは非表示
import { RagChatbot } from '@/components/chat/RagChatbot'

const fontSans = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-sans',
  // display:swap でフォントロード中にシステムフォントでレンダーを開始（FOIT 排除）
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  ...constructMetadata(),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        {/* ─── LCP 最適化: Hero 画像を最優先で preload ─── */}
        <link
          rel="preload"
          href="/images/hero-garden-v3.webp"
          as="image"
          type="image/webp"
          // @ts-expect-error: fetchpriority is valid HTML but not yet in React types
          fetchpriority="high"
        />
        {/* Google Fonts の事前接続（フォント取得を高速化） */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased flex flex-col",
        fontSans.variable
      )}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <LocalBusinessJsonLd />
        {process.env.NEXT_PUBLIC_ENABLE_RAG_CHAT === 'true' && <RagChatbot />}
        <Analytics />
        <SpeedInsights />
      </body>
      <GoogleTagManager gtmId="GTM-5HWGS5WX" />
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  )
}
