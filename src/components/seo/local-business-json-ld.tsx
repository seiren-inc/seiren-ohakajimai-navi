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
    hasMap: 'https://www.google.com/maps/place/%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE%E6%B8%85%E8%93%AE/@35.3960962,139.5274523,16z',
    // 半径での商圏エリア（GEO対策: 戸塚駅起点 50km圏内 = 関東全域対応）
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: '35.3960962',
        longitude: '139.5300272',
      },
      geoRadius: '50000',
    },
    parentOrganization: {
      '@id': `${BASE_URL}/#organization`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '28',
      bestRating: '5',
      worstRating: '1',
    },
    // 対象エリア：全47都道府県（GEO検索最適化）
    areaServed: [
      { '@type': 'AdministrativeArea', name: '北海道' },
      { '@type': 'AdministrativeArea', name: '青森県' },
      { '@type': 'AdministrativeArea', name: '岩手県' },
      { '@type': 'AdministrativeArea', name: '宮城県' },
      { '@type': 'AdministrativeArea', name: '秋田県' },
      { '@type': 'AdministrativeArea', name: '山形県' },
      { '@type': 'AdministrativeArea', name: '福島県' },
      { '@type': 'AdministrativeArea', name: '茨城県' },
      { '@type': 'AdministrativeArea', name: '栃木県' },
      { '@type': 'AdministrativeArea', name: '群馬県' },
      { '@type': 'AdministrativeArea', name: '埼玉県' },
      { '@type': 'AdministrativeArea', name: '千葉県' },
      { '@type': 'AdministrativeArea', name: '東京都' },
      { '@type': 'AdministrativeArea', name: '神奈川県' },
      { '@type': 'AdministrativeArea', name: '新潟県' },
      { '@type': 'AdministrativeArea', name: '富山県' },
      { '@type': 'AdministrativeArea', name: '石川県' },
      { '@type': 'AdministrativeArea', name: '福井県' },
      { '@type': 'AdministrativeArea', name: '山梨県' },
      { '@type': 'AdministrativeArea', name: '長野県' },
      { '@type': 'AdministrativeArea', name: '岐阜県' },
      { '@type': 'AdministrativeArea', name: '静岡県' },
      { '@type': 'AdministrativeArea', name: '愛知県' },
      { '@type': 'AdministrativeArea', name: '三重県' },
      { '@type': 'AdministrativeArea', name: '滋賀県' },
      { '@type': 'AdministrativeArea', name: '京都府' },
      { '@type': 'AdministrativeArea', name: '大阪府' },
      { '@type': 'AdministrativeArea', name: '兵庫県' },
      { '@type': 'AdministrativeArea', name: '奈良県' },
      { '@type': 'AdministrativeArea', name: '和歌山県' },
      { '@type': 'AdministrativeArea', name: '鳥取県' },
      { '@type': 'AdministrativeArea', name: '島根県' },
      { '@type': 'AdministrativeArea', name: '岡山県' },
      { '@type': 'AdministrativeArea', name: '広島県' },
      { '@type': 'AdministrativeArea', name: '山口県' },
      { '@type': 'AdministrativeArea', name: '徳島県' },
      { '@type': 'AdministrativeArea', name: '香川県' },
      { '@type': 'AdministrativeArea', name: '愛媛県' },
      { '@type': 'AdministrativeArea', name: '高知県' },
      { '@type': 'AdministrativeArea', name: '福岡県' },
      { '@type': 'AdministrativeArea', name: '佐賀県' },
      { '@type': 'AdministrativeArea', name: '長崎県' },
      { '@type': 'AdministrativeArea', name: '熊本県' },
      { '@type': 'AdministrativeArea', name: '大分県' },
      { '@type': 'AdministrativeArea', name: '宮崎県' },
      { '@type': 'AdministrativeArea', name: '鹿児島県' },
      { '@type': 'AdministrativeArea', name: '沖縄県' },
      { '@type': 'Country', name: '日本' },
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
      areaServed: { '@type': 'Country', name: '日本' },
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
