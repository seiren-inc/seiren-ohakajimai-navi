export const dynamic = "force-dynamic"

import { ScrivenerProfileOnboardingForm } from "@/components/scrivener/ScrivenerProfileOnboardingForm"
import { constructMetadata } from "@/lib/seo"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export const metadata = constructMetadata({
    title: "プロフィール作成｜お墓じまいナビ",
    description: "AIを使って専門家プロフィールを作成します。",
    noIndex: true,
})

export default async function ScrivenerProfileOnboardingPage() {
    // セッションチェック & AdminScrivenerレコードの取得
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/scrivener/login')
    }

    const scrivener = await prisma.administrativeScrivener.findUnique({
        where: { authUserId: user.id },
        select: { id: true, officeName: true, prefecture: true, profileText: true }
    })

    if (!scrivener) {
        redirect('/scrivener/signup')
    }

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-4xl space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">プロフィールの作成 ✨</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        AIがあなたの強みを分析し、ユーザーから選ばれる魅力的なプロフィールを自動生成します。<br />
                        生成後に編集することも可能です。
                    </p>
                </div>
                
                <ScrivenerProfileOnboardingForm 
                    initialOfficeName={scrivener.officeName} 
                    initialProfile={scrivener.profileText} 
                />
            </div>
        </div>
    )
}
