'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { startRegistration } from '@simplewebauthn/browser'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Fingerprint, Loader2, ShieldCheck, Plus } from 'lucide-react'

interface Passkey {
    id: string
    created_at: string
    friendly_name?: string
}

export function PasskeyManager() {
    const [passkeys, setPasskeys] = useState<Passkey[]>([])
    const [isSupported, setIsSupported] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            window.PublicKeyCredential &&
            typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
        ) {
            window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
                .then(setIsSupported)
                .catch(() => setIsSupported(false))
        }

        // パスキー一覧の取得
        fetchPasskeys()
    }, [])

    const fetchPasskeys = async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data } = await (supabase.auth.mfa as any).listFactors()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const passkeyList: Passkey[] = (((data as any)?.all || []) as any[]).filter(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (f: any) => f.factor_type === 'webauthn'
            )
            setPasskeys(passkeyList)
        } catch {
            // パスキーが未対応または取得失敗時は空のままで継続
            setPasskeys([])
        }
    }

    const handleRegisterPasskey = async () => {
        setIsLoading(true)
        setMessage(null)

        try {
            // Step 1: 登録チャレンジの取得
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: challengeData, error: challengeError } = await (supabase.auth as any).enrollPasskey({ challenge: true })

            if (challengeError || !challengeData) {
                throw new Error(challengeError?.message || 'チャレンジの生成に失敗しました')
            }

            // Step 2: WebAuthn 登録フローの実行
            const regResponse = await startRegistration({
                optionsJSON: challengeData,
            })

            // Step 3: 登録レスポンスをサーバーへ送信
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error: enrollError } = await (supabase.auth as any).enrollPasskey({ regResponse })

            if (enrollError) {
                throw new Error(enrollError.message)
            }

            setMessage({ type: 'success', text: 'パスキーを登録しました。次回からパスキーでログインできます。' })
            await fetchPasskeys()
        } catch (err) {
            if (err instanceof Error) {
                if (err.name === 'NotAllowedError') {
                    // ユーザーキャンセル
                    setMessage(null)
                } else {
                    setMessage({ type: 'error', text: 'パスキーの登録に失敗しました。もう一度お試しください。' })
                }
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-indigo-100">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <ShieldCheck className="h-5 w-5 text-indigo-500" />
                    セキュリティ設定
                </CardTitle>
                <CardDescription>
                    パスキー（Touch ID / Face ID / Windows Hello）を登録すると、パスワード不要でログインできます。
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* 登録済みパスキー一覧 */}
                {passkeys.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700">登録済みパスキー</p>
                        {passkeys.map((pk) => (
                            <div
                                key={pk.id}
                                className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                            >
                                <Fingerprint className="h-4 w-4 text-indigo-400 shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-800">
                                        {pk.friendly_name || 'パスキー'}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        登録日: {new Date(pk.created_at).toLocaleDateString('ja-JP')}
                                    </p>
                                </div>
                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                    有効
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {passkeys.length === 0 && (
                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center">
                        <Fingerprint className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                        <p className="text-sm text-slate-500">パスキーはまだ登録されていません</p>
                    </div>
                )}

                {/* フィードバックメッセージ */}
                {message && (
                    <div
                        className={`rounded-md p-3 text-sm ${
                            message.type === 'success'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* 新規登録ボタン */}
                {isSupported ? (
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                        onClick={handleRegisterPasskey}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                登録中...
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                パスキーを追加する
                            </>
                        )}
                    </Button>
                ) : (
                    <p className="text-center text-xs text-slate-400">
                        ご利用のブラウザはパスキーに対応していません
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
