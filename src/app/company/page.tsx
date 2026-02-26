import { constructMetadata } from "@/lib/seo"
import Link from "next/link"

export const metadata = constructMetadata({
  title: "会社概要｜株式会社清蓮",
  description: "お墓じまいナビを運営する株式会社清蓮の会社概要です。所在地、代表者情報、サービス理念などをご確認いただけます。",
})

const companyInfo = [
  { label: "社名", value: "株式会社清蓮" },
  { label: "設立", value: "2020年（予定）" },
  { label: "代表者", value: "（公開準備中）" },
  { label: "所在地", value: "（公開準備中）" },
  { label: "電話番号", value: "0120-000-000（24時間受付）" },
  { label: "メールアドレス", value: "（公開準備中）" },
  { label: "事業内容", value: "改葬（お墓じまい）手続き案内・書類サポート・提携行政書士紹介・石材店手配・遺骨ケアサポート" },
]

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Company</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
          会社概要
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-neutral-600">
          株式会社清蓮は、お客様が安心してお墓じまいに取り組めるよう、法令遵守を最優先にした誠実なサービスを提供しています。
        </p>

        <div className="mt-16 overflow-hidden rounded-2xl border border-neutral-200">
          <table className="w-full">
            <tbody>
              {companyInfo.map((item, i) => (
                <tr key={item.label} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-neutral-700 w-1/3">
                    {item.label}
                  </th>
                  <td className="px-8 py-5 text-sm text-neutral-600">
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16 rounded-2xl bg-emerald-50 px-8 py-10">
          <h2 className="text-2xl font-bold text-neutral-900">私たちの姿勢</h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-700">
            お墓じまいは、ご先祖様への感謝と次世代への配慮が交差する、非常に繊細な手続きです。<br />
            私たちは「できること・できないこと」を常に明確にし、違法リスクのある代行は一切行いません。<br />
            法令の範囲内で、お客様が安心して前に進めるよう、誠実にサポートすることを約束しています。
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            無料相談・お見積り
          </Link>
        </div>
      </div>
    </div>
  )
}
