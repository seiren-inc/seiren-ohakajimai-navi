"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Menu,
  X,
  Mail,
  Phone,
  ChevronRight,
  FileText,
  Landmark,
  Download,
  UserCheck,
  Hammer,
  Waves,
  MessageSquare,
} from "lucide-react"
import { PillLink } from "../primitives"

const NAV = [
  { label: "改葬とは", href: "#about" },
  { label: "サービス", href: "#services" },
  { label: "改葬許可申請書DL", href: "#permit" },
  { label: "行政書士マッチング", href: "#gyosei" },
  { label: "墓石撤去実例", href: "#cases" },
  { label: "関連サービス", href: "#related" },
]

const NAV_BENTO = [
  { label: "改葬とは", sub: "基礎知識", href: "#about", Icon: FileText, span: 2 },
  { label: "サービス", sub: "対応範囲", href: "#services", Icon: Landmark, span: 1 },
  { label: "改葬許可申請書DL", sub: "全国対応", href: "#permit", Icon: Download, span: 1 },
  { label: "行政書士マッチング", sub: "有資格者紹介", href: "#gyosei", Icon: UserCheck, span: 1 },
  { label: "墓石撤去実例", sub: "施工事例", href: "#cases", Icon: Hammer, span: 1 },
  { label: "関連サービス", sub: "散骨・粉骨", href: "#related", Icon: Waves, span: 2 },
] as const

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="group relative whitespace-nowrap px-0 py-1 text-sm font-medium text-[#525762] transition-colors duration-200 hover:text-seiren-main"
    >
      {label}
      <span
        aria-hidden
        className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 rounded bg-seiren-accent-micro transition-all duration-200 group-hover:w-full"
      />
    </a>
  )
}

