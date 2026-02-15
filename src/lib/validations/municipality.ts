import { z } from "zod"

export const municipalityImportSchema = z.object({
    jisCode: z.string().length(6, "JISコードは6桁である必要があります"),
    name: z.string().min(1, "市区町村名は必須です"),
    prefectureCode: z.string().length(2, "都道府県コードは2桁である必要があります"),
    prefectureName: z.string().min(1, "都道府県名は必須です"),
    prefectureSlug: z.string().min(1, "都道府県slugは必須です"),
    municipalitySlug: z.string().min(1, "市区町村slugは必須です"),

    // Optional / Nullable fields
    url: z.string().url("URLの形式が正しくありません").optional().or(z.literal("")),
    pdfUrl: z.string().url("PDF URLの形式が正しくありません").optional().or(z.literal("")),
    region: z.string().optional(),

    // Boolean/Enum fields (handling string input from CSV)
    isPublished: z.union([
        z.boolean(),
        z.string().transform(val => val === "true" || val === "TRUE")
    ]).optional().default(true),

    linkStatus: z.enum(["OK", "NEEDS_REVIEW", "BROKEN", "UNKNOWN"]).optional().default("UNKNOWN"),

    notes: z.string().optional(),
    seoDescription: z.string().optional(),
})

export type MunicipalityImportData = z.infer<typeof municipalityImportSchema>
