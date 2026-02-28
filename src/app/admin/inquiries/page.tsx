import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { InquiryStatus } from "@prisma/client"

const PAGE_SIZE = 10

const statusMap: Record<InquiryStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    NEW: { label: "新規", variant: "destructive" },
    IN_PROGRESS: { label: "対応中", variant: "default" },
    DONE: { label: "完了", variant: "secondary" },
    ARCHIVED: { label: "アーカイブ", variant: "outline" },
}

const inquiryTypeLabels: Record<string, string> = {
    OHaka: "お墓じまい",
    GYoseishoshi: "行政書士",
}

// Fixed type definition for searchParams in Next.js 15
type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function InquiriesPage(props: PageProps) {
    const searchParams = await props.searchParams
    const currentPage = Number(searchParams?.page) || 1
    const typeFilter = (searchParams?.type as string) || ""
    const skip = (currentPage - 1) * PAGE_SIZE

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    if (typeFilter === "OHaka" || typeFilter === "GYoseishoshi") {
        where.inquiryType = typeFilter
    }

    const [inquiries, totalCount] = await Promise.all([
        prisma.inquiry.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: PAGE_SIZE,
            skip,
        }),
        prisma.inquiry.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)
    const buildUrl = (params: Record<string, string | number>) => {
        const sp = new URLSearchParams()
        if (typeFilter) sp.set("type", typeFilter)
        Object.entries(params).forEach(([k, v]) => sp.set(k, String(v)))
        return `/admin/inquiries?${sp.toString()}`
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">問い合わせ一覧</h2>
                <div className="text-sm text-muted-foreground">
                    全 {totalCount} 件
                </div>
            </div>

            {/* inquiryType フィルタ */}
            <div className="flex gap-2">
                <Button variant={!typeFilter ? "default" : "outline"} size="sm" asChild>
                    <Link href="/admin/inquiries">全件</Link>
                </Button>
                <Button variant={typeFilter === "OHaka" ? "default" : "outline"} size="sm" asChild>
                    <Link href="/admin/inquiries?type=OHaka">お墓じまい</Link>
                </Button>
                <Button variant={typeFilter === "GYoseishoshi" ? "default" : "outline"} size="sm" asChild>
                    <Link href="/admin/inquiries?type=GYoseishoshi">行政書士</Link>
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ステータス</TableHead>
                            <TableHead>氏名</TableHead>
                            <TableHead>種別</TableHead>
                            <TableHead>受信日時</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inquiries.map((inquiry) => (
                            <TableRow key={inquiry.id}>
                                <TableCell>
                                    <Badge variant={statusMap[inquiry.status].variant}>
                                        {statusMap[inquiry.status].label}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{inquiry.lastName} {inquiry.firstName}</div>
                                    <div className="text-xs text-muted-foreground">{inquiry.email}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {inquiryTypeLabels[(inquiry as any).inquiryType] || "お墓じまい"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {format(inquiry.createdAt, "yyyy/MM/dd HH:mm", { locale: ja })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/admin/inquiries/${inquiry.id}`}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            詳細
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {inquiries.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    問い合わせはまだありません。
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage <= 1}
                        asChild
                    >
                        <Link href={buildUrl({ page: currentPage - 1 })}>
                            <ChevronLeft className="h-4 w-4" /> 前へ
                        </Link>
                    </Button>
                    <div className="text-sm">
                        {currentPage} / {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= totalPages}
                        asChild
                    >
                        <Link href={buildUrl({ page: currentPage + 1 })}>
                            次へ <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