function BentoCard({ item, onClose }: { item: (typeof NAV_BENTO)[number]; onClose: () => void }) {
  return (
    <a
      href={item.href}
      onClick={onClose}
      className="group relative flex min-h-[96px] flex-col justify-between gap-3.5 overflow-hidden rounded-[18px] border border-white/65 px-4 pb-3.5 pt-4 transition-transform duration-200 active:scale-[0.98]"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.58) 60%, rgba(255,255,255,0.48) 100%)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.8), 0 6px 18px rgba(30,42,56,0.08)",
        gridColumn: `span ${item.span}`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-[8%] right-[8%] top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)" }}
      />
      <div className="flex items-center justify-between">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-[11px] border border-seiren-accent-micro/25 text-seiren-accent-micro"
          style={{
            background:
              "linear-gradient(135deg, rgba(183,154,99,0.18), rgba(183,154,99,0.06))",
          }}
        >
          <item.Icon size={18} strokeWidth={1.75} />
        </span>
        <ChevronRight size={16} className="text-[#525762]/55" strokeWidth={1.75} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[15px] font-semibold leading-[1.3] tracking-[0.005em] text-seiren-main">
          {item.label}
        </span>
        <span className="text-[11px] font-medium tracking-[0.04em] text-[#525762]">
          {item.sub}
        </span>
      </div>
    </a>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <div
      aria-hidden={!open}
      className="fixed inset-0 z-[100]"
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      <div
        onClick={onClose}
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: "rgba(20,28,40,0.55)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
        }}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="メニュー"
        className="absolute right-0 top-0 bottom-0 flex w-[min(88vw,380px)] flex-col border-l border-white/60 p-4 pb-[22px] transition-transform duration-300"
        style={{
          background:
            "linear-gradient(180deg, rgba(250,250,248,0.92) 0%, rgba(245,243,238,0.95) 100%)",
          backdropFilter: "blur(28px) saturate(160%)",
          WebkitBackdropFilter: "blur(28px) saturate(160%)",
          boxShadow: "-18px 0 48px rgba(20,28,40,0.18)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="mb-4 flex items-center justify-between border-b border-seiren-accent-micro/20 pb-4 pt-2 px-2">
          <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
            <Image
              src="/web-app-manifest-192x192.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-auto object-contain"
            />
            <span className="flex flex-col leading-[1.15]">
              <span className="text-sm font-semibold text-seiren-main">お墓じまいナビ</span>
              <span className="mt-0.5 text-[9px] font-medium tracking-[0.14em] text-[#8A8478]">
                by 株式会社 清蓮
              </span>
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/70"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.55))",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 8px rgba(30,42,56,0.08)",
            }}
          >
            <X size={18} strokeWidth={1.75} className="text-seiren-main" />
          </button>
        </div>

        <nav aria-label="サイトメニュー" className="grid flex-none grid-cols-2 gap-2.5">
          {NAV_BENTO.map((it) => (
            <BentoCard key={it.label} item={it} onClose={onClose} />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2.5 pt-4">
          <a
            href="#contact"
            onClick={onClose}
            className="flex items-center justify-center gap-2.5 rounded-[18px] border border-white/25 px-5 py-4 text-[15px] font-bold tracking-[0.02em] text-white no-underline"
            style={{
              background: "linear-gradient(135deg, #C98A2E 0%, #B47820 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 20px rgba(201,138,46,0.32)",
            }}
          >
            <Mail size={18} className="text-white" strokeWidth={1.75} /> 無料で相談する
          </a>
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="https://lin.ee/qSN2RLK"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/25 px-3.5 py-3 text-[13px] font-bold text-white no-underline"
              style={{
                background: "linear-gradient(135deg, #06C755 0%, #04A848 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 14px rgba(6,199,85,0.28)",
              }}
            >
              <MessageSquare size={16} strokeWidth={1.75} className="text-white" /> LINE
            </a>
            <a
              href="tel:08008888788"
              className="flex items-center justify-center gap-2 rounded-2xl border border-seiren-accent-micro/30 px-3.5 py-3 text-[13px] font-semibold text-seiren-main no-underline"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.55))",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 14px rgba(30,42,56,0.06)",
              }}
            >
              <Phone size={15} strokeWidth={1.75} className="text-seiren-accent-micro" /> 電話
            </a>
          </div>
          <p className="mx-1 mt-1 text-center text-[11px] tracking-[0.05em] text-[#8A8478]">
            0800-888-8788 ・ 9:00〜19:00 ・ お見積り無料
          </p>
        </div>
      </aside>
    </div>
  )
}

export function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-200"
      style={{
        background: "rgba(250,250,248,0.82)",
        backdropFilter: "blur(10px) saturate(110%)",
        WebkitBackdropFilter: "blur(10px) saturate(110%)",
        borderBottom: scrolled
          ? "1px solid rgba(229,224,214,0.9)"
          : "1px solid rgba(229,224,214,0.4)",
        boxShadow: scrolled ? "0 1px 0 rgba(30,42,56,0.02)" : "none",
      }}
    >
      <div className="mx-auto flex h-[84px] max-w-[1280px] items-center justify-between gap-6 px-5 lg:px-7">
        <Link href="/#top" className="flex flex-shrink-0 items-center gap-3">
          <Image
            src="/web-app-manifest-192x192.png"
            alt="清蓮 / お墓じまいナビ"
            width={44}
            height={44}
            className="h-11 w-auto object-contain"
            priority
          />
          <span className="flex flex-col leading-[1.15]">
            <span
              className="text-base font-semibold tracking-[0.01em] text-seiren-main"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              お墓じまいナビ
            </span>
            <span className="mt-0.5 text-[10px] font-medium tracking-[0.16em] text-[#8A8478]">
              by 株式会社 清蓮
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {NAV.map((it) => (
            <NavLink key={it.label} label={it.label} href={it.href} />
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 xl:flex">
          <PillLink variant="cta" size="sm" href="/contact">
            無料で相談する
          </PillLink>
        </div>

        <button
          aria-label="メニュー"
          onClick={() => setMenuOpen(true)}
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#E5E0D6] bg-white/70 xl:hidden"
        >
          <Menu size={20} strokeWidth={1.75} className="text-seiren-main" />
        </button>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
