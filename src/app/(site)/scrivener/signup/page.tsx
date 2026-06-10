import { ScrivenerSignupForm } from "@/components/scrivener/ScrivenerSignupForm"
import { constructMetadata } from "@/lib/seo"

export const metadata = constructMetadata({
    title: "行政書士アカウント登録｜お墓じまいナビ",
    description: "お墓じまいナビの提携行政書士としてアカウントを作成します。",
    noIndex: true,
})

export default function ScrivenerSignupPage() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">提携行政書士 登録</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        基本情報を入力してアカウントを作成してください
                    </p>
                </div>
                
                <ScrivenerSignupForm />
            </div>
        </div>
    )
}
