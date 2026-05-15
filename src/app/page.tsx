import { constructMetadata } from "@/lib/seo"
import HomepageClient from "@/components/home/HomepageClient"
import { FaqJsonLd, homepageFaqs } from "@/components/seo/faq-json-ld"
import { ServiceJsonLd } from "@/components/seo/service-json-ld"
import { DefinedTermSetJsonLd } from "@/components/seo/defined-term-json-ld"
import { OrganizationJsonLd } from '@/components/seo/organization-json-ld'
import { WebSiteJsonLd } from '@/components/seo/website-json-ld'
import { LocalBusinessJsonLd } from '@/components/seo/local-business-json-ld'
import { SpeakableJsonLd } from '@/components/seo/speakable-json-ld'

export const metadata = constructMetadata({
  title: "お墓じまい・改葬手続きならお墓じまいナビ｜墓じまい・墓石撤去・全国対応",
  description:
    "お墓じまいの相談先が見つからない方へ。手続き案内から墓石撤去・離檀交渉・遺骨ケアまで一括サポート。株式会社清蓮（全国47都道府県対応）。改葬実績300件以上・24時間受付・お見積り無料。",
  image: "/og-image.jpg",
  path: "/",
})

export const revalidate = 86400

export default function TopPage() {
  return (
    <>
      <FaqJsonLd faqs={homepageFaqs} />
      <ServiceJsonLd />
      <DefinedTermSetJsonLd />
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <LocalBusinessJsonLd />
      <SpeakableJsonLd
        pageUrl="https://www.ohakajimai-navi.jp"
        cssSelector={["h1", ".typography-heading", "[data-speakable]"]}
      />
      <HomepageClient />
    </>
  )
}
