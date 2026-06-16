import { constructMetadata } from "@/lib/seo"
import HomepageClient from "@/components/home/HomepageClient"
import { FaqJsonLd, homepageFaqs } from "@/components/seo/faq-json-ld"
import { ServiceJsonLd } from "@/components/seo/service-json-ld"
import { DefinedTermSetJsonLd } from "@/components/seo/defined-term-json-ld"
import { OrganizationJsonLd } from '@/components/seo/organization-json-ld'
import { WebSiteJsonLd } from '@/components/seo/website-json-ld'
import { LocalBusinessJsonLd } from '@/components/seo/local-business-json-ld'

export const metadata = constructMetadata({
  title: "お墓じまい・改葬手続きなら清蓮｜墓石撤去・粉骨・納骨先まで全国対応",
  description:
    "お墓じまい・改葬手続き・墓石撤去・粉骨・洗骨・納骨先選びまで清蓮が整理。横浜を拠点に全国対応。無料相談・見積もり受付中。",
  image: "/og-image.jpg",
  path: "/",
})

export default function TopPage() {
  return (
    <>
      <FaqJsonLd faqs={homepageFaqs} />
      <ServiceJsonLd />
      <DefinedTermSetJsonLd />
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <LocalBusinessJsonLd />
      <HomepageClient />
    </>
  )
}
