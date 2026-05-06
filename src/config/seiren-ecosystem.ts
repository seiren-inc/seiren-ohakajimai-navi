/**
 * 清蓮グループ供養・終活エコシステム — 公式URLの単一ソース（SEO実行計画 §1.5）
 * フッター・JSON-LD sameAs・「次のステップ」ブロック・計測 data 属性の参照先はここに集約する。
 */

export const SEIREN_ORGANIZATION_SAME_AS = [
    "https://www.sankotu-cruise.com/",
    "https://ikotsu-lab.com/",
    "https://www.ikotsu.com/",
    "https://www.ohakanavi.jp/",
    "https://www.seiren-inc.co.jp/",
] as const

/** フッター「関連サービス」（表示順・ラベル・アンカーパス固定・計測IDは NextSteps と揃える） */
export const FOOTER_SISTER_SITES = [
    { id: "sankotsu-cruise", href: "https://www.sankotu-cruise.com/", label: "海洋散骨クルーズ" },
    { id: "ikotsu-lab-sankotsu", href: "https://ikotsu-lab.com/sankotu.html", label: "遺骨サポートLab" },
    { id: "ikotsu-com", href: "https://www.ikotsu.com/", label: "遺骨.com" },
    { id: "ohaka-navi", href: "https://www.ohakanavi.jp/", label: "お墓探しナビ" },
] as const

export const SEIREN_CORPORATE_SITE_HREF = "https://www.seiren-inc.co.jp"

export type EcosystemNextStepsContext = "flow" | "sankotsu" | "kaisougo" | "kaisoukyoka"

type NextStepCard = {
    id: string
    href: string
    title: string
    description: string
}

const CRUISE: NextStepCard = {
    id: "sankotsu-cruise",
    href: "https://www.sankotu-cruise.com/",
    title: "海洋散骨クルーズ（別サイト）",
    description: "相模湾・東京湾でのチャーター・合同・代理散骨の公式案内です。",
}

const IKOTSU_LAB: NextStepCard = {
    id: "ikotsu-lab-sankotsu",
    href: "https://ikotsu-lab.com/sankotu.html",
    title: "遺骨サポートLab（別サイト）",
    description: "散骨や遺骨に関するBtoC向けサービス情報です。",
}

const OHAKA_NAVI: NextStepCard = {
    id: "ohaka-navi",
    href: "https://www.ohakanavi.jp/",
    title: "お墓探しナビ（別サイト）",
    description: "全国の納骨堂・樹木葬・永代供養墓などを検索できます。",
}

/** ホーム等のグループ紹介カード — href は単一ソース */
export const ECOSYSTEM_SHOWCASE_CARDS = [
    {
        id: "cruise",
        title: "海洋散骨クルーズ",
        description:
            "自社船で行う、心温まる海洋散骨。相模湾・東京湾を中心に全国対応。",
        href: "https://www.sankotu-cruise.com/",
    },
    {
        id: "ikotsu-lab",
        title: "遺骨サポートLab",
        description:
            "ご遺骨の粉骨・洗骨・乾燥。大切なご遺骨をパウダー状に整えます。",
        href: "https://ikotsu-lab.com/sankotu.html",
    },
    {
        id: "ohaka-navi",
        title: "お墓探しナビ",
        description:
            "全国の納骨堂・樹木葬・永代供養墓を検索。理想の移転先を見つける。",
        href: "https://www.ohakanavi.jp/",
    },
    {
        id: "ikotsu-com",
        title: "遺骨.com（法人）",
        description:
            "士業・葬儀社様向け、ご遺骨の保管・整理・供養のB2Bソリューション。",
        href: "https://www.ikotsu.com/",
    },
] as const

/** コンテキスト別「次のステップ」リンク（過剰な全網羅ではなく計画ページのみ） */
export const ECOSYSTEM_NEXT_STEPS_BY_CONTEXT: Record<EcosystemNextStepsContext, NextStepCard[]> = {
    flow: [CRUISE, OHAKA_NAVI, IKOTSU_LAB],
    sankotsu: [CRUISE, IKOTSU_LAB, OHAKA_NAVI],
    kaisougo: [OHAKA_NAVI, CRUISE, IKOTSU_LAB],
    kaisoukyoka: [
        {
            id: "gyoseishoshi-internal",
            href: "/gyoseishoshi",
            title: "行政書士マッチング（当サイト）",
            description: "申請代行が必要な場合は、提携行政書士のご紹介が可能です。",
        },
        CRUISE,
        OHAKA_NAVI,
    ],
}
