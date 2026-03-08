import { constructMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import PricingPageClient from "./PricingPageClient"
import { FaqJsonLd } from "@/components/seo/faq-json-ld"
import { SpeakableJsonLd } from "@/components/seo/speakable-json-ld"

const priceFaqs = [
  {
    question: "お墓じまいの費用はいくらかかりますか？",
    answer: "お墓じまい（改葬）の費用は、墓石の大きさ・立地・寺院や霊園のある場所・改葬先の選択によって大きく異なります。一般的な目安として、墓石撤去工事が10万〜50万円程度、行政書士への改葬許可申請代行費が3万〜10万円程度（依頼した場合）です。株式会社清蓮では現地調査後に見積りを確定し、追加費用は原則発生しません。",
  },
  {
    question: "追加費用は発生しますか？",
    answer: "原則として追加費用は発生しません。現地調査で墓石の規模・搬出経路・地中障害物の有無を確認したうえで確定見積りをご提示します。ただし、調査時に確認できなかった地中障害物が発見された場合など、例外的に事前にご相談のうえ追加費用が発生するケースがあります。",
  },
  {
    question: "現地調査は無料ですか？",
    answer: "はい、現地調査は全国どこでも無料です。専任スタッフがお墓に伺い、墓石の大きさ・搬出経路・周辺状況を確認します。遠方の場合は写真・動画での簡易確認にも対応しています。",
  },
  {
    question: "分割払いやカード払いはできますか？",
    answer: "クレジットカード払いと銀行振込に対応しています。分割払いについては個別にご相談ください。一般的には着手金として工事費の50%程度をいただき、残金は工事完了後のお支払いとなります。",
  },
  {
    question: "見積もりをもらった後、断ってもキャンセル料はかかりませんか？",
    answer: "ご安心ください。正式なご契約（同意書の取り交わし）前であれば、お見積もり後にキャンセルされてもキャンセル料・出張費・調査費などは一切かかりません。",
  },
  {
    question: "お寺から高額な離檀料を請求された場合、どうなりますか？",
    answer: "離檀料に法的な根拠はなく、あくまで「お布施（お気持ち）」として3万〜10万円程度を包むのが一般的です。法外な請求があった場合は、弊社が提携する行政書士や弁護士をご紹介し、円満な解決に向けたサポートを行うことが可能です。",
  },
  {
    question: "遺骨の「洗骨」や「粉骨」には別途費用がかかりますか？",
    answer: "はい。洗骨や粉骨は、ご遺骨の柱（霊）数や汚れの程度によって料金が異なります。基本プランとは別オプションとなりますが、ご遺骨の状態を確認後、作業前に正確な費用を必ずお伝えいたします。",
  },
  {
    question: "お墓の撤去工事（解体）だけを依頼することはできますか？",
    answer: "可能です。書類手続きはご自身で行い、工事とご遺骨のケアのみを弊社に依頼されるお客様も多数いらっしゃいます。無駄を省いたお客様に最適なプランをご提案します。",
  },
  {
    question: "「行政書士マッチング」の利用に手数料はかかりますか？",
    answer: "当サイトを通じて行政書士に相談・依頼を行うシステム自体に仲介手数料はかかりません。お客様がお支払いになるのは、行政書士が提示する手続き代行の報酬額のみです。",
  },
  {
    question: "合同墓や海洋散骨など、新しい納骨先への手配も任せられますか？",
    answer: "はい、ワンストップで対応可能です。海洋散骨（自社サービス）のほか、提携する全国の永代供養墓や樹木葬など、ご予算やご希望に合わせた改葬先をご紹介・手配いたします。",
  },
]

export const metadata = constructMetadata({
  title: "料金について | お墓じまいナビ - 明確な料金体系で安心",
  description: "お墓じまいの料金プラン。行政手続き代行55,000円〜、基本プラン150,000円〜。見積り後の追加費用は原則なし。全国対応・現地調査無料。",
  image: "/og/pricing.jpg",
  path: '/price',
})

export default function PricePage() {
  return (
    <>
      <FaqJsonLd faqs={priceFaqs} />
      <SpeakableJsonLd
        pageUrl="https://www.ohakajimai-navi.jp/price"
        cssSelector={["h1", "h2", "h3"]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: process.env.NEXT_PUBLIC_BASE_URL || "https://ohakajimai-navi.jp" },
          { name: "料金について", url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://ohakajimai-navi.jp"}/price` },
        ]}
      />
      <div className="bg-[#F5F5F7]/80">
        <Breadcrumb items={[{ name: "料金について", href: "/price" }]} />
      </div>
      <PricingPageClient />
    </>
  )
}
