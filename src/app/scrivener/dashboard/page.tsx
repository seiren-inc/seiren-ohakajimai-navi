import { constructMetadata } from "@/lib/seo"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createScrivenerPortalSession } from "@/actions/scrivener/payment"
import { signOutScrivener } from "@/actions/scrivener/auth"
import { ScrivenerRealtimeInquiries } from "@/components/scrivener/ScrivenerRealtimeInquiries"
import { PasskeyManager } from "@/components/scrivener/PasskeyManager"
import { LogOut, ExternalLink, UserCircle, CreditCard, Clock, Shield } from "lucide-react"

export const metadata = constructMetadata({
    title: "マイページ（ダッシュボード）｜お墓じまいナビ",
    description: "行政書士向けの各種管理を行います",
    noIndex: true,
})

export default async function ScrivenerDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/scrivener/login')
    }

    const scrivener = await prisma.administrativeScrivener.findUnique({
        where: { authUserId: user.id },
        include: {
            inquiries: {
                orderBy: { createdAt: 'desc' },
                take: 50 // 最新50件
            }
        }
    })

    if (!scrivener) {
        redirect('/scrivener/signup')
    }

    // ステータスバッジの表示ロジック
    let StatusBadge = <Badge variant="secondary">設定中</Badge>
    if (scrivener.paymentStatus === 'UNPAID' || scrivener.onboardingStep !== 'APPROVED_ACTIVE') {
        if (scrivener.paymentStatus === 'PAID') {
            StatusBadge = <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="w-3 h-3 justify-center mr-1" />運営審査待ち</Badge>
        } else {
            StatusBadge = <Badge variant="destructive">未決済</Badge>
        }
    } else if (!scrivener.isActive) {
        StatusBadge = <Badge variant="outline">休止中</Badge>
    } else {
        StatusBadge = <Badge className="bg-green-600 hover:bg-green-700">掲載中（アクティブ）</Badge>
    }

    return (
        <div className="flex min-h-[calc(100vh-80px)] bg-slate-50">
            {/* サイドバー（簡易版） */}
            <aside className="hidden w-64 flex-col border-r bg-white md:flex">
                <div className="flex h-16 items-center border-b px-6">
                    <h2 className="text-lg font-semibold tracking-tight text-slate-900">マイページ</h2>
                </div>
                <div className="flex-1 overflow-auto py-4">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-indigo-600 bg-indigo-50 transition-all hover:text-indigo-900">
                            <UserCircle className="h-4 w-4" />
                            ダッシュボード
                        </div>
                        <form action={async () => { "use server"; await createScrivenerPortalSession() }}>
                            <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900">
                                <CreditCard className="h-4 w-4" />
                                決済・プラン管理
                            </button>
                        </form>
                    </nav>
                </div>
                <div className="border-t p-4">
                    <form action={async () => { "use server"; await signOutScrivener() }}>
                        <Button variant="ghost" className="w-full justify-start text-slate-600" type="submit">
                            <LogOut className="mr-2 h-4 w-4" />
                            ログアウト
                        </Button>
                    </form>
                </div>
            </aside>

            {/* メインコンテンツ */}
            {/* Mobile nav bar: サイドバーが hidden の場合にモバイルで表示 */}
            <div className="border-b bg-white md:hidden">
                <nav className="flex overflow-x-auto gap-1 px-3 py-2 scrollbar-hide">
                    <span className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50">
                        <UserCircle className="h-3.5 w-3.5" />ダッシュボード
                    </span>
                    <form action={async () => { "use server"; await createScrivenerPortalSession() }}>
                        <button type="submit" className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
                            <CreditCard className="h-3.5 w-3.5" />決済・プラン管理
                        </button>
                    </form>
                    <form action={async () => { "use server"; await signOutScrivener() }}>
                        <button type="submit" className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
                            <LogOut className="h-3.5 w-3.5" />ログアウト
                        </button>
                    </form>
                </nav>
            </div>
            <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto">
                <div className="mx-auto max-w-5xl space-y-8">
                    
                    {/* ヘッダーエリア */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{scrivener.officeName} 様</h1>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-sm text-slate-500">現在のステータス:</span>
                                {StatusBadge}
                            </div>
                        </div>
                        
                        {scrivener.paymentStatus === 'UNPAID' && (
                            <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                                <a href="/scrivener/onboarding/plan">プランを選択して掲載を申し込む</a>
                            </Button>
                        )}
                        
                        {scrivener.onboardingStep === 'APPROVED_ACTIVE' && (
                            <Button variant="outline" asChild>
                                <a href={`/gyoseishoshi/${scrivener.id}`} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4" /> 掲載ページを確認
                                </a>
                            </Button>
                        )}
                    </div>

                    {/* お知らせ・注意事項アラート */}
                    {scrivener.paymentStatus === 'PAID' && scrivener.onboardingStep !== 'APPROVED_ACTIVE' && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <h3 className="font-semibold text-amber-800">✅ お申し込みありがとうございます</h3>
                            <p className="mt-1 text-sm text-amber-700">
                                現在、運営事務局にてご登録いただいた資格情報などの審査を行っております。<br/>
                                審査には通常1〜3営業日ほどかかります。完了後、自動的にサイトへ掲載され、この画面でリード（お問い合わせ）を確認できるようになります。
                            </p>
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>ご登録情報</CardTitle>
                                <CardDescription>お客様に公開される基本プロフィール</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                    <span className="font-medium text-slate-500">対応エリア</span>
                                    <span className="col-span-2">{scrivener.prefecture} {scrivener.city || ''}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                    <span className="font-medium text-slate-500">得意分野</span>
                                    <span className="col-span-2">{scrivener.specialties?.join(', ') || '未設定'}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="font-medium text-slate-500">プロフィール文</span>
                                    <span className="col-span-2 line-clamp-3 text-slate-700">
                                        {scrivener.profileText || '未設定'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>ご契約プラン</CardTitle>
                                <CardDescription>現在の請求・決済状況</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                    <span className="font-medium text-slate-500">プラン名</span>
                                    <span className="col-span-2 font-semibold text-indigo-700">{scrivener.planType}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                    <span className="font-medium text-slate-500">契約開始日</span>
                                    <span className="col-span-2">
                                        {scrivener.contractStartDate ? format(scrivener.contractStartDate, 'yyyy年MM月dd日') : '-'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="font-medium text-slate-500">次回更新日</span>
                                    <span className="col-span-2">
                                        {scrivener.currentPeriodEnd ? format(scrivener.currentPeriodEnd, 'yyyy年MM月dd日') : '-'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 問い合わせ（リード）一覧表示（リアルタイム通知対応コンポーネント） */}
                    <div className="pt-6 border-t border-slate-200">
                        <ScrivenerRealtimeInquiries initialInquiries={scrivener.inquiries} scrivenerId={scrivener.id} />
                    </div>

                    {/* セキュリティ設定（パスキー管理） */}
                    <div className="pt-6 border-t border-slate-200">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="h-4 w-4 text-slate-400" />
                            <h2 className="text-lg font-semibold text-slate-800">セキュリティ</h2>
                        </div>
                        <PasskeyManager />
                    </div>
                </div>
            </main>
        </div>
    )
}
