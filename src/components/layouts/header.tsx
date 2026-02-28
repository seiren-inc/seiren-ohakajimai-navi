"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef } from "react"
import { Phone, Menu, X, ChevronDown } from "lucide-react"

const navItems = [
  { label: "お墓じまいとは", href: "/about" },
  { label: "ご依頼の流れ", href: "/flow" },
  { label: "料金", href: "/price" },
  { label: "行政書士マッチング", href: "/gyoseishoshi" },
]

const kaisouSubItems = [
  { label: "申請書ダウンロード", href: "/kaisoukyoka", description: "全国自治体の申請書一覧" },
  { label: "改葬手続き情報", href: "/kaissou", description: "都道府県別の手続きガイド" },
]

const relatedServices = [
  {
    label: "散骨クルーズ",
    href: "https://www.sankotu-cruise.com/",
    description: "海洋散骨の専門サービス",
    external: true,
    comingSoon: false,
  },
  {
    label: "遺骨ラボ",
    href: "https://ikotsu-lab.com/",
    description: "遺骨の専門処理・粉骨",
    external: true,
    comingSoon: false,
  },
  {
    label: "お墓探しナビ",
    href: "#",
    description: "全国の霊園・納骨堂を検索",
    external: false,
    comingSoon: true,
  },
]

// お墓探しナビ 準備中モーダル
function ComingSoonModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/notify-ohakanavi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) throw new Error("送信エラー")
      setSubmitted(true)
    } catch {
      setError("送信に失敗しました。しばらくしてから再度お試しください。")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Coming Soon
            </p>
            <h2 className="mt-2 text-xl font-bold text-neutral-900">お墓探しナビ</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700"
            aria-label="閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="mt-6 rounded-xl bg-emerald-50 py-6 text-center">
            <p className="text-sm font-semibold text-emerald-700">登録しました ✓</p>
            <p className="mt-1 text-xs text-emerald-600">公開時にご連絡します</p>
          </div>
        ) : (
          <>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              全国の霊園・納骨堂・樹木葬を探せるサービスを準備中です。
              公開時にお知らせします。
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレスを入力"
                required
                disabled={loading}
                className="w-full rounded-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
              />
              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-60"
              >
                {loading ? "送信中..." : "公開時に通知を受け取る"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// 関連サービス ドロップダウン（PC）
function RelatedServicesDropdown() {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  return (
    <>
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
          aria-expanded={open}
          aria-haspopup="true"
        >
          関連サービス
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm">
            {relatedServices.map((service) =>
              service.comingSoon ? (
                <button
                  key={service.label}
                  onClick={() => {
                    setOpen(false)
                    setModalOpen(true)
                  }}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                >
                  <span className="flex flex-col">
                    <span>{service.label}</span>
                    <span className="text-xs text-neutral-400">{service.description}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                    準備中
                  </span>
                </button>
              ) : (
                <a
                  key={service.label}
                  href={service.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex flex-col rounded-md px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                >
                  <span>{service.label}</span>
                  <span className="text-xs text-neutral-400">{service.description}</span>
                </a>
              )
            )}
          </div>
        )}
      </div>

      {modalOpen && <ComingSoonModal onClose={() => setModalOpen(false)} />}
    </>
  )
}

// 改葬手続き関連 ドロップダウン（PC）
function KaisouDropdown() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isActive = kaisouSubItems.some(item => pathname === item.href)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap ${
          isActive
            ? "text-neutral-900"
            : "text-neutral-600 hover:text-neutral-900"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        改葬手続き関連
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm">
          {kaisouSubItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex flex-col rounded-md px-3 py-2.5 text-sm transition-colors ${
                pathname === item.href
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <span className="font-medium">{item.label}</span>
              <span className="text-xs text-neutral-400">{item.description}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200/70 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/logo2.png"
              alt="清蓮 ロゴ"
              width={36}
              height={36}
              className="h-9 w-auto object-contain"
              priority
            />
            <span className="text-sm font-bold tracking-tight text-neutral-900 lg:text-base">お墓じまいナビ</span>
          </Link>

          {/* Desktop Nav (lg以上のみ表示) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive
                      ? "relative text-sm font-medium text-neutral-900 after:absolute after:-bottom-px after:left-0 after:w-full after:h-[2px] after:bg-emerald-600"
                      : "text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors whitespace-nowrap"
                  }
                >
                  {item.label}
                </Link>
              )
            })}

            {/* 改葬手続き関連プルダウン */}
            <KaisouDropdown />

            {/* 関連サービス（補助ナビ） */}
            <span className="h-4 w-px bg-neutral-200" aria-hidden="true" />
            <RelatedServicesDropdown />
          </nav>

          {/* Desktop CTA (lg以上のみ表示) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <a
              href="tel:08008888788"
              className="flex flex-col items-end text-right leading-none"
            >
              <span className="flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors tracking-wide">
                <Phone className="h-3.5 w-3.5" />
                0800-888-8788
              </span>
              <span className="text-[10px] text-neutral-400 mt-0.5">フリーコール｜9:00〜19:00</span>
            </a>
            <Link
              href="/contact"
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              無料相談
            </Link>
          </div>

          {/* Mobile/Tablet: CTA + Hamburger (lg未満で表示) */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/contact"
              className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              無料相談
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Drawer */}
        {menuOpen && (
          <div className="border-t border-neutral-100 bg-white px-4 pb-6 pt-4 lg:hidden">
            {/* メインナビ */}
            <nav className="flex flex-col">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex min-h-[52px] items-center border-b border-neutral-100 text-base ${
                      isActive
                        ? "font-semibold text-emerald-600"
                        : "font-medium text-neutral-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}

              {/* 改葬手続き関連（モバイル） */}
              <div className="border-b border-neutral-100">
                <p className="flex min-h-[52px] items-center text-base font-medium text-neutral-700">
                  改葬手続き関連
                </p>
                <div className="flex flex-col gap-1 pb-3 pl-4">
                  {kaisouSubItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex flex-col rounded-lg px-2 py-2.5 text-sm ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                            : "text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="text-xs text-neutral-400">{item.description}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </nav>

            {/* 電話・CTA */}
            <div className="mt-5 flex flex-col gap-3">
              <a
                href="tel:08008888788"
                className="flex min-h-[52px] flex-col items-center justify-center rounded-full border-2 border-emerald-600 text-emerald-600"
              >
                <span className="flex items-center gap-1.5 text-sm font-bold">
                  <Phone className="h-4 w-4" />
                  0800-888-8788
                </span>
                <span className="text-[10px] text-emerald-500 mt-0.5">フリーコール｜9:00〜19:00</span>
              </a>
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[52px] items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white"
              >
                無料相談・お見積り
              </Link>
            </div>

            {/* 関連サービス（モバイル最下部） */}
            <div className="mt-8 border-t border-neutral-100 pt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                関連サービス
              </p>
              <div className="mt-3 flex flex-col gap-1">
                {relatedServices.map((service) =>
                  service.comingSoon ? (
                    <button
                      key={service.label}
                      onClick={() => {
                        setMenuOpen(false)
                        setModalOpen(true)
                      }}
                      className="flex items-center justify-between rounded-lg px-2 py-3 text-left text-sm text-neutral-500 hover:bg-neutral-50"
                    >
                      <span>{service.label}</span>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-400">
                        準備中
                      </span>
                    </button>
                  ) : (
                    <a
                      key={service.label}
                      href={service.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg px-2 py-3 text-sm text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
                    >
                      {service.label}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 準備中モーダル（ヘッダー外） */}
      {modalOpen && <ComingSoonModal onClose={() => setModalOpen(false)} />}
    </>
  )
}
