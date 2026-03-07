/**
 * Speakable JSON-LD コンポーネント
 * Google SGE・音声検索向けに、AI要約に引用されやすいコンテンツ領域を明示する。
 * https://schema.org/speakable
 */

interface SpeakableJsonLdProps {
  /** xPath か cssSelector のどちらか一方を指定する */
  cssSelector?: string[]
  xPath?: string[]
  pageUrl: string
}

export function SpeakableJsonLd({ cssSelector, xPath, pageUrl }: SpeakableJsonLdProps) {
  const speakable: Record<string, unknown> = {
    "@type": "SpeakableSpecification",
  }
  if (cssSelector && cssSelector.length > 0) speakable.cssSelector = cssSelector
  if (xPath && xPath.length > 0) speakable.xpath = xPath

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: pageUrl,
    speakable,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
