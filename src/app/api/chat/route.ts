import { openai } from "@ai-sdk/openai"
import { streamText, tool } from "ai"
import { z } from "zod"
import { getChatRateLimit } from "@/lib/rate-limit-chat"
import { prisma } from "@/lib/prisma"

import { NextResponse } from "next/server"

// Next.js API route options
export const maxDuration = 30
// Force dynamic to prevent caching dynamic chat responses
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    try {
        // T7-06: レート制限
        const { success, ip } = await getChatRateLimit()
        if (!success) {
            return NextResponse.json({ error: "Too Many Requests" }, { status: 429 })
        }

        const { messages, sessionId } = await req.json()
        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: "messages must be a non-empty array" }, { status: 400 })
        }

        const lastMessage = messages[messages.length - 1]
        if (!lastMessage || typeof lastMessage !== "object" || !("content" in lastMessage) || lastMessage.content == null) {
            return NextResponse.json({ error: "last message content is required" }, { status: 400 })
        }

        const userMessage = String(lastMessage.content)

        // ログ記録用の変数 (T7-07)
        let detectedIntent = "UNKNOWN"
        let referenceJisCode: string | null = null
        let isRejected = false
        const result = streamText({
            model: openai("gpt-4o-mini"),
            system: `あなたは「お墓じまいナビ」の案内AIです。
以下のルールを完全に遵守してください。
1. あなたは情報を作成・推測してはいけません。必ず用意されたツール（検索機能）を使って得た「事実」のみを回答の根拠にしてください。
2. ユーザーが都道府県や市町村を指定して「改葬許可」について質問した場合は、必ず getMunicipalityInfo ツールを呼び出してください。
3. ユーザーが料金などの一般的な質問をした場合は、必ず getGeneralFaq ツールを呼び出してください。
4. ツールで情報が得られなかった場合は、「申し訳ありませんが、当サイトのデータベースに情報が存在しません。」とだけ回答し、自腹で推測しないでください。（T7-04, T7-05）
5. 回答には必ず該当ページへのURLやPDFのリンクを提示して、ユーザーが見に行けるようにしてください。
6. お墓や行政書士以外の世間話には「お墓じまいに関するご案内のみ可能です」と回答し、拒否してください。`,
            messages,
            tools: {
                // T7-02: 自治体情報の検索ツール
                getMunicipalityInfo: tool({
                    description: "指定された都道府県・市区町村の改葬許可に関する情報（URL、PDF）を検索する",
                    parameters: z.object({
                        prefecture: z.string().describe("都道府県名（例: 東京都）"),
                        city: z.string().describe("市区町村名（例: 渋谷区）"),
                    }),
                    // @ts-expect-error: ai SDKのバージョン差異による型エラーをバイパス
                    execute: async ({ prefecture, city }: { prefecture: string; city: string }) => {
                        detectedIntent = "REGION_SEARCH"
                        // DBから検索
                        const municipality = await prisma.municipality.findFirst({
                            where: {
                                prefectureName: { contains: prefecture, mode: "insensitive" },
                                name: { contains: city, mode: "insensitive" },
                            },
                        })
                        if (!municipality) {
                            isRejected = true
                            return { found: false, message: "情報が見つかりませんでした。" }
                        }
                        referenceJisCode = municipality.jisCode
                        return { found: true, message: "情報が見つかりました。", data: municipality }
                    },
                }),
                // T7-02: 一般向けFAQの検索ツール
                getGeneralFaq: tool({
                    description: "お墓じまいの料金体系や、一般的な行政書士に関する情報を取得する",
                    parameters: z.object({
                        query: z.string().describe("質問の要約"),
                    }),
                    // @ts-expect-error: ai SDKのバージョン差異による型エラーをバイパス
                    execute: async () => {
                        detectedIntent = "GENERAL_FAQ"
                        // 本来はベクトル検索などを行うが、今回は静的なFAQ情報を返す
                        return {
                            found: true,
                            data: [
                                { q: "料金はいくらですか？", a: "サービス一覧ページを御覧ください。散骨は5万円から、などのプランがあります。 https://ohakajimai-navi.jp/carrying" },
                                { q: "行政書士に対応してもらえますか？", a: "はい、全国の行政書士を検索できるページをご用意しております。 https://ohakajimai-navi.jp/gyoseishoshi" }
                            ]
                        }
                    },
                })
            },
            onFinish: async ({ text }) => {
                // T7-07: 会話履歴と結果の保存
                try {
                    await prisma.ragChatLog.create({
                        data: {
                            sessionId: sessionId || "anonymous",
                            userMessage: userMessage,
                            detectedIntent,
                            referenceJisCode,
                            aiResponse: text,
                            isRejected,
                            ipAddress: ip,
                        }
                    })
                } catch (e) {
                    console.error("Failed to save chat log:", e)
                }
            }
        })

        return result.toTextStreamResponse()
    } catch (e) {
        console.error("Chat API Error:", e)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
