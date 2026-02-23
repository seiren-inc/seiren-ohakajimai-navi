import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Link as LinkIcon, FileCheck, AlertTriangle, Calendar, Info } from "lucide-react";

export default async function MunicipalityDetailPage({
    params,
}: {
    params: Promise<{ jisCode: string }>;
}) {
    const { jisCode } = await params;
    const m = await prisma.municipality.findUnique({
        where: { jisCode },
        include: { auditLogs: { take: 10, orderBy: { checkedAt: 'desc' } } }
    });

    if (!m) {
        notFound();
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <nav className="text-sm text-muted-foreground mb-2">
                        <a href="/admin/quality" className="hover:text-primary">Quality Dashboard</a> &gt;
                        <a href="/admin/quality/municipalities" className="hover:text-primary ml-1">Municipalities</a> &gt; {m.jisCode}
                    </nav>
                    <h2 className="text-3xl font-bold tracking-tight">{m.name} ({m.jisCode})</h2>
                </div>
                <div className="flex space-x-2">
                    <Badge variant={m.isPublished ? "default" : "secondary"}>
                        {m.isPublished ? "Published" : "Hidden"}
                    </Badge>
                    <Badge variant={m.linkStatus === "OK" ? "default" : "destructive"}>
                        {m.linkStatus}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-blue-500" />
                            General Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Prefecture</p>
                                <p className="text-sm font-semibold">{m.prefectureName} ({m.prefectureCode})</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Region</p>
                                <p className="text-sm font-semibold">{m.region || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Municipality Slug</p>
                                <p className="text-sm font-mono">{m.municipalitySlug}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Data Quality Level</p>
                                <p className="text-sm">{m.dataQualityLevel}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            Status & Updates
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Last Checked</p>
                            <p className="text-sm">
                                {m.lastCheckedAt ? new Date(m.lastCheckedAt).toLocaleString() : "Never"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Created At</p>
                            <p className="text-sm">{new Date(m.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Updated At</p>
                            <p className="text-sm">{new Date(m.updatedAt).toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LinkIcon className="h-5 w-5 text-primary" />
                            Resource Links
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 border rounded-md">
                            <p className="text-xs font-medium text-muted-foreground mb-1 underline">Guide Page URL</p>
                            {m.url ? (
                                <div className="flex items-center justify-between">
                                    <code className="text-xs break-all bg-gray-50 p-1 rounded w-full mr-2">{m.url}</code>
                                    <a href={m.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-blue-600 hover:text-blue-800">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>
                            ) : <p className="text-sm text-red-500 italic">Not set</p>}
                        </div>
                        <div className="p-4 border rounded-md">
                            <p className="text-xs font-medium text-muted-foreground mb-1 underline">Official PDF URL</p>
                            {m.pdfUrl ? (
                                <div className="flex items-center justify-between">
                                    <code className="text-xs break-all bg-amber-50 p-1 rounded w-full mr-2">{m.pdfUrl}</code>
                                    <a href={m.pdfUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 text-amber-600 hover:text-amber-800">
                                        <FileCheck className="h-4 w-4" />
                                    </a>
                                </div>
                            ) : <p className="text-sm text-gray-400 italic">Not set</p>}
                        </div>
                        {m.hasDomainWarning && (
                            <div className="flex items-center p-3 text-sm text-red-800 border border-red-200 bg-red-50 rounded-md">
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                This municipality has a domain trust warning. Please verify the official status of the links.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Sub-Links (JSON)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-[10px] bg-gray-50 p-2 rounded border max-h-[200px] overflow-y-auto">
                            {JSON.stringify(m.subLinks, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Audit Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="px-4 py-2 text-left font-medium">Checked At</th>
                                    <th className="px-4 py-2 text-left font-medium">Result</th>
                                    <th className="px-4 py-2 text-left font-medium">Status Code</th>
                                    <th className="px-4 py-2 text-left font-medium underline">Checked URL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {m.auditLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground italic">
                                            No audit history found for this municipality.
                                        </td>
                                    </tr>
                                ) : (
                                    m.auditLogs.map((log) => (
                                        <tr key={log.id.toString()} className="border-b hover:bg-muted/30">
                                            <td className="px-4 py-2">{new Date(log.checkedAt).toLocaleString()}</td>
                                            <td className="px-4 py-2">
                                                <Badge variant={log.result === "OK" ? "default" : "outline"}>
                                                    {log.result}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-2 font-mono text-xs">{log.httpStatus || "-"}</td>
                                            <td className="px-4 py-2 max-w-[300px] truncate text-xs text-muted-foreground">{log.targetUrl}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
