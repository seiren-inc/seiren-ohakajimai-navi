'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { startAuthentication } from '@simplewebauthn/browser'
import { Button } from '@/components/ui/button'
import { Fingerprint, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function PasskeyButton() {
    const [isSupported, setIsSupported] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        // パスキー（プラットフォーム認証器）の対応確認
        if (
            typeof window !== 'undefined' &&
            window.PublicKeyCredential &&
            typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
        ) {
            window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
                .then((available) => setIsSupported(available))
                .catch(() => setIsSupported(false))
        }
    }, [])

    // 非対応ブラウザ or OS では非表示
    if (!isSupported) return null

    const handlePasskeyLogin = async () => {
        setIsLoading(true)
        setError(null)

        try {
            // Step 1: Supabase から認証チャレンジを取得
            const { data: challengeData, error: challengeError } =
                // @ts-expect-error - Supabase experimental passkey API
                await supabase.auth.signInWithPasskey({ challenge: true })

            if (challengeError || !challengeData) {
                throw new Error(challengeError?.message || 'チャレンジの取得に失敗しました')
            }

            // Step 2: WebAuthn API で認証実行（指紋認証/Face ID等）
            const authResponse = await startAuthentication({
                optionsJSON: challengeData,
            })

            // Step 3: 認証レスポンスを Supabase に送信
            const { error: signInError } =
                // @ts-expect-error - Supabase experimental passkey API
                await supabase.auth.signInWithPasskey({ authResponse })

            if (signInError) {
                throw new Error(signInError.message)
            }

            // 成功：ダッシュボードへ
            router.push('/scrivener/dashboard')
            router.refresh()
        } catch (err) {
            if (err instanceof Error) {
                // ユーザーがキャンセルした場合は無言で終了
                if (err.name === 'NotAllowedError') {
                    setError(null)
                } else {
                    setError('パスキー認証に失敗しました。パスワードでログインしてください。')
                }
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-2">
            <Button
                type="button"
                variant="outline"
                className="w-full flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                onClick={handlePasskeyLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        認証中...
                    </>
                ) : (
                    <>
                        <Fingerprint className="h-4 w-4" />
                        パスキーでログイン（Touch ID / Face ID）
                    </>
                )}
            </Button>
            {error && (
                <p className="text-xs text-destructive text-center">{error}</p>
            )}
        </div>
    )
}
