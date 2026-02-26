import { constructMetadata } from "@/lib/seo"
import Link from "next/link"
import { Phone, Mail, ExternalLink } from "lucide-react"

export const metadata = constructMetadata({
  title: "会社概要｜株式会社清蓮",
  description:
    "株式会社清蓮は、お墓じまい・改葬・海洋散骨など供養に関わる実務を専門に行う会社です。法令遵守を最優先に、ご家族の不安に誠実に寄り添います。",
})

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

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">

      {/* ─────────────────────────────────────────
          1. ヒーロー
      ───────────────────────────────────────── */}
      <section className="py-32 bg-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Seiren Co., Ltd.
          </p>
          <h1 className="mt-8 text-4xl font-semibold tracking-tight leading-[1.15] text-neutral-900 md:text-5xl">
            供養を、誠実に。
          </h1>
          <p className="mx-auto mt-6 max-w-[42ch] text-lg leading-relaxed text-neutral-600">
            終活と供養の専門会社として、<br className="hidden md:block" />
            法令を守りながら、ご家族の不安に寄り添います。
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          2. ブランドステートメント
      ───────────────────────────────────────── */}
      <section className="py-24 border-t border-neutral-100">
        <div className="mx-auto max-w-3xl space-y-8 px-6">
          <p className="text-base leading-[1.9] text-neutral-600 md:text-lg">
            清蓮は2008年創業。お墓じまい、改葬、海洋散骨など、供養に関わる実務を専門に行う会社です。
          </p>
          <p className="text-base leading-[1.9] text-neutral-600 md:text-lg">
            私たちは、単なる工事会社ではありません。法律を守り、関係者との調整を丁寧に行い、安心して任せられる存在であることを大切にしています。
          </p>
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
          4. 私たちの姿勢
      ───────────────────────────────────────── */}
      <section className="py-24 border-t border-neutral-100">
        <div className="mx-auto max-w-4xl px-6">
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

          <div className="mt-12 space-y-6">
            {/* 電話 */}
            <div className="flex items-center justify-center gap-3">
              <Phone className="h-4 w-4 text-neutral-400 shrink-0" />
              <a
                href="tel:0458819952"
                className="text-base text-emerald-600 hover:text-emerald-800 transition-colors tracking-wide"
              >
                045-881-9952
              </a>
            </div>

            {/* メール */}
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

          {/* SNS / 公式 */}
          <div className="mt-14">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Official
            </p>
            <div className="mt-6 flex flex-col items-center gap-5 text-sm">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                <span className="text-neutral-400 w-20 text-right text-xs">LINE</span>
                <a
                  href="https://line.me/R/ti/p/@956lieqb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-800 transition-colors"
                >
                  @956lieqb
                </a>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                <span className="text-neutral-400 w-20 text-right text-xs">Instagram</span>
                <a
                  href="https://www.instagram.com/sankotu.cruise_seiren"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-800 transition-colors"
                >
                  sankotu.cruise_seiren
                </a>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                <span className="text-neutral-400 w-20 text-right text-xs">Facebook</span>
                <a
                  href="https://www.facebook.com/seirenjapan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-800 transition-colors"
                >
                  seirenjapan
                </a>
              </div>
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
