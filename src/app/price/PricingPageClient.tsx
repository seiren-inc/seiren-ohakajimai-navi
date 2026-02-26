"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { 
  Check, ShieldCheck, Banknote, Users, Info, Plus, Minus, 
  Droplets, Sparkles, MessageCircle, ChevronDown, Phone, Mail, Clock, Undo2, Eye, FileText
} from "lucide-react"

// --- CSS Utilities ---
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

// --- Animation Hooks ---
function useFadeInOnScroll() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

function Section({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  const { ref, isVisible } = useFadeInOnScroll()
  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        "transition-all duration-1000 ease-out will-change-[opacity,transform]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className
      )}
    >
      {children}
    </section>
  )
}

// --- Sub Components ---
function PriceNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-[#F5F5F7] px-4 py-3">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#6E6E73]" />
      <p className="text-xs leading-relaxed text-[#6E6E73]">
        {children}
      </p>
    </div>
  )
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 z-50 h-0.5 w-full bg-transparent print:hidden">
      <div
        className="h-full bg-emerald-600 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// --- Page Data ---
const comparisonRows = [
  { label: "行政手続き代行", ours: "込み", compA: "別途費用", compB: "非対応" },
  { label: "見積り後の追加費用", ours: "原則なし", compA: "あり", compB: "あり" },
  { label: "現地調査", ours: "無料", compA: "有料", compB: "無料" },
  { label: "全国対応", ours: "47都道府県", compA: "関東のみ", compB: "主要都市のみ" },
  { label: "撤去後の写真報告", ours: "あり", compA: "なし", compB: "オプション" },
  { label: "離檀交渉サポート", ours: "あり", compA: "なし", compB: "なし" },
]

const pricingFaqs = [
  {
    q: "見積り後に追加費用が発生することはありますか？",
    a: "原則ありません。現地調査で正確に状況を確認した上でお見積りをお出ししますので、その後の追加請求は基本的にございません。ただし、調査時に確認できなかった地中障害物等が発見された場合のみ、事前にご相談のうえ追加費用が発生する場合があります。",
  },
  {
    q: "支払い方法は何がありますか？",
    a: "銀行振込、クレジットカードに対応しております。分割払いのご相談も承ります。",
  },
  {
    q: "見積りだけでもお願いできますか？",
    a: "はい、もちろんです。現地調査・お見積りは完全無料です。お見積り後にお断りいただいても費用は一切かかりません。",
  },
  {
    q: "他社の見積りと比較してもよいですか？",
    a: "ぜひ比較してください。当社は明朗会計を徹底しておりますので、他社様のお見積りとの違いも丁寧にご説明いたします。",
  },
  {
    q: "離檀料はいくらかかりますか？",
    a: "離檀料はお寺によって大きく異なります（0〜30万円程度）。高額な離檀料を請求された場合の交渉サポートも行っておりますので、お気軽にご相談ください。",
  },
  {
    q: "補助金や助成金は使えますか？",
    a: "一部の自治体ではお墓じまいに関する補助金制度を設けています。対象の自治体かどうかの確認もサポートいたします。",
  },
]

const guarantees = [
  { icon: ShieldCheck, title: "見積り後の追加請求なし", description: "提示金額から追加請求は原則いたしません" },
  { icon: Eye, title: "明朗会計", description: "すべて税込の明確な料金体系" },
  { icon: Undo2, title: "キャンセル無料", description: "見積り後のお断りも費用ゼロ" },
  { icon: Clock, title: "24時間受付", description: "お電話・フォームいつでもOK" },
]

// シミュレータ用設定値
function calcAreaPrice(m: number): number {
  if (m <= 1) return 148000
  if (m <= 2) return 228000
  if (m <= 3) return 298000
  return 298000 + (m - 3) * 98000
}
const TEMPLE_TYPES = [
  { id: "cemetery", label: "霊園墓地", extra: 0 },
  { id: "temple", label: "寺院墓地", extra: 150000 },
  { id: "charnel", label: "納骨堂", extra: -20000 },
]
const INCLUDED_SERVICES = [
  "石材撤去・整地工事",
  "工程管理・日程調整",
  "写真付き完了報告書",
  "行政手続き確認サポート",
  "近隣・管理者対応",
  "離檀交渉サポート",
]


