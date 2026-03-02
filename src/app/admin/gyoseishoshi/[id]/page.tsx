import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import {
    updateScrivener,
    toggleApproval,
    toggleActive,
    toggleComplaintFlag,
    updatePaymentStatus,
    deleteScrivener,
} from "@/actions/admin/scrivener-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PREFECTURES } from "@/lib/prefectures"
import Link from "next/link"
import { ArrowLeft, AlertTriangle, CreditCard } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { StripeCheckoutButton } from "@/components/admin/StripeCheckoutButton"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function ScrivenerDetailPage(props: PageProps) {
    const params = await props.params
    const scrivener = await db.administrativeScrivener.findUnique({
        where: { id: params.id },
    })

    if (!scrivener) notFound()

    const updateWithId = updateScrivener.bind(null, scrivener.id)
    const approveAction = toggleApproval.bind(null, scrivener.id, !scrivener.isApproved)
    const activeAction = toggleActive.bind(null, scrivener.id, !scrivener.isActive)
    const complaintAction = toggleComplaintFlag.bind(null, scrivener.id, !scrivener.complaintFlag)
    const deleteAction = deleteScrivener.bind(null, scrivener.id)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/gyoseishoshi">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        一覧に戻る
                    </Link>
                </Button>
                <h2 className="text-2xl font-bold tracking-tight">行政書士 詳細</h2>
            </div>

            {/* ステータスバー */}
            <div className="flex items-center gap-3 flex-wrap rounded-lg border bg-white p-4">
                <Badge variant={scrivener.isApproved ? "default" : "destructive"}>
                    {scrivener.isApproved ? "承認済" : "未承認"}
                </Badge>
                <Badge variant={scrivener.isActive ? "default" : "outline"}>
                    {scrivener.isActive ? "公開中" : "停止中"}
                </Badge>
                <Badge variant="secondary">{scrivener.planType}</Badge>
                <Badge variant={scrivener.paymentStatus === "PAID" ? "default" : "destructive"}>
                    {scrivener.paymentStatus === "PAID" ? "支払済" : scrivener.paymentStatus === "UNPAID" ? "未払い" : "停止"}
                </Badge>
                {scrivener.complaintFlag && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> 苦情あり
                    </Badge>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                    登録: {format(scrivener.createdAt, "yyyy/MM/dd HH:mm", { locale: ja })}
                    {" / "}
                    更新: {format(scrivener.updatedAt, "yyyy/MM/dd HH:mm", { locale: ja })}
                </span>
            </div>

            {/* クイックアクション */}
            <div className="flex gap-3 flex-wrap">
                <form action={approveAction}>
                    <Button variant={scrivener.isApproved ? "outline" : "default"} size="sm">
                        {scrivener.isApproved ? "承認取消" : "承認する"}
                    </Button>
                </form>
                <form action={activeAction}>
                    <Button variant={scrivener.isActive ? "outline" : "default"} size="sm">
                        {scrivener.isActive ? "掲載停止" : "掲載再開"}
                    </Button>
                </form>
                <form action={complaintAction}>
                    <Button variant={scrivener.complaintFlag ? "outline" : "destructive"} size="sm">
                        {scrivener.complaintFlag ? "苦情解除" : "苦情フラグ"}
                    </Button>
                </form>

                {/* 支払い更新（Doc-10 §8） */}
                <div className="flex gap-2 items-center border rounded-lg px-3 py-1">
                    <span className="text-xs text-muted-foreground">支払い:</span>
                    {(["UNPAID", "PAID", "SUSPENDED"] as const).map((status) => (
                        <form key={status} action={updatePaymentStatus.bind(null, scrivener.id, status)}>
                            <Button
                                variant={scrivener.paymentStatus === status ? "default" : "ghost"}
                                size="sm"
                                className="text-xs h-7 px-2"
                            >
                                {status === "PAID" ? "支払済" : status === "UNPAID" ? "未払い" : "停止"}
                            </Button>
                        </form>
                    ))}
                </div>

                {/* Doc-17 §5-1: 論理削除 */}
                <form action={deleteAction} className="ml-auto">
                    <Button variant="destructive" size="sm">
                        論理削除
                    </Button>
                </form>
            </div>

            {/* Stripe 決済リンク発行 */}
            <div className="rounded-lg border bg-white p-4 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold">Stripe 決済リンク発行</h3>
                    {scrivener.paymentStatus === "PAID" && (
                        <span className="text-xs text-emerald-600 font-medium">（支払済）</span>
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    プラン: <strong>{scrivener.planType}</strong>　
                    {scrivener.stripeSubscriptionId && (
                        <span>Subscription ID: {scrivener.stripeSubscriptionId}</span>
                    )}
                </p>
                <StripeCheckoutButton
                    scrivenerId={scrivener.id}
                    disabled={!scrivener.isApproved}
                />
                {!scrivener.isApproved && (
                    <p className="text-xs text-amber-600">※ 承認後に決済リンクを発行できます</p>
                )}
            </div>

            {/* 編集フォーム */}
            <form action={updateWithId} className="max-w-2xl space-y-6 rounded-lg border bg-white p-6">
                <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">基本情報</h3>
                    <div>
                        <label className="text-sm font-medium">事務所名 <span className="text-red-500">*</span></label>
                        <Input name="officeName" required defaultValue={scrivener.officeName} className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">代表者名</label>
                        <Input name="representativeName" defaultValue={scrivener.representativeName || ""} className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">登録番号</label>
                        <Input name="registrationNumber" defaultValue={scrivener.registrationNumber || ""} placeholder="例: 第12345号" className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">都道府県 <span className="text-red-500">*</span></label>
                            <Select name="prefecture" defaultValue={scrivener.prefecture}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {PREFECTURES.map((p) => (
                                        <SelectItem key={p.code} value={p.name}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">市区町村</label>
                            <Input name="city" defaultValue={scrivener.city || ""} className="mt-1" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium">住所</label>
                        <Input name="addressLine" defaultValue={scrivener.addressLine || ""} className="mt-1" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">連絡先</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">電話番号</label>
                            <Input name="phone" defaultValue={scrivener.phone || ""} className="mt-1" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">メール</label>
                            <Input name="email" type="email" defaultValue={scrivener.email || ""} className="mt-1" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium">ウェブサイトURL</label>
                        <Input name="websiteUrl" type="url" defaultValue={scrivener.websiteUrl || ""} className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">営業時間</label>
                        <Input name="businessHours" defaultValue={scrivener.businessHours || ""} placeholder="例: 平日 9:00〜18:00" className="mt-1" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">掲載情報</h3>
                    <div>
                        <label className="text-sm font-medium">プロフィール <span className="text-red-500">*</span></label>
                        <Textarea name="profileText" required defaultValue={scrivener.profileText} className="mt-1 min-h-[100px]" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">得意分野（カンマ区切り）</label>
                        <Input name="specialties" defaultValue={scrivener.specialties?.join(", ") || ""} className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">料金目安</label>
                        <Input name="priceRangeText" defaultValue={scrivener.priceRangeText || ""} className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">プラン</label>
                            <Select name="planType" defaultValue={scrivener.planType}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BASIC">ベーシック</SelectItem>
                                    <SelectItem value="STANDARD">スタンダード</SelectItem>
                                    <SelectItem value="PREMIUM">プレミアム</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">優先スコア</label>
                            <Input name="priorityScore" type="number" defaultValue={scrivener.priorityScore} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* 契約情報（Doc-18 §5） */}
                <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">契約情報</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Stripe Subscription ID</label>
                            <Input
                                name="stripeSubscriptionId"
                                defaultValue={scrivener.stripeSubscriptionId || ""}
                                placeholder="sub_..."
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Stripe 支払期限 (current_period_end)</label>
                            <p className="mt-2 text-sm font-medium text-emerald-700">
                                {scrivener.currentPeriodEnd
                                    ? format(scrivener.currentPeriodEnd, "yyyy/MM/dd HH:mm", { locale: ja })
                                    : "未設定"}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">契約開始日</label>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {scrivener.contractStartDate
                                    ? format(scrivener.contractStartDate, "yyyy/MM/dd", { locale: ja })
                                    : "未設定"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">契約終了日</label>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {scrivener.contractEndDate
                                    ? format(scrivener.contractEndDate, "yyyy/MM/dd", { locale: ja })
                                    : "未設定"}
                            </p>
                        </div>
                    </div>
                </div>

                <Button type="submit" className="w-full">保存する</Button>
            </form>
        </div>
    )
}
