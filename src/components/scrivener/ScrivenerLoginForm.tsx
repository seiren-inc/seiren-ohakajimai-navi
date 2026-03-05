'use client'

import { useActionState } from 'react'
import { signInScrivener, AuthState } from '@/actions/scrivener/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { PasskeyButton } from '@/components/scrivener/PasskeyButton'

const initialState: AuthState = {
    error: null,
    success: false,
}

export function ScrivenerLoginForm() {
    const [state, formAction, isPending] = useActionState(signInScrivener, initialState)

    return (
        <Card className="w-full">
            <form action={formAction}>
                <CardContent className="space-y-4 pt-6">
                    {state.error && (
                        <div className="rounded bg-destructive/15 p-3 text-sm text-destructive">
                            {state.error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <Label htmlFor="email">メールアドレス</Label>
                        <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="mail@example.com" 
                            required 
                            disabled={isPending}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="password">パスワード</Label>
                        <Input 
                            id="password" 
                            name="password" 
                            type="password" 
                            required 
                            disabled={isPending}
                        />
                    </div>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ログイン中...
                            </>
                        ) : (
                            'ログイン'
                        )}
                    </Button>
                    
                    {/* パスキーログイン（対応ブラウザのみ自動表示） */}
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs text-slate-400">
                            <span className="bg-white px-2">または</span>
                        </div>
                    </div>
                    
                    <PasskeyButton />
                    
                    <div className="text-center text-sm text-muted-foreground">
                        アカウントをお持ちでないですか？{' '}
                        <Link href="/scrivener/signup" className="text-primary hover:underline">
                            無料登録はこちら
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}
