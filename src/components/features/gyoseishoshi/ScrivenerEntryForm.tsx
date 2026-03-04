'use client'

import { useActionState, useTransition, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2, CheckCircle2, ChevronRight, ChevronLeft, Star } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

import {
    scrivenerEntrySchema,
    PLAN_INFO,
    PLAN_TYPES,
    type ScrivenerEntryFormData,
    type PlanType,
} from "@/lib/validations/scrivener-entry"
import { submitScrivenerEntry } from "@/actions/submit-scrivener-entry"
import { PREFECTURES } from "@/lib/prefectures"

type Step = 1 | 2 | 3

const STEP_LABELS: Record<Step, string> = {
    1: "プラン選択",
    2: "事務所情報入力",
    3: "確認・送信",
}

export function ScrivenerEntryForm() {
    const [currentStep, setCurrentStep] = useState<Step>(1)
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const form = useForm<ScrivenerEntryFormData>({
        resolver: zodResolver(scrivenerEntrySchema),
        defaultValues: {
            planType: undefined,
            officeName: "",
            representativeName: "",
            registrationNumber: "",
            email: "",
            phone: "",
            prefecture: "",
            city: "",
            profileText: "",
            specialties: "",
            priceRangeText: "",
            businessHours: "",
            websiteUrl: "",
            confirmEmail: "",
        },
        mode: "onBlur",
    })

    const watchedPlan = form.watch("planType")
    const formValues = form.getValues()

    // Step1 → Step2 バリデーション
    async function goToStep2() {
        const planValid = await form.trigger("planType")
        if (!planValid) return
        setCurrentStep(2)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // Step2 → Step3 バリデーション
    async function goToStep3() {
        const fields: (keyof ScrivenerEntryFormData)[] = [
            "officeName", "email", "phone", "prefecture", "profileText",
        ]
        const valid = await form.trigger(fields)
        if (!valid) return
        setCurrentStep(3)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    function goBack() {
        setCurrentStep((prev) => (prev - 1) as Step)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    function onSubmit(data: ScrivenerEntryFormData) {
        startTransition(async () => {
            const formData = new FormData()
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString())
                }
            })

            try {
                const result = await submitScrivenerEntry(null, formData)

                if (!result.success) {
                    toast.error(result.message || "送信に失敗しました")
                    if (result.errors) {
                        Object.entries(result.errors).forEach(([key, messages]) => {
                            form.setError(key as keyof ScrivenerEntryFormData, { message: (messages as string[])[0] })
                        })
                        setCurrentStep(2)
                    }
                    return
                }

                if (result.checkoutUrl) {
                    setIsRedirecting(true)
                    window.location.href = result.checkoutUrl
                } else {
                    // Stripe未設定時はサンクスページへ
                    router.push("/gyoseishoshi/entry/thanks")
                }
            } catch {
                toast.error("予期せぬエラーが発生しました。しばらく時間をおいて再度お試しください。")
            }
        })
    }

    const isLoading = isPending || isRedirecting

    return (
        <div className="space-y-6">
            {/* ステップインジケーター */}
            <nav aria-label="申込ステップ">
                <ol className="flex items-center">
                    {([1, 2, 3] as Step[]).map((step, index) => (
                        <li key={step} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                                        step < currentStep
                                            ? "bg-emerald-600 text-white"
                                            : step === currentStep
                                            ? "border-2 border-emerald-600 bg-white text-emerald-600"
                                            : "border-2 border-neutral-200 bg-white text-neutral-400"
                                    }`}
                                >
                                    {step < currentStep ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        step
                                    )}
                                </div>
                                <span
                                    className={`mt-1 text-xs hidden sm:block ${
                                        step === currentStep ? "font-semibold text-emerald-700" : "text-neutral-400"
                                    }`}
                                >
                                    {STEP_LABELS[step]}
                                </span>
                            </div>
                            {index < 2 && (
                                <div
                                    className={`flex-1 h-0.5 mx-2 transition-colors ${
                                        step < currentStep ? "bg-emerald-600" : "bg-neutral-200"
                                    }`}
                                />
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Honeypot */}
                    <FormField
                        control={form.control}
                        name="confirmEmail"
                        render={({ field }) => (
                            <FormItem className="hidden" aria-hidden>
                                <FormControl>
                                    <Input {...field} tabIndex={-1} autoComplete="off" />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* ========== STEP 1: プラン選択 ========== */}
                    {currentStep === 1 && (
                        <div className="space-y-4" id="step-plan">
                            <h2 className="text-lg font-bold text-neutral-900">掲載プランを選択してください</h2>
                            <p className="text-sm text-neutral-600">
                                すべてのプランは月額制（自動更新）です。いつでも解約可能です。
                            </p>

                            <FormField
                                control={form.control}
                                name="planType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="grid gap-4 sm:grid-cols-3">
                                                {PLAN_TYPES.map((plan) => {
                                                    const info = PLAN_INFO[plan]
                                                    const isSelected = field.value === plan
                                                    return (
                                                        <button
                                                            key={plan}
                                                            type="button"
                                                            onClick={() => field.onChange(plan)}
                                                            className={`relative flex flex-col rounded-xl border-2 p-5 text-left transition-all hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${
                                                                isSelected
                                                                    ? "border-emerald-600 bg-emerald-50"
                                                                    : "border-neutral-200 bg-white"
                                                            }`}
                                                            aria-pressed={isSelected}
                                                        >
                                                            {info.recommended && (
                                                                <span className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                                    <Badge className="bg-emerald-600 text-white text-xs">
                                                                        <Star className="h-3 w-3 mr-1" />
                                                                        おすすめ
                                                                    </Badge>
                                                                </span>
                                                            )}
                                                            <div className="flex items-center justify-between mb-3">
                                                                <span className="font-bold text-neutral-900">
                                                                    {info.label}
                                                                </span>
                                                                {isSelected && (
                                                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                                                                )}
                                                            </div>
                                                            <div className="mb-4">
                                                                <span className="text-2xl font-bold text-emerald-700">
                                                                    ¥{info.price.toLocaleString()}
                                                                </span>
                                                                <span className="text-sm text-neutral-500">/月</span>
                                                            </div>
                                                            <ul className="space-y-1.5">
                                                                {info.features.map((f) => (
                                                                    <li key={f} className="flex items-start gap-1.5 text-sm text-neutral-700">
                                                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                                                        {f}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <p className="text-xs text-neutral-500 mt-4">
                                ※ 掲載開始は審査完了後となります。審査には2〜5営業日かかる場合があります。
                            </p>

                            <Button
                                type="button"
                                size="lg"
                                className="w-full"
                                onClick={goToStep2}
                                disabled={!watchedPlan}
                            >
                                次へ：事務所情報を入力する
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    )}

                    {/* ========== STEP 2: 事務所情報入力 ========== */}
                    {currentStep === 2 && (
                        <div className="space-y-6" id="step-info">
                            <div>
                                <h2 className="text-lg font-bold text-neutral-900">事務所情報を入力してください</h2>
                                <p className="mt-1 text-sm text-neutral-600">
                                    <span className="text-red-500">*</span> は必須項目です。
                                </p>
                            </div>

                            {/* 基本情報 */}
                            <div className="space-y-4 rounded-lg border p-5">
                                <h3 className="font-semibold text-neutral-900 border-b pb-2">基本情報</h3>

                                <FormField
                                    control={form.control}
                                    name="officeName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>事務所名 <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="〇〇行政書士事務所" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="representativeName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>代表者名</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="山田 太郎" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="registrationNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>登録番号</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="第12345号" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="prefecture"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>都道府県 <span className="text-red-500">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="選択してください" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {PREFECTURES.map((pref) => (
                                                            <SelectItem key={pref.code} value={pref.name}>
                                                                {pref.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>市区町村</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="新宿区" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* 連絡先 */}
                            <div className="space-y-4 rounded-lg border p-5">
                                <h3 className="font-semibold text-neutral-900 border-b pb-2">連絡先</h3>

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>メールアドレス <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="office@example.com"
                                                    autoComplete="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>Stripe決済の確認メールが送信されます</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>電話番号 <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder="03-1234-5678"
                                                    autoComplete="tel"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="websiteUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ウェブサイトURL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="url"
                                                    placeholder="https://www.example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="businessHours"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>営業時間</FormLabel>
                                            <FormControl>
                                                <Input placeholder="平日 9:00〜18:00" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* 掲載情報 */}
                            <div className="space-y-4 rounded-lg border p-5">
                                <h3 className="font-semibold text-neutral-900 border-b pb-2">掲載情報</h3>

                                <FormField
                                    control={form.control}
                                    name="profileText"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>プロフィール <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="事務所の特徴や強み、改葬手続きのサポート実績などをご記入ください。"
                                                    className="resize-none min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>10〜1000文字</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="specialties"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>得意分野</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="改葬許可申請, 遺産相続, 在留資格"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>カンマ区切りで入力してください</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="priceRangeText"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>料金目安</FormLabel>
                                            <FormControl>
                                                <Input placeholder="3万円〜（内容により異なります）" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    className="flex-1"
                                    onClick={goBack}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    戻る
                                </Button>
                                <Button
                                    type="button"
                                    size="lg"
                                    className="flex-1"
                                    onClick={goToStep3}
                                >
                                    確認画面へ
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ========== STEP 3: 確認・送信 ========== */}
                    {currentStep === 3 && (
                        <div className="space-y-6" id="step-confirm">
                            <h2 className="text-lg font-bold text-neutral-900">入力内容を確認してください</h2>

                            {/* 選択プラン */}
                            <div className="rounded-xl border-2 border-emerald-600 bg-emerald-50 p-5">
                                <p className="text-sm font-semibold text-emerald-700 mb-1">選択中のプラン</p>
                                {watchedPlan && (
                                    <>
                                        <p className="text-xl font-bold text-neutral-900">
                                            {PLAN_INFO[watchedPlan as PlanType].label}プラン
                                        </p>
                                        <p className="text-emerald-700 font-semibold">
                                            ¥{PLAN_INFO[watchedPlan as PlanType].price.toLocaleString()}/月
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* 入力情報サマリー */}
                            <dl className="rounded-lg border divide-y text-sm">
                                {[
                                    { label: "事務所名", value: formValues.officeName },
                                    { label: "代表者名", value: formValues.representativeName || "—" },
                                    { label: "登録番号", value: formValues.registrationNumber || "—" },
                                    { label: "都道府県", value: formValues.prefecture },
                                    { label: "市区町村", value: formValues.city || "—" },
                                    { label: "メールアドレス", value: formValues.email },
                                    { label: "電話番号", value: formValues.phone },
                                    { label: "ウェブサイト", value: formValues.websiteUrl || "—" },
                                    { label: "営業時間", value: formValues.businessHours || "—" },
                                    { label: "得意分野", value: formValues.specialties || "—" },
                                    { label: "料金目安", value: formValues.priceRangeText || "—" },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex px-4 py-3">
                                        <dt className="w-1/3 font-medium text-neutral-500 shrink-0">{label}</dt>
                                        <dd className="text-neutral-900 break-all">{value}</dd>
                                    </div>
                                ))}
                                <div className="px-4 py-3">
                                    <dt className="font-medium text-neutral-500 mb-1">プロフィール</dt>
                                    <dd className="text-neutral-900 whitespace-pre-wrap text-xs">
                                        {formValues.profileText}
                                    </dd>
                                </div>
                            </dl>

                            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
                                <p className="font-semibold mb-1">ご確認ください</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    <li>送信後、Stripe決済ページに移動します。</li>
                                    <li>決済完了後、当社による審査を経て掲載が開始されます（2〜5営業日）。</li>
                                    <li>審査の結果、掲載をお断りする場合があります。その際は速やかにご連絡します。</li>
                                </ul>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    className="flex-1"
                                    onClick={goBack}
                                    disabled={isLoading}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    修正する
                                </Button>
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {isRedirecting ? "決済ページへ移動中..." : "送信中..."}
                                        </>
                                    ) : (
                                        <>
                                            決済へ進む
                                            <ChevronRight className="h-4 w-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            </Form>
        </div>
    )
}