export default function PricingPageClient() {
  const [activeTab, setActiveTab] = useState("plan")
  
  // シミュレーターステート
  const [areaSize, setAreaSize] = useState<number>(2) // 1〜10 m²
  const [templeType, setTempleType] = useState("cemetery")
  const [hasSubsidy, setHasSubsidy] = useState(false)
  
  // スムーズスクロール用 (Anchor Click)
  const scrollTo = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80 // Offset for sticky nav
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  // Active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["plan", "comparison", "options", "simulator", "faq"]
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveTab(section)
            break
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // シミュレーターの合計金額計算
  const basePrice = calcAreaPrice(areaSize)
  const typeExtra = TEMPLE_TYPES.find(t => t.id === templeType)?.extra || 0
  const subsidyAmount = hasSubsidy ? -30000 : 0
  const simulateTotal = basePrice + typeExtra + subsidyAmount

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF] text-[#1D1D1F] selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <ScrollProgress />

      {/* [2] Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-24 md:pt-40 md:pb-32 bg-linear-to-b from-[#F5F5F7]/80 to-[#FFFFFF] overflow-hidden">
        {/* Subtle background decoration (Apple style) */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(5,150,105,0.05),transparent_50%)]" />
        
        <div className="w-full max-w-6xl px-6 z-10">
          <Section>
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">
              {/* Text Content (Left) */}
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                <h3 className="typography-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D1D1F] mb-6 max-w-[22ch]">
                  明確な料金で安心のお墓じまい
                </h3>
                <p className="typography-body max-w-[34ch] text-[17px] text-[#6E6E73] mb-10">
                  見積り後の追加費用は原則なし。
                  すべて税込の明朗会計です。
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 w-full sm:w-auto">
                  <Link 
                    href="/contact"
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-600 text-white font-semibold flex items-center justify-center hover:bg-emerald-700 transition duration-300 print:hidden shadow-sm"
                  >
                    無料お見積りを依頼する
                  </Link>
                  <button 
                    onClick={(e) => scrollTo("simulator", e)}
                    className="w-full sm:w-auto px-8 py-4 rounded-full border border-emerald-600 text-emerald-600 font-semibold flex items-center justify-center hover:bg-emerald-50 transition duration-300 print:hidden"
                  >
                    料金シミュレーション
                  </button>
                </div>
                <p className="mt-6 text-xs text-[#6E6E73]">※ 現地調査・お見積りは完全無料です</p>
              </div>

              {/* Image Content (Right) */}
              <div className="w-full md:w-1/2 relative flex justify-center md:justify-end">
                <div className="relative w-full max-w-[500px] aspect-[4/3] md:aspect-square overflow-hidden rounded-4xl mask-image-circle">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/hero-pricing.png" 
                    alt="お墓じまいナビの無料相談スタッフ" 
                    className="w-full h-full object-cover object-top scale-[1.02]"
                  />
                  {/* Image Gradient Overlay for blending */}
                  <div className="absolute inset-0 rounded-4xl bg-linear-to-tr from-black/5 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* Anchor Navigation */}
      <nav className="sticky top-0 z-40 border-b border-gray-200/50 bg-[#FFFFFF]/80 backdrop-blur-xl print:hidden">
        <div className="mx-auto max-w-5xl">
          <div className="flex gap-2 overflow-x-auto px-6 scrollbar-hide">
            {[
              { id: "plan", label: "料金プラン" },
              { id: "comparison", label: "他社比較" },
              { id: "options", label: "オプション" },
              { id: "simulator", label: "シミュレーション" },
              { id: "faq", label: "よくある質問" },
            ].map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => scrollTo(section.id, e)}
                className={cn(
                  "shrink-0 border-b-2 px-4 py-4 text-sm font-medium transition-colors min-h-[48px] flex items-center whitespace-nowrap",
                  activeTab === section.id
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-[#6E6E73] hover:text-[#1D1D1F]"
                )}
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Trust Badges */}
      <Section className="py-12 bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {guarantees.map((g) => (
              <div key={g.title} className="flex flex-col items-center rounded-2xl bg-[#F5F5F7] p-6 text-center hover:bg-[#F5F5F7]/80 hover:shadow-sm transition-all">
                <g.icon className="h-8 w-8 text-emerald-600 mb-4" />
                <p className="text-sm font-bold text-[#1D1D1F] leading-tight mb-2">{g.title}</p>
                <p className="text-xs text-[#6E6E73] leading-relaxed hidden sm:block">{g.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* [4] Basic Services (Plan) */}
      <div id="plan" className="scroll-mt-48" />
      <Section className="py-20 md:py-28 bg-[#FFFFFF]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <h2 className="typography-heading text-3xl font-bold tracking-tight text-[#1D1D1F] mb-4 max-w-[28ch] mx-auto">基本サービス料金</h2>
            <p className="typography-body text-[#6E6E73] max-w-[44ch] mx-auto">お墓じまいに必要な2つの基本工程です。</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Card 1: 行政手続き */}
            <div className="group flex flex-col bg-[#FFFFFF] rounded-4xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-48 md:h-56 bg-[#F5F5F7] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-tr from-emerald-100/50 to-transparent" />
                <div className="text-center z-10">
                  <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white shadow-sm mb-3">
                    <FileText className="h-8 w-8 text-emerald-600" />
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-8 md:p-10">
                <p className="text-xs font-semibold tracking-widest text-[#6E6E73] uppercase mb-2">Administrative</p>
                <h3 className="text-2xl font-bold text-[#1D1D1F] mb-4">行政手続き代行</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span aria-label="55,000円から">
                    <span className="text-4xl md:text-5xl font-bold text-emerald-600">55,000</span>
                    <span className="text-xl font-bold text-emerald-600">円〜</span>
                  </span>
                  <span className="text-sm text-[#6E6E73]" aria-hidden="true">(税込)</span>
                </div>
                
                <div className="space-y-3 mb-8 flex-1">
                  <h4 className="text-sm font-semibold text-[#1D1D1F] mb-4">含まれるサービス</h4>
                  {[
                    "改葬許可申請書の作成・提出代行",
                    "埋蔵証明書の取得サポート",
                    "受入証明書の手配サポート",
                    "自治体窓口との交渉・確認"
                  ].map(item => (
                    <div key={item} className="flex items-center gap-3 text-sm text-[#6E6E73]">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: 墓石撤去 */}
            <div className="group flex flex-col bg-[#FFFFFF] rounded-4xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-48 md:h-56 bg-[#F5F5F7] flex items-center justify-center relative overflow-hidden">
                <div className="flex w-full h-full relative">
                  {/* BEFORE Image */}
                  <div className="flex-1 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/pricing-before.jpg" alt="お墓の撤去前" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute bottom-4 left-0 w-full flex justify-center text-center">
                      <span className="text-[10px] md:text-xs font-bold text-white tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">BEFORE</span>
                    </div>
                  </div>
                  
                  {/* Center Divider */}
                  <div className="w-[3px] h-full bg-white z-10 shrink-0" />
                  
                  {/* AFTER Image */}
                  <div className="flex-1 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/pricing-after.jpg" alt="お墓の撤去後" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-black/5" />
                    <div className="absolute bottom-4 left-0 w-full flex justify-center text-center">
                      <span className="text-[10px] md:text-xs font-bold text-emerald-900 tracking-widest bg-emerald-100/90 backdrop-blur-md px-3 py-1 rounded-full">AFTER</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-8 md:p-10">
                <p className="text-xs font-semibold tracking-widest text-[#6E6E73] uppercase mb-2">Construction</p>
                <h3 className="text-xl md:text-2xl font-bold text-[#1D1D1F] mb-4 text-balance">墓石の解体・撤去・整地</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl md:text-3xl font-bold text-[#1D1D1F]">現地調査後にお見積り</span>
                </div>
                <p className="text-sm text-[#6E6E73] mb-6">墓石の大きさや施工状況により費用が変わります。</p>
                
                <div className="space-y-3 mb-8 flex-1">
                  <h4 className="text-sm font-semibold text-[#1D1D1F] mb-4">含まれるサービス</h4>
                  {[
                    "墓石の解体・撤去",
                    "区画の整地・原状回復",
                    "廃材の適正処理",
                    "撤去後の写真報告"
                  ].map(item => (
                    <div key={item} className="flex items-center gap-3 text-sm text-[#6E6E73]">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100">
                        <Check className="h-3 w-3 text-stone-600" />
                      </div>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto bg-emerald-50 rounded-xl text-emerald-700 p-4 text-center font-semibold text-sm">
                  現地調査・お見積りは完全無料
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-[#F5F5F7] rounded-2xl p-6 md:p-8">
            <h4 className="text-sm font-semibold tracking-wider text-[#6E6E73] uppercase mb-4">別途費用が発生する場合（含まれないもの）</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "離檀料", note: "お寺により異なります" },
                { label: "閉眼供養のお布施", note: "3〜10万円が目安" },
                { label: "遠方出張費", note: "離島・山間部などの場合" },
                { label: "特殊な基礎の撤去", note: "想定外のコンクリート等" }
              ].map(item => (
                <div key={item.label} className="flex sm:items-center justify-between text-sm flex-col sm:flex-row gap-1 border-b border-gray-200/50 pb-3 last:border-0 sm:border-0 sm:pb-0">
                  <div className="flex items-center gap-3">
                    <Minus className="h-4 w-4 shrink-0 text-[#6E6E73]" />
                    <span className="text-[#1D1D1F] font-medium">{item.label}</span>
                  </div>
                  <span className="text-xs text-[#6E6E73] sm:text-right">{item.note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <PriceNote>
              表示金額はすべて税込です。墓石撤去工事の費用はお墓の規模・場所・施工難度により大きく異なります。
              正確な金額をご提示するため、事前の現地調査を必須とさせていただいております。
            </PriceNote>
          </div>
        </div>
      </Section>

      {/* [5] 料金の透明性 (Dark Mode) */}
      <Section className="py-24 bg-[#1D1D1F] text-white print:bg-white! print:text-black! print:border-y!">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 text-balance leading-tight">
            見積り後の追加費用は、<br className="max-md:hidden"/>原則ありません。
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/70 leading-relaxed mb-12 print:text-black!">
            お墓の規模・場所・施工難度を現地ですべて確認した上で、正確な金額をご提示します。
            ご納得いただけない場合はお断りいただいて構いません。キャンセル料も一切かかりません。
          </p>
          <Link 
            href="/contact"
            className="inline-flex px-8 py-4 rounded-full bg-white text-[#1D1D1F] font-semibold hover:bg-white/90 transition duration-300 print:hidden"
          >
            無料で見積りを依頼する
          </Link>
        </div>
      </Section>

      {/* 追加B: 他社比較 */}
      <div id="comparison" className="scroll-mt-32" />
      <Section className="py-20 md:py-28 bg-[#F5F5F7] print:bg-white!">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-16">
            <h2 className="typography-heading text-3xl font-bold tracking-tight text-[#1D1D1F] mb-4 max-w-[28ch] mx-auto">他社サービスとの違い</h2>
            <p className="typography-body text-[#6E6E73] max-w-[48ch] mx-auto">なぜ「お墓じまいナビ」が選ばれるのか、明確な理由があります。</p>
          </div>
          
          <div className="overflow-hidden rounded-4xl border border-gray-200 bg-white overflow-x-auto shadow-sm">
            <table className="w-full text-sm text-left whitespace-nowrap md:whitespace-normal" role="table" aria-label="他社サービスとの比較表">
              <caption className="sr-only">お墓じまいナビと他社サービスの料金・サービス比較</caption>
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="p-5 font-semibold text-[#6E6E73] w-1/3">比較項目</th>
                  <th className="p-5 text-center min-w-[140px]">
                    <span className="inline-block rounded-full bg-emerald-600 px-4 py-1 text-xs font-bold text-white shadow-sm">
                      お墓じまいナビ
                    </span>
                  </th>
                  <th className="p-5 text-center min-w-[120px] font-medium text-[#6E6E73]">一般的な業者A</th>
                  <th className="p-5 text-center min-w-[120px] font-medium text-[#6E6E73]">一般的な業者B</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5 font-medium text-[#1D1D1F]">{row.label}</td>
                    <td className="p-5 text-center bg-emerald-50/30">
                      <span className="font-bold text-emerald-600 block">{row.ours}</span>
                    </td>
                    <td className="p-5 text-center text-[#6E6E73]">{row.compA}</td>
                    <td className="p-5 text-center text-[#6E6E73]">{row.compB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* [6] Options */}
      <div id="options" className="scroll-mt-32" />
      <Section className="py-20 md:py-28 bg-[#FFFFFF]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <h2 className="typography-heading text-3xl font-bold tracking-tight text-[#1D1D1F] mb-4 max-w-[28ch] mx-auto">オプション</h2>
            <p className="typography-body text-[#6E6E73] max-w-[48ch] mx-auto">基本サービスに組み合わせてご利用いただけるサポートです。</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Droplets, name: "洗骨サービス", price: "33,000円〜", desc: "長年カビや汚れが付着したお骨を丁寧に洗浄し、きれいな状態にします。", color: "text-blue-500", bg: "bg-blue-50" },
              { icon: Sparkles, name: "粉骨サービス", price: "33,000円〜", desc: "散骨や省スペースでの手元供養のために、お骨をパウダー状に細かく粉砕します。", color: "text-amber-500", bg: "bg-amber-50" },
              { icon: MessageCircle, name: "離檀交渉代行", price: "別途ご相談", desc: "高額な離檀料の請求など、お寺とのトラブルを防ぎ円満に離檀するためのサポートを行います。", color: "text-emerald-500", bg: "bg-emerald-50" },
            ].map((opt) => (
              <div key={opt.name} className="group flex flex-col bg-[#FFFFFF] rounded-4xl border border-gray-200 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={cn("mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-6", opt.bg)}>
                  <opt.icon className={cn("h-7 w-7", opt.color)} />
                </div>
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-2">{opt.name}</h3>
                <div className="text-2xl font-bold text-[#1D1D1F] mb-4">{opt.price}</div>
                <p className="typography-body text-[14px] text-[#6E6E73] mt-auto max-w-[32ch] mx-auto">{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* [8] Simulator */}
      <div id="simulator" className="scroll-mt-32" />
      <Section className="py-20 md:py-28 bg-[#F5F5F7] print:bg-white!">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <h2 className="typography-heading text-3xl font-bold tracking-tight text-[#1D1D1F] mb-4 max-w-[28ch] mx-auto">料金シミュレーション</h2>
            <p className="typography-body text-[#6E6E73] max-w-[48ch] mx-auto">簡単な条件を選ぶだけで、すぐにおおよその費用がわかります。</p>
          </div>

          <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
            {/* Left: Input Form */}
            <div className="md:col-span-3 space-y-10">
              {/* 1. Area Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold text-[#1D1D1F]">お墓の広さ（敷地面積）</label>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-emerald-600">{areaSize} m²</span>
                    <div className="text-xs text-[#6E6E73]">¥{calcAreaPrice(areaSize).toLocaleString()}～</div>
                  </div>
                </div>
                <input
                  type="range"
                  min="1" max="10"
                  value={areaSize}
                  onChange={(e) => setAreaSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-[#6E6E73] px-1">
                  <span>1 m²</span>
                  <span>5 m²</span>
                  <span>10 m²</span>
                </div>
                {/* Pricing breakdown hint */}
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {[1,2,3].map(m => (
                    <button
                      key={m}
                      onClick={() => setAreaSize(m)}
                      className={cn(
                        "flex flex-col items-center py-2 rounded-xl border text-xs transition-all",
                        areaSize === m
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-bold"
                          : "border-gray-200 text-[#6E6E73] hover:border-gray-300"
                      )}
                    >
                      <span>{m} m²未満</span>
                      <span className="font-semibold">{(calcAreaPrice(m)/10000).toFixed(1)}万</span>
                    </button>
                  ))}
                  <button
                    onClick={() => setAreaSize(areaSize < 4 ? 4 : areaSize)}
                    className={cn(
                      "flex flex-col items-center py-2 rounded-xl border text-xs transition-all",
                      areaSize >= 4
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-bold"
                        : "border-gray-200 text-[#6E6E73] hover:border-gray-300"
                    )}
                  >
                    <span>3 m²以上</span>
                    <span className="font-semibold">+9.8万/m²</span>
                  </button>
                </div>
              </div>

              {/* 2. Type */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-[#1D1D1F] block">墓地の種類</label>
                <div className="flex bg-gray-200/50 p-1 rounded-2xl">
                  {TEMPLE_TYPES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTempleType(t.id)}
                      className={cn(
                        "flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                        templeType === t.id 
                          ? "bg-white text-emerald-600 shadow-sm"
                          : "text-[#6E6E73] hover:text-[#1D1D1F]"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Subsidy */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl bg-white">
                  <div>
                    <p className="text-sm font-bold text-[#1D1D1F]">自治体の補助金制度</p>
                    <p className="text-xs text-[#6E6E73] mt-1">お住まいの地域で補助金が適用される場合</p>
                  </div>
                  <button 
                    onClick={() => setHasSubsidy(!hasSubsidy)}
                    className={cn(
                      "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2",
                      hasSubsidy ? "bg-emerald-600" : "bg-gray-200"
                    )}
                  >
                    <span 
                      className={cn(
                        "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        hasSubsidy ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Result (Sticky on desktop) */}
            <div className="md:col-span-2">
              <div className="sticky top-32 bg-[#FFFFFF] rounded-4xl border border-gray-200 p-8 shadow-sm">
                <p className="text-xs font-semibold tracking-widest text-[#6E6E73] uppercase mb-4 text-center">Estimated Total</p>
                <div className="text-center mb-8">
                  <span className="text-5xl font-bold text-[#1D1D1F] tabular-nums tracking-tight">
                    ￥{simulateTotal.toLocaleString()}
                  </span>
                  <span className="text-sm text-[#1D1D1F] font-bold ml-1">〜</span>
                </div>

                <div className="space-y-2 text-sm border-t border-gray-100 pt-6 mb-3">
                  <div className="flex justify-between items-center text-[#6E6E73]">
                    <span>石材撤去・整地工事（目安）</span>
                    <span className="font-medium text-[#1D1D1F]">¥{basePrice.toLocaleString()}～</span>
                  </div>
                  {typeExtra > 0 && (
                    <div className="flex justify-between items-center text-[#6E6E73]">
                      <span>お布施・離檀料（目安）</span>
                      <span className="font-medium text-[#1D1D1F]">¥{typeExtra.toLocaleString()}</span>
                    </div>
                  )}
                  {typeExtra < 0 && (
                    <div className="flex justify-between items-center text-[#6E6E73]">
                      <span>納骨堂値引き</span>
                      <span className="font-medium text-emerald-600">¥{typeExtra.toLocaleString()}</span>
                    </div>
                  )}
                  {hasSubsidy && (
                    <div className="flex justify-between items-center text-[#6E6E73]">
                      <span>補助金適用控除（目安）</span>
                      <span className="font-medium text-emerald-600">-¥30,000</span>
                    </div>
                  )}
                </div>

                {/* 含まれるサービス */}
                <div className="bg-[#F5F5F7] rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-[#1D1D1F] mb-3">含まれるサービス</p>
                  <ul className="space-y-1.5">
                    {INCLUDED_SERVICES.map(s => (
                      <li key={s} className="flex items-center gap-2 text-xs text-[#6E6E73]">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/estimation"
                  className="flex items-center justify-center w-full px-6 py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition duration-300"
                >
                  AIでより詳しく診断する
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* [10] Flow (Steppers) */}
      <Section className="py-20 md:py-28 bg-[#FFFFFF]">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F] mb-4">お問合せから完了まで</h2>
            <p className="text-[#6E6E73]">お見積りは4つのステップで完了。ご相談から現地調査まですべて無料です。</p>
          </div>

          <div className="space-y-0">
            {[
              { num: "01", title: "無料ご相談", desc: "お電話またはフォームから。専門スタッフが親身に対応します。", meta: "所要時間: 3分" },
              { num: "02", title: "現地無料調査", desc: "全国の提携石材店がお墓の現地に赴き、正確な状況と採寸を行います。", meta: "全国無料対応" },
              { num: "03", title: "お見積りのご提示", desc: "追加費用のない、コミコミの明朗な総額見積りをご提示します。", meta: "ここまで無料" },
              { num: "04", title: "ご契約・着手", desc: "内容にご納得いただいた場合のみご契約。その後の手続きはすべてお任せください。", meta: "キャンセルOK" }
            ].map((step, i) => (
              <div key={step.num} className="relative flex gap-6 pb-12 last:pb-0">
                {/* Line */}
                {i < 3 && <div className="absolute left-6 top-14 h-[calc(100%-24px)] w-[2px] bg-gray-100" />}
                
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow-sm ring-4 ring-white">
                  {step.num}
                </div>
                
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-[#1D1D1F] mb-1">{step.title}</h3>
                  <p className="text-sm text-[#6E6E73] leading-relaxed mb-3">{step.desc}</p>
                  <span className="inline-flex items-center rounded-full bg-[#F5F5F7] px-3 py-1 text-xs font-semibold text-[#6E6E73]">
                    {step.meta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* [E] FAQ */}
      <div id="faq" className="scroll-mt-32" />
      <Section className="py-20 md:py-28 bg-[#F5F5F7] print:bg-white!">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F] mb-4">料金に関するよくある質問</h2>
            <p className="text-[#6E6E73]">お客様からよくいただくご質問をご案内します。</p>
          </div>

          <div className="divide-y divide-gray-200">
            {pricingFaqs.map((faq, i) => (
              <details key={i} className="group py-6 first:pt-0 last:pb-0 print:open">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-left text-[17px] font-bold text-[#1D1D1F] transition-colors hover:text-emerald-600 min-h-[44px] list-none [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 rounded-lg">
                  <span>{faq.q}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-emerald-600 transition-transform duration-300 group-open:rotate-180 print:hidden" />
                </summary>
                <p className="mt-4 text-[15px] leading-relaxed text-[#6E6E73] md:pr-12 pointer-events-none">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* [11] Final CTA */}
      <section className="py-24 bg-[#1D1D1F] text-white print:bg-white! print:text-black!">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-balance">
            まずは無料でご相談ください。
          </h2>
          <p className="mx-auto max-w-xl text-lg text-white/70 leading-relaxed mb-12 print:text-black!">
            現地調査・お見積りはすべて無料です。<br className="hidden sm:block"/>
            お墓じまいの専門スタッフが丁寧にご対応します。
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link 
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#1D1D1F] font-bold flex items-center justify-center hover:bg-gray-100 transition duration-300 min-h-[56px] print:hidden"
            >
              無料お見積りを依頼する
            </Link>
            
            {/* Mobile optimized phone call button */}
            <a 
              href="tel:0120000000"
              className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-white/30 text-white font-bold flex items-center justify-center hover:bg-white/10 transition duration-300 min-h-[56px]"
            >
              <Phone className="h-5 w-5 mr-2" />
              0120-000-000 に電話する
            </a>
          </div>
          
          <p className="text-sm text-white/50 print:text-black! font-medium">受付時間: 9:00〜18:00（年中無休）</p>
        </div>
      </section>

    </div>
  )
}
