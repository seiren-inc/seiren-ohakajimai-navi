import { constructMetadata } from '@/lib/seo'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ScrivenerProfileEditForm } from '@/components/scrivener/ScrivenerProfileEditForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = constructMetadata({
    title: 'プロフィール編集 | マイページ | お墓じまいナビ',
    description: '行政書士プロフィールの編集ページ',
    noIndex: true,
})

export default async function ScrivenerProfileEditPage(): Promise<React.ReactElement> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/scrivener/login')
    }

    const scrivener = await prisma.administrativeScrivener.findUnique({
        where: { authUserId: user.id },
        select: {
            officeName:         true,
            representativeName: true,
            profileText:        true,
            specialties:        true,
            businessHours:      true,
            priceRangeText:     true,
            websiteUrl:         true,
            prefecture:         true,
            city:               true,
            addressLine:        true,
            phone:              true,
            email:              true,
        },
    })

    if (!scrivener) {
        redirect('/scrivener/signup')
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-50">
            {/* ナビゲーション */}
            <div className="border-b bg-white">
                <div className="container max-w-3xl px-4 py-3">
                    <Link
                        href="/scrivener/dashboard"
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        ダッシュボードに戻る
                    </Link>
                </div>
            </div>

            {/* メインコンテンツ */}
            <div className="container max-w-3xl px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        プロフィール編集
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        掲載ページに表示される情報を編集します。変更は即時反映されます。
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-6 md:p-8 shadow-sm">
                    <ScrivenerProfileEditForm initialValues={scrivener} />
                </div>
            </div>
        </div>
    )
}
