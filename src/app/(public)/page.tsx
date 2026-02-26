import { constructMetadata } from "@/lib/seo"
import HomepageClient from "@/components/home/HomepageClient"
import Script from "next/script"

export const metadata = constructMetadata({
  title: "お墓じまいナビ | 全国対応・改葬手続き案内から供養まで - 株式会社清蓮",
  description:
    "お墓じまいの全工程をワンストップサポート。改葬手続きの案内、提携行政書士のご紹介、墓石撤去、遺骨ケア、新しい供養先まで。24時間受付・お見積り無料。",
  image: "/og/homepage.jpg",
})

export const revalidate = 86400

export default function TopPage() {
  return (
    <>
      <HomepageClient />
    </>
  )
}
