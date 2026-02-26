import { constructMetadata } from "@/lib/seo"
import HomepageClient from "@/components/home/HomepageClient"
import { FaqJsonLd, homepageFaqs } from "@/components/seo/faq-json-ld"

export const metadata = constructMetadata({
  title: "お墓じまい・改葬手続きならお墓じまいナビ｜墓じまい・墓石撤去・全国対応",
  description:
    "お墓じまい・改葬・墓じまい・墓石撤去なら株式会社清蓮運営のお墓じまいナビ。改葬手続きの案内・書類サポート、提携行政書士のご紹介、墓石撤去工事、遺骨ケア、離檀交渉サポート、改葬許可申請、海洋散骨まで全国対応。24時間受付・お見積り無料。",
  image: "/og-image.jpg",
})

export const revalidate = 86400

export default function TopPage() {
  return (
    <>
      <FaqJsonLd faqs={homepageFaqs} />
      <HomepageClient />
    </>
  )
}
