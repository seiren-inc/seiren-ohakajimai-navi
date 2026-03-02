'use client'

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { trackFormSubmit } from "@/lib/analytics/gtag"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
    gyoseishoshiInquirySchema,
    GyoseishoshiInquiryFormData,
    PreferredContactLabels,
} from "@/lib/validations/gyoseishoshi-inquiry"
import { submitGyoseishoshiInquiry } from "@/actions/submit-gyoseishoshi-inquiry"
import { PREFECTURES } from "@/lib/prefectures"

export function GyoseishoshiContactForm() {
    const [isPending, startTransition] = useTransition()

    const form = useForm<GyoseishoshiInquiryFormData>({
        resolver: zodResolver(gyoseishoshiInquirySchema),
        defaultValues: {
            lastName: "",
            firstName: "",
            email: "",
            phone: "",
            prefecture: "",
            city: "",
            content: "",
            preferredContact: undefined,
            confirmEmail: "",
        },
    })

    function onSubmit(data: GyoseishoshiInquiryFormData) {
        startTransition(async () => {
            const formData = new FormData()
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString())
                }
            })

            try {
                const result = await submitGyoseishoshiInquiry(null, formData)

                if (result.success) {
                    toast.success("ご相談を受け付けました")
                    trackFormSubmit("gyoseishoshi_contact")
                    form.reset()
                } else {
                    toast.error(result.message || "送信に失敗しました")
                    if (result.errors) {
                        Object.entries(result.errors).forEach(([key, messages]) => {
                            form.setError(key as keyof GyoseishoshiInquiryFormData, { message: messages[0] })
                        })
                    }
                }
            } catch {
                toast.error("予期せぬエラーが発生しました")
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Honeypot */}
                <FormField
                    control={form.control}
                    name="confirmEmail"
                    render={({ field }) => (
                        <FormItem className="hidden">
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b pb-2">お客様情報</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>姓 <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="山田" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>名 <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="太郎" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>メールアドレス <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="taro.yamada@example.com" {...field} type="email" />
                                </FormControl>
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
                                    <Input placeholder="090-1234-5678" {...field} type="tel" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <FormLabel>市区町村 <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="新宿区" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b pb-2">ご相談内容</h3>

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ご相談内容 <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="改葬許可申請に関するお困りの点や、ご質問を詳しくご記入ください。"
                                        className="resize-none min-h-[120px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="preferredContact"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>ご希望の連絡方法 <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                                    >
                                        {Object.entries(PreferredContactLabels).map(([key, label]) => (
                                            <FormItem key={key} className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value={key} />
                                                </FormControl>
                                                <FormLabel className="font-normal">{label}</FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isPending ? "送信中..." : "無料相談を送信する"}
                </Button>
            </form>
        </Form>
    )
}
