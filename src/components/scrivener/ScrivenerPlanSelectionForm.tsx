'use client'

import { useActionState } from 'react'
import { createScrivenerCheckoutSession } from '@/actions/scrivener/payment'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Loader2 } from 'lucide-react'
import { ScrivenerPlanType } from '@prisma/client'

const PLANS = [
    {
        name: 'BASIC',
        id: 'BASIC' as ScrivenerPlanType,
        price: '9,800',
        description: '手軽に始めたい方に最適なプラン',
        features: ['基本プロフィール掲載', '標準検索順位（スコア10）', '月間3件までの問い合わせ受信可'],
        cta: 'BASICを選択',
    },
    {
        name: 'STANDARD',
        id: 'STANDARD' as ScrivenerPlanType,
        price: '19,800',
        description: '標準的な集客機能が揃った推奨プラン',
        features: ['充実プロフィール掲載', '検索上位表示（スコア50）', '無制限の問い合わせ受信可', 'AIアシスト無制限'],
        cta: 'STANDARDを選択',
        recommended: true,
    },
    {
        name: 'PREMIUM',
        id: 'PREMIUM' as ScrivenerPlanType,
        price: '29,800',
        description: 'エリア独占を狙いたい方向け',
        features: ['トップ表示保証（スコア100）', '無制限の問い合わせ受信可', '優先的なカスタマーサポート', 'SEOコンサルティング月1回'],
        cta: 'PREMIUMを選択',
    }
]

export function ScrivenerPlanSelectionForm({ currentPlan }: { currentPlan?: string }) {
    const [state, formAction, isPending] = useActionState(createScrivenerCheckoutSession, { error: '', success: false })

    return (
        <div className="space-y-6">
            {state?.error && (
                <div className="rounded bg-destructive/15 p-4 text-center text-sm text-destructive mx-auto max-w-2xl">
                    {state.error}
                </div>
            )}
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {PLANS.map((plan) => (
                    <form key={plan.id} action={formAction} className="flex h-full">
                        <Card 
                            className={`flex flex-col w-full ${plan.recommended ? 'border-indigo-600 shadow-lg relative' : 'border-slate-200'}`}
                        >
                            {plan.recommended && (
                                <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-indigo-600 px-3 py-1 text-center text-xs font-semibold text-white">
                                    一番人気
                                </div>
                            )}
                            <CardHeader className="text-center pb-8 pt-10">
                                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                <CardDescription className="pt-2 h-10">{plan.description}</CardDescription>
                                <div className="mt-4 flex items-baseline justify-center text-5xl font-extrabold">
                                    <span className="text-3xl font-medium tracking-tight text-slate-500 mr-1">¥</span>
                                    {plan.price}
                                    <span className="ml-1 text-xl font-medium text-slate-500">/月</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start">
                                            <Check className="h-5 w-5 shrink-0 text-indigo-500" />
                                            <span className="ml-3 text-sm text-slate-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="pt-8 mt-auto">
                                <input type="hidden" name="planType" value={plan.id} />
                                <Button 
                                    type="submit" 
                                    className="w-full h-12 text-md font-bold" 
                                    variant={plan.recommended ? 'default' : 'outline'}
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 遷移中...</>
                                    ) : (
                                        plan.cta
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                ))}
            </div>
            <div className="text-center text-sm text-muted-foreground mt-8">
                決済はStripeのセキュアなページで行われます。14日間無料トライアル終了後に課金が開始されます。
            </div>
        </div>
    )
}
