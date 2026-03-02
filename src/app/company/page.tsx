import { constructMetadata } from "@/lib/seo"
import Image from "next/image"
import Link from "next/link"
import { Phone, Mail } from "lucide-react"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ohakajimai-navi.jp"

export const metadata = constructMetadata({
  title: "会社概要｜お墓じまい・改葬・墓石撤去の株式会社清蓮（横浜・全国対応）",
  description:
    "株式会社清蓮は神奈川県横浜市戸塚区を拠点に、お墓じまい・改葬・海洋散骨・離檀交渉・墓石撤去の専門サービスを全国に提供。法令遵守・誠実な対話を理念に2008年設立。代表：眞如理恵。",
})

// ─── SVG Icons ───────────────────────────────────────────────────
function LineIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.257l-2.443-3.317v2.947c0 .349-.282.63-.63.63-.346 0-.627-.281-.627-.63V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.349.282-.63.63-.63.346 0 .627.281.627.63v4.771zm-5.741 0c0 .349-.282.63-.631.63-.345 0-.627-.281-.627-.63V8.108c0-.349.282-.63.63-.63.346 0 .628.281.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.29.079.749.038 1.04l-.164 1.02c-.045.29-.24 1.143 1.011.62 1.241-.514 6.964-4.104 9.504-7.023C23.102 13.948 24 12.219 24 10.314"/>
    </svg>
  )
}

function InstagramIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function FacebookIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

// ─── Data ────────────────────────────────────────────────────────
const companyData = [
  { label: "会社名", value: "株式会社清蓮" },
  { label: "設立", value: "2008年8月6日" },
  {
    label: "所在地",
    value: "神奈川県横浜市戸塚区戸塚町4170\n高橋ビル1階",
  },
  { label: "代表者", value: "代表取締役　眞如 理恵" },
  { label: "法人番号", value: "0200-01-058496" },
]

const stances = [
  {
    number: "01",
    title: "法令遵守",
    body: "改葬手続きは案内と書類サポートに限定しています。代理申請が必要な場合は、提携行政書士をご紹介します。",
  },
  {
    number: "02",
    title: "全国対応",
    body: "地域ごとの条例や慣習を理解した上で対応しています。全国の提携石材店と連携し、地域差のある手続きもサポートします。",
  },
  {
    number: "03",
    title: "誠実な対話",
    body: "寺院や関係者との調整も、冷静かつ丁寧にサポートします。対立ではなく、調整と対話を大切にしています。",
  },
]

