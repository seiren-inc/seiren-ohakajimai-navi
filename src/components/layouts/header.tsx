"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef } from "react"
import { Phone, Menu, X, ChevronDown, Mail, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Navigation Data ──────────────────────────────────────────────────────────

const SERVICE_ITEMS = [
  { label: "お墓じまいとは",   href: "/about",    desc: "お墓じまいの基礎知識" },
  { label: "ご依頼の流れ",     href: "/flow",     desc: "相談から完了までのステップ" },
  { label: "料金プラン",       href: "/price",    desc: "明朗な料金体系" },
  { label: "お役立ちコラム",   href: "/column",   desc: "費用・手続きの専門解説" },
]

const RELATED_SERVICES = [
  { label: "散骨クルーズ",     href: "https://www.sankotu-cruise.com/", desc: "海洋散骨の専門サービス" },
  { label: "遺骨ラボ",         href: "https://ikotsu-lab.com/",         desc: "遺骨の専門処理・粉骨" },
  { label: "お墓探しナビ",     href: "https://www.ohakanavi.jp",         desc: "全国の霊園・納骨堂を検索" },
]

// ─── Shared Nav Link (with animated amber underline) ─────────────────────────

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={[
        "relative whitespace-nowrap text-[13px] font-medium transition-colors duration-200",
        "after:absolute after:-bottom-px after:left-0 after:h-[2px] after:rounded-full",
        "after:bg-seiren-accent after:transition-all after:duration-300",
        active
          ? "text-seiren-main after:w-full"
          : "text-seiren-body hover:text-seiren-main after:w-0 hover:after:w-full",
      ].join(" ")}
    >
      {label}
    </Link>
  )
}

// ─── Dropdown Wrapper ─────────────────────────────────────────────────────────

function NavDropdown({
  label,
  isActive,
  align = "left",
  children,
}: {
  label: string
  isActive?: boolean
  align?: "left" | "right"
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => { if (timeout.current) clearTimeout(timeout.current); setOpen(true) }
  const hide = () => { timeout.current = setTimeout(() => setOpen(false), 180) }

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        className={[
          "flex items-center gap-1 whitespace-nowrap text-[13px] font-medium transition-colors duration-200",
          isActive || open ? "text-seiren-main" : "text-seiren-body hover:text-seiren-main",
        ].join(" ")}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className={[
          "absolute top-full z-50 mt-3 min-w-[220px] rounded-xl",
          "border border-seiren-border bg-white p-1.5",
          "shadow-[0_8px_30px_rgba(30,42,56,0.10)]",
          "transition-all duration-200 origin-top",
          align === "right" ? "right-0" : "left-0",
          open
            ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none",
        ].join(" ")}
        role="menu"
      >
        {children}
      </div>
    </div>
  )
}

// ─── Dropdown Item ────────────────────────────────────────────────────────────

