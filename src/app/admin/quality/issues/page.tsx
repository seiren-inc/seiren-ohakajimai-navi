import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, AlertTriangle, Link as LinkIcon, FileCheck } from "lucide-react";
import Link from "next/link";

async function IssuesList({
    type = "missing",
    page = 1
}: {
    type?: string;
    page?: number
}) {
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    let where: Prisma.MunicipalityWhereInput = {};
    switch (type) {
        case "missing":
            where = { url: null, pdfUrl: null };
            break;
        case "review":
            where = { linkStatus: "NEEDS_REVIEW" };
            break;
        case "warning":
            where = { hasDomainWarning: true };
            break;
        case "broken":
            where = { linkStatus: "BROKEN" };
            break;
        case "pdf_violation":
            where = {
                linkStatus: "PDF_ONLY",
                url: { not: null, notIn: [""] }
            };
            break;
        case "invalid_format":
            where = {
                OR: [
                    { AND: [{ url: { not: null } }, { NOT: { url: { startsWith: "http" } } }] },
                    { AND: [{ pdfUrl: { not: null } }, { NOT: { pdfUrl: { startsWith: "http" } } }] }
                ]
            };
            break;
        default:
            where = { OR: [{ url: null, pdfUrl: null }, { linkStatus: { in: ["NEEDS_REVIEW", "BROKEN", "UNKNOWN"] } }, { hasDomainWarning: true }] };
    }

    const issues = await prisma.municipality.findMany({
        where,
        orderBy: [{ prefectureCode: "asc" }, { municipalitySlug: "asc" }],
        skip,
        take: pageSize,
    });

    const total = await prisma.municipality.count({ where });

    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">JIS Code</TableHead>
                            <TableHead className="w-[120px]">Prefecture</TableHead>
                            <TableHead>Municipality</TableHead>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead>Links</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {issues.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No issues found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            issues.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell className="font-mono text-xs">{m.jisCode}</TableCell>
                                    <TableCell>{m.prefectureName}</TableCell>
                                    <TableCell className="font-medium">{m.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            m.linkStatus === "OK" ? "default" :
                                                m.linkStatus === "BROKEN" ? "destructive" :
                                                    "outline"
                                        }>
                                            {m.linkStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-xs">
                                            {m.url && (
                                                <a href={m.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                                                    <LinkIcon className="mr-1 h-3 w-3" /> Guide <ExternalLink className="ml-1 h-2 w-2" />
                                                </a>
                                            )}
                                            {m.pdfUrl && (
                                                <a href={m.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-amber-600 hover:underline">
                                                    <FileCheck className="mr-1 h-3 w-3" /> PDF <ExternalLink className="ml-1 h-2 w-2" />
                                                </a>
                                            )}
                                            {!m.url && !m.pdfUrl && (
                                                <span className="text-red-500 font-bold">MISSING</span>
                                            )}
                                            {m.hasDomainWarning && (
                                                <span className="flex items-center text-red-500">
                                                    <AlertTriangle className="mr-1 h-3 w-3" /> Warning
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <a href={`/admin/quality/municipalities/${m.jisCode}`} className="text-sm font-medium text-blue-600 hover:underline">
                                            Details
                                        </a>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                    Showing {skip + 1} to {Math.min(skip + pageSize, total)} of {total} issues
                </div>
                <div className="flex items-center space-x-2">
                    {page > 1 && (
                        <a
                            href={`/admin/quality/issues?type=${type}&page=${page - 1}`}
                            className="rounded border px-2 py-1 hover:bg-gray-50"
                        >
                            Prev
                        </a>
                    )}
                    <span className="font-medium">Page {page}</span>
                    {total > page * pageSize && (
                        <a
                            href={`/admin/quality/issues?type=${type}&page=${page + 1}`}
                            className="rounded border px-2 py-1 hover:bg-gray-50"
                        >
                            Next
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default async function QualityIssuesPage({
    searchParams,
}: {
    searchParams: Promise<{ type?: string; page?: string }>;
}) {
    const params = await searchParams;
    const type = params.type || "missing";
    const page = parseInt(params.page || "1");

    const countsData = await prisma.municipality.groupBy({
        by: ['linkStatus'],
        _count: { id: true },
    }) as { linkStatus: string; _count: { id: number } }[];

    const missingTotal = await prisma.municipality.count({
        where: { url: null, pdfUrl: null }
    });

    const warningTotal = await prisma.municipality.count({
        where: { hasDomainWarning: true }
    });

    const pdfViolationTotal = await prisma.municipality.count({
        where: {
            linkStatus: "PDF_ONLY",
            url: { not: null, notIn: [""] }
        }
    });

    const invalidFormatTotal = await prisma.municipality.count({
        where: {
            OR: [
                { AND: [{ url: { not: null } }, { NOT: { url: { startsWith: "http" } } }] },
                { AND: [{ pdfUrl: { not: null } }, { NOT: { pdfUrl: { startsWith: "http" } } }] }
            ]
        }
    });

    const tabs = [
        { id: "missing", label: "Missing Links", count: missingTotal },
        { id: "review", label: "Needs Review", count: countsData.find((c: { linkStatus: string; _count: { id: number } }) => c.linkStatus === "NEEDS_REVIEW")?._count.id || 0 },
        { id: "broken", label: "Broken", count: countsData.find((c: { linkStatus: string; _count: { id: number } }) => c.linkStatus === "BROKEN")?._count.id || 0 },
        { id: "pdf_violation", label: "PDF rule violation", count: pdfViolationTotal },
        { id: "invalid_format", label: "Invalid Format", count: invalidFormatTotal },
        { id: "warning", label: "Warnings", count: warningTotal },
    ];

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <nav className="text-sm text-muted-foreground mb-2">
                        <Link href="/admin/quality" className="hover:text-primary">Quality Dashboard</Link> &gt; Issues
                    </nav>
                    <h2 className="text-3xl font-bold tracking-tight">Data Quality Issues</h2>
                </div>
            </div>

            <div className="flex space-x-2 border-b pb-px overflow-x-auto">
                {tabs.map((tab) => (
                    <a
                        key={tab.id}
                        href={`/admin/quality/issues?type=${tab.id}`}
                        className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary whitespace-nowrap relative ${type === tab.id ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                            }`}
                    >
                        {tab.label}
                        <Badge className="ml-2 bg-gray-100 text-gray-800 hover:bg-gray-200" variant="secondary">
                            {tab.count}
                        </Badge>
                    </a>
                ))}
            </div>

            <Suspense fallback={<div>Loading issues...</div>}>
                <IssuesList type={type} page={page} />
            </Suspense>
        </div>
    );
}
