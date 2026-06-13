import Image from 'next/image'
import Link from 'next/link'
import { Phone, MapPin } from 'lucide-react'
import {
    FOOTER_SISTER_SITES,
    SEIREN_CORPORATE_SITE_HREF,
} from '@/config/seiren-ecosystem'

const SEO_KEYWORDS: Array<{ href: string; label: string }> = [
    { href: '/price', label: 'お墓じまい 費用' },
    { href: '/flow', label: '改葬手続き 流れ' },
    { href: '/kaisoukyoka', label: '改葬許可申請書 ダウンロード' },
    { href: '/ridanryou', label: '離檀料 相場' },
    { href: '/sankotsu', label: '海洋散骨' },
    { href: '/kaisougo', label: '永代供養とは' },
    { href: '/gyoseishoshi', label: '行政書士 改葬' },
    { href: '/column/how-to-get-kaisoukyoka', label: '改葬許可証 取り方' },
    { href: '/column/cost-of-hakajimai', label: '墓じまい 費用相場' },
    { href: '/column/kaisou-vs-hakajimai', label: '改葬と墓じまいの違い' },
    { href: '/about', label: 'お墓じまいとは' },
    { href: '/column/ridanryou-soba', label: '離檀料とは' },
    { href: '/column/kaiyou-sankotsu-guide', label: '海洋散骨ガイド' },
    { href: '/column/eitaikuyo-toha', label: '永代供養 費用' },
    { href: '/kaissou/tokyo', label: '東京都 改葬' },
    { href: '/kaissou/osaka', label: '大阪府 改葬' },
    { href: '/kaissou/aichi', label: '愛知県 改葬' },
    { href: '/kaissou/fukuoka', label: '福岡県 改葬' },
]

function FooterColumn({
    heading,
    children,
}: {
    heading: string
    children: React.ReactNode
}) {
    return (
        <div>
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-seiren-accent-micro">
                {heading}
            </div>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">{children}</ul>
        </div>
    )
}