function DropItem({
  href,
  label,
  desc,
  external,
}: {
  href: string
  label: string
  desc?: string
  external?: boolean
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-start justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-seiren-bg"
      role="menuitem"
    >
      <span className="flex flex-col gap-0.5">
        <span className="text-[13px] font-medium text-seiren-main">{label}</span>
        {desc && <span className="text-[11px] text-seiren-sub">{desc}</span>}
      </span>
      {external && <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-seiren-accent" />}
    </Link>
  )
}

// ─── CTA Dropdown ─────────────────────────────────────────────────────────────

function CTADropdown() {
  const [open, setOpen] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => { if (timeout.current) clearTimeout(timeout.current); setOpen(true) }
  const hide = () => { timeout.current = setTimeout(() => setOpen(false), 180) }

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      {/* Amber CTA pill */}
      <button
        className="flex items-center gap-1.5 rounded-full bg-seiren-cta px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_2px_12px_rgba(217,119,6,0.30)] transition-all duration-200 hover:bg-seiren-cta-hover hover:shadow-[0_4px_18px_rgba(217,119,6,0.35)]"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        無料相談
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* CTA panel */}
      <div
        className={[
          "absolute right-0 top-full z-50 mt-3 w-64 rounded-xl",
          "border border-seiren-border bg-white p-2",
          "shadow-[0_8px_30px_rgba(30,42,56,0.10)]",
          "transition-all duration-200 origin-top",
          open
            ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none",
        ].join(" ")}
        role="menu"
      >
        {/* 電話相談 */}
        <a
          href="tel:08008888788"
          className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-seiren-bg"
          role="menuitem"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FEF3C7]">
            <Phone className="h-4 w-4 text-seiren-cta" />
          </div>
          <span className="flex flex-col">
            <span className="text-[13px] font-semibold text-seiren-main">電話で相談する</span>
            <span className="text-[11px] text-seiren-sub">0800-888-8788（フリーコール）</span>
            <span className="text-[11px] text-seiren-sub">9:00〜19:00</span>
          </span>
        </a>

        <div className="mx-3 my-1 h-px bg-seiren-border" />

        {/* フォーム */}
        <Link
          href="/contact"
          className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-seiren-bg"
          role="menuitem"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-seiren-bg">
            <Mail className="h-4 w-4 text-seiren-body" />
          </div>
          <span className="flex flex-col">
            <span className="text-[13px] font-semibold text-seiren-main">フォームで問い合わせ</span>
            <span className="text-[11px] text-seiren-sub">24時間受付・2営業日以内に返信</span>
          </span>
        </Link>
      </div>
    </div>
  )
}

