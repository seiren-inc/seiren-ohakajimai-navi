import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { constructMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ExternalLink, Phone, Mail, ArrowRight, Download, AlertTriangle } from "lucide-react"

type PageProps = {
    params: Promise<{ prefecture: string; municipality: string }>
}

async function getMunicipality(prefSlug: string, muniSlug: string) {
    return await prisma.municipality.findFirst({
        where: {
            prefectureSlug: prefSlug,
            municipalitySlug: muniSlug,
            isPublished: true,
        },
    })
}

export async function generateMetadata(props: PageProps) {
    const params = await props.params
    const municipality = await getMunicipality(params.prefecture, params.municipality)

    if (!municipality) return constructMetadata({ title: "ページが見つかりません" })

    return constructMetadata({
        title: `${municipality.name}の改葬許可申請書ダウンロード・手続きガイド`,
        description: `${municipality.prefectureName}${municipality.name}での改葬（お墓じまい）に必要な「改葬許可申請書」のダウンロードや、手続き窓口の情報をまとめています。`,
    })
}

export default async function MunicipalityPage(props: PageProps) {
    const params = await props.params
    const municipality = await getMunicipality(params.prefecture, params.municipality)

    if (!municipality) {
        notFound()
    }

    return (
        <div className="container py-12 px-4 md:px-6">
            <BreadcrumbJsonLd
                items={[
                    { name: "ホーム", url: process.env.NEXT_PUBLIC_BASE_URL || "https://www.osohiki-navi.jp" },
                    { name: "改葬手続き情報", url: `${process.env.NEXT_PUBLIC_BASE_URL}/kaissou` },
                    { name: municipality.prefectureName, url: `${process.env.NEXT_PUBLIC_BASE_URL}/kaissou/${params.prefecture}` },
                    { name: municipality.name, url: `${process.env.NEXT_PUBLIC_BASE_URL}/kaissou/${params.prefecture}/${params.municipality}` },
                ]}
            />

            <div className="grid gap-12 lg:grid-cols-[1fr_350px] max-w-6xl mx-auto">
                {/* Main Content */}
                <div className="space-y-10">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{municipality.name}の改葬手続き</h1>
                        <p className="text-muted-foreground text-lg">
                            {municipality.prefectureName}{municipality.name}でのお墓じまい（改葬）に必要な書類や窓口をご案内します。
                        </p>
                    </div>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold border-b pb-2">1. 改葬許可申請書の入手</h2>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    申請書ダウンロード
                                </CardTitle>
                                <CardDescription>
                                    自治体の公式ページから申請書をダウンロード、または詳細を確認できます。
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {municipality.hasDomainWarning && (
                                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
                                        <AlertTriangle className="h-4 w-4 shrink-0" />
                                        <span>ドメイン要確認（独自ドメインのため、内容が最新であることをご確認ください）</span>
                                    </div>
                                )}

                                {municipality.linkType === 'REGULATION' && (
                                    <div className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                                        例規集リンク
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3">
                                    {municipality.pdfUrl && (
                                        <Button
                                            size="lg"
                                            className="w-full sm:w-auto order-1 sm:order-none"
                                            variant={municipality.linkType === 'PDF' ? "default" : "outline"}
                                            asChild
                                        >
                                            <a href={municipality.pdfUrl} target="_blank" rel="noopener noreferrer">
                                                <Download className="mr-2 h-4 w-4" /> 申請書PDFをダウンロード
                                            </a>
                                        </Button>
                                    )}

                                    {municipality.url && (
                                        <Button
                                            size="lg"
                                            className="w-full sm:w-auto order-2 sm:order-none"
                                            variant={municipality.linkType === 'PDF' ? "outline" : "default"}
                                            asChild
                                        >
                                            <a href={municipality.url} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="mr-2 h-4 w-4" /> {municipality.name} 公式ページへ
                                            </a>
                                        </Button>
                                    )}
                                </div>

                                {!municipality.pdfUrl && !municipality.url && (
                                    <div className="text-sm text-muted-foreground bg-slate-50 p-4 rounded-md">
                                        ※ 現在ダウンロード可能な書類が見つかりませんでした。詳細はお電話や窓口でご確認ください。
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold border-b pb-2">2. 手続きの流れ</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                                    <div className="w-0.5 h-full bg-slate-200 my-2"></div>
                                </div>
                                <div className="pb-8">
                                    <h3 className="font-bold text-lg mb-2">「受入証明書」の取得</h3>
                                    <p className="text-muted-foreground">新しい供養先（お墓、納骨堂、散骨業者など）から、遺骨を受け入れる旨の証明書を発行してもらいます。</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
                                    <div className="w-0.5 h-full bg-slate-200 my-2"></div>
                                </div>
                                <div className="pb-8">
                                    <h3 className="font-bold text-lg mb-2">「埋蔵証明書」の取得</h3>
                                    <p className="text-muted-foreground">現在のお墓の管理者（お寺や霊園）から、遺骨が埋蔵されている事実を証明する署名・捺印をもらいます。</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">「改葬許可証」の交付</h3>
                                    <p className="text-muted-foreground">{municipality.name}の役所に上記書類と申請書を提出し、許可証を受け取ります。</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar CTA */}
                <aside className="space-y-8">
                    <Card className="bg-slate-50 border-primary/20 shadow-md sticky top-24">
                        <CardHeader>
                            <CardTitle className="text-xl text-primary">お墓じまいをまるごと代行</CardTitle>
                            <CardDescription>
                                面倒な役所手続きから、石材店の手配、遺骨の供養先探しまで、プロにお任せしませんか？
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary font-bold">✓</span> 全国どこでも対応
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary font-bold">✓</span> 自治体手続き完全代行
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary font-bold">✓</span> 追加費用なしの明朗会計
                                </li>
                            </ul>
                            <Button className="w-full font-bold h-12 shadow-lg shadow-primary/20" asChild>
                                <Link href="/contact">
                                    <Mail className="mr-2 h-4 w-4" /> 無料相談・お見積り
                                </Link>
                            </Button>
                            <div className="text-center">
                                <p className="text-xs text-muted-foreground mb-1">お電話でも受付中</p>
                                <a href="tel:0120-000-000" className="text-xl font-bold block hover:text-primary transition-colors">
                                    <Phone className="inline mr-1 h-4 w-4" /> 0120-000-000
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    )
}
