const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.ohakajimai-navi.jp'

interface ServiceJsonLdProps {
  services?: {
    name: string
    description: string
    price?: string
    url?: string
  }[]
}

export function ServiceJsonLd({ services }: ServiceJsonLdProps = {}) {
  const defaultServices = [
    {
      name: 'お墓じまい（墓石撤去・整地）',
      description: '現在のお墓の墓石を解体・撤去し、区画を原状回復します。全国対応、追加費用なしの確定見積もりを提供。',
      price: '100000',
      url: `${BASE_URL}/price`,
    },
    {
      name: '改葬許可申請サポート・行政書士紹介',
      description: '改葬に必要な改葬許可申請書の取得方法の案内と、提携行政書士の紹介サービスを提供します。',
      url: `${BASE_URL}/gyoseishoshi`,
    },
    {
      name: '海洋散骨（散骨クルーズ）',
      description: 'お墓じまい後の遺骨を東京湾・相模湾をはじめとした海域に散骨するサービス。チャーター・合同・委託散骨に対応。',
      price: '30000',
      url: `${BASE_URL}/sankotsu`,
    },
    {
      name: '改葬後の供養先コーディネート',
      description: '永代供養墓・樹木葬・納骨堂など、お客様に合った改葬後の供養先の選定・手配をサポートします。',
      url: `${BASE_URL}/kaisougo`,
    },
  ]

  const targetServices = services ?? defaultServices

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'お墓じまいナビ 提供サービス',
    url: BASE_URL,
    itemListElement: targetServices.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        provider: {
          '@type': 'Organization',
          name: '株式会社清蓮',
          url: BASE_URL,
        },
        areaServed: {
          '@type': 'Country',
          name: 'JP',
        },
        ...(service.url && { url: service.url }),
        ...(service.price && {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'JPY',
            price: service.price,
            availability: 'https://schema.org/InStock',
          },
        }),
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
