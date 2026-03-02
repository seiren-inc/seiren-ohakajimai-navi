"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef } from "react"
import { Phone, Menu, X, ChevronDown, Mail, ExternalLink } from "lucide-react"

// -----------------------------------------------
// データ定義
// -----------------------------------------------

const serviceItems = [
  { label: "お墓じまいとは", href: "/about", description: "お墓じまいの基礎知識" },
  { label: "ご依頼の流れ", href: "/flow", description: "相談からお墓じまい完了まで" },
  { label: "料金", href: "/price", description: "明朗な料金体系" },
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

// -----------------------------------------------
// 準備中モーダル
// -----------------------------------------------
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
              {error && <p className="text-xs text-red-500">{error}</p>}
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

// -----------------------------------------------
// ドロップダウン共通コンポーネント
// -----------------------------------------------
type DropdownItem =
  | { type: "link"; label: string; href: string; description?: string; external?: boolean }
  | { type: "button"; label: string; description?: string; badge?: string; onClick: () => void }

function NavDropdown({
  label,
  items,
  isActive,
  align = "left",
}: {
  label: string
  items: DropdownItem[]
  isActive?: boolean
  align?: "left" | "right"
}) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        className={`flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap ${
          isActive
            ? "text-neutral-900"
            : "text-neutral-600 hover:text-neutral-900"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full z-50 mt-2 w-56 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item, i) =>
            item.type === "link" ? (
              <Link
                key={i}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
              >
                <span className="flex flex-col">
                  <span className="font-medium">{item.label}</span>
                  {item.description && (
                    <span className="text-xs text-neutral-400">{item.description}</span>
                  )}
                </span>
                {item.external && <ExternalLink className="h-3 w-3 shrink-0 text-neutral-300" />}
              </Link>
            ) : (
              <button
                key={i}
                onClick={() => { setOpen(false); item.onClick() }}
                className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
              >
                <span className="flex flex-col">
                  <span className="font-medium">{item.label}</span>
                  {item.description && (
                    <span className="text-xs text-neutral-400">{item.description}</span>
                  )}
                </span>
                {item.badge && (
                  <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}

// -----------------------------------------------
// 無料相談 CTAドロップダウン
// -----------------------------------------------
function CTADropdown() {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        className="flex items-center gap-1 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        無料相談
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm">
          {/* 電話相談 */}
          <a
            href="tel:08008888788"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <Phone className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <span className="flex flex-col">
              <span className="font-semibold text-emerald-700">電話で相談する</span>
              <span className="text-xs text-neutral-400">0800-888-8788（フリーコール）</span>
              <span className="text-xs text-neutral-400">9:00〜19:00</span>
            </span>
          </a>

          <div className="my-1 border-t border-neutral-100" />

          {/* フォーム */}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100">
              <Mail className="h-3.5 w-3.5 text-neutral-500" />
            </div>
            <span className="flex flex-col">
              <span className="font-semibold">フォームで問い合わせ</span>
              <span className="text-xs text-neutral-400">24時間受付・2営業日以内に返信</span>
            </span>
          </Link>
        </div>
      )}
    </div>
  )
}

// -----------------------------------------------
// メインヘッダー
// -----------------------------------------------
export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [mobileConsultOpen, setMobileConsultOpen] = useState(false)

  // サービスドロップダウン items
  const serviceDropdownItems: DropdownItem[] = serviceItems.map((item) => ({
    type: "link",
    label: item.label,
    href: item.href,
    description: item.description,
  }))

  // 申請書・手続きドロップダウン items
  const kaisouDropdownItems: DropdownItem[] = kaisouSubItems.map((item) => ({
    type: "link",
    label: item.label,
    href: item.href,
    description: item.description,
  }))

  // 関連サービスドロップダウン items
  const relatedDropdownItems: DropdownItem[] = relatedServices.map((service) =>
    service.comingSoon
      ? {
          type: "button",
          label: service.label,
          description: service.description,
          badge: "準備中",
          onClick: () => setModalOpen(true),
        }
      : {
          type: "link",
          label: service.label,
          href: service.href,
          description: service.description,
          external: service.external,
        }
  )

  const isServiceActive = serviceItems.some((item) => pathname === item.href)
  const isKaisouActive = kaisouSubItems.some((item) => pathname === item.href)

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
            <span className="text-sm font-bold tracking-tight text-neutral-900 lg:text-base">
              お墓じまいナビ
            </span>
          </Link>

          {/* Desktop Nav (lg以上のみ表示) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
            {/* サービス ▼ */}
            <NavDropdown
              label="サービス"
              items={serviceDropdownItems}
              isActive={isServiceActive}
              align="left"
            />

            {/* 申請書・手続き ▼ */}
            <NavDropdown
              label="申請書・手続き"
              items={kaisouDropdownItems}
              isActive={isKaisouActive}
              align="left"
            />

            {/* 行政書士 */}
            <Link
              href="/gyoseishoshi"
              className={
                pathname === "/gyoseishoshi"
                  ? "relative text-sm font-medium text-neutral-900 after:absolute after:-bottom-px after:left-0 after:w-full after:h-[2px] after:bg-emerald-600"
                  : "text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors whitespace-nowrap"
              }
            >
              行政書士
            </Link>

            {/* 会社概要 */}
            <Link
              href="/company"
              className={
                pathname === "/company"
                  ? "relative text-sm font-medium text-neutral-900 after:absolute after:-bottom-px after:left-0 after:w-full after:h-[2px] after:bg-emerald-600"
                  : "text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors whitespace-nowrap"
              }
            >
              会社概要
            </Link>

            {/* セパレーター */}
            <span className="h-4 w-px bg-neutral-200" aria-hidden="true" />

            {/* 関連サービス ▼ */}
            <NavDropdown
              label="関連サービス"
              items={relatedDropdownItems}
              align="right"
            />
          </nav>

          {/* Desktop CTA (lg以上のみ表示) */}
          <div className="hidden lg:flex items-center shrink-0">
            <CTADropdown />
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
            <nav className="flex flex-col">
              {/* サービス */}
              <div className="border-b border-neutral-100">
                <p className="flex min-h-[52px] items-center text-base font-medium text-neutral-700">
                  サービス
                </p>
                <div className="flex flex-col gap-1 pb-3 pl-4">
                  {serviceItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex flex-col rounded-lg px-2 py-2.5 text-sm ${
                        pathname === item.href
                          ? "bg-emerald-50 text-emerald-700 font-semibold"
                          : "text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-xs text-neutral-400">{item.description}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 申請書・手続き */}
              <div className="border-b border-neutral-100">
                <p className="flex min-h-[52px] items-center text-base font-medium text-neutral-700">
                  申請書・手続き
                </p>
                <div className="flex flex-col gap-1 pb-3 pl-4">
                  {kaisouSubItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex flex-col rounded-lg px-2 py-2.5 text-sm ${
                        pathname === item.href
                          ? "bg-emerald-50 text-emerald-700 font-semibold"
                          : "text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-xs text-neutral-400">{item.description}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 行政書士 */}
              <Link
                href="/gyoseishoshi"
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-[52px] items-center border-b border-neutral-100 text-base ${
                  pathname === "/gyoseishoshi"
                    ? "font-semibold text-emerald-600"
                    : "font-medium text-neutral-700"
                }`}
              >
                行政書士
              </Link>

              {/* 会社概要 */}
              <Link
                href="/company"
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-[52px] items-center border-b border-neutral-100 text-base ${
                  pathname === "/company"
                    ? "font-semibold text-emerald-600"
                    : "font-medium text-neutral-700"
                }`}
              >
                会社概要
              </Link>
            </nav>

            {/* お問い合わせ選択 */}
            <div className="mt-5 flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                無料相談
              </p>

              <button
                onClick={() => setMobileConsultOpen(!mobileConsultOpen)}
                className="flex min-h-[52px] items-center justify-between rounded-xl border border-neutral-200 px-4 text-sm font-medium text-neutral-700"
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
                    className="flex min-h-[52px] items-center gap-3 rounded-xl border-2 border-emerald-600 px-4 text-emerald-600"
                  >
                    <Phone className="h-4 w-4 shrink-0" />
                    <span className="flex flex-col">
                      <span className="text-sm font-bold">電話で相談する</span>
                      <span className="text-[10px] text-emerald-500">0800-888-8788（フリーコール）9:00〜19:00</span>
                    </span>
                  </a>
                  <Link
                    href="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-[52px] items-center gap-3 rounded-xl bg-emerald-600 px-4 text-white"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="flex flex-col">
                      <span className="text-sm font-bold">フォームで問い合わせ</span>
                      <span className="text-[10px] text-emerald-100">24時間受付・2営業日以内に返信</span>
                    </span>
                  </Link>
                </div>
              )}
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
                      className="flex items-center justify-between rounded-lg px-2 py-3 text-sm text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
                    >
                      <span>{service.label}</span>
                      <ExternalLink className="h-3 w-3 text-neutral-300" />
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
