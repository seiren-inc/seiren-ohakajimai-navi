import type { Metadata, Viewport } from 'next'
import { Noto_Serif_JP, Noto_Sans_JP, Zen_Kaku_Gothic_New, Inter } from 'next/font/google'
import './globals.css'

const notoSerifJP = Noto_Serif_JP({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  preload: false,
})

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: false,
})

// ヒーロー見出し用 — 「Zen Kaku Gothic New」は太字で行政的品格と現代感を両立する
const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-zen',
  display: 'swap',
  preload: false,
})

// 英数字・数値表記用 — Inter は narrow で読みやすい
const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
import { ConditionalLayout } from '@/components/layouts/ConditionalLayout'
import { cn } from '@/lib/utils'
import { constructMetadata } from '@/lib/seo'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'
// Doc-19 §2.8: 内部AI監査30日安定稼働の前提条件が満たされた場合のみ有効化する
// NEXT_PUBLIC_ENABLE_RAG_CHAT=true を明示的に設定するまでは非表示
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
          fetchPriority="high"
        />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased flex flex-col",
        notoSerifJP.variable,
        notoSansJP.variable,
        zenKakuGothicNew.variable,
        inter.variable,
      )}>
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
