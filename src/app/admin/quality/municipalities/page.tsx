import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

async function MunicipalityList({
    q = "",
    pref = "",
    page = 1
}: {
    q?: string;
    pref?: string;
    page?: number
}) {
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (q) {
        where.OR = [
            { name: { contains: q, mode: 'insensitive' } },
            { jisCode: { contains: q } },
            { municipalitySlug: { contains: q } }
        ];
    }
    if (pref) {
        where.prefectureSlug = pref;
    }

    const items = await prisma.municipality.findMany({
        where,
        orderBy: { jisCode: "asc" },
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
                            <TableHead className="w-[100px]">JIS Code</TableHead>
                            <TableHead className="w-[120px]">Prefecture</TableHead>
                            <TableHead>Municipality</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead className="w-[120px]">Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((m) => (
                            <TableRow key={m.id}>
                                <TableCell className="font-mono text-xs">{m.jisCode}</TableCell>
                                <TableCell>{m.prefectureName}</TableCell>
                                <TableCell className="font-medium">{m.name}</TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">{m.municipalitySlug}</TableCell>
                                <TableCell>
                                    <Badge variant={m.linkStatus === "OK" ? "default" : "outline"}>
                                        {m.linkStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <a href={`/admin/quality/municipalities/${m.jisCode}`} className="text-sm font-medium text-blue-600 hover:underline">
                                        View
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                    Showing {skip + 1} to {Math.min(skip + pageSize, total)} of {total} municipalities
                </div>
                <div className="flex items-center space-x-2">
                    {page > 1 && (
                        <a
                            href={`/admin/quality/municipalities?q=${q}&pref=${pref}&page=${page - 1}`}
                            className="rounded border px-2 py-1 hover:bg-gray-50"
                        >
                            Prev
                        </a>
                    )}
                    <span className="font-medium">Page {page}</span>
                    {total > page * pageSize && (
                        <a
                            href={`/admin/quality/municipalities?q=${q}&pref=${pref}&page=${page + 1}`}
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

export default async function MunicipalitiesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; pref?: string; page?: string }>;
}) {
    const params = await searchParams;
    const q = params.q || "";
    const pref = params.pref || "";
    const page = parseInt(params.page || "1");

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <nav className="text-sm text-muted-foreground mb-2">
                        <a href="/admin/quality" className="hover:text-primary">Quality Dashboard</a> &gt; Municipalities
                    </nav>
                    <h2 className="text-3xl font-bold tracking-tight">All Municipalities</h2>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Filter & Search</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="flex gap-4">
                        <Input
                            name="q"
                            placeholder="Search jisCode, name, or slug..."
                            defaultValue={q}
                            className="max-w-sm"
                        />
                        <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-9 px-4 py-2 shadow hover:bg-primary/90">
                            Search
                        </button>
                        <a href="/admin/quality/municipalities" className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background h-9 px-4 py-2 hover:bg-accent">
                            Reset
                        </a>
                    </form>
                </CardContent>
            </Card>

            <Suspense fallback={<div>Loading municipalities...</div>}>
                <MunicipalityList q={q} pref={pref} page={page} />
            </Suspense>
        </div>
    );
}
