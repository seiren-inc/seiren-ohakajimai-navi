export const dynamic = "force-dynamic"

import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getQualityCounts } from "@/lib/admin/qualityCounts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/features/dashboard/dashboard-layout";
import { DashboardFiltersBar } from "@/components/features/dashboard/filters-bar";
import { KpiCard } from "@/components/features/dashboard/kpi-card";
import { DashboardState } from "@/components/features/dashboard/dashboard-state";

type RangeKey = "7d" | "30d" | "90d" | "qtd"

function resolveRange(value: string | string[] | undefined): RangeKey {
    const normalized = Array.isArray(value) ? value[0] : value
    if (normalized === "7d" || normalized === "30d" || normalized === "90d" || normalized === "qtd") {
        return normalized
    }
    return "30d"
}

function getRangeStart(range: RangeKey): Date {
    const now = new Date()
    if (range === "qtd") {
        const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3
        return new Date(now.getFullYear(), quarterStartMonth, 1)
    }

    const days = range === "7d" ? 7 : range === "90d" ? 90 : 30
    const start = new Date(now)
    start.setDate(now.getDate() - days)
    return start
}

async function QualitySummary({ rangeStart }: { rangeStart: Date }) {
    const [counts, latestRun] = await Promise.all([
        getQualityCounts(),
        prisma.linkCheckRun.findFirst({
            where: { startedAt: { gte: rangeStart } },
            orderBy: { startedAt: "desc" },
        }),
    ])

    const total = counts.total || 1

    const items = [
        {
            title: "Total Municipalities",
            value: counts.total.toLocaleString(),
            deltaLabel: latestRun ? `Checked ${latestRun.totalChecked.toLocaleString()}` : "No recent run",
            trend: "flat" as const,
            tone: "default" as const,
        },
        {
            title: "Published (Guide)",
            value: counts.published_ok.toLocaleString(),
            deltaLabel: `${((counts.published_ok / total) * 100).toFixed(1)}%`,
            trend: "up" as const,
            tone: "success" as const,
        },
        {
            title: "Published (PDF)",
            value: counts.published_pdf.toLocaleString(),
            deltaLabel: `${((counts.published_pdf / total) * 100).toFixed(1)}%`,
            trend: "flat" as const,
            tone: "warning" as const,
        },
        {
            title: "Missing / Broken",
            value: counts.missing_link.toLocaleString(),
            deltaLabel: `${((counts.missing_link / total) * 100).toFixed(1)}%`,
            trend: "up" as const,
            tone: "danger" as const,
        },
    ]

    const lastVerifiedDate = counts.lastVerified
        ? new Date(counts.lastVerified).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
        : "not yet"

    return (
        <div className="space-y-4">
            <div className="text-right text-xs text-muted-foreground">
                Last verification: <span className="font-mono">{lastVerifiedDate}</span>
            </div>
            <div className="dashboard-kpi-grid">
                {items.map((item, index) => (
                    <KpiCard
                        key={item.title}
                        title={item.title}
                        value={item.value}
                        deltaLabel={item.deltaLabel}
                        trend={item.trend}
                        tone={item.tone}
                        subtitle={index === 0 && latestRun ? `Run ID: ${latestRun.id}` : undefined}
                    />
                ))}
            </div>
        </div>
    );
}

