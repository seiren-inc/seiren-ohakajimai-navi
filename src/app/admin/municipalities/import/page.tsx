'use client'

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Upload, CheckCircle2, AlertCircle } from "lucide-react"
import Papa from "papaparse"
import { toast } from "sonner"
import { analyzeImport, executeImport } from "@/actions/admin/import-municipalities"
import { type MunicipalityImportData } from "@/lib/validations/municipality"

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null)
    const [parsedData, setParsedData] = useState<Record<string, unknown>[]>([])
    const [analysis, setAnalysis] = useState<{
        total: number
        newCount: number
        updateCount: number
        errors: { row: number; message: string }[]
        validData: MunicipalityImportData[]
    } | null>(null)

    const [isAnalyzing, startAnalysis] = useTransition()
    const [isImporting, startImport] = useTransition()
    const [importResult, setImportResult] = useState<{
        success: number
        failed: number
    } | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            setAnalysis(null)
            setImportResult(null)
            setParsedData([])
            parseFile(selectedFile)
        }
    }

    const parseFile = (file: File) => {
        if (file.name.endsWith(".json")) {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target?.result as string)
                    if (Array.isArray(json)) {
                        setParsedData(json)
                    } else {
                        toast.error("JSONは配列形式である必要があります")
                    }
                } catch {
                    toast.error("無効なJSONファイルです")
                }
            }
            reader.readAsText(file)
        } else {
            // Assume CSV
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    setParsedData(results.data as Record<string, unknown>[])
                },
                error: (error) => {
                    toast.error(`CSV Parse Error: ${error.message}`)
                }
            })
        }
    }

    const handleAnalyze = () => {
        if (parsedData.length === 0) return

        startAnalysis(async () => {
            try {
                const result = await analyzeImport(parsedData)
                setAnalysis(result)
                if (result.errors.length > 0) {
                    toast.warning(`${result.errors.length}件のエラーがあります`)
                } else {
                    toast.success("プレビュー完了: エラーなし")
                }
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : String(e)
                toast.error(`分析エラー: ${message}`)
            }
        })
    }

    const handleExecute = () => {
        if (!analysis || analysis.validData.length === 0 || !file) return

        startImport(async () => {
            try {
                const result = await executeImport(file.name, analysis.validData)
                if (result.success) {
                    setImportResult(result.importStats || null)
                    toast.success("インポートが完了しました")
                    // Reset Analysis to prevent re-submit
                    setAnalysis(null)
                    setParsedData([])
                    setFile(null)
                } else {
                    toast.error("インポートに失敗しました")
                }
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : String(e)
                toast.error(`実行エラー: ${message}`)
            }
        })
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">自治体データインポート</h2>
                <p className="text-muted-foreground">
                    CSVまたはJSONファイルをアップロードして、自治体データを一括登録・更新します。
                </p>
            </div>

            {/* 1. Upload */}
            <Card>
                <CardHeader>
                    <CardTitle>1. ファイル選択</CardTitle>
                    <CardDescription>jisCode, name, prefectureName などを含むファイルを選択してください。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="file">ファイル (CSV / JSON)</Label>
                        <Input id="file" type="file" accept=".csv,.json" onChange={handleFileChange} />
                    </div>
                    <div className="text-sm text-slate-500">
                        現在の読み込み行数: <span className="font-bold">{parsedData.length}</span> 件
                    </div>
                    <Button
                        onClick={handleAnalyze}
                        disabled={parsedData.length === 0 || isAnalyzing || !!analysis}
                    >
                        {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        プレビューを実行
                    </Button>
                </CardContent>
            </Card>

            {/* 2. result or Preview */}
            {importResult && (
                <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">インポート完了</AlertTitle>
                    <AlertDescription className="text-green-700">
                        成功: {importResult.success} 件 / 失敗: {importResult.failed} 件 (詳細ログはDBに保存されました)
                    </AlertDescription>
                </Alert>
            )}

            {analysis && (
                <Card>
                    <CardHeader>
                        <CardTitle>2. プレビュー結果</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <div className="bg-slate-50 p-4 rounded-md border">
                                <div className="text-xs text-muted-foreground">総件数</div>
                                <div className="text-2xl font-bold">{analysis.total}</div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                <div className="text-xs text-blue-600">新規登録</div>
                                <div className="text-2xl font-bold text-blue-700">{analysis.newCount}</div>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
                                <div className="text-xs text-yellow-600">更新</div>
                                <div className="text-2xl font-bold text-yellow-700">{analysis.updateCount}</div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-md border border-red-100">
                                <div className="text-xs text-red-600">エラー(スキップ)</div>
                                <div className="text-2xl font-bold text-red-700">{analysis.errors.length}</div>
                            </div>
                        </div>

                        {analysis.errors.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="font-bold flex items-center text-red-600 gap-2">
                                    <AlertCircle className="h-4 w-4" /> エラー詳細
                                </h4>
                                <div className="max-h-60 overflow-y-auto border rounded-md text-sm">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[80px]">行番号</TableHead>
                                                <TableHead>エラー内容</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {analysis.errors.map((err, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>{err.row}行目</TableCell>
                                                    <TableCell className="text-red-500">{err.message}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t">
                            <Button
                                onClick={handleExecute}
                                disabled={isImporting || analysis.validData.length === 0}
                                className="w-full sm:w-auto"
                            >
                                {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Upload className="mr-2 h-4 w-4" />
                                {analysis.validData.length}件をインポートする
                            </Button>
                            {analysis.validData.length === 0 && (
                                <p className="text-sm text-red-500 mt-2">有効なデータがありません。</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
