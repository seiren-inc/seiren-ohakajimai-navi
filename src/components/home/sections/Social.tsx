"use client"

import Image from "next/image"
import { Instagram, Facebook, ArrowRight } from "lucide-react"
import { Reveal, SectionHead, Wrap } from "../primitives"

const INSTAGRAM_POSTS = [
  { caption: "横浜・寺院墓地での施工事例", region: "神奈川県横浜市", src: "/images/pricing-after.webp" },
  { caption: "改葬許可申請のご相談", region: "東京都内", src: "/images/reason-compliance-v2.webp" },
  { caption: "海洋散骨クルーズの様子", region: "東京湾", src: "/images/hero-garden-v3.webp" },
  { caption: "墓地清掃と整地後", region: "千葉県北部", src: "/images/pricing-before.webp" },
  { caption: "新しい納骨先のご案内", region: "横浜市内", src: "/images/reason-nationwide-v3.webp" },
]

const GBP_REVIEW_PLACEHOLDERS = [{ tone: "long" }, { tone: "mid" }, { tone: "long" }]

function GoogleGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 1 1-3.3-13l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.5-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.6 5A20 20 0 0 0 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C40.7 35.6 44 30.3 44 24c0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  )
}

function InstagramBlock() {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
            style={{ background: "linear-gradient(135deg, #F58529, #DD2A7B 50%, #8134AF)" }}
          >
            <Instagram size={20} strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-sm font-bold text-seiren-main">
              @sankotu.cruise_seiren
            </div>
            <div className="text-xs text-[#8A8478]">最近の施工・現場の様子</div>
          </div>
        </div>
        <a
          href="https://www.instagram.com/sankotu.cruise_seiren"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E0D6] bg-white px-3.5 py-2 text-[13px] font-semibold text-seiren-main"
        >
          Instagramを見る <ArrowRight size={13} strokeWidth={1.75} />
        </a>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
        {INSTAGRAM_POSTS.map((p, i) => (
          <a
            key={i}
            href="https://www.instagram.com/sankotu.cruise_seiren"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-xl bg-[#EDE9E0]"
            style={{ paddingBottom: "100%" }}
          >
            <Image
              src={p.src}
              alt={p.caption}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              className="absolute inset-0 flex items-end p-2.5"
              style={{
                background: "linear-gradient(to top, rgba(30,42,56,0.55), transparent 45%)",
              }}
            >
              <div className="text-[10.5px] font-medium leading-[1.4] text-white">
                <div className="opacity-85">{p.region}</div>
                <div>{p.caption}</div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

function GBPBlock() {
  return (
    <div className="rounded-[22px] border border-[#ECE7DE] bg-white p-7 shadow-[0_1px_2px_rgba(30,42,56,0.03)]">
      <div className="mb-[18px] flex items-center gap-3">
        <GoogleGlyph size={22} />
        <div>
          <div className="text-[13px] font-bold text-seiren-main">
            Google ビジネスプロフィール
          </div>
          <div className="text-[11px] text-[#8A8478]">株式会社 清蓮 · 横浜市</div>
        </div>
      </div>

      <div className="mb-[18px] flex items-center gap-3.5 rounded-xl border border-dashed border-[#D6CDB8] bg-[#F7F4ED] p-4">
        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-[#E5E0D6] bg-white">
          <GoogleGlyph size={18} />
        </div>
        <div className="flex-1">
          <div className="text-[12.5px] font-bold text-seiren-main">Google レビュー 連携予定</div>
          <div className="mt-0.5 text-[11.5px] leading-[1.6] text-[#8A8478]">
            実際のレビュー件数・評価は、公開準備が整い次第こちらに表示します。
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4" aria-label="Googleレビュー 準備中">
        {GBP_REVIEW_PLACEHOLDERS.map((p, i) => (
          <div
            key={i}
            className={i > 0 ? "border-t border-[#ECE7DE] pt-4" : ""}
          >
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-[30px] w-[30px] rounded-full bg-[#EFECE4]" />
                <div className="h-2.5 w-[84px] rounded bg-[#EFECE4]" />
              </div>
              <div className="h-2.5 w-[78px] rounded bg-[#EFECE4]" />
            </div>
            <div className="flex flex-col gap-[7px]">
              <div className="h-[9px] w-full rounded bg-[#F1EEE6]" />
              <div
                className="h-[9px] rounded bg-[#F1EEE6]"
                style={{ width: p.tone === "long" ? "92%" : "70%" }}
              />
              <div
                className="h-[9px] rounded bg-[#F1EEE6]"
                style={{ width: p.tone === "long" ? "68%" : "48%" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[22px] text-[11.5px] leading-[1.7] text-[#8A8478]">
        ※ レビューは Google ビジネスプロフィールの認証完了後に反映されます。
      </div>
    </div>
  )
}

function FacebookBlock() {
  return (
    <div className="flex h-full flex-col rounded-[22px] border border-[#ECE7DE] bg-white p-7 shadow-[0_1px_2px_rgba(30,42,56,0.03)]">
      <div className="mb-[18px] flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1877F2]">
          <Facebook size={20} className="text-white" strokeWidth={1.75} fill="currentColor" />
        </div>
        <div>
          <div className="text-[13px] font-bold text-seiren-main">株式会社 清蓮</div>
          <div className="text-[11px] text-[#8A8478]">会社の活動・お知らせ</div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-start justify-center py-4">
        <div className="w-full rounded-xl border border-dashed border-[#D6CDB8] bg-[#F7F4ED] p-5">
          <div className="text-[12.5px] font-bold text-seiren-main">
            Facebook 連携準備中
          </div>
          <p className="mt-2 text-xs leading-[1.8] text-[#525762]">
            最新の活動・お知らせは Facebook
            ページで公開しています。準備が整い次第、最新投稿をこちらに表示します。
          </p>
        </div>

        <div className="mt-[18px] flex w-full flex-col gap-3.5">
          {[0, 1].map((i) => (
            <div key={i} className={i > 0 ? "border-t border-[#ECE7DE] pt-3.5" : ""}>
              <div className="mb-2.5 h-[9px] w-[78px] rounded bg-[#EFECE4]" />
              <div className="mb-2 h-2.5 w-[78%] rounded bg-[#EFECE4]" />
              <div className="mb-1.5 h-[9px] w-[92%] rounded bg-[#F1EEE6]" />
              <div className="h-[9px] w-[60%] rounded bg-[#F1EEE6]" />
            </div>
          ))}
        </div>
      </div>

      <a
        href="https://www.facebook.com/seirenjapan/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-[22px] inline-flex items-center gap-1.5 self-start rounded-full border border-[#E5E0D6] px-3.5 py-2 text-[12.5px] font-semibold text-seiren-main"
      >
        Facebookページを見る <ArrowRight size={13} strokeWidth={1.75} />
      </a>
    </div>
  )
}

export function Social() {
  return (
    <section id="related" className="bg-seiren-bg">
      <Wrap className="py-20 md:py-28">
        <Reveal>
          <SectionHead
            eyebrow="SNS & TRUST"
            eyebrowJp="運営の透明性"
            title="日々の活動と、ご利用者の声を公開しています。"
            sub="無理にお誘いするものではありません。会社としての活動状況や、ご相談いただいた方々の声を、ご検討の参考にしてください。"
          />
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-12 rounded-[22px] border border-[#ECE7DE] bg-white p-7 shadow-[0_1px_2px_rgba(30,42,56,0.03)] md:p-8">
            <InstagramBlock />
          </div>
        </Reveal>

        <div className="mt-5 grid grid-cols-1 gap-[22px] lg:grid-cols-[1.1fr_1fr]">
          <Reveal delay={0.18}>
            <GBPBlock />
          </Reveal>
          <Reveal delay={0.24}>
            <FacebookBlock />
          </Reveal>
        </div>
      </Wrap>
    </section>
  )
}
