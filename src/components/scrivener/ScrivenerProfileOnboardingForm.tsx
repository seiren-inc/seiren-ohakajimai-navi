'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react'
import { saveScrivenerProfile } from '@/actions/scrivener/profile'

interface Props {
    initialOfficeName: string
    initialProfile?: string | null
}

export function ScrivenerProfileOnboardingForm({ initialOfficeName, initialProfile }: Props) {
    const [officeName, setOfficeName] = useState(initialOfficeName)
    const [keywords, setKeywords] = useState('相続専門, 無料出張相談, スピード対応, 女性スタッフ対応可')
    const [completion, setCompletion] = useState(initialProfile || '')
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const handleGenerate = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/scrivener/ai-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ officeName, keywords }),
            })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)

            // ストリーミングレスポンスを読み込む
            const reader = res.body?.getReader()
            const decoder = new TextDecoder()
            let result = ''
            setCompletion('')

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    const chunk = decoder.decode(value, { stream: true })
                    const lines = chunk.split('\n')
                    for (const line of lines) {
                        if (line.startsWith('0:')) {
                            try {
                                const parsed = JSON.parse(line.slice(2))
                                result += parsed
                                setCompletion(result)
                            } catch {
                                // パースエラーは無視
                            }
                        }
                    }
                }
            }
        } catch {
            alert('プロフィールの生成に失敗しました。再度お試しください。')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        
        const formData = new FormData()
        formData.append('officeName', officeName)
        formData.append('profileText', completion)
        
        await saveScrivenerProfile(formData)
        setIsSaving(false)
    }

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* 左側: 入力パネル */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">1. 事務所の特徴を教える</CardTitle>
                            <CardDescription>
                                AIがあなたに最適なプロフィール文を作成します。
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="officeName">事務所名</Label>
                                <Input 
                                    id="officeName" 
                                    value={officeName} 
                                    onChange={(e) => setOfficeName(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="keywords">アピールポイント（キーワード）</Label>
                                <Textarea 
                                    id="keywords" 
                                    value={keywords} 
                                    onChange={(e) => setKeywords(e.target.value)} 
                                    placeholder="例: 相続に強い, 初回相談無料, 女性行政書士, スピード対応" 
                                    rows={3}
                                />
                                <p className="text-xs text-muted-foreground">
                                    箇条書きや単語の羅列で構いません。
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                type="button" 
                                onClick={handleGenerate} 
                                disabled={isLoading || !keywords.trim()} 
                                className="w-full bg-indigo-600 hover:bg-indigo-700"
                            >
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 自動生成中...</>
                                ) : (
                                    <><Sparkles className="mr-2 h-4 w-4" /> AIでプロフィールを作成する</>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* 右側: AI生成結果とプレビュー */}
                <div className="space-y-6">
                    <Card className="h-full flex flex-col border-indigo-100 shadow-sm">
                        <CardHeader className="bg-indigo-50/50 pb-4">
                            <CardTitle className="text-xl flex items-center text-indigo-900">
                                2. 生成されたプロフィール
                            </CardTitle>
                            <CardDescription>
                                直接テキストを編集することも可能です。
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 pt-6 flex flex-col">
                            <Textarea 
                                value={completion} 
                                onChange={(e) => setCompletion(e.target.value)}
                                className="flex-1 min-h-[300px] leading-relaxed resize-none bg-slate-50/50 focus-visible:ring-indigo-500"
                                placeholder="左のボタンを押すと、ここにAIが作成したプロフィール文が表示されます。"
                                required
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
                <Button type="submit" size="lg" disabled={isSaving || !completion || isLoading}>
                    {isSaving ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 保存中...</>
                    ) : (
                        <><CheckCircle2 className="mr-2 h-5 w-5" /> この内容で保存して次へ</>
                    )}
                </Button>
            </div>
        </form>
    )
}
