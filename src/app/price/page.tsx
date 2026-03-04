import { constructMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import PricingPageClient from "./PricingPageClient"
import { FaqJsonLd } from "@/components/seo/faq-json-ld"

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