const snsLinks = [
  {
    label: "LINE",
    handle: "@956lieqb",
    href: "https://line.me/R/ti/p/@956lieqb",
    Icon: LineIcon,
    brand: "#06C755",
  },
  {
    label: "Instagram",
    handle: "sankotu.cruise_seiren",
    href: "https://www.instagram.com/sankotu.cruise_seiren",
    Icon: InstagramIcon,
    brand: "#E1306C",
  },
  {
    label: "Facebook",
    handle: "seirenjapan",
    href: "https://www.facebook.com/seirenjapan",
    Icon: FacebookIcon,
    brand: "#1877F2",
  },
]

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <BreadcrumbJsonLd items={[
        { name: "ホーム", url: SITE_URL },
        { name: "会社概要", url: `${SITE_URL}/company` },
      ]} />
      <Breadcrumb items={[{ name: "会社概要", href: "/company" }]} />

      {/* ─────────────────────────────────────────
          1. ヒーロー
      ───────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-[60vh] min-h-[480px] w-full">
          <Image
            src="/images/company-hero-zen.jpg"
            alt="静寂な禅庭 — 清蓮の理念を象徴する空間"
            fill
            className="object-cover"
            priority
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-white/30" />
        </div>

        {/* Hero Text overlaid at bottom */}
        <div className="py-20 bg-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Seiren Co., Ltd.
            </p>
            <h1 className="mt-6 text-2xl font-semibold tracking-tight leading-[1.15] text-neutral-900 md:text-4xl lg:text-5xl">
              供養を、誠実に。
            </h1>
            <p className="mx-auto mt-6 max-w-[42ch] text-lg leading-relaxed text-neutral-600">
              終活と供養の専門会社として、<br className="hidden md:block" />
              法令を守りながら、ご家族の不安に寄り添います。
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          2. ブランドステートメント（画像付き）
      ───────────────────────────────────────── */}
      <section className="py-24 border-t border-neutral-100">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-16 md:grid-cols-2 md:items-center">
            <div className="space-y-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">
                About
              </p>
              <p className="text-base leading-[1.9] text-neutral-600 md:text-lg">
                清蓮は2008年創業。お墓じまい、改葬、海洋散骨など、供養に関わる実務を専門に行う会社です。
              </p>
              <p className="text-base leading-[1.9] text-neutral-600 md:text-lg">
                私たちは、単なる工事会社ではありません。法律を守り、関係者との調整を丁寧に行い、安心して任せられる存在であることを大切にしています。
              </p>
            </div>
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
              <Image
                src="/images/company-office.jpg"
                alt="清蓮のオフィス — 信頼と誠実さが宿る空間"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          3. 会社情報
      ───────────────────────────────────────── */}
      <section className="py-24 border-t border-neutral-100">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Company Info
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900">
            会社情報
          </h2>

          <dl className="mt-14 grid gap-y-10 gap-x-20 md:grid-cols-2">
            {companyData.map((item) => (
              <div key={item.label}>
                <dt className="text-sm text-neutral-400">{item.label}</dt>
                <dd className="mt-2 text-base text-neutral-900 whitespace-pre-line">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          4. 私たちの姿勢（画像付き）
      ───────────────────────────────────────── */}
      <section className="py-24 border-t border-neutral-100">
        <div className="mx-auto max-w-5xl px-6">
          {/* 画像 */}
          <div className="relative aspect-21/9 overflow-hidden rounded-2xl mb-20">
            <Image
              src="/images/company-grave.jpg"
              alt="丁寧に整えられた日本のお墓 — 清蓮が守る、供養の尊厳"
              fill
              className="object-cover"
            />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Our Stance
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900">
            私たちの姿勢
          </h2>

          <div className="mt-14 grid gap-14 md:grid-cols-3">
            {stances.map((item) => (
              <div key={item.number}>
                <span className="text-xs font-medium text-neutral-400 tracking-widest">
                  {item.number}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-[1.85] text-neutral-600">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          5. お問い合わせ・公式情報
      ───────────────────────────────────────── */}
      <section className="py-24 bg-neutral-50 border-t border-neutral-100">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Contact
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900">
            お問い合わせ
          </h2>

          {/* 連絡先 */}
          <div className="mt-12 space-y-5">
            <div className="flex items-center justify-center gap-3">
              <Phone className="h-4 w-4 text-neutral-400 shrink-0" />
              <a
                href="tel:0458819952"
                className="text-base text-emerald-600 hover:text-emerald-800 transition-colors tracking-wide"
              >
                045-881-9952
              </a>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Mail className="h-4 w-4 text-neutral-400 shrink-0" />
              <a
                href="mailto:contact@seiren.ne.jp"
                className="text-base text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                contact@seiren.ne.jp
              </a>
            </div>
          </div>

          {/* SNS */}
          <div className="mt-16">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Official SNS
            </p>
            <div className="mt-8 flex flex-col items-center gap-5">
              {snsLinks.map(({ label, handle, href, Icon, brand }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm text-neutral-700 transition-all hover:border-neutral-300 hover:shadow-sm"
                >
                  <Icon className="h-4 w-4 transition-colors" style={{ color: brand }} />
                  <span className="w-20 text-left text-xs text-neutral-400">{label}</span>
                  <span className="text-neutral-700 group-hover:text-neutral-900 transition-colors">
                    {handle}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-8 py-3.5 text-sm font-medium text-neutral-700 hover:border-neutral-400 hover:text-neutral-900 transition-colors"
            >
              無料相談・お見積りフォームへ
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
