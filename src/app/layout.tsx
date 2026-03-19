import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { ConditionalLayout } from '@/components/layouts/ConditionalLayout'
import { cn } from '@/lib/utils'
import { constructMetadata } from '@/lib/seo'
import { OrganizationJsonLd } from '@/components/seo/organization-json-ld'
import { WebSiteJsonLd } from '@/components/seo/website-json-ld'
import { LocalBusinessJsonLd } from '@/components/seo/local-business-json-ld'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { RagChatbot } from '@/components/chat/RagChatbot'
import { GoogleTagManager } from '@next/third-parties/google'

const fontSans = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-sans',
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
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID
  const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID

  return (
    <html lang="ja">
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
        <RagChatbot />
        <Analytics />
        <SpeedInsights />
      </body>
      <GoogleTagManager gtmId="GTM-5HWGS5WX" />
    </html>
  )
}
