import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import AIEstimationWizard from '@/components/estimation/AIEstimationWizard'

export const metadata: Metadata = constructMetadata({
  title: 'お墓じまいAI見積もり【無料・即時】4問で改葬費用の概算を算出',
  description: 'たった4つの質問に答えるだけ。AIがお墓じまい・改葬に必要な費用（墓石撤去・改葬先・行政書士費用）の概算を即座に算出します。個人情報不要・何度でも無料。全国対応。',
  path: '/estimation',
})

export default function EstimationPage() {
  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* 背景の装飾（モダンなグラデーション） */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden flex justify-center">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 blur-[120px]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-teal-400/20 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px]"></div>
      </div>

      <div className="container relative mx-auto px-4 py-16 md:py-24">
        {/* ウィザード本体 */}
        <AIEstimationWizard />
      </div>
    </main>
  )
}
