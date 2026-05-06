import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ConditionalLayout } from '@/components/layouts/ConditionalLayout'
import { cn } from '@/lib/utils'
import { constructMetadata } from '@/lib/seo'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'
// Doc-19 §2.8: 内部AI監査30日安定稼働の前提条件が満たされた場合のみ有効化する
// NEXT_PUBLIC_ENABLE_RAG_CHAT=true を明示的に設定するまでは非表示
import { RagChatbot } from '@/components/chat/RagChatbot'
import { SEIREN_ORGANIZATION_SAME_AS } from '@/config/seiren-ecosystem'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  ...constructMetadata(),
}

const BASE_URL = 'https://www.ohakajimai-navi.jp'

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  "name": "株式会社清蓮",
  "url": BASE_URL,
  "description": "墓じまい・改葬の専門ナビゲーションサービス。行政書士情報・散骨・納骨堂も詳しく掲載。",
  "sameAs": [...SEIREN_ORGANIZATION_SAME_AS],
}

const localBusinessLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BASE_URL}/#localbusiness`,
  "name": "お墓じまいナビ",
  "url": BASE_URL,
  "description": "墓じまい・改葬の手続き・費用・行政書士の情報を提供。相談無料。",
  "areaServed": [{ "@type": "Country", "name": "Japan" }],
  "serviceType": [
    "墓じまい", "改葬", "散骨", "納骨堂", "行政書士紹介"
  ],
  "priceRange": "無料相談",
  "parentOrganization": { "@type": "Organization", "@id": `${BASE_URL}/#organization` }
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
          fetchPriority="high"
        />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased flex flex-col",
        "font-[system-ui,-apple-system,BlinkMacSystemFont,'Hiragino_Kaku_Gothic_ProN','Yu_Gothic',sans-serif]"
      )}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
        />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
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
