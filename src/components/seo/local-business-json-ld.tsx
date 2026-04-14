/**
 * LocalBusiness JSON-LD コンポーネント
 * 横浜・湘南エリアの海洋散骨・お墓じまい事業者として
 * Google ローカル検索 / AI 検索向けに構造化データを提供する。
 * https://schema.org/LocalBusiness
 */

const BASE_URL = 'https://www.ohakajimai-navi.jp'

export function LocalBusinessJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${BASE_URL}/#local-business`,
    name: 'お墓じまいナビ（株式会社清蓮）',
    alternateName: ['清蓮', 'Seiren', 'お墓じまいナビ'],
    description:
      '神奈川県横浜市戸塚区を拠点に、お墓じまい・改葬・海洋散骨・離檀交渉・墓石撤去を全国対応でワンストップサポート。横浜・湘南エリアの海洋散骨専門事業者。',
    url: BASE_URL,
    telephone: '045-881-9952',
    email: 'contact@seiren.ne.jp',
    priceRange: 'お見積り無料',
    image: `${BASE_URL}/og-image.jpg`,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/og-image.jpg`,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '戸塚町4170 高橋ビル1階',
      addressLocality: '横浜市戸塚区',
      addressRegion: '神奈川県',
      postalCode: '244-0003',
      addressCountry: 'JP',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '35.3960962',
      longitude: '139.5300272',
    },
    // 対象エリア：横浜・湘南エリアを明示（GEO検索最適化）
    areaServed: [
      {
        '@type': 'City',
        name: '横浜市',
        sameAs: 'https://ja.wikipedia.org/wiki/%E6%A8%AA%E6%B5%9C%E5%B8%82',
      },
      {
        '@type': 'City',
        name: '藤沢市',
        sameAs: 'https://ja.wikipedia.org/wiki/%E8%97%A4%E6%B2%A2%E5%B8%82',
      },
      {
        '@type': 'City',
        name: '茅ヶ崎市',
        sameAs: 'https://ja.wikipedia.org/wiki/%E8%8C%85%E3%83%B6%E5%B4%8E%E5%B8%82',
      },
      {
        '@type': 'City',
        name: '鎌倉市',
        sameAs: 'https://ja.wikipedia.org/wiki/%E9%8E%8C%E5%80%89%E5%B8%82',
      },
      {
        '@type': 'City',
        name: '川崎市',
        sameAs: 'https://ja.wikipedia.org/wiki/%E5%B7%9D%E5%B4%8E%E5%B8%82',
      },
      {
        '@type': 'Country',
        name: '日本',
      },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday', 'Sunday',
      ],
      opens: '09:00',
      closes: '17:00',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '0800-888-8788',
      contactType: 'customer service',
      areaServed: 'JP',
      availableLanguage: 'Japanese',
      contactOption: 'TollFree',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'お墓じまい・海洋散骨サービス一覧',
      itemListElement: [
        {
          '@type': 'Offer',
          name: '海洋散骨（横浜・湘南沖）',
          description:
            '東京湾・相模湾での海洋散骨。チャーター・合同・委託散骨に対応。粉骨サービス込み。',
          url: `${BASE_URL}/sankotsu`,
          areaServed: ['横浜市', '湘南エリア', '全国'],
        },
        {
          '@type': 'Offer',
          name: 'お墓じまい・墓石撤去工事',
          description:
            '全国47都道府県対応。墓石解体・撤去・整地・原状回復まで一括対応。',
          url: `${BASE_URL}/`,
        },
        {
          '@type': 'Offer',
          name: '改葬手続きサポート・行政書士紹介',
          description:
            '改葬許可申請の案内・書類サポート。代理申請が必要な場合は提携行政書士をご紹介。',
          url: `${BASE_URL}/gyoseishoshi`,
        },
        {
          '@type': 'Offer',
          name: '離檀交渉サポート',
          description:
            '寺院・墓地管理者との離檀交渉で詰まりやすいポイントを整理し、円滑化をサポート。',
          url: `${BASE_URL}/ridanryou`,
        },
        {
          '@type': 'Offer',
          name: '遺骨の洗骨・粉骨',
          description:
            '取り出したご遺骨の洗骨・粉骨・改葬先容器への納め替えに対応。',
          url: `${BASE_URL}/`,
        },
      ],
    },
    foundingDate: '2008-08-06',
    sameAs: [
      'https://line.me/R/ti/p/@956lieqb',
      'https://www.instagram.com/sankotu.cruise_seiren',
      'https://www.facebook.com/seirenjapan',
      'https://twitter.com/seiren_official',
      'https://www.google.com/maps/place/%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE%E6%B8%85%E8%93%AE/@35.3960962,139.5274523,16z',
    ],
    knowsAbout: [
      '海洋散骨', 'お墓じまい', '改葬', '墓石撤去工事', '離檀交渉',
      '粉骨', '洗骨', '永代供養', '改葬許可申請書',
      '横浜 海洋散骨', '湘南 散骨', '神奈川 お墓じまい',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
