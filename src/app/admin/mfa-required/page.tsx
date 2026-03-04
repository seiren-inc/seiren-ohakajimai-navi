import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * MFA未完了ユーザー向け案内ページ
 * middleware.tsでAAL2未達のユーザーがリダイレクトされる先。
 * ユーザーはここでMFA設定を促される。
 */
export default async function MfaRequiredPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-xl shadow-sm border p-8 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                            <ShieldAlert className="h-8 w-8 text-amber-600" />
                        </div>
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-neutral-900">
                            二段階認証（MFA）が必要です
                        </h1>
                        <p className="mt-3 text-sm text-neutral-600">
                            管理画面へのアクセスには、二段階認証（TOTP）の設定が必須です。
                            認証アプリ（Google Authenticator等）を使用してMFAを設定してください。
                        </p>
                    </div>

                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800 text-left space-y-2">
                        <p className="font-semibold">設定手順</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Supabaseダッシュボードにアクセス</li>
                            <li>アカウント設定 → セキュリティ → MFA</li>
                            <li>認証アプリでQRコードをスキャン</li>
                            <li>確認コードを入力して設定完了</li>
                        </ol>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button asChild className="w-full">
                            <Link href="/login">ログインページに戻る</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
