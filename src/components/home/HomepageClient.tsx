import { testimonials } from "@/lib/testimonials"
import Link from "next/link"
import Image from "next/image"
import { Reveal, WorryList } from "./Reveal"
import { TestimonialCarousel } from "./TestimonialCarousel"
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
  Hammer,
} from "lucide-react"

import { EcosystemShowcase } from "@/components/features/ecosystem/EcosystemShowcase"
import {
  FOOTER_SISTER_SITES,
  SEIREN_CORPORATE_SITE_HREF,
} from "@/config/seiren-ecosystem"

/** トップ専用フッター表示ラベル（共通 Footer の短縮ラベルと差分のみ上書き） */
const HOME_FOOTER_SISTER_LABELS = {
  "sankotsu-cruise": "海洋散骨クルーズ",
  "ikotsu-lab-sankotsu": "遺骨サポートLab（個人）",
  "ikotsu-com": "遺骨.com（法人）",
  "ohaka-navi": "お墓探しナビ",
} as const satisfies Record<(typeof FOOTER_SISTER_SITES)[number]["id"], string>

// ----------------------------------------------------------------
// Trust Bar Stats（静的表示。カウントアップは廃止）
// ----------------------------------------------------------------
const trustStats = [
  { value: "300", unit: "件以上", label: "施工実績", footnote: "2008年創業・横浜" },
  { value: "47", unit: "都道府県", label: "全国対応" },
  { value: "0", unit: "円", label: "お見積り" },
]

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

const simulatorFields = [
  "都道府県を選択",
  "墓石の大きさ",
  "遺骨の数",
  "次の供養先",
  "離檀料の有無",
] as const

const stuckPoints = [
  "埋葬証明書がどこでもらえるかわからない",
  "改葬先の受入証明書が必要かわからない",
  "墓地管理者に連絡しづらい",
  "自治体ごとに書式が違う",
] as const

const homepageBottomFaqs = [
  {
    q: "改葬許可申請は自分でできますか？",
    a: "はい。書類がそろい、墓地管理者や改葬先との確認が取れていれば、ご自身で進められるケースは多いです。不安がある場合は状況整理からご相談ください。",
  },
  {
    q: "行政書士に依頼した方がいいのはどんな場合ですか？",
    a: "代理提出が必要な場合、相続人が複数いる場合、個別事情が多く手続きが複雑な場合は、行政書士への相談が適しています。",
  },
  {
    q: "申請書はどこで入手できますか？",
    a: "現在のお墓がある自治体の窓口、または公式サイトで入手します。トップページ上部の既存導線から改葬許可申請書の一覧ページへ進めます。",
  },
  {
    q: "離檀料は必ず必要ですか？",
    a: "必ず発生するものではありません。寺院や契約状況、これまでの関係性によって異なるため、事前確認が重要です。",
  },
  {
    q: "改葬先が決まっていない場合はどうすればいいですか？",
    a: "納骨堂、永代供養、散骨など選択肢の整理から始めるのが現実的です。改葬先が未定でも相談できる内容は多くあります。",
  },
] as const

