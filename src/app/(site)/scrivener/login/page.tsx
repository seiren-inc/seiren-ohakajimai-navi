import { ScrivenerLoginForm } from "@/components/scrivener/ScrivenerLoginForm"
import { constructMetadata } from "@/lib/seo"

export const metadata = constructMetadata({
    title: "行政書士ログイン｜お墓じまいナビ",
    description: "提携行政書士のマイページへログインします。",
    noIndex: true,
})

export default function ScrivenerLoginPage() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">提携行政書士 ログイン</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        メールアドレスとパスワードを入力してください
                    </p>
                </div>
                
                <ScrivenerLoginForm />
            </div>
        </div>
    )
}
