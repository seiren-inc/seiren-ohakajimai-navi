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
                                src="/logo2.png"
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
                <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Seiren Co., Ltd. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
