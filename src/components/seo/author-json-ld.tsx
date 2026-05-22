/**
 * Author JSON-LD コンポーネント（E-E-A-T強化）
 * 記事の著者・監修者情報をGoogleに伝え、コンテンツの専門性・権威性を示す。
 */

interface AuthorJsonLdProps {
  pageUrl: string
  headline: string
  description: string
  datePublished?: string
  dateModified?: string
}

export function AuthorJsonLd({
  pageUrl,
  headline,
  description,
  datePublished = "2024-10-01",
  dateModified,
}: AuthorJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: pageUrl,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Organization",
      name: "株式会社清蓮",
      url: "https://www.ohakajimai-navi.jp",
      logo: "https://www.ohakajimai-navi.jp/og-image.jpg",
    },
    publisher: {
      "@type": "Organization",
      name: "株式会社清蓮",
      url: "https://www.ohakajimai-navi.jp",
      logo: "https://www.ohakajimai-navi.jp/og-image.jpg",
    },
    image: "https://www.ohakajimai-navi.jp/og-image.jpg",
    // 監修者情報（専門家によるレビューを明示）
    reviewedBy: {
      "@type": "Person",
      name: "眞如 理恵",
      jobTitle: "代表取締役",
      description: "株式会社清蓮 代表取締役。2008年創業。お墓じまい・改葬・海洋散骨の実務を専門とし、全国対応のワンストップサービスを提供。法令遵守を最優先に、ご家族に寄り添うサポートを行っている。",
      url: "https://www.ohakajimai-navi.jp/company",
      sameAs: [
        "https://www.seiren-inc.co.jp",
      ],
      knowsAbout: [
        "お墓じまい", "改葬", "海洋散骨", "墓石撤去工事", "離檀交渉",
        "改葬許可申請", "粉骨", "洗骨", "永代供養",
      ],
      worksFor: {
        "@type": "Organization",
        name: "株式会社清蓮",
        url: "https://www.ohakajimai-navi.jp",
      },
    },
    inLanguage: "ja-JP",
    isPartOf: {
      "@type": "WebSite",
      name: "お墓じまいナビ",
      url: "https://www.ohakajimai-navi.jp",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
