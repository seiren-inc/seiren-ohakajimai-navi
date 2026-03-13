import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
    return (
        <footer className="border-t bg-muted/50">
            <div className="container py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <Image
                                src="/web-app-manifest-192x192.png"
                                alt="清蓮 ロゴ"
                                width={28}
                                height={28}
                                className="h-7 w-auto object-contain"
                            />
                            <span className="text-lg font-bold">お墓じまいナビ</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            株式会社清蓮が運営する、改葬手続きから供養までの一括サポートサービス。
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">サービス</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/#kaisou-steps" className="hover:underline">お墓じまいとは</Link></li>
                            <li><Link href="/flow" className="hover:underline">手続きの流れ</Link></li>
                            <li><Link href="/price" className="hover:underline">料金プラン</Link></li>
                            <li><Link href="/gyoseishoshi" className="hover:underline">行政書士マッチング</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">対応エリア</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/kaissou" className="hover:underline">全国対応</Link></li>
                            <li><Link href="/kaissou/tokyo" className="hover:underline">東京都</Link></li>
                            <li><Link href="/kaissou/kanagawa" className="hover:underline">神奈川県</Link></li>
                            <li><Link href="/kaissou/saitama" className="hover:underline">埼玉県</Link></li>
                            <li><Link href="/kaissou/chiba" className="hover:underline">千葉県</Link></li>
                            <li><Link href="/kaissou/osaka" className="hover:underline">大阪府</Link></li>
                            <li><Link href="/kaissou/aichi" className="hover:underline">愛知県</Link></li>
                            <li><Link href="/kaissou/fukuoka" className="hover:underline">福岡県</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">会社情報</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/company" className="hover:underline">運営会社</Link></li>
                            <li><Link href="/privacy" className="hover:underline">プライバシーポリシー</Link></li>
                            <li><Link href="/contact" className="hover:underline">お問い合わせ</Link></li>
                        </ul>
                    </div>
                </div>
                {/* SEOキーワードリンク */}
                <div className="mt-8 pt-6 border-t">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <Link href="/price" className="hover:underline hover:text-foreground">お墓じまい 費用</Link>
                        <Link href="/flow" className="hover:underline hover:text-foreground">改葬手続き 流れ</Link>
                        <Link href="/kaisoukyoka" className="hover:underline hover:text-foreground">改葬許可申請書 ダウンロード</Link>
                        <Link href="/ridanryou" className="hover:underline hover:text-foreground">離檀料 相場</Link>
                        <Link href="/sankotsu" className="hover:underline hover:text-foreground">海洋散骨</Link>
                        <Link href="/kaisougo" className="hover:underline hover:text-foreground">永代供養とは</Link>
                        <Link href="/gyoseishoshi" className="hover:underline hover:text-foreground">行政書士 改葬</Link>
                        <Link href="/column/how-to-get-kaisoukyoka" className="hover:underline hover:text-foreground">改葬許可証 取り方</Link>
                        <Link href="/column/cost-of-hakajimai" className="hover:underline hover:text-foreground">墓じまい 費用相場</Link>
                        <Link href="/column/kaisou-vs-hakajimai" className="hover:underline hover:text-foreground">改葬と墓じまいの違い</Link>
                        <Link href="/about" className="hover:underline hover:text-foreground">お墓じまいとは</Link>
                        <Link href="/column/ridanryou-soba" className="hover:underline hover:text-foreground">離檀料とは</Link>
                        <Link href="/column/kaiyou-sankotsu-guide" className="hover:underline hover:text-foreground">海洋散骨ガイド</Link>
                        <Link href="/column/eitaikuyo-toha" className="hover:underline hover:text-foreground">永代供養 費用</Link>
                        <Link href="/kaissou/tokyo" className="hover:underline hover:text-foreground">東京都 改葬</Link>
                        <Link href="/kaissou/osaka" className="hover:underline hover:text-foreground">大阪府 改葬</Link>
                        <Link href="/kaissou/aichi" className="hover:underline hover:text-foreground">愛知県 改葬</Link>
                        <Link href="/kaissou/fukuoka" className="hover:underline hover:text-foreground">福岡県 改葬</Link>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t space-y-4">
                    {/* E-E-A-T: 信頼性・専門性シグナル */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
                        <div>
                            <p className="font-semibold text-foreground mb-1">専門性・実績</p>
                            <p>2008年創業。改葬・お墓じまい・海洋散骨の専門会社として全国47都道府県で累計多数の実績。代表取締役：眞如 理恵。</p>
                        </div>
                        <div>
                            <p className="font-semibold text-foreground mb-1">法令遵守</p>
                            <p>改葬許可申請の代行は行政書士等の有資格者業務です。当社は申請の案内・書類取得方法の説明・提携行政書士のご紹介を行います。</p>
                        </div>
                        <div>
                            <p className="font-semibold text-foreground mb-1">会社情報</p>
                            <p>株式会社清蓮<br />〒244-0003 神奈川県横浜市戸塚区戸塚町4170 高橋ビル1階<br />TEL: 045-881-9952</p>
                        </div>
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Seiren Co., Ltd. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    )
}
