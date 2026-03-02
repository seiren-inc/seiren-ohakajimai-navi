'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from 'react-qr-code'
import { trackDiagnosisComplete } from '@/lib/analytics/gtag'
import { 
  Building2,
  Trees,
  Landmark,
  HelpCircle,
  Maximize,
  Grid3X3,
  Map,
  Truck,
  Wind,
  Waves,
  Home,
  ArrowRight,
  ArrowLeft,
  Calculator,
  Loader2,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react'

// --- 型定義 ---
type Option = {
  id: string
  label: string
  icon: React.ElementType
  minAdd: number
  maxAdd: number
  desc?: string
}

type Question = {
  id: string
  title: string
  subtitle?: string
  options: Option[]
}

// --- 質問データ ---
const QUESTIONS: Question[] = [
  {
    id: 'q1_type',
    title: '現在のお墓はどのような場所にありますか？',
    subtitle: '場所によって解体手続きや必要な供養が異なります',
    options: [
      { id: 'temple', label: '寺院墓地', icon: Landmark, minAdd: 100000, maxAdd: 300000, desc: '（お布施・離檀料の目安含む）' },
      { id: 'public', label: '公営霊園', icon: Trees, minAdd: 0, maxAdd: 0 },
      { id: 'private', label: '民営霊園', icon: Building2, minAdd: 0, maxAdd: 0 },
      { id: 'unknown', label: 'わからない', icon: HelpCircle, minAdd: 50000, maxAdd: 100000 },
    ]
  },
  {
    id: 'q2_size',
    title: 'お墓の広さはどのくらいですか？',
    subtitle: 'おおよその面積で構いません',
    options: [
      { id: 'small', label: '1㎡未満', icon: Maximize, minAdd: 150000, maxAdd: 250000, desc: '（畳半分程度）' },
      { id: 'medium', label: '2㎡〜3㎡程度', icon: Grid3X3, minAdd: 300000, maxAdd: 500000, desc: '（畳1〜2帖程度）' },
      { id: 'large', label: '4㎡以上', icon: Map, minAdd: 600000, maxAdd: 1000000, desc: '（大きめのお墓）' },
      { id: 'unknown', label: 'わからない', icon: HelpCircle, minAdd: 300000, maxAdd: 600000 },
    ]
  },
  {
    id: 'q3_access',
    title: 'お墓に面した通路は広く、重機や車が入る環境ですか？',
    subtitle: '解体作業の難易度に関わります',
    options: [
      { id: 'yes', label: 'はい', icon: Truck, minAdd: 0, maxAdd: 0, desc: '（近くまで車が行ける）' },
      { id: 'no', label: 'いいえ', icon: Wind, minAdd: 100000, maxAdd: 200000, desc: '（階段や山道・狭い通路）' },
      { id: 'unknown', label: 'わからない', icon: HelpCircle, minAdd: 50000, maxAdd: 100000 },
    ]
  },
  {
    id: 'q4_next',
    title: '取り出した後の「お骨」はどうされる予定ですか？',
    subtitle: '次の供養先の手配費用が含まれます',
    options: [
      { id: 'eitai', label: '永代供養・樹木葬', icon: Trees, minAdd: 100000, maxAdd: 300000 },
      { id: 'ocean', label: '海洋散骨したい', icon: Waves, minAdd: 50000, maxAdd: 150000 },
      { id: 'home', label: '手元供養する', icon: Home, minAdd: 30000, maxAdd: 80000 },
      { id: 'unknown', label: 'まだ決まっていない', icon: HelpCircle, minAdd: 100000, maxAdd: 250000 },
    ]
  }
]

// --- 計算ロジック ---
const calculateEstimate = (answers: Record<string, Option>) => {
  let min = 0
  let max = 0
  // 基本代行手数料
  min += 50000
  max += 100000

  Object.values(answers).forEach(opt => {
    min += opt.minAdd
    max += opt.maxAdd
  })

  return { min, max }
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function AIEstimationWizard() {
  const [step, setStep] = useState(-1) // -1: Start, 0-3: Questions, 4: Loading, 5: Result
  const [answers, setAnswers] = useState<Record<string, Option>>({})
  const [progressValue, setProgressValue] = useState(0)
  
  // スマホ/PC判定
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  
  useEffect(() => {
    setIsMounted(true);
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  // GA4: 診断完了トラッキング
  useEffect(() => {
    if (step === QUESTIONS.length + 1) {
      const resultStr = `${answers['q1_type']?.label} / ${answers['q2_size']?.label}`
      trackDiagnosisComplete(resultStr)

      // Supabase: ログ保存
      const result = calculateEstimate(answers)
      fetch("/api/simulation-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "AI_ESTIMATION",
          inputParams: answers,
          resultAmount: result.max, // 最大値を代表値として保存
        }),
      }).catch(err => console.error("Failed to save simulation log:", err))
    }
  }, [step, answers])

  const handleSelect = (questionId: string, option: Option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }))
    
    // 短いディレイを入れて自動遷移（心地よいUIのため）
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1)
      } else {
        startLoading()
      }
    }, 400)
  }

  const startLoading = () => {
    setStep(QUESTIONS.length)
    setProgressValue(0)
    
    const duration = 2500
    const interval = 50
    const steps = duration / interval
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      setProgressValue(Math.min(Math.round((currentStep / steps) * 100), 100))
      
      if (currentStep >= steps) {
        clearInterval(timer)
        setTimeout(() => setStep(QUESTIONS.length + 1), 300) // 結果画面へ
      }
    }, interval)
  }

  // --- アニメーション設定 ---
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  }

  // 結果計算
  const result = step > QUESTIONS.length ? calculateEstimate(answers) : { min: 0, max: 0 }

  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
      <AnimatePresence mode="wait" custom={1}>
        {/* ========================================================= */}
        {/* START SCREEN */}
        {/* ========================================================= */}
        {step === -1 && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-teal-600 text-white shadow-lg">
              <Sparkles className="h-10 w-10" />
            </div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              お墓じまい AI自動見積もり
            </h2>
            <p className="mb-8 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
              4つの質問に答えるだけで、AIがあなたのお墓じまいに必要な「おおよその費用相場」を即座に計算します。個人情報の入力は不要です。
            </p>
            <button
              onClick={() => setStep(0)}
              className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-slate-900 px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105 hover:bg-slate-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-slate-900/20 active:scale-95"
            >
              <span>無料で見積もりを始める</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="mt-4 text-xs text-slate-400">所要時間: 約30秒</p>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* QUESTIONS SCREEN */}
        {/* ========================================================= */}
        {step >= 0 && step < QUESTIONS.length && (
          <motion.div
            key={`q-${step}`}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex flex-col"
          >
            {/* ステップインジケーター */}
            <div className="mb-8 flex items-center justify-between text-sm font-medium text-slate-400">
              <button 
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 hover:text-slate-600 transition-colors disabled:opacity-0"
                disabled={step === 0}
              >
                <ArrowLeft className="w-4 h-4" /> 戻る
              </button>
              <span>Step {step + 1} of {QUESTIONS.length}</span>
            </div>

            {/* 質問文 */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 sm:text-2xl leading-snug">
                {QUESTIONS[step].title}
              </h3>
              {QUESTIONS[step].subtitle && (
                <p className="mt-2 text-sm text-slate-500">
                  {QUESTIONS[step].subtitle}
                </p>
              )}
            </div>

            {/* 選択肢 */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {QUESTIONS[step].options.map((opt) => {
                const isSelected = answers[QUESTIONS[step].id]?.id === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(QUESTIONS[step].id, opt)}
                    className={cn(
                      "group relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200",
                      isSelected 
                        ? "border-emerald-500 bg-emerald-50 shadow-md ring-1 ring-emerald-500" 
                        : "border-white/60 bg-white/40 hover:border-slate-300 hover:bg-white/80 hover:shadow-sm"
                    )}
                  >
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                      isSelected ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    )}>
                      <opt.icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className={cn("font-bold", isSelected ? "text-emerald-900" : "text-slate-700")}>
                        {opt.label}
                      </span>
                      {opt.desc && (
                        <span className={cn("text-[11px] mt-0.5", isSelected ? "text-emerald-600" : "text-slate-400")}>
                          {opt.desc}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* LOADING SCREEN */}
        {/* ========================================================= */}
        {step === QUESTIONS.length && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
              <svg className="absolute inset-0 h-full w-full -rotate-90 text-emerald-500" viewBox="0 0 100 100">
                <circle
                  className="stroke-current transition-all duration-100 ease-out"
                  strokeWidth="4"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progressValue) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  cx="50"
                  cy="50"
                  r="45"
                />
              </svg>
              <Calculator className="h-8 w-8 animate-pulse text-emerald-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">
              AIが最適なプランを算出中...
            </h3>
            <p className="text-sm text-slate-500">
              入力いただいた条件（{answers['q1_type']?.label} / {answers['q2_size']?.label} など）をもとに、概算費用と必要な手続きを計算しています。
            </p>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* RESULT SCREEN */}
        {/* ========================================================= */}
        {step === QUESTIONS.length + 1 && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
          >
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> 計算完了
              </div>
              <h3 className="text-slate-600 font-medium mb-1">あなたのお墓じまい概算費用</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black tracking-tighter text-slate-900 sm:text-5xl">
                  {(result.min / 10000).toLocaleString()}
                </span>
                <span className="text-xl font-bold text-slate-500">万</span>
                <span className="text-3xl font-light text-slate-400 mx-2">〜</span>
                <span className="text-4xl font-black tracking-tighter text-slate-900 sm:text-5xl">
                  {(result.max / 10000).toLocaleString()}
                </span>
                <span className="text-xl font-bold text-slate-500">万円</span>
              </div>
            </div>

            {/* 回答のサマリー */}
            <div className="mb-8 rounded-2xl bg-white/40 p-5 border border-white/60">
              <p className="mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">算出条件</p>
              <ul className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <li className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">1. お墓の場所</span>
                  <span className="font-medium text-slate-800">{answers['q1_type']?.label}</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">2. 広さ</span>
                  <span className="font-medium text-slate-800">{answers['q2_size']?.label}</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">3. 重機搬入</span>
                  <span className="font-medium text-slate-800">{answers['q3_access']?.label}</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">4. 次の納骨先</span>
                  <span className="font-medium text-slate-800">{answers['q4_next']?.label}</span>
                </li>
              </ul>
            </div>

            {/* CVR最大化のCTA */}
            <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
              
              <h4 className="mb-2 text-lg font-bold leading-tight">
                この条件で、専門家に正確な無料見積もりと手続きの相談をしませんか？
              </h4>
              <p className="mb-6 text-sm text-slate-300">
                上記の概算は目安です。現地調査に基づく正確なお見積りと、役所の煩わしい改葬許可手続きについては、提携の専門家（行政書士・石材店）が無料でご相談に乗ります。
              </p>
              
              <div className="flex flex-col gap-3">
                {(() => {
                  const message = `【AIお墓じまい見積もり結果】
■算出条件
・場所：${answers['q1_type']?.label}
・広さ：${answers['q2_size']?.label}
・アクセス：${answers['q3_access']?.label}
・次の供養：${answers['q4_next']?.label}

■概算費用
${(result.min / 10000).toLocaleString()}万 〜 ${(result.max / 10000).toLocaleString()}万円

この条件で詳しく相談したいです。`;
                  
                  const lineUrl = `https://lin.ee/h0TINzZ`; 


                  // SSR / ハイドレーション中は安全なフォールバックUIを表示
                  if (!isMounted) {
                    return (
                      <div className="group flex w-full items-center justify-between rounded-xl bg-emerald-500 px-5 py-4 font-bold text-white opacity-80">
                        <span className="flex items-center gap-2">
                          LINEを開く準備中...
                        </span>
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                    )
                  }

                  if (!isMobile) {
                    return (
                      <div className="rounded-xl bg-white/10 border border-white/20 p-5 text-center">
                        <p className="text-sm font-bold text-white mb-4">
                          スマホでQRコードを読み取ってLINE相談
                        </p>
                        <div className="bg-white p-3 rounded-xl inline-block mb-3">
                          <QRCode value={lineUrl} size={120} />
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          1. スマホのカメラでQRコードを読み取る<br/>
                          2. 「清蓮」公式アカウントを友だち追加<br/>
                          3. 以下のテキストをコピーして送信
                        </p>
                        <button
                          onClick={async () => {
                            await navigator.clipboard.writeText(message);
                            alert('結果をコピーしました！LINEのトークに貼り付けてください。');
                          }}
                          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors"
                        >
                          結果テキストをコピーする
                        </button>
                      </div>
                    )
                  }


                  // モバイル向け：直接LINEを開くボタン
                  return (
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(message);
                          alert('見積もり結果をコピーしました！\nLINEのトーク画面に「貼り付け」して送信してください。');
                          window.open(lineUrl, '_blank');
                        } catch (err) {
                          window.open(lineUrl, '_blank');
                        }
                      }}
                      className="group flex w-full items-center justify-between rounded-xl bg-emerald-500 px-5 py-4 font-bold text-white transition-all hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
                    >
                      <span className="flex items-center gap-2">
                        LINEを開く <span className="text-xs font-normal opacity-90">（結果を自動コピーします）</span>
                      </span>
                      <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  )
                })()}


                <a
                  href="/contact"
                  className="group flex w-full items-center justify-between rounded-xl bg-white/10 border border-white/20 px-5 py-4 font-bold text-white transition-all hover:bg-white/20"
                >
                  <span className="flex items-center gap-2">
                    メール・電話で相談する
                  </span>
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
              <p className="mt-4 text-center text-xs text-slate-400">
                ※入力情報は保存されず、無理な営業等は一切ございません。
              </p>
            </div>

            <button 
              onClick={() => { setStep(-1); setAnswers({}); }}
              className="mt-6 text-center text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              最初からやり直す
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
