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
      logo: {
        "@type": "ImageObject",
        url: "https://www.ohakajimai-navi.jp/og-image.jpg",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "株式会社清蓮",
      url: "https://www.ohakajimai-navi.jp",
      logo: {
        "@type": "ImageObject",
        url: "https://www.ohakajimai-navi.jp/og-image.jpg",
      },
    },
    // 監修者情報（専門家によるレビューを明示）
    reviewedBy: {
      "@type": "Person",
      name: "眞如 理恵",
      jobTitle: "代表取締役",
      worksFor: {
        "@type": "Organization",
        name: "株式会社清蓮",
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
