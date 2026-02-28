/**
 * AdministrativeScrivener の型定義
 * Doc-04 §6: any使用禁止・strict準拠
 * Doc-08 §8: 公開側にphone/email返却禁止
 */

export type ScrivenerPlanType = "BASIC" | "STANDARD" | "PREMIUM"
export type PaymentStatus = "UNPAID" | "PAID" | "SUSPENDED"

/** 公開表示用（Doc-08/Doc-17: phone/email/registrationNumber除外）*/
export type PublicScrivener = {
    id: string
    officeName: string
    representativeName: string | null
    prefecture: string
    city: string | null
    websiteUrl: string | null
    priceRangeText: string | null
    specialties: string[]
    profileText: string
    planType: ScrivenerPlanType
    priorityScore: number
    updatedAt: Date
}

/** 管理画面用（全フィールド）*/
export type AdminScrivener = PublicScrivener & {
    registrationNumber: string | null
    addressLine: string | null
    phone: string | null
    email: string | null
    businessHours: string | null
    isApproved: boolean
    isActive: boolean
    complaintFlag: boolean
    paymentStatus: PaymentStatus
    contractStartDate: Date | null
    contractEndDate: Date | null
    createdAt: Date
}
