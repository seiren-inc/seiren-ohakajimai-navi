export function OrganizationJsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: '株式会社清蓮',
        url: 'https://www.osohiki-navi.jp',
        logo: 'https://www.osohiki-navi.jp/logo.png',
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+81-3-0000-0000',
            contactType: 'customer service',
            areaServed: 'JP',
            availableLanguage: 'Japanese',
        },
        sameAs: [
            'https://twitter.com/seiren_official',
            'https://facebook.com/seiren_official',
        ],
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
