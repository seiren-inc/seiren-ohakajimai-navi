import { prisma } from "@/lib/prisma"
import type { AdminScrivener } from "@/lib/scrivener-types"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Eye, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

const PAGE_SIZE = 20

// prisma generate前のany回避
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any

const paymentStatusLabel: Record<string, { label: string; variant: "default" | "destructive" | "outline" | "secondary" }> = {
    PAID: { label: "支払済", variant: "default" },
    UNPAID: { label: "未払い", variant: "destructive" },
    SUSPENDED: { label: "停止", variant: "outline" },
}

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminGyoseishoshiPage(props: PageProps) {
    const searchParams = await props.searchParams
    const currentPage = Number(searchParams?.page) || 1
    const filterType = (searchParams?.filter as string) || ""
    const skip = (currentPage - 1) * PAGE_SIZE

    // Doc-18 §3-1: フィルタ（未承認/未払い/停止中/苦情あり）
    type WhereCondition = Record<string, unknown>
    const where: WhereCondition = {}
    if (filterType === "unapproved") where.isApproved = false
    if (filterType === "unpaid") where.paymentStatus = "UNPAID"
    if (filterType === "suspended") where.isActive = false
    if (filterType === "complaint") where.complaintFlag = true

    const [scriveners, totalCount]: [AdminScrivener[], number] = await Promise.all([
        db.administrativeScrivener.findMany({
            where,
            orderBy: [{ createdAt: "desc" }],
            take: PAGE_SIZE,
            skip,
        }),
        db.administrativeScrivener.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    const filterParam = filterType ? `&filter=${filterType}` : ""

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">行政書士管理</h2>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">全 {totalCount} 件</span>
                    <Button asChild>
                        <Link href="/admin/gyoseishoshi/new">
                            <Plus className="h-4 w-4 mr-2" />
                            新規登録
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Doc-18 §3-1: フィルタボタン */}
            <div className="flex gap-2 flex-wrap">
                {[
                    { key: "", label: "すべて" },
                    { key: "unapproved", label: "未承認" },
                    { key: "unpaid", label: "未払い" },
                    { key: "suspended", label: "停止中" },
                    { key: "complaint", label: "苦情あり" },
                ].map((f) => (
                    <Button
                        key={f.key}
                        variant={filterType === f.key ? "default" : "outline"}
                        size="sm"
                        asChild
                    >
                        <Link href={`/admin/gyoseishoshi${f.key ? `?filter=${f.key}` : ""}`}>
                            {f.label}
                        </Link>
                    </Button>
                ))}
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>事務所名</TableHead>
                            <TableHead>都道府県</TableHead>
                            <TableHead>プラン</TableHead>
                            <TableHead>承認</TableHead>
                            <TableHead>掲載</TableHead>
                            <TableHead>支払い</TableHead>
                            <TableHead>苦情</TableHead>
                            <TableHead>登録日</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scriveners.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell>
                                    <div className="font-medium">{s.officeName}</div>
                                    {s.representativeName && (
                                        <div className="text-xs text-muted-foreground">{s.representativeName}</div>
                                    )}
                                </TableCell>
                                <TableCell>{s.prefecture}</TableCell>
                                <TableCell>
                                    <Badge variant={s.planType === "PREMIUM" ? "default" : s.planType === "STANDARD" ? "secondary" : "outline"}>
                                        {s.planType}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={s.isApproved ? "default" : "destructive"}>
                                        {s.isApproved ? "承認済" : "未承認"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={s.isActive ? "default" : "outline"}>
                                        {s.isActive ? "公開中" : "停止中"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={paymentStatusLabel[s.paymentStatus]?.variant || "outline"}>
                                        {paymentStatusLabel[s.paymentStatus]?.label || s.paymentStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {s.complaintFlag && (
                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {format(s.createdAt, "yyyy/MM/dd", { locale: ja })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/admin/gyoseishoshi/${s.id}`}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            詳細
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {scriveners.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} className="h-24 text-center">
                                    該当する行政書士はありません。
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                    <Button variant="outline" size="sm" disabled={currentPage <= 1} asChild>
                        <Link href={`/admin/gyoseishoshi?page=${currentPage - 1}${filterParam}`}>
                            <ChevronLeft className="h-4 w-4" /> 前へ
                        </Link>
                    </Button>
                    <div className="text-sm">{currentPage} / {totalPages}</div>
                    <Button variant="outline" size="sm" disabled={currentPage >= totalPages} asChild>
                        <Link href={`/admin/gyoseishoshi?page=${currentPage + 1}${filterParam}`}>
                            次へ <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