// ─── Main Header ──────────────────────────────────────────────────────────────

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen]         = useState(false)
  const [mobileConsultOpen, setMobileConsultOpen] = useState(false)

  const isActive      = (href: string) => pathname === href
  const isServiceActive = SERVICE_ITEMS.some(i => pathname.startsWith(i.href))

  const closeMenu = () => { setMenuOpen(false); setMobileConsultOpen(false) }

  return (
    <header
      className="sticky top-0 z-50 h-20 w-full border-b border-seiren-border/60 bg-white/[0.82] backdrop-blur-[12px]"
      role="banner"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={closeMenu}
          aria-label="お墓じまいナビ トップページへ"
        >
          <Image
            src="/web-app-manifest-192x192.png"
            alt="清蓮 ロゴ"
            width={36}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
          <span className="text-sm font-bold tracking-tight text-seiren-main lg:text-base">
            お墓じまいナビ
          </span>
        </Link>

        {/* ── Desktop Nav (xl+) ── */}
        <nav
          className="hidden xl:flex items-center gap-6"
          aria-label="グローバルナビゲーション"
        >
          <NavLink href="/about"       label="お墓じまいとは"   active={isActive("/about")} />

          <NavDropdown label="サービス" isActive={isServiceActive}>
            {SERVICE_ITEMS.map(item => (
              <DropItem key={item.href} href={item.href} label={item.label} desc={item.desc} />
            ))}
          </NavDropdown>

          <NavLink href="/gyoseishoshi" label="行政書士紹介"      active={isActive("/gyoseishoshi")} />
          <NavLink href="/kaisoukyoka"  label="改葬許可申請書DL"  active={pathname.startsWith("/kaisoukyoka")} />

          <NavDropdown label="関連サービス" align="right">
            {RELATED_SERVICES.map(s => (
              <DropItem key={s.href} href={s.href} label={s.label} desc={s.desc} external />
            ))}
          </NavDropdown>

          <NavLink href="/contact" label="問い合わせ" active={isActive("/contact")} />
        </nav>

        {/* ── Desktop CTA (xl+) ── */}
        <div className="hidden xl:flex items-center shrink-0">
          <CTADropdown />
        </div>

        {/* ── Mobile: CTA pill + Hamburger (〜xl) ── */}
        <div className="flex items-center gap-2 xl:hidden">
          <Link
            href="/contact"
            className="rounded-full bg-seiren-cta px-4 py-2 text-xs font-semibold text-white shadow-[0_2px_10px_rgba(217,119,6,0.25)] transition-all hover:bg-seiren-cta-hover"
          >
            無料相談
          </Link>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-seiren-body transition-colors hover:bg-seiren-bg"
            aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={cn(
          "overflow-hidden border-seiren-border bg-white xl:hidden",
          "transition-[max-height,opacity] duration-300 ease-in-out",
          menuOpen ? "border-t max-h-[80dvh] opacity-100" : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <div className="px-5 pb-8 pt-3">
          {/* Primary links */}
          <nav className="flex flex-col divide-y divide-seiren-border" aria-label="モバイルナビゲーション">

            <Link href="/about" onClick={closeMenu}
              className={`flex min-h-[52px] items-center text-[15px] font-medium ${isActive("/about") ? "text-seiren-cta" : "text-seiren-main"}`}
            >
              お墓じまいとは
            </Link>

            {/* サービス サブリスト */}
            <div>
              <p className="flex min-h-[52px] items-center text-[15px] font-medium text-seiren-main">
                サービス
              </p>
              <div className="flex flex-col gap-0.5 pb-3 pl-3">
                {SERVICE_ITEMS.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-[#FEF3C7] text-seiren-cta"
                        : "text-seiren-body hover:bg-seiren-bg"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/gyoseishoshi" onClick={closeMenu}
              className={`flex min-h-[52px] items-center text-[15px] font-medium ${isActive("/gyoseishoshi") ? "text-seiren-cta" : "text-seiren-main"}`}
            >
              行政書士紹介
            </Link>

            <Link href="/kaisoukyoka" onClick={closeMenu}
              className={`flex min-h-[52px] items-center text-[15px] font-medium ${pathname.startsWith("/kaisoukyoka") ? "text-seiren-cta" : "text-seiren-main"}`}
            >
              改葬許可申請書DL
            </Link>

            <Link href="/contact" onClick={closeMenu}
              className={`flex min-h-[52px] items-center text-[15px] font-medium ${isActive("/contact") ? "text-seiren-cta" : "text-seiren-main"}`}
            >
              問い合わせ
            </Link>
          </nav>

          {/* 無料相談 アコーディオン */}
          <div className="mt-5 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-seiren-sub">
              無料相談
            </p>

            <button
              onClick={() => setMobileConsultOpen(v => !v)}
              className="flex w-full min-h-[52px] items-center justify-between rounded-xl border border-seiren-border px-4 text-sm font-medium text-seiren-main"
            >
              <span>相談方法を選ぶ</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${mobileConsultOpen ? "rotate-180" : ""}`}
              />
            </button>

            {mobileConsultOpen && (
              <div className="flex flex-col gap-2">
                <a
                  href="tel:08008888788"
                  className="flex min-h-[52px] items-center gap-3 rounded-xl border-2 border-seiren-cta px-4"
                >
                  <Phone className="h-4 w-4 shrink-0 text-seiren-cta" />
                  <span className="flex flex-col">
                    <span className="text-sm font-bold text-seiren-cta">電話で相談する</span>
                    <span className="text-xs text-seiren-sub">0800-888-8788（フリーコール）9:00〜19:00</span>
                  </span>
                </a>

                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="flex min-h-[52px] items-center gap-3 rounded-xl bg-seiren-cta px-4 text-white"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="flex flex-col">
                    <span className="text-sm font-bold">フォームで問い合わせ</span>
                    <span className="text-xs text-white/70">24時間受付・2営業日以内に返信</span>
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* 関連サービス */}
          <div className="mt-6 border-t border-seiren-border pt-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-seiren-sub">
              関連サービス
            </p>
            <div className="mt-3 flex flex-col gap-0.5">
              {RELATED_SERVICES.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-lg px-2 py-3 text-sm text-seiren-sub transition-colors hover:bg-seiren-bg hover:text-seiren-main"
                >
                  <span>{s.label}</span>
                  <ExternalLink className="h-3 w-3 text-seiren-accent" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
