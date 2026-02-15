import { z } from "zod"

// Prisma Enums with labels for UI
export const CemeteryType = {
    TEMPLE: "寺院墓地",
    PUBLIC: "公営霊園",
    PRIVATE: "民営霊園",
    COMMUNITY: "共同墓地",
    OTHER: "その他",
    UNKNOWN: "不明",
} as const

export const ConsiderationPeriod = {
    IMMEDIATE: "すぐにでも",
    WITHIN_HALF_YEAR: "半年以内",
    WITHIN_YEAR: "1年以内",
    UNDECIDED: "未定",
} as const

// Optional Fields Enums
export const DestinationType = {
    NEW_GRAVE: "新しいお墓",
    NOUKOTSUDO: "納骨堂",
    TREE_BURIAL: "樹木葬",
    SCATTERING: "散骨",
    HOME: "手元供養",
    OTHER: "その他",
} as const

export const BoneServiceType = {
    POWDER: "粉骨",
    WASH: "洗骨",
    BOTH: "両方",
    NONE: "不要",
} as const

export const ContainerType = {
    SEALED_BAG: "密封袋",
    URN: "骨壷",
    ORIGINAL_BOX: "オリジナル骨箱",
    BONE_BAG: "骨袋",
    UNDECIDED: "未定",
} as const

export const inquirySchema = z.object({
    // Personal Info
    lastName: z.string().min(1, "姓を入力してください"),
    firstName: z.string().min(1, "名を入力してください"),
    lastNameKana: z.string().min(1, "セイを入力してください").regex(/^[ァ-ヶー]+$/, "全角カタカナで入力してください"),
    firstNameKana: z.string().min(1, "メイを入力してください").regex(/^[ァ-ヶー]+$/, "全角カタカナで入力してください"),
    email: z.string().email("メールアドレスの形式が正しくありません"),
    phone: z.string().min(10, "電話番号を入力してください").regex(/^[0-9-]+$/, "半角数字とハイフンのみ使用できます"),

    // Address
    postalCode: z.string().length(7, "郵便番号は7桁の数字で入力してください").regex(/^[0-9]+$/, "半角数字で入力してください"),
    prefecture: z.string().min(1, "都道府県を選択してください"),
    city: z.string().min(1, "市区町村を入力してください"),
    addressDetail: z.string().optional(),

    // Survey
    cemeteryType: z.enum(["TEMPLE", "PUBLIC", "PRIVATE", "COMMUNITY", "OTHER", "UNKNOWN"], {
        errorMap: () => ({ message: "墓地の種類を選択してください" }),
    }),
    considerationPeriod: z.enum(["IMMEDIATE", "WITHIN_HALF_YEAR", "WITHIN_YEAR", "UNDECIDED"], {
        errorMap: () => ({ message: "検討時期を選択してください" }),
    }),

    // Optional Services (Nullable/Optional in DB, but form might treat as empty string)
    destinationType: z.enum(["NEW_GRAVE", "NOUKOTSUDO", "TREE_BURIAL", "SCATTERING", "HOME", "OTHER"]).optional(),
    boneServiceType: z.enum(["POWDER", "WASH", "BOTH", "NONE"]).optional(),
    containerType: z.enum(["SEALED_BAG", "URN", "ORIGINAL_BOX", "BONE_BAG", "UNDECIDED"]).optional(),
    ritanConsultation: z.boolean().default(false),

    content: z.string().min(10, "ご相談内容を10文字以上で入力してください"),

    // Honeypot (Should be empty)
    confirmEmail: z.string().max(0, "スパム検知").optional().or(z.literal("")),
})

export type InquiryFormData = z.infer<typeof inquirySchema>