const relatedServiceCards = [
  {
    title: "散骨クルーズ",
    description: "海洋散骨を希望される方へ",
    href: "https://www.sankotu-cruise.com/",
    cta: "サービスを見る",
    external: true,
    status: null,
  },
  {
    title: "遺骨ラボ",
    description: "洗骨・粉骨・手元供養をご希望の方へ",
    href: "https://ikotsu-lab.com/",
    cta: "サービスを見る",
    external: true,
    status: null,
  },
  {
    title: "お墓探しナビ",
    description: "納骨先・永代供養を探したい方へ",
    href: "https://ohakanavi.jp/",
    cta: "準備中",
    external: true,
    status: "準備中",
  },
] as const

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------
export default function HomepageClient() {
  return (
    <>
      <div className="flex flex-col min-h-screen text-neutral-900 selection:bg-[#E8D9B8] selection:text-seiren-main">

        {/* ============================================================
            [B] ヒーロー — 2カラム: 左コピー＋CTA / 右画像＋信頼グラスカード
        ============================================================ */}
        <section className="relative overflow-hidden bg-seiren-bg">
          {/* 右半分の画像エリア（デスクトップのみ） */}
          <div className="absolute inset-y-0 right-0 hidden w-[52%] md:block">
            <Image
              src="/images/cemetery-flowers.jpg"
              alt="整備された明るいお墓に色とりどりの花が供えられた風景"
              fill
              sizes="52vw"
              className="object-cover object-center"
              priority
            />
            {/* 左エッジへのフェードマスク */}
            <div className="absolute inset-0 bg-linear-to-r from-seiren-bg via-seiren-bg/30 to-transparent" />
          </div>

          {/* モバイル用背景画像（全幅・フェードアウト） */}
          <div className="absolute inset-0 md:hidden">
            <Image
              src="/images/cemetery-flowers.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-seiren-bg/90" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1320px] px-6 lg:px-16">
            <div className="grid grid-cols-1 min-h-[88dvh] items-center py-28 md:grid-cols-2 md:py-36">

              {/* ── 左カラム: コピー＋CTA ── */}
              <div
                className="min-w-0 max-w-lg"
                style={{ animation: "fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both" }}
              >
                {/* 上部バッジ */}
                <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-seiren-accent">
                  <span className="h-px w-5 bg-seiren-accent/60" />
                  全国対応・改葬実績300件以上
                </p>

                {/* ヘッドライン */}
                <h1 className="mt-5 font-zen text-[34px] font-bold leading-[1.2] tracking-tight text-seiren-main sm:text-[42px] md:text-[50px] lg:text-[56px]">
                  お墓じまい、<br />
                  誰に頼めばいいか<br className="hidden sm:block md:hidden" />迷っていませんか？
                </h1>

                {/* サブコピー */}
                <p
                  className="mt-7 text-[15px] font-medium leading-[1.9] text-seiren-body md:text-[17px]"
                  data-speakable="true"
                  style={{ animation: "fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.12s both" }}
                >
                  改葬手続きから離檀交渉、墓石撤去、粉骨、<br className="hidden md:block" />
                  ご納骨先まで。清蓮が一貫して対応します。
                </p>

                {/* CTA群 */}
                <div
                  className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
                  style={{ animation: "fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.22s both" }}
                >
                  <Link
                    href="/contact"
                    className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-seiren-cta px-9 text-[17px] font-semibold text-white shadow-[0_4px_20px_rgba(217,119,6,0.35)] transition-all hover:bg-seiren-cta-hover hover:shadow-[0_6px_24px_rgba(217,119,6,0.45)] active:scale-[0.98]"
                  >
                    無料相談する
                  </Link>
                  <Link
                    href="/kaisoukyoka"
                    className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full border border-seiren-border bg-white/70 px-8 text-[15px] font-semibold text-seiren-main backdrop-blur-sm transition-all hover:border-seiren-accent/50 hover:bg-white"
                  >
                    <FileText className="h-4 w-4 text-seiren-accent" />
                    改葬許可申請書を探す
                  </Link>
                </div>

                <p className="mt-5 text-[12px] font-medium text-seiren-sub">
                  0800-888-8788 / 24時間365日受付 / お見積り無料
                </p>
              </div>

              {/* ── 右カラム: グラス信頼カード ── */}
              <div
                className="mt-10 flex justify-center md:mt-0 md:items-end md:justify-end md:pb-12"
                style={{ animation: "fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.18s both" }}
              >
                <div className="animate-floating rounded-2xl border border-white/60 bg-white/70 px-8 py-6 shadow-[0_8px_40px_rgba(30,42,56,0.10)] backdrop-blur-md">
                  <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-seiren-sub">清蓮の実績</p>
                  <div className="flex gap-8">
                    {trustStats.map((item, i) => (
                      <div key={item.label} className={`text-center ${i > 0 ? "border-l border-seiren-border pl-8" : ""}`}>
                        <div className="flex items-baseline gap-0.5">
                          <span className="font-inter text-[36px] font-bold leading-none tracking-tight text-seiren-main">
                            {item.value}
                          </span>
                          <span className="text-[13px] font-medium text-seiren-sub">{item.unit}</span>
                        </div>
                        <p className="mt-1.5 text-[12px] font-medium text-seiren-sub">{item.label}</p>
                        {'footnote' in item && item.footnote && (
                          <span className="mt-0.5 block text-[10px] text-seiren-sub/60">{item.footnote}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================
            [C] 信頼バー（静的表示）
        ============================================================ */}
        <div className="border-y border-seiren-border bg-seiren-surface">
          <div className="mx-auto grid max-w-4xl grid-cols-1 divide-y divide-seiren-border md:grid-cols-3 md:divide-x md:divide-y-0">
            {trustStats.map((item) => (
              <div key={item.label} className="flex flex-col items-center px-8 py-10 text-center">
                <div className="flex items-baseline gap-1">
                  <span className="font-inter text-[44px] font-bold tracking-tight text-seiren-accent md:text-[52px]">
                    {item.value}
                  </span>
                  <span className="font-sans text-[15px] font-medium text-seiren-sub">{item.unit}</span>
                </div>
                <p className="mt-2 text-[13px] font-medium text-seiren-sub">{item.label}</p>
                {'footnote' in item && item.footnote && (
                  <span className="mt-1 text-[11px] text-seiren-sub/50">{item.footnote}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            [C2] 悩み訴求 — 共感セクション
        ============================================================ */}
        <Reveal className="relative overflow-hidden bg-seiren-bg py-0">
          <section>
            {/* 右装飾: flower-decoration を極薄で重ねる */}
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 md:block" aria-hidden="true">
              <Image
                src="/images/flower-decoration.jpg"
                alt=""
                fill
                sizes="30vw"
                className="object-cover object-left opacity-[0.07]"
              />
            </div>

            <div className="relative mx-auto grid max-w-[1320px] items-center gap-0 md:grid-cols-2">
              {/* 左: 写真（縦長・フル高さ） */}
              <div className="relative h-[380px] md:h-[540px]">
                <Image
                  src="/images/visitor-praying.jpg"
                  alt="お墓の前で静かにお参りする女性。お墓じまいへの想いと、大切な決断の重さを象徴する場面"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                />
                {/* 右エッジへのフェード */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-seiren-bg/80 md:to-seiren-bg" />
              </div>

              {/* 右: 共感コピー */}
              <div className="px-8 py-16 md:py-24 md:pl-14 md:pr-16">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-seiren-accent">
                  よくあるお悩み
                </p>
                <h2 className="mt-5 font-zen text-[26px] font-bold leading-[1.25] tracking-tight text-seiren-main md:text-[34px]">
                  「お墓のこと、<br />
                  どこに相談すればいいか<br />
                  わからない」
                </h2>

                <WorryList
                  items={[
                    "お寺との関係が悪くなるのでは？",
                    "費用がいくらかかるか不安",
                    "書類の手続きが複雑そう",
                    "家族の同意を得るのが難しい",
                    "墓石を撤去することへの後ろめたさ",
                  ]}
                />

                <div className="mt-10 rounded-2xl border border-seiren-accent/20 bg-seiren-accent/5 px-6 py-5">
                  <p className="text-[14px] font-semibold leading-[1.7] text-seiren-main">
                    清蓮はこれまで300件以上のお墓じまいに携わってきました。<br />
                    どんな小さな疑問でも、まずはお気軽にご相談ください。
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ============================================================
            [D] 選ばれる3つの理由
        ============================================================ */}
        <Reveal className="py-24 md:py-36">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-zen text-balance text-[22px] font-bold tracking-tight text-neutral-900 md:text-[34px] lg:text-[44px]">選ばれる3つの理由</h2>
              <p className="mt-5 text-[17px] leading-[1.65] text-neutral-500">安さだけではありません。法令遵守と確かな実績で選ばれています。</p>
            </div>

            <div className="mt-16 space-y-20 md:mt-20 md:space-y-28">
              {/* 理由1: 全国対応 */}
              <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
                <div className="w-full md:w-1/2">
                  <div className="aspect-4/3 overflow-hidden rounded-3xl bg-linear-to-br from-seiren-accent/8 to-seiren-accent/15 relative">
                    <Image
                      src="/images/reason-nationwide-v3.webp"
                      alt="日本列島と全国ネットワークを象徴するインフォグラフィック風デザイン"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="min-w-0 w-full md:w-1/2">
                  <span className="inline-flex items-center rounded-full bg-seiren-accent/10 px-2 py-0.5 text-[11px] font-semibold text-seiren-accent">01</span>
                  <h3 className="typography-heading font-zen mt-3 max-w-[22ch] text-xl font-semibold leading-[1.2] tracking-tight text-neutral-900 md:text-2xl lg:text-3xl">全国対応と提携ネットワーク</h3>
                  <p className="typography-body mt-5 max-w-[65ch] wrap-break-word text-base leading-[1.9] text-neutral-500 md:text-lg">全国の提携石材店と連携しているため、地域差のある手続きや工事も進めやすい体制です。</p>
                  <p className="typography-body mt-4 max-w-[65ch] wrap-break-word text-base leading-[1.9] text-neutral-500 md:text-lg">独自のネットワークで、地域ごとの条例や慣習に精通した優良石材店を手配します。</p>
                </div>
              </div>

              {/* 理由2: 法令遵守（画像とテキストの左右反転） */}
              <div className="flex flex-col items-center gap-10 md:flex-row-reverse md:gap-16">
                <div className="w-full md:w-1/2">
                  <div className="aspect-4/3 overflow-hidden rounded-3xl bg-linear-to-br from-gray-50 to-gray-100 relative">
                    <Image
                      src="/images/reason-compliance-v2.webp"
                      alt="デスクの上に整然と置かれた書類と万年筆"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="min-w-0 w-full md:w-1/2">
                  <span className="inline-flex items-center rounded-full bg-seiren-accent/10 px-2 py-0.5 text-[11px] font-semibold text-seiren-accent">02</span>
                  <h3 className="typography-heading font-zen mt-3 max-w-[22ch] text-xl font-semibold leading-[1.2] tracking-tight text-neutral-900 md:text-2xl lg:text-3xl">法令遵守の安心設計</h3>
                  <p className="typography-body mt-5 max-w-[65ch] wrap-break-word text-base leading-[1.9] text-neutral-500 md:text-lg">改葬手続きは「案内」と「行政書士紹介」に限定。違法リスクのある代行は行いません。</p>
                  <p className="typography-body mt-4 max-w-[65ch] wrap-break-word text-base leading-[1.9] text-neutral-500 md:text-lg">改葬許可申請の代理提出が必要な場合は、提携行政書士をご紹介します。</p>
                </div>
              </div>

              {/* 理由3: 離檀交渉サポート */}
              <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
                <div className="w-full md:w-1/2">
                  <div className="aspect-4/3 overflow-hidden rounded-3xl bg-linear-to-br from-amber-50 to-orange-50 relative">
                    <Image
                      src="/images/reason-negotiation-v2.webp"
                      alt="落ち着いた和室で交渉している様子"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="min-w-0 w-full md:w-1/2">
                  <span className="inline-flex items-center rounded-full bg-seiren-accent/10 px-2 py-0.5 text-[11px] font-semibold text-seiren-accent">03</span>
                  <h3 className="typography-heading font-zen mt-3 max-w-[22ch] text-xl font-semibold leading-[1.2] tracking-tight text-neutral-900 md:text-2xl lg:text-3xl">離檀交渉サポート</h3>
                  <p className="typography-body mt-5 max-w-[65ch] wrap-break-word text-base leading-[1.9] text-neutral-500 md:text-lg">寺院・墓地管理者との離檀交渉で悩む方が多い領域を、実務目線でサポートします。</p>
                  <p className="typography-body mt-4 max-w-[65ch] wrap-break-word text-base leading-[1.9] text-neutral-500 md:text-lg">高額な離檀料を請求された場合もご相談ください。</p>
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
                    <Star className="h-4 w-4" />
                    他社にない独自サービス
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ============================================================
            [D-post] お客様の声（ハイライト3件）
        ============================================================ */}
        <Reveal className="bg-neutral-50 py-16 md:py-24">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-16">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-seiren-accent">お客様の声</p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {([testimonials[0], testimonials[1], testimonials[2]] as typeof testimonials).map((t, i) => (
                <div key={i} className="flex flex-col rounded-2xl border border-neutral-100 bg-white p-7 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex flex-wrap items-center rounded-full bg-seiren-accent/10 px-3 py-1 text-xs font-semibold text-seiren-main">
                      {t.prefecture}・{t.situation}
                    </span>
                    <div className="flex shrink-0 gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="font-serif mt-4 flex-1 text-[14px] leading-[2] text-neutral-600">「{t.text}」</p>
                  <p className="mt-4 text-[13px] font-semibold text-neutral-400">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* 中間CTA */}
        <section className="border-y border-seiren-border bg-seiren-main py-16">
          <div className="mx-auto max-w-[980px] px-6 lg:px-12 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-seiren-accent">まずは無料で</p>
            <h2 className="mt-4 font-zen text-[22px] font-bold text-white md:text-[28px]">
              現地調査前でも、概算費用をお伝えできます
            </h2>
            <p className="mt-3 text-[14px] text-white/60">
              状況をお伺いするだけでおおよその費用感がわかります。お気軽にどうぞ。
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-seiren-cta px-8 text-base font-bold text-white shadow-[0_4px_20px_rgba(217,119,6,0.4)] transition-all hover:bg-seiren-cta-hover sm:w-auto"
              >
                無料相談・見積り依頼
              </Link>
              <a
                href="tel:08008888788"
                className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 sm:w-auto"
              >
                <Phone className="h-5 w-5" />
                0800-888-8788
              </a>
            </div>
          </div>
        </section>

        {/* ============================================================
            [E] サービス内容
        ============================================================ */}
        <Reveal className="bg-neutral-50 py-24 md:py-36">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-zen text-balance text-[22px] font-bold tracking-tight text-neutral-900 md:text-[34px] lg:text-[44px]">サービス内容</h2>
              <p className="mt-5 text-[17px] leading-[1.65] text-neutral-500">お墓じまいに関わるすべての工程をサポートします。</p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3 items-stretch">
              {services.map((service, i) => (
                <div
                  key={i}
                  className="flex flex-col h-full rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-seiren-accent/30 hover:shadow-md"
                >
                  <span className="font-mono text-[11px] tracking-widest text-neutral-300">{String(i + 1).padStart(2, "0")}</span>
                  <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-seiren-accent/10 ring-1 ring-seiren-accent/20">
                    <service.icon className="h-6 w-6 text-seiren-accent" />
                  </div>
                  <h3 className="font-zen mt-6 text-lg font-semibold leading-snug text-neutral-900">{service.title}</h3>
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
          <div className="mx-auto max-w-[1320px] px-6 lg:px-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-zen text-balance text-[22px] font-bold tracking-tight text-neutral-900 md:text-[34px] lg:text-[44px]">改葬手続きとは</h2>
              <p className="mt-5 text-[17px] leading-[1.65] text-neutral-500">現在のお墓からご遺骨を移し、別の納骨先へ移す手続きです。墓じまいでは「改葬許可証」の取得が必要になります。</p>
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
                <div key={i} className="group overflow-hidden rounded-3xl bg-neutral-50">
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
                    <span className="inline-flex items-center rounded bg-seiren-accent/10 px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.2em] text-seiren-accent">
                      {item.step}
                    </span>
                    <h3 className="font-zen mt-3 text-[20px] font-semibold text-neutral-900">{item.title}</h3>
                    <p className="mt-3 text-[15px] leading-[1.65] text-neutral-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-10 flex max-w-2xl items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/40 px-6 py-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-neutral-400" />
              <p className="text-[14px] leading-[1.65] text-neutral-400">
                許可証の発行までの期間は自治体により異なります（数日〜1、2週間程度が目安）。
              </p>
            </div>
          </div>
        </Reveal>

        {/* ============================================================
            [G] 清蓮ができること / 行わないこと（最重要）
        ============================================================ */}
        <Reveal className="bg-neutral-50 py-24 md:py-36">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-14">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-zen text-balance text-[22px] font-bold tracking-tight text-neutral-900 md:text-[34px] lg:text-[44px]">私たちの対応範囲</h2>
              <p className="mt-5 text-[17px] leading-[1.65] text-neutral-500">法令を遵守し、できることとできないことを明確にしています。</p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2">
              {/* できること */}
              <div className="rounded-3xl bg-white p-8 md:p-10 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-seiren-accent/10">
                  <Check className="h-6 w-6 text-seiren-accent" />
                </div>
                <h3 className="font-zen mt-5 text-xl font-bold text-neutral-900">清蓮ができること</h3>
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
                    <li key={item} className="flex items-start gap-3 text-sm text-neutral-900">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-seiren-accent/15">
                        <Check className="h-3.5 w-3.5 text-seiren-accent" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 行わないこと */}
              <div className="rounded-3xl border border-amber-200/60 bg-amber-50/20 p-8 md:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
                  <ShieldAlert className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-zen mt-5 text-xl font-bold text-neutral-900">清蓮が行わないこと</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500">改葬許可申請の「代理提出」「行政手続きの代行」は、行政書士等の有資格者が行う業務です。清蓮は無資格での代行を行いません。</p>
                <p className="mt-4 text-sm leading-relaxed text-neutral-500">必要な場合は提携行政書士をご紹介します。</p>

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
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-seiren-accent px-5 py-2.5 text-sm font-semibold text-seiren-accent hover:bg-seiren-accent/10 transition-colors"
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
          <div className="mx-auto max-w-[980px] px-6 lg:px-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-zen text-balance text-[22px] font-bold tracking-tight text-neutral-900 md:text-[34px] lg:text-[44px]">ご依頼の流れ</h2>
              <p className="mt-5 text-[17px] leading-[1.65] text-neutral-500">お問い合わせから完了まで、5つのステップで進めます。</p>
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
              ].map((item) => (
                <div key={item.step} className="relative flex gap-6 pb-12 last:pb-0">
                  {!item.last && (
                    <div className="absolute left-6 top-16 h-full w-px bg-seiren-accent/15" />
                  )}
                  <div
                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      item.last
                        ? "bg-seiren-cta text-white ring-4 ring-seiren-cta/20"
                        : "border-2 border-seiren-accent bg-white text-seiren-accent"
                    }`}
                  >
                    {item.step}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-zen text-[19px] font-semibold text-neutral-900">{item.title}</h3>
                      {item.badge && (
                        <span className="rounded-full border border-seiren-accent/30 bg-seiren-accent/15 px-3 py-0.5 text-xs font-semibold text-seiren-main">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-[16px] leading-[1.65] text-neutral-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ============================================================
            [I] 料金について
        ============================================================ */}
        <Reveal id="pricing" className="bg-white py-24 md:py-36">
          <div className="mx-auto max-w-[980px] px-6 lg:px-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-zen text-balance text-[22px] font-bold tracking-tight text-neutral-900 md:text-[34px] lg:text-[44px]">料金について</h2>
              <p className="mt-5 text-[17px] leading-[1.65] text-neutral-500">現地状況で変動するため、まずは無料で概算をご案内します。追加費用が出やすいポイントも事前にご説明します。</p>
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
                  <div className="flex items-center justify-center rounded-2xl bg-seiren-accent/10 p-3">
                    <item.icon className="h-8 w-8 text-seiren-accent" />
                  </div>
                  <h3 className="font-zen mt-4 text-[17px] font-semibold text-neutral-900">{item.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-neutral-500">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-seiren-cta px-8 text-base font-semibold text-white transition-colors hover:bg-seiren-cta-hover sm:w-auto"
              >
                無料相談・概算を依頼する
              </Link>
              <Link
                href="/price"
                className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border-2 border-seiren-accent px-8 text-base font-semibold text-seiren-accent transition-colors hover:bg-seiren-accent/10 sm:w-auto"
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
          <div className="mx-auto max-w-[1200px] px-6 lg:px-14">
            <div className="relative overflow-hidden rounded-3xl bg-seiren-bg p-10 md:p-20">
              <div className="relative z-10 mx-auto max-w-2xl text-center">
                <h2 className="font-zen text-balance text-[28px] font-bold tracking-tight text-neutral-900 md:text-[36px]">ご自分で手続きされる方へ</h2>
                <p className="mt-5 text-[17px] leading-[1.65] text-neutral-500">全国自治体の改葬許可申請書のダウンロードと、一般的な記入ポイントをまとめています。まずはお墓の所在地の自治体を検索してください。</p>
                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Link
                    href="/kaisoukyoka"
                    className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-seiren-main px-8 text-base font-semibold text-white transition-colors hover:bg-seiren-main/90 sm:w-auto"
                  >
                    <Download className="h-5 w-5" />
                    改葬許可申請書 全国一覧
                  </Link>
                  <Link
                    href="/flow"
                    className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200 px-8 text-base font-semibold text-neutral-900 transition-colors hover:bg-gray-50 sm:w-auto"
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
            [K-pre] お客様の声
        ============================================================ */}
        <Reveal className="py-24 md:py-36">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-zen text-balance text-[22px] font-bold tracking-tight text-neutral-900 md:text-[34px] lg:text-[44px]">お客様の声</h2>
              <p className="mt-5 text-[17px] leading-[1.65] text-neutral-500">実際にご依頼いただいたお客様からいただいた声です。</p>
            </div>
            <div className="mt-16">
              <TestimonialCarousel />
            </div>
          </div>
        </Reveal>

        {/* ============================================================
            [K] よくある質問
        ============================================================ */}
        <Reveal className="bg-neutral-50 py-24 md:py-36">
          <div className="mx-auto max-w-[760px] px-6 lg:px-10">
            <div className="text-center">
              <h2 className="font-zen text-balance text-[34px] font-bold tracking-tight text-neutral-900 md:text-[44px]">よくあるご質問</h2>
            </div>

            <div className="mt-14 divide-y divide-neutral-100">
              {faqs.map((faq, i) => (
                <details key={i} className="group">
                  <summary className="flex min-h-[64px] cursor-pointer items-center justify-between gap-4 py-6 text-left text-[17px] font-semibold text-neutral-900 transition-colors hover:text-seiren-accent [&::-webkit-details-marker]:hidden list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seiren-accent rounded-lg">
                    <span className="font-serif">{faq.q}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-neutral-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="pb-7 pr-10 text-[15px] leading-[1.85] text-neutral-500">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ============================================================
            [L] 最終CTA — オペレーター写真 + ガラス
        ============================================================ */}
        <section className="relative overflow-hidden">
          {/* 背景: オペレーター写真 */}
          <div className="absolute inset-0">
            <Image
              src="/images/consultation-operator.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
              aria-hidden="true"
            />
            {/* 暗めのオーバーレイ — seiren-main ベース */}
            <div className="absolute inset-0 bg-seiren-main/80" />
          </div>

          <div className="relative z-10 mx-auto max-w-[760px] px-6 lg:px-10 py-28 text-center md:py-36">
            {/* グラスカード */}
            <div className="rounded-3xl border border-white/20 bg-white/10 px-8 py-12 backdrop-blur-md md:px-14">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-seiren-accent">
                まずは無料相談
              </p>
              <h2 className="mt-5 font-zen text-balance text-[30px] font-bold leading-[1.2] text-white md:text-[42px] lg:text-[48px]">
                お気軽にご相談ください
              </h2>
              <p className="mx-auto mt-6 max-w-md text-[15px] leading-[1.75] text-white/75">
                お見積りは無料です。無理な勧誘は一切いたしません。<br />
                改葬のご相談は、ご家族の大切な決断です。
              </p>

              <div className="mt-10 flex flex-col items-center gap-3 sm:gap-4">
                {/* Tier 1: Primary amber fill */}
                <Link
                  href="/contact"
                  className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full bg-seiren-cta px-10 text-base font-bold text-white shadow-[0_4px_24px_rgba(217,119,6,0.5)] transition-all hover:bg-seiren-cta-hover hover:shadow-[0_6px_32px_rgba(217,119,6,0.6)] sm:w-auto"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  無料で相談する
                </Link>
                {/* Tier 2: Secondary white-border outline */}
                <Link
                  href="#flow"
                  className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border border-white/50 px-8 text-[15px] font-semibold text-white transition-all hover:bg-white/10 sm:w-auto"
                >
                  サービスの流れを見る
                </Link>
                {/* Tier 3: Ghost low-emphasis */}
                <a
                  href="tel:08008888788"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white/90"
                >
                  <Phone className="h-4 w-4" />
                  0800-888-8788（無料）
                </a>
              </div>

              <p className="mt-5 text-[13px] text-white/50">24時間365日受付 / お見積り無料 / 急かすことなく一緒に考えます</p>
            </div>
          </div>
        </section>

        <EcosystemShowcase />

        <section className="bg-white py-24 md:py-32">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-16">
            <div className="overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-sm">
              <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="border-b border-neutral-200 bg-neutral-50/70 px-7 py-8 md:px-10 md:py-10 lg:border-b-0 lg:border-r">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-seiren-accent">AIシミュレーター</p>
                  <h2 className="mt-4 font-zen text-balance text-[26px] font-bold leading-[1.25] text-seiren-main md:text-[34px]">
                    お墓じまいの概算費用を30秒で診断
                  </h2>
                  <p className="mt-5 text-[15px] leading-[1.9] text-neutral-500">
                    墓地の場所、墓石の大きさ、遺骨の数、次の供養先から、概算費用の目安を確認できます。
                  </p>
                  <div className="mt-8 rounded-2xl border border-seiren-accent/15 bg-white px-5 py-4">
                    <p className="text-sm font-semibold text-seiren-main">今回は静的UIのみです</p>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                      実際の計算ロジックやAPI接続は入れず、入力イメージと導線だけを配置しています。
                    </p>
                  </div>
                </div>

                <div className="px-7 py-8 md:px-10 md:py-10">
                  <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 md:p-6">
                    <div className="space-y-3">
                      {simulatorFields.map((field) => (
                        <div
                          key={field}
                          className="flex min-h-[54px] items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-500"
                        >
                          <span>{field}</span>
                          <ChevronDown className="h-4 w-4 text-neutral-400" />
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/estimation"
                      className="mt-5 inline-flex min-h-[54px] w-full items-center justify-center rounded-full bg-seiren-cta px-6 text-base font-semibold text-white transition-colors hover:bg-seiren-cta-hover"
                    >
                      概算費用を診断する
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-neutral-50 py-24 md:py-32">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-seiren-accent">詰まりやすい論点</p>
              <h2 className="mt-4 font-zen text-balance text-[28px] font-bold leading-[1.25] text-seiren-main md:text-[38px]">
                改葬許可申請でつまずきやすいポイント
              </h2>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
              {stuckPoints.map((point) => (
                <div key={point} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="mt-5 text-sm font-semibold leading-[1.8] text-neutral-900">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-24 md:py-32">
          <div className="mx-auto max-w-[980px] px-6 lg:px-12">
            <div className="rounded-[32px] border border-neutral-200 bg-neutral-50 px-7 py-8 md:px-10 md:py-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-seiren-accent">行政書士マッチング</p>
              <h2 className="mt-4 font-zen text-balance text-[28px] font-bold leading-[1.25] text-seiren-main md:text-[36px]">
                手続きが不安な方は行政書士に相談できます
              </h2>
              <p className="mt-5 text-[15px] leading-[1.9] text-neutral-500">
                清蓮は行政手続きの代行は行いません。
                代理提出や個別事情を含む申請が必要な場合は、対応可能な行政書士への相談をご検討ください。
              </p>
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
                <p className="text-sm leading-[1.8] text-amber-800">
                  行政書士以外が報酬を得て行政手続きの代理提出を行うことは、法律上問題となる可能性があります。
                </p>
              </div>
              <Link
                href="/gyoseishoshi"
                className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-seiren-accent bg-white px-7 text-sm font-semibold text-seiren-accent transition-colors hover:bg-seiren-accent/10"
              >
                行政書士マッチングを見る
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-neutral-50 py-24 md:py-32">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-14">
            <div className="rounded-[32px] bg-seiren-main px-7 py-10 text-white md:px-10 md:py-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-seiren-accent">一括相談</p>
              <h2 className="mt-4 font-zen text-balance text-[28px] font-bold leading-[1.25] md:text-[36px]">
                書類だけでなく、お墓じまい全体を相談したい方へ
              </h2>
              <p className="mt-5 max-w-3xl text-[15px] leading-[1.9] text-white/75">
                墓石撤去、離檀の相談、洗骨・粉骨、散骨、次の納骨先まで、状況に合わせてご案内します。
              </p>
              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-seiren-cta px-8 text-base font-semibold text-white transition-colors hover:bg-seiren-cta-hover"
                >
                  無料相談する
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24 md:py-32">
          <div className="mx-auto max-w-[980px] px-6 lg:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-seiren-accent">FAQ</p>
              <h2 className="mt-4 font-zen text-balance text-[28px] font-bold leading-[1.25] text-seiren-main md:text-[38px]">
                改葬許可申請のよくある質問
              </h2>
            </div>

            <div className="mt-12 divide-y divide-neutral-200 rounded-[28px] border border-neutral-200 bg-neutral-50/70 px-6 md:px-8">
              {homepageBottomFaqs.map((faq) => (
                <details key={faq.q} className="group py-1">
                  <summary className="flex min-h-[68px] cursor-pointer items-center justify-between gap-4 py-4 text-left text-[16px] font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden list-none">
                    <span>{faq.q}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-neutral-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="pb-5 pr-2 text-[14px] leading-[1.85] text-neutral-500 md:pr-8">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-neutral-50 py-24 md:py-32">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-seiren-accent">関連サービス</p>
              <h2 className="mt-4 font-zen text-balance text-[28px] font-bold leading-[1.25] text-seiren-main md:text-[38px]">
                改葬後の供養先もご相談できます
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {relatedServiceCards.map((service) => (
                <div key={service.title} className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-serif text-xl font-semibold text-neutral-900">{service.title}</h3>
                    {service.status && (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        {service.status}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-[1.8] text-neutral-500">{service.description}</p>
                  {service.status ? (
                    <div className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full border border-neutral-200 px-6 text-sm font-semibold text-neutral-400">
                      {service.cta}
                    </div>
                  ) : (
                    <a
                      href={service.href}
                      target={service.external ? "_blank" : undefined}
                      rel={service.external ? "noopener noreferrer" : undefined}
                      className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-seiren-accent px-6 text-sm font-semibold text-seiren-accent transition-colors hover:bg-seiren-accent/10"
                    >
                      {service.cta}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white pb-24 pt-8 md:pb-32 md:pt-10">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-14">
            <div className="rounded-[32px] border border-seiren-border bg-seiren-surface px-7 py-9 text-center md:px-10 md:py-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-seiren-accent">フッター直前CTA</p>
              <h2 className="mt-4 font-zen text-balance text-[28px] font-bold leading-[1.25] text-seiren-main md:text-[38px]">
                迷ったら、まずは今の状況整理からご相談ください
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-[1.9] text-neutral-500">
                書類だけの質問でも、全体相談でも構いません。ご家族の状況や改葬先の希望に合わせて、次にやるべきことを整理します。
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex min-h-[54px] w-full items-center justify-center rounded-full bg-seiren-cta px-8 text-base font-semibold text-white transition-colors hover:bg-seiren-cta-hover sm:w-auto"
                >
                  無料相談する
                </Link>
                <Link
                  href="/gyoseishoshi"
                  className="inline-flex min-h-[54px] w-full items-center justify-center rounded-full border border-seiren-accent px-8 text-base font-semibold text-seiren-accent transition-colors hover:bg-seiren-accent/10 sm:w-auto"
                >
                  行政書士を見る
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            [M] フッター
        ============================================================ */}
        <footer className="border-t bg-white py-16 print:hidden">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-16">
            <div className="grid gap-12 md:grid-cols-4">
              <div className="md:col-span-1">
                <Link href="/" className="flex items-center gap-2.5">
                  <Image
                    src="/logo2.png"
                    alt="清蓮 ロゴ"
                    width={28}
                    height={28}
                    className="h-7 w-auto object-contain"
                  />
                  <span className="text-base font-bold text-neutral-900">お墓じまいナビ</span>
                </Link>
                <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                  株式会社清蓮が運営する、改葬手続きから供養までの
                  一括サポートサービス。
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-900">サービス</h4>
                <ul className="mt-4 space-y-3">
                  {[
                    { label: "お墓じまいとは", href: "#kaisou-steps" },
                    { label: "手続きの流れ", href: "/flow" },
                    { label: "料金プラン", href: "/price" },
                    { label: "対応エリア", href: "/kaissou" },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-sm text-neutral-500 transition-colors hover:text-neutral-900">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div data-ecosystem-block="home-footer-related-services">
                <h4 className="text-sm font-semibold text-neutral-900">関連サービス</h4>
                <ul className="mt-4 space-y-3">
                  {FOOTER_SISTER_SITES.map((site) => (
                    <li key={site.id}>
                      <a
                        href={site.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                        data-ecosystem-link={site.id}
                        data-ecosystem-from="home-footer-related-services"
                      >
                        {HOME_FOOTER_SISTER_LABELS[site.id]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-900">企業情報</h4>
                <ul className="mt-4 space-y-3">
                  <li>
                    <a
                      href={SEIREN_CORPORATE_SITE_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                      data-ecosystem-link="seiren-corporate"
                      data-ecosystem-from="home-footer-company"
                    >
                      株式会社清蓮 企業サイト
                    </a>
                  </li>
                  {[
                    { label: "運営会社について", href: "/company" },
                    { label: "プライバシーポリシー", href: "/privacy" },
                    { label: "お問い合わせ", href: "/contact" },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-sm text-neutral-500 transition-colors hover:text-neutral-900">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 border-t pt-8 text-center text-xs text-neutral-500">
              © 2026 Seiren Co., Ltd. All rights reserved.
            </div>
          </div>
        </footer>
      </div>

    </>
  )
}
