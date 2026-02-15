'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { type Inquiry, InquiryStatus } from "@prisma/client"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { toast } from "sonner"
import { Loader2, ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { updateInquiryStatus, updateInquiryMemo } from "@/actions/admin/inquiry"
import Link from "next/link"

// Status Helper
const statusMap: Record<InquiryStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    NEW: { label: "新規", variant: "destructive" },
    IN_PROGRESS: { label: "対応中", variant: "default" },
    DONE: { label: "完了", variant: "secondary" },
    ARCHIVED: { label: "アーカイブ", variant: "outline" },
}

// Translation Helper for Enums
const translateEnum = (key: string | null | undefined, type: 'Cemetery' | 'Period' | 'Destination' | 'Bone' | 'Container') => {
    if (!key) return "未指定"
    // Simple mapping based on known values (could be centralized)
    // For now, returning the raw key if simple, or we can import the mapping from validation file if allowed
    return key
}

export function InquiryDetail({ inquiry }: { inquiry: Inquiry }) {
    const router = useRouter()
    const [status, setStatus] = useState<InquiryStatus>(inquiry.status)
    const [memo, setMemo] = useState(inquiry.memo || "")
    const [isStatusPending, startStatusTransition] = useTransition()
    const [isMemoPending, startMemoTransition] = useTransition()

    const handleStatusChange = (newStatus: InquiryStatus) => {
        setStatus(newStatus)
        startStatusTransition(async () => {
            const result = await updateInquiryStatus(inquiry.id, newStatus)
            if (result.success) {
                toast.success("ステータスを更新しました")
                router.refresh()
            } else {
                toast.error("ステータスの更新に失敗しました")
                setStatus(inquiry.status) // Revert
            }
        })
    }

    const handleMemoSave = () => {
        startMemoTransition(async () => {
            const result = await updateInquiryMemo(inquiry.id, memo)
            if (result.success) {
                toast.success("管理メモを保存しました")
                router.refresh()
            } else {
                toast.error("管理メモの保存に失敗しました")
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/inquiries">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h2 className="text-2xl font-bold tracking-tight">問い合わせ詳細</h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">ステータス変更:</span>
                    <Select
                        value={status}
                        onValueChange={(val) => handleStatusChange(val as InquiryStatus)}
                        disabled={isStatusPending}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NEW">新規</SelectItem>
                            <SelectItem value="IN_PROGRESS">対応中</SelectItem>
                            <SelectItem value="DONE">完了</SelectItem>
                            <SelectItem value="ARCHIVED">アーカイブ</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>基本情報</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">受信日時</div>
                                    <div>{format(inquiry.createdAt, "yyyy/MM/dd HH:mm", { locale: ja })}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">ID</div>
                                    <div className="text-xs font-mono">{inquiry.id}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">氏名</div>
                                    <div className="text-lg font-bold">{inquiry.lastName} {inquiry.firstName}</div>
                                    <div className="text-sm text-muted-foreground">{inquiry.lastNameKana} {inquiry.firstNameKana}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">連絡先</div>
                                    <div>{inquiry.email}</div>
                                    <div>{inquiry.phone}</div>
                                </div>
                            </div>
                            <div className="border-t pt-4 mt-4">
                                <div className="text-sm font-medium text-muted-foreground mb-1">住所</div>
                                <div>
                                    〒{inquiry.postalCode} {inquiry.prefecture}{inquiry.city}
                                    {inquiry.addressDetail && <span className="block">{inquiry.addressDetail}</span>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>相談内容</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">墓地種別</div>
                                    <div className="font-medium">{inquiry.cemeteryType}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">検討時期</div>
                                    <div className="font-medium">{inquiry.considerationPeriod}</div>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-md border text-sm whitespace-pre-wrap">
                                {inquiry.content}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>オプション・詳細</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">改葬先</div>
                                    <div>{inquiry.destinationType || "-"}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">遺骨サポート</div>
                                    <div>{inquiry.boneServiceType || "-"}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">容器</div>
                                    <div>{inquiry.containerType || "-"}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">離檀交渉</div>
                                    <div>{inquiry.ritanConsultation ? "希望する" : "希望しない"}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Ops */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>管理メモ</CardTitle>
                            <CardDescription>社内共有用のメモです。顧客には公開されません。</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                                className="min-h-[200px]"
                                placeholder="対応状況や特記事項を入力..."
                            />
                            <Button onClick={handleMemoSave} disabled={isMemoPending} className="w-full">
                                {isMemoPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                保存する
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>システム情報</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2 text-muted-foreground">
                            <div className="flex justify-between">
                                <span>IP Address</span>
                                <span className="font-mono">{inquiry.ipAddress || "Unknown"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>User Agent</span>
                                <span className="truncate max-w-[150px]" title={inquiry.userAgent || ""}>
                                    {inquiry.userAgent || "Unknown"}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
