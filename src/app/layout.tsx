import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layouts/header'
import { Footer } from '@/components/layouts/footer'
import { cn } from '@/lib/utils'
import { constructMetadata } from '@/lib/seo'
import { OrganizationJsonLd } from '@/components/seo/organization-json-ld'

const fontSans = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = constructMetadata()

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
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <OrganizationJsonLd />
      </body>
    </html>
  )
}
