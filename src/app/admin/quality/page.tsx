import { Suspense } from "react";
import { getQualityCounts } from "@/lib/admin/qualityCounts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, FileText, ListChecks } from "lucide-react";

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
                    <a href="/admin/quality/issues" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                        View Issues
                    </a>
                    <a href="/admin/quality/municipalities" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                        All Municipalities
                    </a>
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
                            <a href="/admin/quality/runs" className="text-sm text-blue-600 hover:underline">
                                View History
                            </a>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-[200px] items-center justify-center text-muted-foreground border-2 border-dashed rounded-md">
                                Placeholder: LinkCheckRun history will appear here (PHASE 5)
                            </div>
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
