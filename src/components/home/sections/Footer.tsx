"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, MapPin, MessageSquare, Instagram, Facebook } from "lucide-react"
import {
  FOOTER_SISTER_SITES,
  SEIREN_CORPORATE_SITE_HREF,
} from "@/config/seiren-ecosystem"
import { Wrap } from "../primitives"

const FOOTER_NAV: Array<{ h: string; items: Array<{ label: string; href: string; external?: boolean }> }> = [
  {
    h: "サービス",
    items: [
      { label: "改葬手続き", href: "/flow" },
      { label: "墓石撤去", href: "/price" },
      { label: "粉骨・洗骨", href: "/sankotsu" },
      { label: "海洋散骨", href: "/sankotsu" },
      { label: "永代供養先案内", href: "/kaisougo" },
      { label: "離檀調整支援", href: "/ridanryou" },
    ],
  },
  {
    h: "お役立ち",
    items: [
      { label: "改葬とは", href: "/about" },
      { label: "改葬許可申請書DL", href: "/kaisoukyoka" },
      { label: "行政書士マッチング", href: "/gyoseishoshi" },
      { label: "墓石撤去実例", href: "#cases" },
      { label: "よくあるご質問", href: "#faq" },
      { label: "お役立ちコラム", href: "/column" },
    ],
  },
  {
    h: "会社",
    items: [
      { label: "会社概要", href: "/company" },
      { label: "お問い合わせ", href: "/contact" },
      { label: "プライバシーポリシー", href: "/privacy" },
      { label: "特定商取引法表記", href: "/tokutei" },
    ],
  },
]

const SEO_KEYWORDS: Array<{ href: string; label: string }> = [
  { href: "/price", label: "お墓じまい 横浜" },
  { href: "/flow", label: "改葬 手続き" },
  { href: "/kaisoukyoka", label: "改葬許可申請書" },
  { href: "/price", label: "墓石撤去 費用" },
  { href: "/sankotsu", label: "海洋散骨 関東" },
  { href: "/kaisougo", label: "永代供養 神奈川" },
  { href: "/sankotsu", label: "粉骨 横浜" },
  { href: "/ridanryou", label: "離檀料 相場" },
  { href: "/gyoseishoshi", label: "行政書士 改葬" },
  { href: "/kaisougo", label: "納骨堂 比較" },
  { href: "/kaisougo", label: "樹木葬 横浜" },
  { href: "/about", label: "お墓 引っ越し" },
]

