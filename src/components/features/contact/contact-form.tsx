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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
    inquirySchema,
    InquiryFormData,
    CemeteryType,
    ConsiderationPeriod,
    DestinationType,
    BoneServiceType,
    ContainerType
} from "@/lib/validations/inquiry"
import { submitInquiry } from "@/actions/submit-inquiry"

export function ContactForm() {
    const [isPending, startTransition] = useTransition()

    const form = useForm<InquiryFormData>({
        resolver: zodResolver(inquirySchema),
        defaultValues: {
            lastName: "",
            firstName: "",
            lastNameKana: "",
            firstNameKana: "",
            email: "",
            phone: "",
            postalCode: "",
            prefecture: "",
            city: "",
            addressDetail: "",
            cemeteryType: undefined,
            considerationPeriod: undefined,
            content: "",
            destinationType: undefined,
            boneServiceType: undefined,
            containerType: undefined,
            ritanConsultation: false,
            confirmEmail: "", // Honeypot
        },
    })

    function onSubmit(data: InquiryFormData) {
        startTransition(async () => {
            const formData = new FormData()
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString())
                }
            })

            try {
                const result = await submitInquiry(null, formData)

                if (result.success) {
                    toast.success("お問い合わせを受け付けました")
                    trackFormSubmit("contact")
                    // Redirect is handled in Server Action, but we can reset form here just in case
                    form.reset()
                } else {
                    toast.error(result.message || "送信に失敗しました")
                    if (result.errors) {
                        Object.entries(result.errors).forEach(([key, messages]) => {
                            form.setError(key as keyof InquiryFormData, { message: messages[0] })
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

                {/* Hidden Honeypot */}
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

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="lastNameKana"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>セイ <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="ヤマダ" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="firstNameKana"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>メイ <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="タロウ" {...field} />
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
                                <FormDescription>ハイフンなしでも入力可能です。</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-[120px_1fr] gap-4 items-end">
                        <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>郵便番号 <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        {/* Add onChange handler for auto-address later */}
                                        <Input placeholder="1234567" {...field} maxLength={8} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                            {/* Populate pref list properly later, simplified for brevity */}
                                            <SelectItem value="東京都">東京都</SelectItem>
                                            <SelectItem value="神奈川県">神奈川県</SelectItem>
                                            <SelectItem value="埼玉県">埼玉県</SelectItem>
                                            <SelectItem value="千葉県">千葉県</SelectItem>
                                            <SelectItem value="その他">その他</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

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

                    <FormField
                        control={form.control}
                        name="addressDetail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>番地・建物名など</FormLabel>
                                <FormControl>
                                    <Input placeholder="西新宿2-8-1 都庁第一本庁舎" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b pb-2">ご相談内容</h3>

                    <FormField
                        control={form.control}
                        name="cemeteryType"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>墓地の種類 <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        {Object.entries(CemeteryType).map(([key, label]) => (
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

                    <FormField
                        control={form.control}
                        name="considerationPeriod"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>検討時期 <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        {Object.entries(ConsiderationPeriod).map(([key, label]) => (
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

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ご相談内容詳細 <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="現在のお墓の状況や、お困りの点などを詳しくご記入ください。"
                                        className="resize-none min-h-[120px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="pt-4 pb-2">
                        <h4 className="font-semibold text-sm text-muted-foreground">任意オプション</h4>
                    </div>

                    <FormField
                        control={form.control}
                        name="destinationType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>改葬先（新しい供養先）</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="選択してください（任意）" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.entries(DestinationType).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="boneServiceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>遺骨サポート（洗骨・粉骨）</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="選択してください（任意）" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(BoneServiceType).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="containerType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>容器（骨壷・骨箱）</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="選択してください（任意）" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(ContainerType).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="ritanConsultation"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        離檀交渉のサポートを希望する
                                    </FormLabel>
                                    <FormDescription>
                                        お寺との離檀交渉に不安がある場合はチェックを入れてください。
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />

                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isPending ? "送信中..." : "送信する"}
                </Button>
            </form>
        </Form>
    )
}
