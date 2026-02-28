import { z } from "zod"

export const gyoseishoshiInquirySchema = z.object({
    lastName: z.string().min(1, "姓を入力してください"),
    firstName: z.string().min(1, "名を入力してください"),
    email: z.string().email("メールアドレスの形式が正しくありません"),
    phone: z.string().min(10, "電話番号を入力してください").regex(/^[0-9-]+$/, "半角数字とハイフンのみ使用できます"),
    prefecture: z.string().min(1, "都道府県を選択してください"),
    city: z.string().min(1, "市区町村を入力してください"),
    content: z.string().min(10, "ご相談内容を10文字以上で入力してください"),
    preferredContact: z.enum(["phone", "email", "either"], {
        message: "ご希望の連絡方法を選択してください",
    }),
    // Honeypot
    confirmEmail: z.string().max(0, "スパム検知").optional().or(z.literal("")),
})

export type GyoseishoshiInquiryFormData = z.infer<typeof gyoseishoshiInquirySchema>

export const PreferredContactLabels = {
    phone: "電話",
    email: "メール",
    either: "どちらでも",
} as const