export function HomeFooter() {
  return (
    <footer className="border-t border-[#ECE7DE] bg-[#F3F0EA] pt-[72px] text-[#525762]">
      <Wrap>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.9fr_0.9fr_0.9fr_0.9fr]">
          {/* Brand column */}
          <div>
            <Link href="/#top" className="inline-flex items-center gap-3">
              <Image
                src="/web-app-manifest-192x192.png"
                alt=""
                width={46}
                height={46}
                className="h-[46px] w-auto object-contain"
              />
              <span className="flex flex-col leading-[1.2]">
                <span className="text-[15px] font-semibold text-seiren-main">
                  お墓じまいナビ
                </span>
                <span className="mt-0.5 text-[10px] tracking-[0.16em] text-[#8A8478]">
                  by 株式会社 清蓮
                </span>
              </span>
            </Link>
            <p className="mt-[22px] max-w-[320px] text-[13px] leading-[1.9] text-[#525762]">
              2008年創業。横浜を拠点に全国47都道府県の改葬・墓じまいをご支援しています。
            </p>
            <div className="mt-[22px] flex flex-col gap-2">
              <a
                href="tel:0458819952"
                className="inline-flex items-center gap-2.5 text-[13px] text-seiren-main"
              >
                <Phone size={14} strokeWidth={1.75} className="text-seiren-accent" />
                <span
                  className="text-[15px] font-bold text-seiren-main"
                  style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                >
                  045-881-9952
                </span>
                <span className="text-[#8A8478]">9:00〜19:00</span>
              </a>
              <span className="inline-flex items-center gap-2.5 text-[13px] text-[#525762]">
                <MapPin size={14} strokeWidth={1.75} className="text-seiren-accent" />
                〒244-0003 神奈川県横浜市戸塚区戸塚町4170 高橋ビル1階
              </span>
            </div>
            <div className="mt-[22px] flex gap-2.5">
              <a
                href="https://lin.ee/qSN2RLK"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LINE"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-seiren-line"
              >
                <MessageSquare size={18} strokeWidth={1.75} className="text-white" />
              </a>
              <a
                href="https://www.instagram.com/sankotu.cruise_seiren"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: "linear-gradient(135deg, #F58529, #DD2A7B 50%, #8134AF)" }}
              >
                <Instagram size={18} strokeWidth={1.75} className="text-white" />
              </a>
              <a
                href="https://www.facebook.com/seirenjapan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2]"
              >
                <Facebook size={18} strokeWidth={1.75} className="text-white" fill="currentColor" />
              </a>
            </div>
          </div>

          {FOOTER_NAV.map((g) => (
            <div key={g.h}>
              <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#A6884C]">
                {g.h}
              </div>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {g.items.map((it) => (
                  <li key={it.label}>
                    <Link
                      href={it.href}
                      className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Sister sites */}
          <div data-ecosystem-block="footer-related-services">
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#A6884C]">
              関連サービス
            </div>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {FOOTER_SISTER_SITES.map((site) => (
                <li key={site.href}>
                  <a
                    href={site.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                    data-ecosystem-link={site.id}
                    data-ecosystem-from="footer-related-services"
                  >
                    {site.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={SEIREN_CORPORATE_SITE_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                  data-ecosystem-link="seiren-corporate"
                  data-ecosystem-from="footer-company"
                >
                  株式会社清蓮 企業サイト
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO keyword cloud */}
        <div className="mt-14 border-y border-[#E0DAC9] py-7">
          <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#A6884C]">
            よく検索されるトピック
          </div>
          <div className="flex flex-wrap gap-2">
            {SEO_KEYWORDS.map((k, i) => (
              <Link
                key={`${k.href}-${i}`}
                href={k.href}
                className="rounded-full border border-[#E5E0D6] bg-seiren-bg px-3 py-1.5 text-xs text-[#525762] transition-colors duration-200 hover:border-seiren-accent/40 hover:text-seiren-main"
              >
                {k.label}
              </Link>
            ))}
          </div>
        </div>

        {/* E-E-A-T trust signals */}
        <div className="grid grid-cols-1 gap-6 py-7 md:grid-cols-3">
          <div>
            <p className="mb-1 text-[13px] font-semibold text-seiren-main">専門性・実績</p>
            <p className="text-[11.5px] leading-[1.85] text-[#8A8478]">
              2008年創業。改葬・お墓じまい・海洋散骨の専門会社として全国47都道府県で累計多数の実績。代表取締役：眞如 理恵。
            </p>
          </div>
          <div>
            <p className="mb-1 text-[13px] font-semibold text-seiren-main">法令遵守</p>
            <p className="text-[11.5px] leading-[1.85] text-[#8A8478]">
              改葬許可申請の代行は行政書士等の有資格者業務です。当社は申請の案内・書類取得方法の説明・提携行政書士のご紹介を行います。
            </p>
          </div>
          <div>
            <p className="mb-1 text-[13px] font-semibold text-seiren-main">会社情報</p>
            <p className="text-[11.5px] leading-[1.85] text-[#8A8478]">
              株式会社清蓮
              <br />
              〒244-0003 神奈川県横浜市戸塚区戸塚町4170 高橋ビル1階
              <br />
              TEL: 045-881-9952
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E0DAC9] py-5 text-[11.5px] text-[#8A8478]">
          <span>
            © {new Date().getFullYear()} 株式会社 清蓮 / お墓じまいナビ. All rights reserved.
          </span>
          <span className="tracking-[0.04em]">SEIREN INC. — YOKOHAMA, JAPAN</span>
        </div>
      </Wrap>
    </footer>
  )
}
