import { constructMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { HowToJsonLd, kaisouHowToSteps } from "@/components/seo/howto-json-ld"
import {
  MessageCircle,
  FileText,
  Search,
  FileSignature,
  Hammer,
  HeartHandshake,
  Anchor,
  Clock,
  AlertCircle,
  Info,
  CheckCircle2,
  ArrowRight,
  Phone,
} from "lucide-react"
import Link from "next/link"

export const metadata = constructMetadata({
  title: "ご依頼の流れ｜お墓じまい・改葬・墓石撤去の手続きを7ステップで解説｜お墓じまいナビ",
  description:
    "お墓じまい（改葬）の流れを7ステップで解説。無料相談・書類確認・現地調査・ご契約・墓石撤去・遺骨ケア・改葬先移送まで。改葬許可申請の案内と行政書士紹介を法令に基づき提供。株式会社清蓮（横浜・全国対応）。",
})

// ─── コンプライアンスバナー ─────────────────────────────
const COMPLIANCE_NOTE =
  "改葬許可申請の代行は行政書士など有資格者の業務です。清蓮は申請代行を行わず、書類の取得方法の案内・一般的な記入説明・提携行政書士のご紹介に留めます。"

// ─── ステップデータ ─────────────────────────────────────
const steps = [
  {
    step: 1,
    Icon: MessageCircle,
    title: "無料相談・お問い合わせ",
    duration: "即日",
    description:
      "フォームまたはお電話で現在の状況をお聞きします。改葬か散骨か、改葬先の有無、お急ぎ度合いなど、まずはお気軽にご連絡ください。",
    bullets: [
      "相談・見積りはすべて無料",
      "強引な勧誘は一切行いません",
      "散骨のみの場合は改葬許可申請が不要なケースがあります（個別にご案内）",
    ],
    note: null,
  },
  {
    step: 2,
    Icon: FileText,
    title: "必要書類の確認と取得案内",
    duration: "1〜3日",
    description:
      "改葬許可申請に必要な書類の一覧をご案内します。全国自治体の申請書ダウンロード先も本サイトでご確認いただけます。記入項目の一般的な注意点をご説明します。",
    bullets: [
      "必要書類：改葬許可申請書・埋蔵証明書・受入証明書（新しい供養先から）",
      "申請書のダウンロード先は「申請書DL」ページで自治体別に掲載",
      "記入例の一般的な説明をご提供（個別の法的判断・書類作成代行は行いません）",
    ],
    note: "改葬許可申請の代行が必要な場合は、提携行政書士をご紹介します。依頼契約は行政書士と直接締結いただく形となります。",
  },
  {
    step: 3,
    Icon: Search,
    title: "現地調査・お見積り",
    duration: "1〜2週間",
    description:
      "専任スタッフがお墓に伺い、墓石の規模・搬出導線・周辺条件を確認します。概算をその場でご提示し、現地確認後に確定見積りをお出しします。",
    bullets: [
      "現地調査は無料（全国対応）",
      "遠方の場合は写真・動画での簡易確認にも対応",
      "追加費用が原則発生しない明朗会計",
    ],
    note: null,
  },
  {
    step: 4,
    Icon: FileSignature,
    title: "ご契約",
    duration: "1〜3日",
    description:
      "お見積り内容にご納得いただけましたら契約となります。工事内容・日程・注意事項・費用を書面で確認し、着手金をお預かりします。",
    bullets: [
      "契約書面を丁寧に説明します",
      "着手金：総額の50%程度（目安）",
      "残金は工事完了後のお支払い",
      "クレジットカード・振込に対応",
    ],
    note: null,
  },
  {
    step: 5,
    Icon: Hammer,
    title: "墓石撤去工事・原状回復",
    duration: "1日〜",
    description:
      "改葬許可証が発行されたことを確認の上、提携石材店が墓石の解体・撤去・整地を行います。寺院・霊園のルールに合わせて当日対応します。",
    bullets: [
      "優良石材店ネットワークによる施工",
      "撤去後は整地・原状回復まで完了",
      "工事中の写真記録をご提供",
    ],
    note: null,
  },
  {
    step: 6,
    Icon: HeartHandshake,
    title: "遺骨の取り出し・ケア",
    duration: "必要に応じて",
    description:
      "遺骨を丁寧に取り出し、改葬先の仕様に合わせた洗骨・粉骨・容器への納め替えを行います。散骨クルーズへの引き継ぎにも対応します。",
    bullets: [
      "洗骨・粉骨（必要に応じて）",
      "骨壷・骨箱・遺骨袋など改葬先に合わせた容器へ納め替え",
      "海洋散骨の場合は散骨クルーズへの引き継ぎも対応",
    ],
    note: null,
  },
  {
    step: 7,
    Icon: Anchor,
    title: "改葬先へ移送 または 海洋散骨",
    duration: "調整次第",
    description:
      "永代供養・納骨堂・樹木葬などの改葬先への移送段取りをサポートします。海洋散骨は「散骨クルーズ」と連携して対応します。",
    bullets: [
      "改葬先との日程調整をサポート",
      "海洋散骨：散骨クルーズ（関連サービス）にて対応",
      "海洋散骨のみの場合、改葬許可申請が不要なケースがあります",
    ],
    note: null,
  },
]

export default function FlowPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: process.env.NEXT_PUBLIC_BASE_URL || "https://www.ohakajimai-navi.jp" },
          { name: "ご依頼の流れ", url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.ohakajimai-navi.jp"}/flow` },
        ]}
      />
      <HowToJsonLd
        name="改葬（お墓じまい）手続きの方法"
        description="現在のお墓からご遺骨を取り出し、別の納骨先へ移す「改葬」の正式手続きの流れ。"
        totalTime="P3M"
        steps={kaisouHowToSteps}
      />

      {/* ─── Hero ─── */}
      <div className="border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <nav className="flex items-center gap-2 text-xs text-neutral-400" aria-label="パンくず">
            <Link href="/" className="hover:text-neutral-600 transition-colors">ホーム</Link>
            <span aria-hidden="true">/</span>
            <span className="text-neutral-700">ご依頼の流れ</span>
          </nav>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
            ご依頼の流れ
          </h1>
          <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-neutral-600 md:text-lg">
            お墓じまいは、現地確認から工事・遺骨のケア・改葬先の手配まで段取りが多い手続きです。
            清蓮は工事と遺骨のケアを軸に、改葬手続きは「案内」と「行政書士紹介」で法令遵守の形で支えます。
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-xs text-neutral-500 w-fit">
            <Clock className="h-3.5 w-3.5" />
            全体目安：2〜4ヶ月（墓地規模・自治体・改葬先の受入状況により前後します）
          </div>
        </div>
      </div>

      {/* ─── コンプライアンスバナー ─── */}
      <div className="border-b border-amber-200 bg-amber-50">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-amber-800">
              <strong className="font-semibold">重要：</strong>{COMPLIANCE_NOTE}
            </p>
          </div>
        </div>
      </div>

      {/* ─── タイムライン ─── */}
      <div className="mx-auto max-w-3xl px-6 py-20">
        {/* 縦線 */}
        <div className="relative">
          <div
            className="absolute left-[19px] top-10 bottom-10 w-px bg-neutral-200 hidden sm:block"
            aria-hidden="true"
          />

          <ol className="space-y-12" aria-label="ご依頼の流れ">
            {steps.map(({ step, Icon, title, duration, description, bullets, note }) => (
              <li key={step} className="group relative sm:flex sm:gap-8">
                {/* アイコン */}
                <div className="relative z-10 mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm sm:mb-0">
                  <Icon className="h-4.5 w-4.5 text-emerald-600" strokeWidth={1.75} />
                </div>

                {/* カード */}
                <div className="flex-1 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                      Step {step}
                    </span>
                    <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-500">
                      <Clock className="h-3 w-3" />
                      {duration}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 max-w-[46ch]">
                    {description}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* コンプライアンス注記 */}
                  {note && (
                    <div className="mt-5 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                      <p className="text-xs leading-relaxed text-blue-700">{note}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ─── 離檀交渉サポート ─── */}
      <div className="border-y border-neutral-100 bg-neutral-50">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">強み</p>
          <h2 className="mt-3 text-2xl font-bold text-neutral-900">離檀交渉サポート</h2>
          <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-neutral-600">
            寺院・墓地管理者との離檀交渉でお困りの方へ。実務目線で進め方を整理し、落としどころを一緒に設計します。
            高額な離檀料を提示された場合もご相談ください。
          </p>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 max-w-md">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
            <p className="text-xs leading-relaxed text-neutral-500">
              当社のサポートは進め方の整理・情報提供です。法的代理交渉（弁護士業務）は行いません。
            </p>
          </div>
        </div>
      </div>

      {/* ─── 行政書士紹介セクション ─── */}
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">コンプライアンス</p>
        <h2 className="mt-3 text-2xl font-bold text-neutral-900">提携行政書士のご紹介</h2>
        <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-neutral-600">
          代理提出や個別事情がある場合は、提携行政書士をご紹介します。
          改葬許可申請の代行は行政書士など有資格者のみが行える業務です。
          清蓮は代行を行わず、ご紹介に留まります。依頼契約は行政書士と直接締結いただく形となります。
        </p>
        <Link
          href="/gyoseishoshi"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:border-neutral-300 hover:text-neutral-900 transition-colors"
        >
          行政書士に相談する（無料）
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* ─── CTA ─── */}
      <div className="border-t border-neutral-100 bg-neutral-900">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            まずは無料でご相談ください
          </h2>
          <p className="mt-3 text-sm text-neutral-400">見積り無料。強引な勧誘はしません。</p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-emerald-600 px-8 text-base font-semibold text-white hover:bg-emerald-700 transition-colors sm:w-auto"
            >
              無料相談フォームへ
            </Link>
            <a
              href="tel:08008888788"
              className="inline-flex min-h-[52px] w-full flex-col items-center justify-center rounded-full border-2 border-neutral-600 px-8 text-sm font-semibold text-white hover:border-neutral-400 transition-colors sm:w-auto"
            >
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                0800-888-8788
              </span>
              <span className="text-[10px] font-normal text-neutral-400 mt-0.5">フリーコール｜9:00〜19:00</span>
            </a>
          </div>
        </div>
      </div>

      {/* ─── サブナビ ─── */}
      <div className="border-t border-neutral-100 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-8 flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/" className="text-neutral-500 hover:text-neutral-800 transition-colors">
            ← トップへ戻る
          </Link>
          <Link href="/price" className="flex items-center gap-1 text-emerald-700 font-medium hover:underline">
            料金について <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/kaisoukyoka" className="flex items-center gap-1 text-emerald-700 font-medium hover:underline">
            申請書DL <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/gyoseishoshi" className="flex items-center gap-1 text-emerald-700 font-medium hover:underline">
            行政書士マッチング <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
