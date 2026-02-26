"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Phone, Menu, X } from "lucide-react"

const navItems = [
  { label: "お墓じまいとは", href: "/about" },
  { label: "ご依頼の流れ", href: "/flow" },
  { label: "料金", href: "/price" },
  { label: "申請書DL", href: "/kaisoukyoka" },
  { label: "会社概要", href: "/company" },
]

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/70 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600">
            <span className="text-sm font-bold text-white">N</span>
          </div>
          <span className="text-base font-bold tracking-tight text-neutral-900">お墓じまいナビ</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive
                    ? "relative text-sm font-medium text-neutral-900 after:absolute after:-bottom-[1px] after:left-0 after:w-full after:h-[2px] after:bg-emerald-600"
                    : "text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                }
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <a
            href="tel:0120-000-000"
            className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-emerald-700 transition-colors"
          >
            <Phone className="h-4 w-4" />
            0120-000-000
          </a>
          <Link
            href="/contact"
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            無料相談・お見積り
          </Link>
        </div>

        {/* Mobile: Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden"
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="border-t border-neutral-100 bg-white px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-6 text-base">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={
                    isActive
                      ? "text-base font-semibold text-neutral-900"
                      : "text-base font-medium text-neutral-600"
                  }
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <a
              href="tel:0120-000-000"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border-2 border-emerald-600 text-sm font-bold text-emerald-600"
            >
              <Phone className="h-4 w-4" />
              電話で相談
            </a>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-[48px] items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white"
            >
              無料相談・お見積り
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
