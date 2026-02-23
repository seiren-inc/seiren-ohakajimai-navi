import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Terminal } from "lucide-react";

export default async function RunDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    // @ts-ignore
    const run = await prisma.linkCheckRun.findUnique({
        where: { id }
    });

    if (!run) {
        notFound();
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <nav className="text-sm text-muted-foreground mb-2">
                        <a href="/admin/quality" className="hover:text-primary">Quality Dashboard</a> &gt;
                        <a href="/admin/quality/runs" className="hover:text-primary ml-1">Audit Runs</a> &gt; Run Detail
                    </nav>
                    <h2 className="text-3xl font-bold tracking-tight">Run: {run.id}</h2>
                </div>
                <Badge variant={
                    run.status === "SUCCEEDED" ? "default" :
                        run.status === "FAILED" ? "destructive" :
                            "outline"
                }>
                    {run.status}
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Info className="h-5 w-5 text-blue-500" />
                            Execution Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Started</p>
                                <p className="text-base font-semibold">{new Date(run.startedAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Finished</p>
                                <p className="text-base font-semibold">
                                    {run.finishedAt ? new Date(run.finishedAt).toLocaleString() : "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Checked Items</p>
                                <p className="text-base font-bold text-blue-600">{run.totalChecked.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                                <p className="text-base font-bold">
                                    {run.totalChecked > 0
                                        ? (((run.totalChecked - run.brokenCount) / run.totalChecked) * 100).toFixed(1) + "%"
                                        : "0%"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Notes & Flags</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm p-4 border rounded bg-gray-50 italic text-muted-foreground">
                            {run.notes || "No notes provided for this run."}
                        </p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-primary">
                            <Terminal className="h-5 w-5" />
                            Metadata (Raw JSON)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-xs bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto">
                            {JSON.stringify(run, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
