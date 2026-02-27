import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  // Resend は環境変数が揃っているリクエスト時に初期化（ビルド時クラッシュ防止）
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[notify-ohakanavi] RESEND_API_KEY is not set')
    return NextResponse.json({ error: 'サーバー設定エラー' }, { status: 500 })
  }
  const resend = new Resend(apiKey)

  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'メールアドレスが無効です' },
        { status: 400 }
      )
    }

    // contact@seiren.ne.jp に通知メールを送信
    await resend.emails.send({
      from: 'お墓じまいナビ <noreply@ohakajimai-navi.jp>',
      to: ['contact@seiren.ne.jp'],
      subject: '【お墓探しナビ】公開通知登録がありました',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #059669; font-size: 18px; margin-bottom: 16px;">
            お墓探しナビ 公開通知登録
          </h2>
          <p style="color: #374151; margin-bottom: 8px;">
            以下のメールアドレスから公開通知の登録がありました。
          </p>
          <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color: #111827; font-size: 16px; font-weight: 600; margin: 0;">
              ${email}
            </p>
          </div>
          <p style="color: #6B7280; font-size: 13px; margin-top: 16px;">
            このメールはお墓じまいナビ（ohakajimai-navi.jp）から自動送信されています。
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[notify-ohakanavi] Error:', error)
    return NextResponse.json(
      { error: 'メール送信に失敗しました' },
      { status: 500 }
    )
  }
}
