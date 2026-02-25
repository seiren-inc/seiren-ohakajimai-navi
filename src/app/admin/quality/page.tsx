import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getQualityCounts } from "@/lib/admin/qualityCounts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, FileText, ListChecks, ArrowRight, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

async function RecentAuditSummary() {
    const lastRun = await prisma.linkCheckRun.findFirst({
        orderBy: { startedAt: 'desc' }
    });

    if (!lastRun) {
        return (
            <div className="flex h-[200px] flex-col items-center justify-center text-muted-foreground border border-dashed rounded-md bg-gray-50/50">
                <History className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-sm">No audit runs recorded yet.</p>
                <p className="text-xs">Run `npm run linkcheck:run` to start.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-muted-foreground">Last Run: {new Date(lastRun.startedAt).toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant={lastRun.status === "SUCCEEDED" ? "default" : "destructive"}>
                            {lastRun.status}
                        </Badge>
                        <span className="text-sm font-mono text-[10px]">{lastRun.id}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div className="p-3 border rounded-lg bg-blue-50/30">
                    <p className="text-[10px] uppercase font-bold text-blue-600">Checked</p>
                    <p className="text-xl font-bold">{lastRun.totalChecked.toLocaleString()}</p>
                </div>
                <div className="p-3 border rounded-lg bg-red-50/30">
                    <p className="text-[10px] uppercase font-bold text-red-600">Broken</p>
                    <p className="text-xl font-bold">{lastRun.brokenCount.toLocaleString()}</p>
                </div>
                <div className="p-3 border rounded-lg bg-green-50/30">
                    <p className="text-[10px] uppercase font-bold text-green-600">Fixed</p>
                    <p className="text-xl font-bold">{lastRun.fixedCount.toLocaleString()}</p>
                </div>
            </div>

            <div className="text-xs bg-muted p-2 rounded truncate font-mono">
                Notes: {lastRun.notes || "N/A"}
            </div>

            <a href={`/admin/quality/runs/${lastRun.id}`} className="inline-flex items-center text-xs font-medium text-blue-600 hover:underline">
                View Full Logs <ArrowRight className="ml-1 h-3 w-3" />
            </a>
        </div>
    );
}

async function QualitySummary() {
    const counts = await getQualityCounts();

    const items = [
        { label: "Total municipalities", value: counts.total, icon: ListChecks, color: "text-blue-600" },
        { label: "Published (Guide)", value: counts.published_ok, icon: CheckCircle2, color: "text-green-600" },
        { label: "Published (PDF)", value: counts.published_pdf, icon: FileText, color: "text-amber-600" },
        { label: "Missing / Broken", value: counts.missing_link, icon: AlertCircle, color: "text-red-600" },
    ];

    const lastVerifiedDate = counts.lastVerified
        ? new Date(counts.lastVerified).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
        : "not yet";

    return (
        <div className="space-y-4">
            <div className="text-right text-xs text-muted-foreground">
                Last verification: <span className="font-mono">{lastVerifiedDate}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {items.map((item) => (
                    <Card key={item.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
                            <item.icon className={`h-4 w-4 ${item.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{item.value.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                {((item.value / counts.total) * 100).toFixed(1)}% of total
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default function QualityDashboardPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Data Quality Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/admin/quality/issues" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                        View Issues
                    </Link>
                    <Link href="/admin/quality/municipalities" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                        All Municipalities
                    </Link>
                </div>
            </div>

            <div className="space-y-4">
                <Suspense fallback={<div>Loading quality summary...</div>}>
                    <QualitySummary />
                </Suspense>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Link Audits</CardTitle>
                            <Link href="/admin/quality/runs" className="text-sm text-blue-600 hover:underline">
                                View History
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <Suspense fallback={<div className="h-[200px] flex items-center justify-center">Loading audit history...</div>}>
                                <RecentAuditSummary />
                            </Suspense>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Next Steps</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">1</span>
                                    <span>Implement secure HTTP headers (PHASE 1)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">2</span>
                                    <span>Optimize query performance & indexing (PHASE 2)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">3</span>
                                    <span>Establish automated testing suite (PHASE 3)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600">4</span>
                                    <span>Deploy Public API v1 (PHASE 4)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600">5</span>
                                    <span>Persist audit logs & history (PHASE 5)</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
