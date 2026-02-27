import Link from "next/link"
import {
  FileText,
  ShieldCheck,
  UserCheck,
  Anchor,
  ChevronRight,
  AlertTriangle,
  Check,
  ArrowRight,
} from "lucide-react"

// --------------------------------
// FAQ 構造化データ（JSON-LD）
// --------------------------------
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "改葬（お墓じまい）には許可が必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、改葬には「改葬許可証」が必要です。墓地埋葬法第5条により、現在のお墓が所在する市区町村に改葬許可申請書を提出し、許可を受ける必要があります。",
      },
    },
    {
      "@type": "Question",
      name: "改葬許可申請書は誰が作成・提出できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "申請書の作成・提出自体はお客様（申請者）が行うものです。行政書士法により、申請書の作成代理・提出代理は行政書士のみが行える業務です。清蓮では書き方のご説明と提携行政書士のご紹介を行っています。",
      },
    },
    {
      "@type": "Question",
      name: "海洋散骨に改葬許可は必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "海洋散骨（粉骨の上、海洋にて散骨）は改葬に該当しないため、改葬許可証は不要です。ただし、節度ある方法での実施が求められます。清蓮では海洋散骨のご相談・実施も承っています。",
      },
    },
    {
      "@type": "Question",
      name: "改葬手続きにどのくらいの期間がかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "改葬許可申請書の受理から許可証発行まで、自治体によって異なりますが数日〜2週間程度が目安です。郵送申請の場合は追加の日数が必要です。お墓じまい全体の流れでは、準備から完了まで1〜3ヶ月程度を見ていただくとよいでしょう。",
      },
    },
  ],
}

// --------------------------------
// STEP データ
// --------------------------------
const steps = [
  {
    step: 1,
    title: "現在の墓地管理者から「埋蔵証明書」を取得",
    body: "現在お墓がある寺院・霊園の管理者に、遺骨が埋蔵されている事実を証明してもらいます。改葬許可申請書の証明欄に記入してもらうか、別紙証明書を取得します。",
  },
  {
    step: 2,
    title: "自治体へ「改葬許可申請書」を提出",
    body: "現在のお墓の所在地を管轄する市区町村役所（住民課・戸籍課など）に申請書を提出します。窓口・郵送対応は自治体によって異なります。",
  },
  {
    step: 3,
    title: "「改葬許可証」の交付",
    body: "申請書の受理後、数日〜2週間程度で改葬許可証が交付されます。この許可証がないと、新しい供養先での受け入れができません。",
  },
  {
    step: 4,
    title: "新しい供養先へ納骨",
    body: "改葬許可証を新しい墓地・納骨堂・寺院等に提出し、納骨が完了します。海洋散骨の場合は改葬許可証の提出は不要です。",
  },
]

// --------------------------------
// 清蓮ができること
// --------------------------------
const canDoList = [
  "改葬手続きの流れのご説明",
  "全国自治体の改葬申請書類の取得サポート",
  "申請書の記入方法に関する一般的なご説明",
  "提携行政書士のご紹介（代理申請が必要な場合）",
  "墓石撤去工事・石材業者の手配",
  "離檀交渉サポート（事前相談・同席支援）",
  "取り出した遺骨の洗骨・粉骨",
  "改葬後の容れ物・供養方法のご提案",
  "海洋散骨の実施（改葬許可不要）",
]

