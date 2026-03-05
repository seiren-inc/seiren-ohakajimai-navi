'use client'

import { useActionState } from 'react'
import { signUpScrivener, AuthState } from '@/actions/scrivener/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

const initialState: AuthState = {
    error: null,
    success: false,
}

export function ScrivenerSignupForm() {
    const [state, formAction, isPending] = useActionState(signUpScrivener, initialState)

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
                        <Label htmlFor="officeName">事務所名</Label>
                        <Input 
                            id="officeName" 
                            name="officeName" 
                            placeholder="例: 清蓮行政書士事務所" 
                            required 
                            disabled={isPending}
                        />
                    </div>
                    
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
                        <Label htmlFor="password">パスワード（6文字以上）</Label>
                        <Input 
                            id="password" 
                            name="password" 
                            type="password" 
                            minLength={6}
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
                                登録中...
                            </>
                        ) : (
                            '無料でアカウントを作成'
                        )}
                    </Button>
                    
                    <div className="text-center text-sm text-muted-foreground">
                        すでにアカウントをお持ちですか？{' '}
                        <Link href="/scrivener/login" className="text-primary hover:underline">
                            ログイン
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}
