type HowToStep = {
    name: string
    text: string
    image?: string
}

type HowToProps = {
    name: string
    description: string
    totalTime?: string
    steps: HowToStep[]
}

export function HowToJsonLd({ name, description, totalTime, steps }: HowToProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name,
        description,
        ...(totalTime && { totalTime }),
        step: steps.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.name,
            text: step.text,
            ...(step.image && {
                image: {
                    '@type': 'ImageObject',
                    url: step.image,
                },
            }),
        })),
        tool: [
            {
                '@type': 'HowToTool',
                name: '改葬許可申請書',
            },
            {
                '@type': 'HowToTool',
                name: '受入証明書',
            },
            {
                '@type': 'HowToTool',
                name: '埋葬証明書',
            },
        ],
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}

// 改葬手続きの手順データ
export const kaisouHowToSteps: HowToStep[] = [
    {
        name: 'Step 1: 受入証明書の取得',
        text: '新しい納骨先（永代供養墓・納骨堂・樹木葬など）から「受入証明書」を発行してもらいます。新しい供養先が決まっていない場合は、先に改葬後の納骨先を決める必要があります。',
    },
    {
        name: 'Step 2: 埋葬証明書の取得',
        text: '現在のお墓の管理者（寺院の住職・霊園管理事務所など）から「埋葬証明書」を発行してもらいます。すでに火葬されている場合は「収蔵証明書」が必要になる場合があります。',
    },
    {
        name: 'Step 3: 改葬許可申請書の提出',
        text: '現在のお墓がある市区町村役所に「改葬許可申請書」を提出します。受入証明書と埋葬証明書を添付して申請すると「改葬許可証」が発行されます。役所によっては窓口への持参か郵送が必要です。',
    },
    {
        name: 'Step 4: 墓石の撤去工事（お墓じまい）',
        text: '改葬許可証が発行されたら、石材店に依頼して墓石の解体・撤去・整地を行います。撤去後は墓地の原状回復（区画の返還）まで行います。',
    },
    {
        name: 'Step 5: 遺骨の取り出しと新しい供養先への納骨',
        text: 'ご遺骨を丁寧に取り出し、改葬許可証とともに新しい供養先へお届けします。海洋散骨の場合は専門業者に依頼して適切に行います。',
    },
]
