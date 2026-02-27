"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Phone,
  Mail,
  MapPin,
  FileText,
  UserCheck,
  Droplets,
  Landmark,
  Waves,
  Check,
  ShieldAlert,
  AlertTriangle,
  Info,
  ChevronDown,
  Download,
  ArrowRight,
  ShieldCheck,
  Star,
  MessageSquare,
  ClipboardList,
  CheckCircle,
  Eye,
  Undo2,
  Menu,
  X,
  Hammer,
} from "lucide-react"

// 関連サービスデータ（header.tsx と共通定義）
const relatedServices = [
  { label: "散骨クルーズ", href: "https://www.sankotu-cruise.com/", description: "海洋散骨の専門サービス", external: true, comingSoon: false },
  { label: "遠骨ラボ", href: "https://ikotsu-lab.com/", description: "遠骨の専門処理・粉骨", external: true, comingSoon: false },
  { label: "お墓探しナビ", href: "#", description: "全国の霊団・納骨堂を検索", external: false, comingSoon: true },
]

// ----------------------------------------------------------------
// Reveal Hook (IntersectionObserver)
// ----------------------------------------------------------------
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ----------------------------------------------------------------
// Reveal Section Wrapper
// ----------------------------------------------------------------
function Reveal({
  children,
  className = "",
  delay = 0,
  id,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  id?: string
}) {
  const { ref, visible } = useReveal()
  return (
    <section
      ref={ref}
      id={id}
      className={className}
      style={{
        transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </section>
  )
}

// ----------------------------------------------------------------
// Count Up (for Trust Bar)
// ----------------------------------------------------------------
function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const { ref, visible } = useReveal()
  useEffect(() => {
    if (!visible || target === 0) {
      setCount(target)
      return
    }
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [visible, target, duration])
  return <span ref={ref as React.RefObject<HTMLSpanElement>}>{count}</span>
}

// ----------------------------------------------------------------
// Service Data
// ----------------------------------------------------------------
const services = [
  {
    icon: FileText,
    title: "改葬手続きの案内",
    description:
      "流れの説明、書類の取得方法、一般的な記入ポイントをご案内します。全国自治体の申請書ダウンロード導線もご用意。",
  },
  {
    icon: UserCheck,
    title: "行政書士のご紹介",
    description: "代理提出や個別事情がある場合は、提携行政書士をご紹介します。",
  },
  {
    icon: Hammer,
    title: "墓石撤去工事の手配",
    description: "現地状況に応じた撤去・整地・原状回復を手配します。",
  },
  {
    icon: Droplets,
    title: "遺骨の取扱い（洗骨・粉骨）",
    description:
      "取り出したご遺骨の洗骨・粉骨、保管容器への納め替えに対応します。",
  },
  {
    icon: Landmark,
    title: "改葬先のご提案",
    description:
      "納骨堂・樹木葬・合祀など、改葬後の選択肢をご提案します。",
  },
  {
    icon: Waves,
    title: "海洋散骨",
    description:
      "海洋散骨の場合、一般に改葬手続きが不要となるケースがあります。状況に応じてご案内します。",
  },
]

// ----------------------------------------------------------------
// FAQ Data
// ----------------------------------------------------------------
const faqs = [
  {
    q: "改葬手続きの代行もお願いできますか？",
    a: "代理提出は行政書士等の有資格者業務です。清蓮は代行せず、必要な場合は提携行政書士をご紹介します。",
  },
  {
    q: "受入証明と埋葬証明はどこでもらえますか？",
    a: "受入証明は新しい納骨先、埋葬証明は現在のお墓の管理者（寺院・霊園等）から取得します。",
  },
  {
    q: "離檀交渉サポートとは何ですか？",
    a: "寺院・管理者との手続き上の交渉や段取りで詰まりやすいポイントを整理し、円滑化を支援します。",
  },
  {
    q: "海洋散骨の場合は改葬手続きが必要ですか？",
    a: "状況により異なります。個別事情を確認してご案内します。",
  },
  {
    q: "見積り後に追加費用が発生することはありますか？",
    a: "原則ありません。現地調査で正確に状況を確認した上でお見積りを提示します。ただし、調査時に確認できなかった地中障害物等が発見された場合のみ、事前にご相談のうえ追加費用が発生する場合があります。",
  },
  {
    q: "全国どこでも対応していますか？",
    a: "はい、47都道府県対応しています。全国の提携石材店ネットワークを活用して対応いたします。",
  },
]

// ----------------------------------------------------------------
// Coming Soon Modal（お墓探しナビ）
// ----------------------------------------------------------------
function HomepageComingSoonModal({ onClose }: { onClose: () => void }) {
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
      if (!res.ok) throw new Error()
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
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Coming Soon</p>
            <h2 className="mt-2 text-xl font-bold text-neutral-900">お墓探しナビ</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700" aria-label="閉じる">
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
              全国の霊園・納骨堂・樹木葬を探せるサービスを準備中です。公開時にお知らせします。
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

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------
export default function HomepageClient() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [relatedOpen, setRelatedOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
      setMenuOpen(false)
    }
  }

  const navLinks = [
    { label: "お墓じまいとは", href: "/about" },
    { label: "ご依頼の流れ", href: "/flow" },
    { label: "料金", href: "/price" },
    { label: "申請書DL", href: "/kaisoukyoka" },
    { label: "改葬手続き情報", href: "/kaissou" },
    { label: "会社概要", href: "/company" },
  ]

  // ----------------------------------------------------------------
  // JSON-LD
  // ----------------------------------------------------------------
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "お墓じまいナビ",
    description: "改葬手続き案内から供養までの一括サポートサービス",
    provider: { "@type": "Organization", name: "株式会社清蓮" },
    areaServed: "JP",
    telephone: "0120-000-000",
    priceRange: "お見積り無料",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col min-h-screen text-[#1A1A1A] selection:bg-emerald-100 selection:text-emerald-900 pb-20 md:pb-0">

        {/* ============================================================
            [A] グローバルナビ
        ============================================================ */}
        <header
          className={`sticky top-0 z-50 border-b border-neutral-200/70 bg-white/95 backdrop-blur-xl transition-shadow ${
            scrolled ? "shadow-sm" : ""
          }`}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image
                src="/logo.png"
                alt="清蓮 ロゴ"
                width={36}
                height={36}
                className="h-9 w-auto object-contain"
                priority
              />
              <span className="text-sm font-bold tracking-tight lg:text-base">お墓じまいナビ</span>
            </Link>

            {/* Desktop Nav (lg以上のみ) */}
            <nav className="hidden items-center gap-6 lg:flex">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
              {/* 関連サービス補助ナビ */}
              <span className="h-4 w-px bg-neutral-200" aria-hidden="true" />
              <div
                className="relative"
                onMouseEnter={() => setRelatedOpen(true)}
                onMouseLeave={() => setRelatedOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800 transition-colors">
                  関連サービス
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${relatedOpen ? "rotate-180" : ""}`} />
                </button>
                {relatedOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm">
                    {relatedServices.map((service) =>
                      service.comingSoon ? (
                        <button
                          key={service.label}
                          onClick={() => { setRelatedOpen(false); setModalOpen(true) }}
                          className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                        >
                          <span className="flex flex-col">
                            <span>{service.label}</span>
                            <span className="text-xs text-neutral-400">{service.description}</span>
                          </span>
                          <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">準備中</span>
                        </button>
                      ) : (
                        <a
                          key={service.label}
                          href={service.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setRelatedOpen(false)}
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
            </nav>

            {/* CTA + Mobile Menu */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:045-881-9952"
                className="hidden items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-emerald-700 transition-colors lg:flex"
              >
                <Phone className="h-4 w-4" />
                045-881-9952
              </a>
              <Link
                href="/contact"
                className="hidden rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 lg:inline-flex"
              >
                無料相談
              </Link>
              {/* モバイル専用CTAミニボタン */}
              <Link
                href="/contact"
                className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 lg:hidden"
              >
                無料相談
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-lg lg:hidden"
                aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Menu Drawer */}
          {menuOpen && (
            <div className="border-t border-neutral-100 bg-white px-4 pb-6 pt-4 lg:hidden">
              <nav className="flex flex-col">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex min-h-[52px] items-center border-b border-neutral-100 text-base font-medium text-neutral-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-5 flex flex-col gap-3">
                <a
                  href="tel:045-881-9952"
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-full border-2 border-emerald-600 text-sm font-bold text-emerald-600"
                >
                  <Phone className="h-4 w-4" />
                  045-881-9952
                </a>
                <Link
                  href="/contact"
                  className="flex min-h-[52px] items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  無料相談・お見積り
                </Link>
              </div>
              {/* 関連サービス（モバイル最下部） */}
              <div className="mt-8 border-t border-neutral-100 pt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">関連サービス</p>
                <div className="mt-3 flex flex-col gap-1">
                  {relatedServices.map((service) =>
                    service.comingSoon ? (
                      <button
                        key={service.label}
                        onClick={() => { setMenuOpen(false); setModalOpen(true) }}
                        className="flex items-center justify-between rounded-lg px-2 py-3 text-left text-sm text-neutral-500 hover:bg-neutral-50"
                      >
                        <span>{service.label}</span>
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-400">準備中</span>
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

        {/* 準備中モーダル */}
        {modalOpen && (
          <HomepageComingSoonModal onClose={() => setModalOpen(false)} />
        )}

        {/* ============================================================
            [B] ヒーロー
        ============================================================ */}
        <section className="relative flex min-h-[86vh] items-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-linear-to-br from-emerald-50 via-white to-gray-50" />

          {/* Hero image */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero-garden-v3.jpg"
              alt="静かな日本の墓地の庭園風景。朝の柔らかい自然光と整然と並ぶ墓石"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-r from-white via-white/98 to-white/70 md:via-white/95 md:to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32">
            <div
              className="max-w-xl"
              style={{ animation: "fadeUp 0.9s ease-out both" }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">全国対応・法令遵守</p>
              <h1 className="typography-heading mt-5 max-w-[16ch] text-3xl font-semibold leading-[1.15] tracking-tight text-[#111827] sm:text-4xl md:text-5xl lg:text-6xl">お墓じまいのすべてを、プロにお任せ。</h1>
              <p className="typography-body mt-6 max-w-[46ch] text-base font-medium leading-[1.85] text-[#374151] md:text-lg">
                改葬手続きの案内と書類サポート、提携行政書士の<br className="hidden md:block" />
                ご紹介、墓石撤去、遺骨のケア、新しい供養先まで。<br className="hidden md:block" />
                株式会社清蓮がワンストップでサポートします。
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/contact"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-emerald-600 px-9 text-[17px] font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl"
                >
                  無料相談・お見積り
                </Link>
                <a
                  href="tel:0120000000"
                  className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white/80 px-8 text-[17px] font-semibold text-[#111827] backdrop-blur transition-all hover:border-gray-300 hover:bg-white"
                >
                  <Phone className="h-5 w-5 text-emerald-600" />
                  0120-000-000
                </a>
              </div>

              <p className="mt-5 text-[13px] font-medium text-[#4B5563]">24時間365日受付 / お見積り無料 / 無理な勧誘なし</p>
            </div>
          </div>
        </section>

        {/* ============================================================
            [C] 信頼バー
        ============================================================ */}
        <div className="border-y border-gray-100 bg-white">
          <div className="mx-auto grid max-w-4xl grid-cols-1 divide-y divide-gray-100 md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              { target: 47, unit: "都道府県", label: "全国対応" },
              { target: 24, unit: "時間", label: "受付対応" },
              { target: 0, unit: "円", label: "お見積り" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center px-8 py-10 text-center">
                <div className="flex items-baseline gap-1">
                  <span className="text-[44px] font-bold tracking-tight text-emerald-600 md:text-[52px]">
                    <CountUp target={item.target} />
                  </span>
                  <span className="text-[15px] font-medium text-[#6B7280]">{item.unit}</span>
                </div>
                <p className="mt-2 text-[13px] font-medium text-[#9CA3AF]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            [D] 選ばれる3つの理由
        ============================================================ */}
        <Reveal className="py-24 md:py-36">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-[34px] font-bold tracking-tight text-[#1A1A1A] md:text-[44px]">選ばれる3つの理由</h2>
              <p className="mt-5 text-[17px] leading-[1.65] text-[#6B7280]">安さだけではありません。法令遵守と確かな実績で選ばれています。</p>
            </div>

            <div className="mt-16 space-y-20 md:mt-20 md:space-y-28">
              {/* 理由1: 全国対応 */}
              <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
                <div className="w-full md:w-1/2">
                  <div className="aspect-4/3 overflow-hidden rounded-3xl bg-linear-to-br from-emerald-50 to-emerald-100 relative">
                    <Image
                      src="/images/reason-nationwide-v3.jpg"
                      alt="日本列島と全国ネットワークを象徴するインフォグラフィック風デザイン"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="min-w-0 w-full md:w-1/2">
                  <span className="text-[12px] font-semibold tracking-widest text-emerald-600">01</span>
                  <h3 className="typography-heading mt-3 max-w-[22ch] text-2xl font-semibold leading-[1.2] tracking-tight text-[#1A1A1A] md:text-3xl lg:text-4xl">全国対応と提携ネットワーク</h3>
                  <p className="typography-body mt-5 max-w-[640px] wrap-break-word text-base leading-[1.9] text-[#6B7280] md:text-lg">全国の提携石材店と連携しているため、地域差のある手続きや工事も進めやすい体制です。</p>
                  <p className="typography-body mt-4 max-w-[640px] wrap-break-word text-base leading-[1.9] text-[#6B7280] md:text-lg">独自のネットワークで、地域ごとの条例や慣習に精通した優良石材店を手配します。</p>
                </div>
              </div>

              {/* 理由2: 法令遵守（画像とテキストの左右反転） */}
              <div className="flex flex-col items-center gap-10 md:flex-row-reverse md:gap-16">
                <div className="w-full md:w-1/2">
                  <div className="aspect-4/3 overflow-hidden rounded-3xl bg-linear-to-br from-gray-50 to-gray-100 relative">
                    <Image
                      src="/images/reason-compliance-v2.jpg"
                      alt="デスクの上に整然と置かれた書類と万年筆"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="min-w-0 w-full md:w-1/2">
                  <span className="text-[12px] font-semibold tracking-widest text-emerald-600">02</span>
                  <h3 className="typography-heading mt-3 max-w-[22ch] text-2xl font-semibold leading-[1.2] tracking-tight text-[#1A1A1A] md:text-3xl lg:text-4xl">法令遵守の安心設計</h3>
                  <p className="typography-body mt-5 max-w-[640px] wrap-break-word text-base leading-[1.9] text-[#6B7280] md:text-lg">改葬手続きは「案内」と「行政書士紹介」に限定。違法リスクのある代行は行いません。</p>
                  <p className="typography-body mt-4 max-w-[640px] wrap-break-word text-base leading-[1.9] text-[#6B7280] md:text-lg">改葬許可申請の代理提出が必要な場合は、提携行政書士をご紹介します。</p>
                </div>
              </div>

              {/* 理由3: 離檀交渉サポート */}
              <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
                <div className="w-full md:w-1/2">
                  <div className="aspect-4/3 overflow-hidden rounded-3xl bg-linear-to-br from-amber-50 to-orange-50 relative">
                    <Image
                      src="/images/reason-negotiation-v2.jpg"
                      alt="落ち着いた和室で交渉している様子"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="min-w-0 w-full md:w-1/2">
                  <span className="text-[12px] font-semibold tracking-widest text-emerald-600">03</span>
                  <h3 className="typography-heading mt-3 max-w-[22ch] text-2xl font-semibold leading-[1.2] tracking-tight text-[#1A1A1A] md:text-3xl lg:text-4xl">離檀交渉サポート</h3>
                  <p className="typography-body mt-5 max-w-[640px] wrap-break-word text-base leading-[1.9] text-[#6B7280] md:text-lg">寺院・墓地管理者との離檀交渉で悩む方が多い領域を、実務目線でサポートします。</p>
                  <p className="typography-body mt-4 max-w-[640px] wrap-break-word text-base leading-[1.9] text-[#6B7280] md:text-lg">高額な離檀料を請求された場合もご相談ください。</p>
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                    <Star className="h-4 w-4" />
                    他社にない独自サービス
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ============================================================
            [E] サービス内容
        ============================================================ */}
        <Reveal className="bg-[#F9FAFB] py-24 md:py-36">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-[34px] font-bold tracking-tight text-[#1A1A1A] md:text-[44px]">サービス内容</h2>
              <p className="mt-5 text-[17px] leading-[1.65] text-[#6B7280]">お墓じまいに関わるすべての工程をサポートします。</p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3 items-stretch">
              {services.map((service, i) => (
                <div
                  key={i}
                  className="flex flex-col h-full rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="text-xs font-medium tracking-widest text-emerald-600">{String(i + 1).padStart(2, "0")}</span>
                  <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                    <service.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold leading-snug text-neutral-900">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 line-clamp-3">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ============================================================
            [F] 改葬手続きとは
        ============================================================ */}
        <Reveal id="kaisou-steps" className="py-24 md:py-36">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-[34px] font-bold tracking-tight text-[#1A1A1A] md:text-[44px]">改葬手続きとは</h2>
              <p className="mt-5 text-[17px] leading-[1.65] text-[#6B7280]">現在のお墓からご遺骨を移し、別の納骨先へ移す手続きです。墓じまいでは「改葬許可証」の取得が必要になります。</p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "Step 1",
                  title: "受入証明の取得",
                  description: "新しい納骨先から「受入証明書」を発行してもらいます。",
                  image: "/images/step-acceptance-v3.jpg",
                  alt: "書類を丁寧に受け取る手元のクローズアップ",
                },
                {
                  step: "Step 2",
                  title: "埋葬証明の取得",
                  description: "現在のお墓の管理者から「埋葬証明書」を発行してもらいます。",
                  image: "/images/step-burial-cert.jpg",
                  alt: "寺院または霊園の管理事務所に置かれた書類と印鑑",
                },
                {
                  step: "Step 3",
                  title: "改葬許可の申請",
                  description: "お墓のある自治体に書類を提出し、「改葬許可証」を受領します。",
                  image: "/images/step-permit.jpg",
                  alt: "机の上に置かれた許可証風の無地書類",
                },
              ].map((item, i) => (
                <div key={i} className="group overflow-hidden rounded-3xl bg-[#F9FAFB]">
                  <div
                    className="flex aspect-16/10 items-center justify-center bg-gray-100 relative"
                  >
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-8">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                      {item.step}
                    </span>
                    <h3 className="mt-3 text-[20px] font-semibold text-[#1A1A1A]">{item.title}</h3>
                    <p className="mt-3 text-[15px] leading-[1.65] text-[#6B7280]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-10 flex max-w-2xl items-start gap-3 rounded-2xl bg-[#F9FAFB] px-6 py-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#9CA3AF]" />
              <p className="text-[14px] leading-[1.65] text-[#9CA3AF]">
                許可証の発行までの期間は自治体により異なります（数日〜1、2週間程度が目安）。
              </p>
            </div>
          </div>
        </Reveal>

        {/* ============================================================
            [G] 清蓮ができること / 行わないこと（最重要）
        ============================================================ */}
        <Reveal className="bg-[#F9FAFB] py-24 md:py-36">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-[34px] font-bold tracking-tight text-[#1A1A1A] md:text-[44px]">私たちの対応範囲</h2>
              <p className="mt-5 text-[17px] leading-[1.65] text-[#6B7280]">法令を遵守し、できることとできないことを明確にしています。</p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2">
              {/* できること */}
              <div className="rounded-3xl bg-white p-8 md:p-10 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                  <Check className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-[#1A1A1A]">清蓮ができること</h3>
                <ul className="mt-6 space-y-4">
                  {[
                    "改葬手続きの流れのご説明",
                    "必要書類の取得方法のご案内",
                    "全国自治体の申請書ダウンロード導線",
                    "記入方法の一般的なご説明",
                    "提携行政書士のご紹介",
                    "墓石撤去工事の手配",
                    "離檀交渉サポート",
                    "遺骨の洗骨・粉骨",
                    "改葬先に合わせた容器への納め替え",
                    "海洋散骨の手配",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[#1A1A1A]">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 行わないこと */}
              <div className="rounded-3xl border-2 border-amber-200 bg-amber-50/30 p-8 md:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
                  <ShieldAlert className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-[#1A1A1A]">清蓮が行わないこと</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">改葬許可申請の「代理提出」「行政手続きの代行」は、行政書士等の有資格者が行う業務です。清蓮は無資格での代行を行いません。</p>
                <p className="mt-4 text-sm leading-relaxed text-[#6B7280]">必要な場合は提携行政書士をご紹介します。</p>

                <div className="mt-8 rounded-xl bg-amber-100/50 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">ご注意</p>
                      <p className="mt-1 text-xs leading-relaxed text-amber-700">「代行可」とうたう業者でも、実態が無資格対応のケースがあります。依頼前に資格者の関与を確認してください。</p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/contact?type=gyoseishoshi"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-600 px-5 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  提携行政書士を紹介してもらう
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ============================================================
            [H] ご依頼の流れ
        ============================================================ */}
        <Reveal id="flow" className="py-24 md:py-36">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-[34px] font-bold tracking-tight text-[#1A1A1A] md:text-[44px]">ご依頼の流れ</h2>
              <p className="mt-5 text-[17px] leading-[1.65] text-[#6B7280]">お問い合わせから完了まで、5つのステップで進めます。</p>
            </div>

            <div className="mt-16 space-y-0">
              {[
                {
                  step: "01",
                  title: "無料相談",
                  description:
                    "状況確認（現墓地、改葬先、寺院/管理者との関係、希望日程）。お電話またはフォームで。",
                  badge: "24時間受付",
                  icon: MessageSquare,
                  last: false,
                },
                {
                  step: "02",
                  title: "現地調査・概算見積",
                  description:
                    "撤去規模、搬出経路、必要作業を確認。お見積りは無料です。",
                  badge: "無料",
                  icon: MapPin,
                  last: false,
                },
                {
                  step: "03",
                  title: "事前準備",
                  description:
                    "受入証明、埋葬証明、申請書の取得と記入ポイント案内。代理提出が必要な場合は行政書士へ接続。",
                  badge: null,
                  icon: ClipboardList,
                  last: false,
                },
                {
                  step: "04",
                  title: "工事・ご遺骨の取扱い",
                  description:
                    "撤去工事、洗骨・粉骨、容器への納め替え。施工後の写真報告をお送りします。",
                  badge: null,
                  icon: Hammer,
                  last: false,
                },
                {
                  step: "05",
                  title: "完了",
                  description:
                    "改葬先への納骨、散骨など希望に合わせて完了。アフターフォローも対応。",
                  badge: null,
                  icon: CheckCircle,
                  last: true,
                },
              ].map((item, i) => (
                <div key={item.step} className="relative flex gap-6 pb-12 last:pb-0">
                  {!item.last && (
                    <div className="absolute left-6 top-16 h-full w-px bg-gray-200" />
                  )}
                  <div
                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      item.last
                        ? "bg-emerald-600 text-white"
                        : "border-2 border-emerald-600 bg-white text-emerald-600"
                    }`}
                  >
                    {item.step}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-[19px] font-semibold text-[#1A1A1A]">{item.title}</h3>
                      {item.badge && (
                        <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-600">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-[16px] leading-[1.65] text-[#6B7280]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ============================================================
            [I] 料金について
        ============================================================ */}
        <Reveal id="pricing" className="bg-[#F9FAFB] py-24 md:py-36">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-[34px] font-bold tracking-tight text-[#1A1A1A] md:text-[44px]">料金について</h2>
              <p className="mt-5 text-[17px] leading-[1.65] text-[#6B7280]">現地状況で変動するため、まずは無料で概算をご案内します。追加費用が出やすいポイントも事前にご説明します。</p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: "追加費用なし",
                  description: "お見積り後の追加請求は原則ありません",
                },
                {
                  icon: Eye,
                  title: "明朗会計",
                  description: "すべて税込の明確な料金体系",
                },
                {
                  icon: Undo2,
                  title: "キャンセル無料",
                  description: "お見積り後のお断りも費用ゼロ",
                },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm">
                  <item.icon className="h-8 w-8 text-emerald-600" />
                  <h3 className="mt-4 text-[17px] font-semibold text-[#1A1A1A]">{item.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#6B7280]">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-emerald-600 px-8 text-base font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                無料相談・概算を依頼する
              </Link>
              <Link
                href="/price"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-6 text-base font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                料金プランを見る
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* ============================================================
            [J] ご自分で手続きされる方へ
        ============================================================ */}
        <Reveal className="py-24 md:py-36">
          <div className="mx-auto max-w-5xl px-6">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-50 via-white to-gray-50 p-10 md:p-20">
              <div className="relative z-10 mx-auto max-w-2xl text-center">
                <h2 className="text-balance text-[28px] font-bold tracking-tight text-[#1A1A1A] md:text-[36px]">ご自分で手続きされる方へ</h2>
                <p className="mt-5 text-[17px] leading-[1.65] text-[#6B7280]">全国自治体の改葬許可申請書のダウンロードと、一般的な記入ポイントをまとめています。まずはお墓の所在地の自治体を検索してください。</p>
                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Link
                    href="/kaisoukyoka"
                    className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#1A1A1A] px-8 text-base font-semibold text-white transition-colors hover:bg-gray-800"
                  >
                    <Download className="h-5 w-5" />
                    改葬許可申請書 全国一覧
                  </Link>
                  <Link
                    href="/flow"
                    className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border-2 border-gray-200 px-6 text-base font-semibold text-[#1A1A1A] transition-colors hover:bg-gray-50"
                  >
                    改葬手続きの流れ
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ============================================================
            [K] よくある質問
        ============================================================ */}
        <Reveal className="bg-[#F9FAFB] py-24 md:py-36">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center">
              <h2 className="text-balance text-[34px] font-bold tracking-tight text-[#1A1A1A] md:text-[44px]">よくあるご質問</h2>
            </div>

            <div className="mt-14 divide-y divide-gray-200">
              {faqs.map((faq, i) => (
                <details key={i} className="group">
                  <summary className="flex min-h-[64px] cursor-pointer items-center justify-between gap-4 py-6 text-left text-[17px] font-semibold text-[#1A1A1A] transition-colors hover:text-emerald-600 [&::-webkit-details-marker]:hidden list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg">
                    <span>{faq.q}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-[#9CA3AF] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="pb-7 pr-10 text-[16px] leading-[1.7] text-[#6B7280]">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ============================================================
            [L] 最終CTA
        ============================================================ */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-600 to-emerald-700" />
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-balance text-[36px] font-bold text-white md:text-[48px] lg:text-[56px]">まずはお気軽にご相談ください</h2>
            <p className="mx-auto mt-6 max-w-lg text-[17px] leading-[1.65] text-emerald-100">お見積りは無料です。無理な勧誘は一切いたしません。</p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full bg-white px-10 text-base font-bold text-emerald-600 shadow-lg transition-all hover:shadow-xl sm:w-auto"
              >
                <Mail className="mr-2 h-5 w-5" />
                無料相談・お見積りフォーム
              </Link>
              <a
                href="tel:0120000000"
                className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full border-2 border-white/30 px-8 text-base font-semibold text-white transition-all hover:bg-white/10 sm:w-auto"
              >
                <Phone className="h-5 w-5" />
                0120-000-000
              </a>
            </div>

            <p className="mt-4 text-sm text-emerald-200">24時間365日受付</p>
          </div>
        </section>

        {/* ============================================================
            [M] フッター
        ============================================================ */}
        <footer className="border-t bg-white py-16 print:hidden">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 md:grid-cols-4">
              <div className="md:col-span-1">
                <a href="/" className="flex items-center gap-2.5">
                  <Image
                    src="/logo.png"
                    alt="清蓮 ロゴ"
                    width={28}
                    height={28}
                    className="h-7 w-auto object-contain"
                  />
                  <span className="text-base font-bold text-[#1A1A1A]">お墓じまいナビ</span>
                </a>
                <p className="mt-4 text-sm leading-relaxed text-[#6B7280]">
                  株式会社清蓮が運営する、改葬手続きから供養までの
                  一括サポートサービス。
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#1A1A1A]">サービス</h4>
                <ul className="mt-4 space-y-3">
                  {[
                    { label: "お墓じまいとは", href: "#kaisou-steps" },
                    { label: "手続きの流れ", href: "/flow" },
                    { label: "料金プラン", href: "/price" },
                    { label: "対応エリア", href: "/kaissou" },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-sm text-[#6B7280] transition-colors hover:text-[#1A1A1A]">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#1A1A1A]">関連サービス</h4>
                <ul className="mt-4 space-y-3">
                  {[
                    { label: "海洋散骨クルーズ", href: "#" },
                    { label: "遺骨サポートLab", href: "#" },
                    { label: "改葬許可申請書DL", href: "/kaisoukyoka" },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-sm text-[#6B7280] transition-colors hover:text-[#1A1A1A]">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#1A1A1A]">会社情報</h4>
                <ul className="mt-4 space-y-3">
                  {[
                    { label: "運営会社", href: "#" },
                    { label: "プライバシーポリシー", href: "/privacy" },
                    { label: "お問い合わせ", href: "/contact" },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-sm text-[#6B7280] transition-colors hover:text-[#1A1A1A]">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 border-t pt-8 text-center text-xs text-[#6B7280]">
              © 2026 Seiren Co., Ltd. All rights reserved.
            </div>
          </div>
        </footer>

        {/* ============================================================
            [N] フローティングCTA（モバイルのみ）
        ============================================================ */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 p-3 backdrop-blur-xl md:hidden print:hidden">
          <div className="flex gap-2">
            <a
              href="tel:0120000000"
              className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full border-2 border-emerald-600 text-sm font-bold text-emerald-600"
            >
              <Phone className="h-4 w-4" />
              電話で相談
            </a>
            <Link
              href="/contact"
              className="flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white"
            >
              無料相談・お見積り
            </Link>
          </div>
        </div>
      </div>

      {/* Keyframe animation */}
      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