export function Footer() {
    return (
        <footer className="border-t border-seiren-border-warm bg-[#F3F0EA] pt-16 text-seiren-body">
            <div className="container">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.9fr_0.9fr_0.9fr_0.9fr]">
                    {/* Brand column */}
                    <div className="space-y-5">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <Image
                                src="/web-app-manifest-192x192.png"
                                alt="清蓮 ロゴ"
                                width={36}
                                height={36}
                                className="h-9 w-auto object-contain"
                            />
                            <span className="flex flex-col leading-[1.2]">
                                <span className="text-[15px] font-semibold text-seiren-main">
                                    お墓じまいナビ
                                </span>
                                <span className="mt-0.5 text-[10px] tracking-[0.16em] text-[#8A8478]">
                                    by 株式会社 清蓮
                                </span>
                            </span>
                        </Link>
                        <p className="max-w-[320px] text-[13px] leading-[1.9] text-[#525762]">
                            2008年創業。横浜を拠点に全国47都道府県の改葬・墓じまいをご支援しています。
                        </p>
                        <div className="flex flex-col gap-2">
                            <a
                                href="tel:0458819952"
                                className="inline-flex items-center gap-2.5 text-[13px] text-seiren-main"
                            >
                                <Phone
                                    size={14}
                                    strokeWidth={1.75}
                                    className="text-seiren-accent"
                                />
                                <span
                                    className="text-[15px] font-bold text-seiren-main"
                                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                                >
                                    045-881-9952
                                </span>
                                <span className="text-[#8A8478]">9:00〜19:00</span>
                            </a>
                            <span className="inline-flex items-center gap-2.5 text-[13px] text-[#525762]">
                                <MapPin
                                    size={14}
                                    strokeWidth={1.75}
                                    className="text-seiren-accent"
                                />
                                〒244-0003 神奈川県横浜市戸塚区戸塚町4170 高橋ビル1階
                            </span>
                        </div>
                    </div>

                    <FooterColumn heading="サービス">
                        <li>
                            <Link
                                href="/#kaisou-steps"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                お墓じまいとは
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/flow"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                手続きの流れ
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/price"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                料金プラン
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/estimation"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                かんたん無料見積もり
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/gyoseishoshi"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                行政書士マッチング
                            </Link>
                        </li>
                    </FooterColumn>

                    <FooterColumn heading="対応エリア">
                        <li>
                            <Link
                                href="/kaissou"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                全国対応
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/kaissou/tokyo"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                東京都
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/kaissou/kanagawa"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                神奈川県
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/kaissou/saitama"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                埼玉県
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/kaissou/chiba"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                千葉県
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/kaissou/osaka"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                大阪府
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/kaissou/aichi"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                愛知県
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/kaissou/fukuoka"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                福岡県
                            </Link>
                        </li>
                    </FooterColumn>

                    <div data-ecosystem-block="footer-related-services">
                        <FooterColumn heading="関連サービス">
                            {FOOTER_SISTER_SITES.map((site) => (
                                <li key={site.href}>
                                    <a
                                        href={site.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                                        data-ecosystem-link={site.id}
                                        data-ecosystem-from="footer-related-services"
                                    >
                                        {site.label}
                                    </a>
                                </li>
                            ))}
                        </FooterColumn>
                    </div>

                    <FooterColumn heading="企業情報">
                        <li>
                            <a
                                href={SEIREN_CORPORATE_SITE_HREF}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                                data-ecosystem-link="seiren-corporate"
                                data-ecosystem-from="footer-company"
                            >
                                株式会社清蓮 企業サイト
                            </a>
                        </li>
                        <li>
                            <Link
                                href="/company"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                運営会社について
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/privacy"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                プライバシーポリシー
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/tokutei"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                特定商取引法に基づく表記
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/terms"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                コンテンツ利用条件
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/contact"
                                className="text-[13px] text-[#525762] hover:text-seiren-main hover:underline"
                            >
                                お問い合わせ
                            </Link>
                        </li>
                    </FooterColumn>
                </div>

                {/* SEO keyword cloud */}
                <div className="mt-14 border-y border-[#E0DAC9] py-7">
                    <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-seiren-accent-micro">
                        よく検索されるトピック
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {SEO_KEYWORDS.map((k) => (
                            <Link
                                key={k.href}
                                href={k.href}
                                className="rounded-full border border-[#E5E0D6] bg-seiren-bg px-3 py-1.5 text-xs text-[#525762] transition-colors duration-200 hover:border-seiren-accent/40 hover:text-seiren-main"
                            >
                                {k.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* E-E-A-T trust signals */}
                <div className="grid grid-cols-1 gap-6 pt-7 md:grid-cols-3">
                    <div className="text-xs text-[#8A8478]">
                        <p className="mb-1 font-semibold text-seiren-main">専門性・実績</p>
                        <p className="leading-[1.85]">
                            2008年創業。改葬・お墓じまい・海洋散骨の専門会社として全国47都道府県で累計多数の実績。代表取締役：眞如 理恵。
                        </p>
                    </div>
                    <div className="text-xs text-[#8A8478]">
                        <p className="mb-1 font-semibold text-seiren-main">法令遵守</p>
                        <p className="leading-[1.85]">
                            改葬許可申請の代行は行政書士等の有資格者業務です。当社は申請の案内・書類取得方法の説明・提携行政書士のご紹介を行います。
                        </p>
                    </div>
                    <div className="text-xs text-[#8A8478]">
                        <p className="mb-1 font-semibold text-seiren-main">会社情報</p>
                        <p className="leading-[1.85]">
                            株式会社清蓮
                            <br />
                            〒244-0003 神奈川県横浜市戸塚区戸塚町4170 高橋ビル1階
                            <br />
                            TEL: 045-881-9952
                        </p>
                    </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#E0DAC9] py-5 text-[11.5px] text-[#8A8478]">
                    <span>
                        © {new Date().getFullYear()} 株式会社 清蓮 / お墓じまいナビ. All rights reserved.
                    </span>
                    <span className="tracking-[0.04em]">SEIREN INC. — YOKOHAMA, JAPAN</span>
                </div>
            </div>
        </footer>
    )
}
