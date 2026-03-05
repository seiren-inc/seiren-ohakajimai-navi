import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { NextResponse } from 'next/server'

export const maxDuration = 30 // Set max duration for Vercel

export async function POST(req: Request) {
    try {
        const { keywords, officeName } = await req.json()

        const prompt = `あなたはSEOとWEBマーケティングの専門家であり、選ばれる行政書士プロフィールを作成するプロです。
以下の前提条件とキーワードをもとに、お墓じまいナビの「提携行政書士一覧」に掲載するための魅力的なPR文（プロフィール）を200文字〜400文字で生成してください。

【前提条件】
- 事務所名: ${officeName || '当事務所'}
- 読み手は「お墓じまいの手続きや費用に不安を抱えている一般のユーザー（遺族や高齢者）」です。
- 親しみやすさ、専門性、迅速な対応（E-E-A-T）が伝わるようにしてください。
- フォーマットはプレーンテキストにし、不要な見出しや挨拶（「こんにちは」等）は省いてください。

【入力キーワード（得意なこと・アピールポイント）】
${keywords || '迅速対応, 親切丁寧'}
`

        // Check if OpenAI API key is missing (for local prototype testing)
        if (!process.env.OPENAI_API_KEY) {
            console.warn('[ai-profile] OPENAI_API_KEY is not set. Using mock stream.')
            const mockProfile = `お墓じまい・改葬の手続きでお悩みなら、${officeName || '当事務所'}にお任せください。\n\n初めてのお墓じまいは、「何から始めればいいのか分からない」「役所でどんな書類が必要か不安」という方がほとんどです。私たちはご遺族のお気持ちに寄り添い、複雑な改葬許可申請や寺院とのやり取りを含む行政手続きを迅速かつ丁寧にサポートいたします。\n\nお客様にご負担をおかけしないよう、土日祝日のご相談やオンライン対応も承っております。専門家としての正確な手続きはもちろんのこと、わかりやすい言葉での事前の費用・スケジュール説明を徹底しております。お墓の引越しに関する些細な疑問でも、どうぞお気軽にご相談ください。`
            
            // Create a mock stream
            const encoder = new TextEncoder()
            const stream = new ReadableStream({
                async start(controller) {
                    const words = mockProfile.split('')
                    for (const word of words) {
                        controller.enqueue(encoder.encode(word))
                        await new Promise(r => setTimeout(r, 10)) // 10ms delay per char to simulate streaming
                    }
                    controller.close()
                }
            })
            // Return stream in compatible format
            return new NextResponse(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
        }

        const result = await streamText({
            model: openai('gpt-4o-mini'),
            prompt: prompt,
            temperature: 0.7,
        })

        return result.toTextStreamResponse()
    } catch (error) {
        console.error('[ai-profile api error]', error)
        return NextResponse.json(
            { error: 'Failed to generate profile' },
            { status: 500 }
        )
    }
}
