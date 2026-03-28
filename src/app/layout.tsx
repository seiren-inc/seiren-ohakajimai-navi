import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ConditionalLayout } from '@/components/layouts/ConditionalLayout'
import { constructMetadata } from '@/lib/seo'
import { OrganizationJsonLd } from '@/components/seo/organization-json-ld'
import { WebSiteJsonLd } from '@/components/seo/website-json-ld'
import { LocalBusinessJsonLd } from '@/components/seo/local-business-json-ld'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleTagManager } from '@next/third-parties/google'
import { RagChatbot } from '@/components/chat/RagChatbot'

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
      </head>
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <LocalBusinessJsonLd />
        <RagChatbot />
        <Analytics />
        <SpeedInsights />
      </body>
      <GoogleTagManager gtmId="GTM-5HWGS5WX" />
    </html>
  )
}
