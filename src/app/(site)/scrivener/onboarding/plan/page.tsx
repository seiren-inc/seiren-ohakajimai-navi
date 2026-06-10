export const dynamic = "force-dynamic"

import { constructMetadata } from "@/lib/seo"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ScrivenerPlanSelectionForm } from "@/components/scrivener/ScrivenerPlanSelectionForm"

export const metadata = constructMetadata({
    title: "プラン選択｜お墓じまいナビ",
    description: "行政書士向けの掲載プランを選択します。",
    noIndex: true,
})

export default async function ScrivenerPlanSelectionPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/scrivener/login')
    }

    const scrivener = await prisma.administrativeScrivener.findUnique({
        where: { authUserId: user.id },
        select: { id: true, planType: true, paymentStatus: true }
    })

    if (!scrivener) {
        redirect('/scrivener/signup')
    }

    // 既に支払済みの場合はダッシュボードへ
    if (scrivener.paymentStatus === 'PAID') {
        redirect('/scrivener/dashboard')
    }

    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-5xl space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">料金プランの選択</h1>
                    <p className="mt-4 text-lg text-slate-600">
                        14日間の無料トライアルから始められます。掲載期間中いつでもキャンセル可能です。
                    </p>
                </div>
                
                <ScrivenerPlanSelectionForm currentPlan={scrivener.planType} />
            </div>
        </div>
    )
}
