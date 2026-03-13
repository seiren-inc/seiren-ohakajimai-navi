/**
 * VideoObject JSON-LD コンポーネント
 * Google動画検索・AI検索向けに動画コンテンツの情報を提供する。
 * https://schema.org/VideoObject
 */

interface VideoJsonLdProps {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  /** ISO 8601 形式（例: "PT5M30S" = 5分30秒） */
  duration?: string
  contentUrl?: string
  embedUrl?: string
  pageUrl: string
}

export function VideoJsonLd({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl,
  embedUrl,
  pageUrl,
}: VideoJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl,
    uploadDate,
    ...(duration && { duration }),
    ...(contentUrl && { contentUrl }),
    ...(embedUrl && { embedUrl }),
    publisher: {
      "@type": "Organization",
      name: "株式会社清蓮",
      logo: {
        "@type": "ImageObject",
        url: "https://www.ohakajimai-navi.jp/og-image.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