async function AuditTrendPanel({ rangeStart }: { rangeStart: Date }) {
    const runs = await prisma.linkCheckRun.findMany({
        where: { startedAt: { gte: rangeStart } },
        orderBy: { startedAt: "asc" },
        take: 8,
        select: {
            id: true,
            startedAt: true,
            brokenCount: true,
            fixedCount: true,
            status: true,
        },
    })

    if (runs.length === 0) {
        return (
            <DashboardState
                mode="empty"
                message="選択期間に監査データがありません。期間を変更してください。"
                actionLabel="監査履歴を見る"
                actionHref="/admin/quality/runs"
            />
        )
    }

    const maxBroken = Math.max(...runs.map((run) => run.brokenCount), 1)

    return (
        <div className="space-y-3">
            {runs.map((run) => (
                <div key={run.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(run.startedAt).toLocaleDateString("ja-JP")}</span>
                        <span className="font-mono">{run.id.slice(0, 8)}</span>
                    </div>
                    <div className="h-2 w-full rounded bg-muted">
                        <div
                            className="h-2 rounded bg-destructive/80"
                            style={{ width: `${Math.max(8, Math.round((run.brokenCount / maxBroken) * 100))}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-rose-600">Broken {run.brokenCount}</span>
                        <span className="text-emerald-600">Fixed {run.fixedCount}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

async function RecentAuditTable({ rangeStart }: { rangeStart: Date }) {
    const runs = await prisma.linkCheckRun.findMany({
        where: { startedAt: { gte: rangeStart } },
        orderBy: { startedAt: "desc" },
        take: 8,
        select: {
            id: true,
            startedAt: true,
            status: true,
            totalChecked: true,
            brokenCount: true,
            fixedCount: true,
        },
    })

    if (runs.length === 0) {
        return (
            <DashboardState
                mode="empty"
                message="最近の監査実行がありません。まず監査を実行してください。"
                actionLabel="実行手順を見る"
                actionHref="/admin/quality/runs"
            />
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-2 pr-4 font-medium">Run</th>
                        <th className="pb-2 pr-4 font-medium">Status</th>
                        <th className="pb-2 pr-4 font-medium">Checked</th>
                        <th className="pb-2 pr-4 font-medium">Broken</th>
                        <th className="pb-2 font-medium">Started</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {runs.map((run) => (
                        <tr key={run.id}>
                            <td className="py-2 pr-4 font-mono text-xs">{run.id}</td>
                            <td className="py-2 pr-4">
                                <Badge variant={run.status === "SUCCEEDED" ? "default" : "destructive"}>
                                    {run.status}
                                </Badge>
                            </td>
                            <td className="py-2 pr-4">{run.totalChecked.toLocaleString()}</td>
                            <td className="py-2 pr-4">{run.brokenCount.toLocaleString()}</td>
                            <td className="py-2 text-xs text-muted-foreground">
                                {new Date(run.startedAt).toLocaleString("ja-JP")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function QualityDashboardPage(props: PageProps) {
    const searchParams = await props.searchParams
    const currentRange = resolveRange(searchParams?.range)
    const rangeStart = getRangeStart(currentRange)

    const filters = (
        <DashboardFiltersBar
            basePath="/admin/quality"
            currentRange={currentRange}
            options={[
                { label: "7d", value: "7d" },
                { label: "30d", value: "30d" },
                { label: "90d", value: "90d" },
                { label: "QTD", value: "qtd" },
            ]}
        />
    );

    const actions = (
        <>
            <Button asChild size="sm">
                <Link href="/admin/quality/issues">View Issues</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
                <Link href={`/admin/quality?range=${currentRange}`}>
                    <RefreshCcw className="mr-2 h-3.5 w-3.5" />
                    Refresh
                </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
                <Link href="/admin/quality/municipalities">All Municipalities</Link>
            </Button>
        </>
    );

    return (
        <DashboardLayout
            className="theme-terminal-ops-dark"
            title="Data Quality Dashboard"
            description="SEO/GEO/MEO data health monitoring and remediation workflow"
            actions={actions}
            filters={filters}
        >
            <div className="space-y-4">
                <Suspense
                    fallback={
                        <div className="dashboard-kpi-grid">
                            <KpiCard title="Loading..." value="-" loading />
                            <KpiCard title="Loading..." value="-" loading />
                            <KpiCard title="Loading..." value="-" loading />
                            <KpiCard title="Loading..." value="-" loading />
                        </div>
                    }
                >
                    <QualitySummary rangeStart={rangeStart} />
                </Suspense>

                <div className="grid gap-4 lg:grid-cols-7">
                    <Card className="lg:col-span-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-4 w-4" />
                                Audit Trend
                            </CardTitle>
                            <Badge variant="outline">{currentRange.toUpperCase()}</Badge>
                        </CardHeader>
                        <CardContent>
                            <Suspense fallback={<DashboardState mode="loading" message="Loading trend..." />}>
                                <AuditTrendPanel rangeStart={rangeStart} />
                            </Suspense>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Priority Signals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">1</span>
                                    <span>Missing / Broken を優先修正し、地域ページの信頼性を回復</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">2</span>
                                    <span>直近 failed run の原因（リンク切れ/HTTP応答）を切り分け</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">3</span>
                                    <span>監査結果をエリア別に再評価し、再発防止タスクを登録</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">4</span>
                                    <span>週次監査の自動化としきい値アラートを運用へ反映</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">5</span>
                                    <span>品質改善の効果を 30d / 90d で比較して施策優先度を更新</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Link Audits</CardTitle>
                        <Link href="/admin/quality/runs" className="text-sm text-blue-600 hover:underline">
                            View History
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <Suspense fallback={<DashboardState mode="loading" message="Loading recent audits..." />}>
                            <RecentAuditTable rangeStart={rangeStart} />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
