import { constructMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import PricingPageClient from "./PricingPageClient"

export const metadata = constructMetadata({
  title: "料金について | お墓じまいナビ - 明確な料金体系で安心",
  description: "お墓じまいの料金プラン。行政手続き代行55,000円〜、基本プラン150,000円〜。見積り後の追加費用は原則なし。全国対応・現地調査無料。",
  image: "/og/pricing.jpg",
})

export default function PricePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: process.env.NEXT_PUBLIC_BASE_URL || "https://ohakajimai-navi.jp" },
          { name: "料金について", url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://ohakajimai-navi.jp"}/price` },
        ]}
      />
      <PricingPageClient />
    </>
  )
}
