import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { ConditionalLayout } from '@/components/layouts/ConditionalLayout'
import { cn } from '@/lib/utils'
import { constructMetadata } from '@/lib/seo'
import { OrganizationJsonLd } from '@/components/seo/organization-json-ld'
import { Analytics } from '@vercel/analytics/next'

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
  icons: {
    icon: [
      { url: "/logo2.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo2.png", type: "image/png" },
    ],
    shortcut: "/logo2.png",
  },
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased flex flex-col",
        fontSans.variable
      )}>
        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <OrganizationJsonLd />
        <Analytics />
      </body>
    </html>
  )
}
