import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { constructMetadata } from "@/lib/seo"
import { Phone, Mail, FileText, CheckCircle2, ArrowRight, MapPin, Milestone, Building2, HelpCircle, Download } from "lucide-react"

export const metadata = constructMetadata({
    title: "お墓じまいナビ｜全国対応・ワンストップの改葬代行サービス",
    description: "【全国対応】面倒な改葬手続きから墓石撤去、新しい供養先（永代供養・散骨・粉骨）の手配まで、お墓じまいのすべてをワンストップでサポートします。株式会社清蓮が運営。",
    image: "/og-image-home.jpg",
})

export default function TopPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 bg-gradient-to-b from-blue-50/50 to-white overflow-hidden">
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
                        <Badge variant="secondary" className="px-4 py-2 text-primary bg-primary/10 hover:bg-primary/20 transition-colors">
                            全国対応・行政手続き代行・墓石撤去・供養まで
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 pb-2">
                            お墓じまいのすべてを、<br className="hidden sm:inline" />プロにお任せ。
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-[42rem] leading-relaxed mx-auto">
                            面倒な「改葬許可申請」から、石材店の手配、遺骨の取り出し、そして新しい供養先まで。<br className="hidden md:inline" />
                            株式会社清蓮がワンストップでサポートします。
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto pt-4">
                            <Button size="lg" className="w-full text-lg h-14 shadow-lg shadow-primary/20" asChild>
                                <Link href="/contact">
                                    <Mail className="mr-2 h-5 w-5" /> 無料相談・お見積り
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="w-full text-lg h-14 bg-white/80 hover:bg-white" asChild>
                                <a href="tel:0120-000-000">
                                    <Phone className="mr-2 h-5 w-5" /> 0120-000-000
                                </a>
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground pt-2">
                            ※ お電話は24時間365日受付中
                        </p>
                    </div>
                </div>
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
                    <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-100 blur-3xl opacity-50 animate-pulse" />
                    <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-slate-100 blur-3xl opacity-50" />
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-20 bg-white">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">選ばれる3つの理由</h2>
                        <p className="text-muted-foreground text-lg">安さだけではありません。確かな実績と安心のサポート体制。</p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        <Card className="border-none shadow-lg bg-slate-50/50">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">全国対応 & 提携石材店網</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    日本全国どこのお墓でも対応可能。独自のネットワークで、地域ごとの条例や慣習に精通した優良石材店を手配します。
                                </CardDescription>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-lg bg-slate-50/50">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">完全ワンストップ</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    行政手続きの代行から、墓石の解体・撤去、遺骨の取り出し、そして永代供養や散骨の手配まで、窓口ひとつで完結します。
                                </CardDescription>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-lg bg-slate-50/50">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">多数の実績と信頼</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    株式会社清蓮は長年にわたり供養サービスを提供。累計対応件数についてはお問い合わせください。安心してお任せいただけます。
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Service Section */}
            <section className="py-20 bg-slate-50">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">サービス内容</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            お墓じまいに関わるすべての工程をサポートします。
                        </p>
                    </div>
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div className="space-y-8">
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 mt-1">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">行政手続き代行</h3>
                                    <p className="text-muted-foreground">面倒な「改葬許可申請」の手続きを完全代行。自治体ごとの複雑な要件もスムーズにクリアします。</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 mt-1">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">墓石の撤去・解体</h3>
                                    <p className="text-muted-foreground">現地確認の上、適正価格で施工いたします。撤去後の整地・原状回復も確実に行います。</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 mt-1">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">遺骨サポート（洗骨・粉骨）</h3>
                                    <p className="text-muted-foreground">取り出したお骨の洗浄や、容量を減らす粉骨サービスも自社ラボにて対応可能です。</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 mt-1">
                                    4
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">新しい供養先の手配</h3>
                                    <p className="text-muted-foreground">永代供養墓、樹木葬、海洋散骨、手元供養（ダイヤモンド葬など）まで、ご希望に沿った供養先をご提案します。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Flow Section */}
            <section className="py-20 bg-white">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div className="text-left">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">ご依頼の流れ</h2>
                            <p className="text-muted-foreground text-lg">お問い合わせから完了まで、専任スタッフが伴走します。</p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/flow">詳しく見る <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-5 text-center">
                        {['無料相談', '現地調査・見積', 'ご契約', '行政手続き', '工事・完了'].map((step, i) => (
                            <div key={i} className="relative p-6 rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col items-center">
                                <div className="text-4xl font-bold text-slate-100 mb-2 absolute top-2 right-4">{i + 1}</div>
                                <Milestone className="h-8 w-8 text-primary mb-4 relative z-10" />
                                <h3 className="font-bold relative z-10">{step}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Price Section */}
            <section className="py-20 bg-slate-50">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">料金について</h2>
                        <p className="text-muted-foreground text-lg">明確な料金体系で、追加費用の不安を解消します。</p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle>お墓じまい・改葬代行</CardTitle>
                                <CardDescription>墓石の撤去工事費は現地調査の上、お見積りいたします。</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold mb-4">
                                    <span className="text-lg font-normal text-muted-foreground">行政手続き代行</span> 5.5万円<span className="text-lg font-normal text-muted-foreground">〜</span>
                                </div>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>・改葬許可申請書の作成代行</li>
                                    <li>・受入証明書の手配サポート</li>
                                    <li>・埋葬証明書の取得サポート</li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card className="bg-primary text-primary-foreground">
                            <CardHeader>
                                <CardTitle className="text-white">お見積り・現地調査</CardTitle>
                                <CardDescription className="text-blue-100">全国どこでも無料で対応いたします。</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold mb-6">
                                    0円
                                </div>
                                <Button variant="secondary" size="lg" className="w-full font-bold" asChild>
                                    <Link href="/contact">無料見積もりを依頼する</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="text-center mt-10">
                        <Button variant="link" asChild>
                            <Link href="/price">料金詳細を見る <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Download Section (Hub) */}
            <section className="py-20 bg-blue-900 text-white">
                <div className="container px-4 md:px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">ご自分で手続きされる方へ</h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                        全国の自治体の改葬許可申請書ダウンロード先や書き方の情報をまとめています。<br />
                        まずはご自身で調べてみたい方は、こちらをご活用ください。
                    </p>
                    <Button size="lg" variant="secondary" asChild>
                        <Link href="/kaissou">
                            <Download className="mr-2 h-4 w-4" /> 全国の改葬手続き情報を見る
                        </Link>
                    </Button>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="container px-4 md:px-6 max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">よくあるご質問</h2>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>遠方に住んでいて立ち会えませんが、依頼できますか？</AccordionTrigger>
                            <AccordionContent>
                                はい、可能です。現地での立ち会いが難しい場合でも、写真等で状況をご報告しながら作業を進めさせていただきます。
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>お寺との離檀交渉も代行してもらえますか？</AccordionTrigger>
                            <AccordionContent>
                                はい、サポート可能です。長年の経験に基づき、円満な離檀が進むようアドバイスや代行をさせていただきます（※別途オプションとなる場合があります）。
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>費用はいつ支払えばよいですか？</AccordionTrigger>
                            <AccordionContent>
                                基本的には、ご契約時に着手金、工事完了後に残金のお支払いをお願いしております。詳細はお見積り時にご案内いたします。
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>遺骨のみの移動（引っ越し）もお願いできますか？</AccordionTrigger>
                            <AccordionContent>
                                はい、可能です。墓石の撤去を伴わない、ご遺骨の移動（改葬）手続きや搬送のみのご依頼も承っております。
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>

            {/* Company Links Section */}
            <section className="py-16 bg-slate-50 border-t">
                <div className="container px-4 md:px-6 text-center">
                    <h3 className="text-lg font-bold mb-8 text-muted-foreground">関連サービス</h3>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                        <a href="#" className="font-semibold text-slate-600 hover:text-primary transition-colors">海洋散骨クルーズ</a>
                        <a href="#" className="font-semibold text-slate-600 hover:text-primary transition-colors">遺骨サポートLab</a>
                        <a href="#" className="font-semibold text-slate-600 hover:text-primary transition-colors">お墓じまいナビ</a>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container px-4 md:px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">まずはお気軽にご相談ください</h2>
                    <p className="text-slate-300 mb-10 text-lg">
                        お見積りは無料です。無理な勧誘は一切いたしません。
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
                        <Button size="lg" variant="secondary" className="w-[80%] sm:w-full h-14 text-lg font-bold mx-auto" asChild>
                            <Link href="/contact">
                                <Mail className="mr-2 h-5 w-5" /> 無料相談・お見積りフォーム
                            </Link>
                        </Button>
                    </div>
                    <div className="mt-8">
                        <p className="text-sm text-slate-400 mb-2">お電話でのご相談（24時間受付）</p>
                        <a href="tel:0120-000-000" className="text-3xl font-bold hover:text-blue-300 transition-colors">
                            0120-000-000
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
