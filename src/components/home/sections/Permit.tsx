"use client"

import { FileText, CheckCircle, ShieldCheck, Download } from "lucide-react"
import { IconBubble, PillLink, Reveal, SectionHead, Tag, Wrap } from "../primitives"

const PREFS = [
  { region: "北海道・東北", items: ["北海道", "宮城県", "福島県", "岩手県"] },
  { region: "関東", items: ["東京都", "神奈川県", "千葉県", "埼玉県", "茨城県", "栃木県", "群馬県"] },
  { region: "中部", items: ["愛知県", "静岡県", "新潟県", "長野県", "岐阜県"] },
  { region: "関西", items: ["大阪府", "兵庫県", "京都府", "奈良県", "滋賀県", "和歌山県"] },
  { region: "中国・四国・九州", items: ["広島県", "岡山県", "福岡県", "熊本県", "鹿児島県", "沖縄県"] },
]

const REQUIREMENTS = [
  { t: "受入先からの「受入証明書」", d: "新しい納骨先で発行されます。" },
  { t: "現在の管理者の「埋葬証明書」", d: "現在のお墓の管理寺院・霊園で発行されます。" },
  { t: "申請者の本人確認書類", d: "自治体により対応が異なります。" },
]

export function Permit() {
  return (
    <section id="permit" className="bg-seiren-bg">
      <Wrap className="py-20 md:py-28">
        <Reveal>
          <SectionHead
            eyebrow="DOWNLOAD"
            eyebrowJp="改葬許可申請書ダウンロード"
            title="自治体ごとの様式を、まとめて確認できます。"
            sub="改葬許可申請書は、ご遺骨が現在埋葬されている自治体の様式に従って提出します。代表的な様式リンクをまとめました。記入や提出のご相談は無料で承ります。"
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 items-start gap-7 lg:grid-cols-2">
          {/* Left — info card */}
          <Reveal>
            <div className="rounded-[22px] border border-[#ECE7DE] bg-white p-7 shadow-[0_1px_2px_rgba(30,42,56,0.03)] md:p-8">
              <IconBubble tone="gold" size={56}>
                <FileText size={26} strokeWidth={1.75} />
              </IconBubble>
              <h3 className="mt-5 font-serif text-[22px] font-bold leading-[1.5] text-seiren-main">
                改葬許可申請書とは
              </h3>
              <p className="mt-4 text-[14.5px] leading-[1.95] text-[#525762]">
                ご遺骨を別のお墓・納骨先へ移すときに、現在の埋葬地のある市区町村に提出する書類です。様式・添付物・本人確認方法は自治体ごとに異なります。
              </p>

              <div className="mt-7 flex flex-col gap-3">
                {REQUIREMENTS.map((it) => (
                  <div
                    key={it.t}
                    className="flex gap-3 rounded-xl bg-[#F7F5F0] p-3.5"
                  >
                    <CheckCircle
                      size={18}
                      strokeWidth={1.75}
                      className="mt-0.5 flex-shrink-0 text-seiren-green"
                    />
                    <div>
                      <div className="text-sm font-semibold text-seiren-main">{it.t}</div>
                      <div className="mt-0.5 text-xs leading-[1.7] text-seiren-sub">
                        {it.d}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-[22px] flex gap-3 rounded-xl border border-seiren-green/20 bg-seiren-green-soft/50 p-4">
                <ShieldCheck
                  size={18}
                  strokeWidth={1.75}
                  className="mt-0.5 flex-shrink-0 text-seiren-green"
                />
                <p className="m-0 text-[12.5px] leading-[1.8] text-[#3F4A37]">
                  代理提出が必要な場合は、提携の行政書士をご紹介します。記入方法のご相談は無料です。
                </p>
              </div>
            </div>
          </Reveal>

          {/* Right — prefecture list */}
          <Reveal delay={0.1}>
            <div className="rounded-[22px] border border-[#ECE7DE] bg-white p-7 shadow-[0_1px_2px_rgba(30,42,56,0.03)] md:p-8">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="m-0 font-serif text-[18px] font-bold text-seiren-main">
                  地域から探す
                </h3>
                <Tag tone="navy">47都道府県対応</Tag>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-[1.7] text-seiren-sub">
                ご希望の都道府県をクリックすると、代表的な様式リンクの一覧へ移動します。
              </p>

              <div className="mt-[22px] flex flex-col gap-3.5">
                {PREFS.map((g) => (
                  <div key={g.region}>
                    <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-seiren-accent-micro">
                      {g.region}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {g.items.map((p) => (
                        <a
                          key={p}
                          href="#"
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E0D6] bg-white px-3.5 py-2 text-[13px] font-medium text-seiren-main transition-all duration-200 hover:border-seiren-accent/50 hover:bg-[#FFFBF1]"
                        >
                          {p}{" "}
                          <Download size={13} strokeWidth={1.75} className="text-seiren-accent-micro" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <PillLink variant="ghost" size="md" href="#contact">
                  <FileText size={15} strokeWidth={1.75} className="text-seiren-accent-micro" />
                  全47都道府県を見る
                </PillLink>
                <span className="text-xs text-[#8A8478]">記入のご相談は無料</span>
              </div>
            </div>
          </Reveal>
        </div>
      </Wrap>
    </section>
  )
}
