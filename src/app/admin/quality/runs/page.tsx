import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default async function AuditRunsPage() {
    const runs = await prisma.linkCheckRun.findMany({
        orderBy: { startedAt: 'desc' },
        take: 50
    });

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <nav className="text-sm text-muted-foreground mb-2">
                        <Link href="/admin/quality" className="hover:text-primary">Quality Dashboard</Link> &gt; Audit Runs
                    </nav>
                    <h2 className="text-3xl font-bold tracking-tight">Audit History</h2>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5 text-gray-500" />
                        Recent Executions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[180px]">Started At</TableHead>
                                    <TableHead className="w-[100px]">Status</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-right text-red-600">Broken</TableHead>
                                    <TableHead className="text-right text-green-600">Fixed</TableHead>
                                    <TableHead>Finished At</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {runs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground italic">
                                            No audit runs have been executed yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    runs.map((run) => (
                                        <TableRow key={run.id}>
                                            <td className="px-4 py-2 text-sm">
                                                {new Date(run.startedAt).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={
                                                    run.status === "SUCCEEDED" ? "default" :
                                                        run.status === "FAILED" ? "destructive" :
                                                            "outline"
                                                } className="flex items-center w-fit gap-1">
                                                    {run.status === "SUCCEEDED" && <CheckCircle2 className="h-3 w-3" />}
                                                    {run.status === "FAILED" && <XCircle className="h-3 w-3" />}
                                                    {run.status === "RUNNING" && <Loader2 className="h-3 w-3 animate-spin" />}
                                                    {run.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                {run.totalChecked.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2 text-right font-medium text-red-600">
                                                {run.brokenCount.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2 text-right font-medium text-green-600">
                                                {run.fixedCount.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-muted-foreground">
                                                {run.finishedAt ? new Date(run.finishedAt).toLocaleString() : "-"}
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <Link href={`/admin/quality/runs/${run.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                                                    Details
                                                </Link>
                                            </td>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