// --------------------------------
// コンポーネント本体
// --------------------------------
export default function ReKaisouGuide() {
  return (
    <>
      {/* JSON-LD: FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section
        aria-labelledby="reKaisouGuide-heading"
        className="mt-16 space-y-16"
      >
        {/* Section Header */}
        <div className="text-center space-y-3">
          <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">
            Kaisou Guide
          </p>
          <h2
            id="reKaisouGuide-heading"
            className="text-2xl md:text-3xl font-bold tracking-tight text-[#1D1D1F]"
          >
            改葬（お墓じまい）の手続きについて
          </h2>
          <p className="text-[#6E6E73] text-sm max-w-xl mx-auto">
            全国1,737自治体共通の情報です。お住まいの自治体の固有情報と合わせてご確認ください。
          </p>
        </div>

        {/* ① 改葬とは */}
        <div className="bg-[#F5F5F7] rounded-3xl p-8 md:p-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-[#1D1D1F]">改葬とは</h2>
          </div>
          <p className="text-[#1D1D1F] leading-loose text-sm md:text-base">
            改葬とは、すでに埋葬・埋蔵された遺骨を別の場所へ移すことをいいます。
            お墓じまい（墓じまい）は改葬の一形態で、現在のお墓を撤去し、遺骨を新しい供養先に移す手続き全般を指します。
          </p>
          <p className="text-[#1D1D1F] leading-loose text-sm md:text-base">
            <strong className="text-emerald-600">墓地埋葬法第5条により、改葬には必ず「改葬許可証」が必要です。</strong>
            許可証の取得は、現在のお墓が所在する市区町村への申請が原則となるため、
            <strong>自治体ごとに書類や手順が異なります。</strong>
          </p>
        </div>

        {/* ② 改葬手続きの流れ */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#1D1D1F] flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">②</span>
            改葬手続きの流れ（4ステップ）
          </h2>
          <div className="space-y-4">
            {steps.map(({ step, title, body }, idx) => (
              <div key={step} className="flex gap-5">
                <div className="flex flex-col items-center shrink-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D1D1F] text-white font-bold text-sm">
                    {step}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-px flex-1 bg-gray-200 my-2" />
                  )}
                </div>
                <div className="pb-4">
                  <h3 className="font-bold text-base text-[#1D1D1F] mb-1">
                    {title}
                  </h3>
                  <p className="text-[#6E6E73] text-sm leading-loose">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ③ 清蓮ができること */}
        <div className="bg-[#FFFFFF] border border-gray-200 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F7] shrink-0">
              <UserCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#6E6E73] uppercase">Legal Scope</p>
              <h2 className="text-xl font-bold text-[#1D1D1F]">清蓮ができること（合法範囲）</h2>
            </div>
          </div>
          <ul className="grid md:grid-cols-2 gap-3">
            {canDoList.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#1D1D1F]">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              改葬手続きについて相談する
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact?type=gyoseishoshi"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-emerald-600 text-emerald-600 text-sm font-semibold hover:bg-emerald-50 transition-colors"
            >
              提携行政書士を紹介してもらう
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* ④ 法令遵守ポリシー */}
        <div className="bg-[#1D1D1F] text-white rounded-3xl p-8 md:p-10 space-y-4">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 shrink-0">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-1">Legal Compliance</p>
                <h2 className="text-xl font-bold text-white">法令遵守ポリシー</h2>
              </div>
              <div className="flex items-start gap-2 bg-amber-500/20 border border-amber-500/40 rounded-2xl px-5 py-4">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm leading-loose text-white/90">
                  <strong className="text-amber-300">改葬許可申請書の作成および提出代理は、行政書士法により行政書士のみが行える業務です。</strong>
                  <br />
                  当社では法令を遵守し、正式な代理業務は行っておりません。
                  必要に応じて提携行政書士をご紹介しております。
                </p>
              </div>
              <p className="text-sm text-white/70 leading-loose">
                清蓮は「改葬手続きの一般的なご説明」「書類取得のサポート」「提携行政書士の紹介」を提供します。
                申請書の記入・提出は必ずお客様ご自身または行政書士が行います。
              </p>
              <Link
                href="/contact?type=gyoseishoshi"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                提携行政書士を紹介してもらう
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ⑤ 海洋散骨という選択肢 */}
        <div className="bg-[#F5F5F7] rounded-3xl p-8 md:p-10 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0">
              <Anchor className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#6E6E73] uppercase mb-1">Alternative Option</p>
              <h2 className="text-xl font-bold text-[#1D1D1F]">海洋散骨という選択肢</h2>
            </div>
          </div>
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 text-sm text-emerald-700 font-semibold">
              <Check className="h-4 w-4" />
              改葬許可証は不要です
            </div>
            <p className="text-[#1D1D1F] text-sm leading-loose">
              海洋散骨（粉骨後、海上にて散骨する方式）は、墓地埋葬法上の「改葬」には該当しないため、
              <strong>改葬許可証の取得が不要</strong>です。
              お墓の移転先を検討されている方は、「お墓を持たない」選択肢として海洋散骨もご検討いただけます。
            </p>
            <p className="text-[#6E6E73] text-xs leading-loose">
              ※ 遺骨を取り出す際は、墓地管理者への連絡が必要です。また節度ある方法での実施が求められます。
            </p>
          </div>
          <Link
            href="/kaiyousankotsuyaku"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1D1D1F] text-white text-sm font-semibold hover:bg-[#2d2d2f] transition-colors"
          >
            海洋散骨を検討する
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
