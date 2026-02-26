export function OrganizationJsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': ['Organization', 'LocalBusiness'],
        '@id': 'https://www.osohiki-navi.jp/#organization',
        name: '株式会社清蓮',
        alternateName: ['お墓じまいナビ', 'Seiren'],
        description: 'お墓じまい・改葬・海洋散骨など供養に関わる実務を専門に行う会社。法令遵守を最優先に、全国対応でご家族の不安に寄り添います。',
        url: 'https://www.osohiki-navi.jp',
        logo: {
            '@type': 'ImageObject',
            url: 'https://www.osohiki-navi.jp/og-image.jpg',
        },
        image: 'https://www.osohiki-navi.jp/og-image.jpg',
        telephone: '045-881-9952',
        email: 'contact@seiren.ne.jp',
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
            latitude: '35.395',
            longitude: '139.534',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '045-881-9952',
            contactType: 'customer service',
            areaServed: 'JP',
            availableLanguage: 'Japanese',
            hoursAvailable: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                    'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                    'Friday', 'Saturday', 'Sunday',
                ],
                opens: '00:00',
                closes: '23:59',
            },
        },
        areaServed: {
            '@type': 'Country',
            name: '日本',
        },
        serviceType: [
            'お墓じまい', '改葬', '海洋散骨', '墓石撤去', '遺骨供養',
            '改葬手続きサポート', '離檀交渉サポート', '洗骨', '粉骨',
        ],
        foundingDate: '2008-08-06',
        employee: {
            '@type': 'Person',
            name: '眞如 理恵',
            jobTitle: '代表取締役',
        },
        sameAs: [
            'https://line.me/R/ti/p/@956lieqb',
            'https://www.instagram.com/sankotu.cruise_seiren',
            'https://www.facebook.com/seirenjapan',
        ],
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'お墓じまいサービス一覧',
            itemListElement: [
                {
                    '@type': 'Offer',
                    name: '改葬手続きサポート',
                    description: '改葬許可申請に必要な書類の取得方法・記入ポイントをご案内',
                },
                {
                    '@type': 'Offer',
                    name: '墓石撤去工事',
                    description: '全国の提携石材店による墓石解体・撤去・整地',
                },
                {
                    '@type': 'Offer',
                    name: '海洋散骨',
                    description: '東京湾・相模湾などでの海洋散骨手配',
                },
                {
                    '@type': 'Offer',
                    name: '遺骨の洗骨・粉骨',
                    description: '取り出したご遺骨の洗骨・粉骨・容器への納め替え',
                },
            ],
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
