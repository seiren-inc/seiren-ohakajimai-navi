import { constructMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { FaqJsonLd } from "@/components/seo/faq-json-ld"
import { SpeakableJsonLd } from "@/components/seo/speakable-json-ld"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import Link from "next/link"
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ohakajimai-navi.jp"

export const metadata = constructMetadata({
  title: "海洋散骨とは？費用・手続き・法律・ルールを解説｜お墓じまいナビ",
  description: "海洋散骨（散骨）の費用相場・手続きの流れ・法律上の扱い・マナーを解説。お墓じまい後の遺骨の行き先として海洋散骨を選ぶ方が増えています。改葬許可申請が必要なケース・不要なケースも解説。株式会社清蓮（全国対応）提供。",
  path: "/sankotsu",
})

const faqs = [
  {
    question: "海洋散骨は法律的に問題ありませんか？",
    answer: "日本では「墓地、埋葬等に関する法律（墓埋法）」が遺骨の取り扱いを規制していますが、散骨を直接禁止する法律は存在しません。節度を持った方法で行えば、海洋散骨は合法な供養の選択肢です。自治体によっては独自のルールを定めている場合があるため、事前確認が推奨されます。",
  },
  {
    question: "お墓じまいの後に海洋散骨する場合、改葬許可申請は必要ですか？",
    answer: "現在のお墓から遺骨を取り出して散骨する場合は、市区町村への「改葬許可申請」が必要になります。ただし、自宅に保管している遺骨を散骨する場合や、すでに改葬許可証を取得済みの場合は不要です。個別の事情により異なるため、ご相談ください。",
  },
  {
    question: "海洋散骨の費用はいくらですか？",
    answer: "散骨の方法によって異なります。チャーター散骨（家族だけで船を貸し切る場合）は30万〜50万円程度、合同散骨（複数の家族と共同で行う場合）は5万〜15万円程度が目安です。株式会社清蓮が運営する「散骨クルーズ」でも対応しています。",
  },
  {
    question: "粉骨（粉砕）は必須ですか？",
    answer: "はい、海洋散骨を行う場合は、遺骨を2mm以下の粉状に加工する「粉骨（粉砕）」が必須です。これはルールとして定着しており、粉骨せずに遺骨をそのまま海に撒くことは許可されません。株式会社清蓮では粉骨の代行サービスも提供しています。",
  },
  {
    question: "遠方に住んでいて立ち会えない場合はどうすればよいですか？",
    answer: "代理散骨（委託散骨）というサービスがあり、ご家族に代わって業者が散骨を行います。散骨の証明書や写真・動画の提供に対応している業者もあります。株式会社清蓮の散骨クルーズでも代理散骨に対応しています。",
  },
]

export default function SankotsuPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: BASE_URL },
          { name: "海洋散骨とは", url: `${BASE_URL}/sankotsu` },
        ]}
      />
      <FaqJsonLd faqs={faqs} />
      <SpeakableJsonLd
        pageUrl={`${BASE_URL}/sankotsu`}
        cssSelector={["h1", "h2"]}
      />

      <div className="min-h-screen bg-white">
        <div className="border-b border-neutral-100 bg-neutral-50">
          <Breadcrumb items={[{ name: "海洋散骨とは", href: "/sankotsu" }]} />
          <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Scattering at Sea</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              海洋散骨とは
            </h1>
            <p className="mt-6 text-base leading-relaxed text-neutral-600 max-w-[50ch]">
              ご遺骨を粉骨（粉砕）し、海や自然の中に撒く供養の形。
              近年、お墓じまい後の遺骨の行き先として選ぶ方が急増しています。
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-16 space-y-16">
          {/* 基本説明 */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900">海洋散骨（散骨）の基礎知識</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "散骨とは",
                  body: "故人の遺骨を粉砕（粉骨）し、海・山・空などの自然の中に撒く供養の方法です。墓石を持たない「自然葬」の一種で、宗教・宗派を問わず実施できます。日本では海洋散骨が最も一般的です。",
                },
                {
                  title: "海洋散骨が選ばれる理由",
                  body: "永代供養墓・樹木葬・納骨堂と比べて管理費が発生しないこと、「海に還りたい」という故人の意思を尊重できること、お墓じまい後の遺骨の行き先として手続きが比較的シンプルなことが主な理由です。",
                },
                {
                  title: "法律上の位置付け",
                  body: "散骨を直接禁止する法律は日本には存在しません。ただし「節度を持って行うこと」が求められており、漁場近く・海水浴場・港湾付近での散骨は禁止されています。自治体独自の条例が存在する場合もあります。",
                },
                {
                  title: "粉骨（粉砕）の必要性",
                  body: "海洋散骨を行う前に、遺骨を2mm以下の粉状に加工する「粉骨」が必要です。これはルールとして定着しており、粉骨せずに遺骨をそのまま海に撒くことは許可されていません。専門業者への依頼が一般的です。",
                },
                {
                  title: "改葬許可申請との関係",
                  body: "現在のお墓から遺骨を取り出して散骨する場合は、市区町村への「改葬許可申請」が必要です。自宅に保管していた遺骨や、すでに改葬許可証を取得済みの場合は不要な場合もあります。",
                },
                {
                  title: "散骨の種類",
                  body: "【チャーター散骨】家族だけで船を貸し切り散骨（30〜50万円程度）。【合同散骨】複数の遺族と共同で実施（5〜15万円程度）。【委託散骨】立ち会えない場合に業者が代行（3〜8万円程度）。",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-neutral-200 p-6">
                  <h3 className="text-base font-bold text-neutral-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 注意点 */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900">散骨を行う際の注意点</h2>
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 space-y-3">
              <div className="flex items-start gap-2"><AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" /><p className="text-sm text-amber-800">漁場・海水浴場・港湾・航路付近では散骨できません</p></div>
              <div className="flex items-start gap-2"><AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" /><p className="text-sm text-amber-800">自治体によっては散骨に関する独自条例がある場合があります</p></div>
              <div className="flex items-start gap-2"><AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" /><p className="text-sm text-amber-800">現在のお墓から遺骨を取り出す場合は改葬許可申請が必要です</p></div>
              <div className="flex items-start gap-2"><AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" /><p className="text-sm text-amber-800">散骨後は祭祀財産（遺骨）が返還不可になるため、家族全員の同意を得てから実施してください</p></div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900">よくある質問</h2>
            <div className="mt-6 divide-y divide-neutral-100 rounded-2xl border border-neutral-200">
              {faqs.map((item, i) => (
                <details key={i} className="group px-6">
                  <summary className="flex min-h-[56px] cursor-pointer items-center justify-between gap-4 py-4 text-sm font-semibold text-neutral-900 list-none">
                    <span>{item.question}</span>
                    <span className="shrink-0 text-neutral-400 group-open:rotate-45 transition-transform">＋</span>
                  </summary>
                  <p className="pb-5 text-sm leading-relaxed text-neutral-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
              散骨・お墓じまいの無料相談 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/flow" className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-200 px-8 py-4 text-sm font-semibold text-neutral-700 hover:border-neutral-300 transition-colors">
              お墓じまいの流れを見る <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 関連リンク */}
          <div className="pt-8 border-t border-neutral-100">
            <p className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mb-4">関連ページ</p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: "/about", label: "お墓じまいとは" },
                { href: "/kaisoukyoka", label: "改葬許可申請書ダウンロード" },
                { href: "/ridanryou", label: "離檀料について" },
                { href: "/kaisougo", label: "改葬後の供養先" },
                { href: "/gyoseishoshi", label: "行政書士に相談する" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-emerald-700 underline underline-offset-2 hover:text-emerald-900">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
