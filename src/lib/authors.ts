/**
 * コラム・解説ページの執筆・監修者情報の単一ソース（L-3）。
 * 表示用の著者ブロックと ArticleJsonLd（BlogPosting スキーマ）の両方がここを参照する。
 * 氏名表記は「眞如理恵」（スペースなし）に統一 — organization-json-ld の employee と一致させること。
 */

export interface BlogAuthor {
    name: string
    jobTitle?: string
    bio?: string
}

export const CANONICAL_AUTHOR = {
    name: "眞如理恵",
    jobTitle: "代表取締役",
    company: "株式会社清蓮",
    /** 記事下の著者ブロックに表示する紹介文 */
    bio: "2008年の設立以来、お墓じまい・改葬の専門会社として全国のご家族をサポート。法令遵守と誠実な対応を理念に、書類手続きの案内から墓石撤去、海洋散骨までワンストップで支援しています。",
    /** JSON-LD の Person.description 用 */
    schemaDescription:
        "株式会社清蓮 代表取締役。2008年創業。お墓じまい・改葬・海洋散骨の実務を専門とし、全国対応のワンストップサービスを提供。法令遵守を最優先に、ご家族に寄り添うサポートを行っている。",
    url: "https://www.ohakajimai-navi.jp/company",
    sameAs: ["https://www.seiren-inc.co.jp"],
    knowsAbout: [
        "お墓じまい", "改葬", "海洋散骨", "墓石撤去工事", "離檀交渉",
        "改葬許可申請", "粉骨", "洗骨", "永代供養",
    ],
} as const
