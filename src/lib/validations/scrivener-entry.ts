import { z } from "zod"

export const PLAN_TYPES = ["BASIC", "STANDARD", "PREMIUM"] as const
export type PlanType = typeof PLAN_TYPES[number]

export const PLAN_INFO: Record<PlanType, {
    label: string
    price: number
    features: string[]
    recommended?: boolean
}> = {
    BASIC: {
        label: "ベーシック",
        price: 9800,
        features: [
            "事務所の基本情報を掲載",
            "問い合わせフォームからの連絡受付",
            "通常表示（優先度：低）",
        ],
    },
    STANDARD: {
        label: "スタンダード",
        price: 19800,
        recommended: true,
        features: [
            "ベーシックの全機能",
            "得意分野・料金目安を掲載",
            "優先表示（優先度：中）",
            "アクセス数レポート（月1回）",
        ],
    },
    PREMIUM: {
        label: "プレミアム",
        price: 39800,
        features: [
            "スタンダードの全機能",
            "ページ最上部への優先表示",
            "写真・PRコメント掲載",
            "専任サポート対応",
        ],
    },
}

export const scrivenerEntrySchema = z.object({
    // プラン
    planType: z.enum(["BASIC", "STANDARD", "PREMIUM"] as const, { message: "プランを選択してください" }),

    // 事務所基本情報
    officeName: z
        .string()
        .min(1, "事務所名を入力してください")
        .max(100, "100文字以内で入力してください"),
    representativeName: z
        .string()
        .max(50, "50文字以内で入力してください")
        .optional()
        .or(z.literal("")),
    registrationNumber: z
        .string()
        .max(50, "50文字以内で入力してください")
        .optional()
        .or(z.literal("")),

    // 連絡先
    email: z
        .string()
        .email("有効なメールアドレスを入力してください")
        .max(254),
    phone: z
        .string()
        .regex(/^[0-9\-+（）()\s]{10,20}$/, "有効な電話番号を入力してください"),

    // 所在地
    prefecture: z.string().min(1, "都道府県を選択してください"),
    city: z
        .string()
        .max(50, "50文字以内で入力してください")
        .optional()
        .or(z.literal("")),

    // 掲載情報
    profileText: z
        .string()
        .min(10, "10文字以上でプロフィールを入力してください")
        .max(1000, "1000文字以内で入力してください"),
    specialties: z
        .string()
        .max(200, "200文字以内で入力してください")
        .optional()
        .or(z.literal("")),
    priceRangeText: z
        .string()
        .max(100, "100文字以内で入力してください")
        .optional()
        .or(z.literal("")),
    businessHours: z
        .string()
        .max(100, "100文字以内で入力してください")
        .optional()
        .or(z.literal("")),
    websiteUrl: z
        .string()
        .url("有効なURLを入力してください（https://〜）")
        .max(500)
        .optional()
        .or(z.literal("")),

    // Honeypot
    confirmEmail: z.string().optional(),
})

export type ScrivenerEntryFormData = z.infer<typeof scrivenerEntrySchema>
