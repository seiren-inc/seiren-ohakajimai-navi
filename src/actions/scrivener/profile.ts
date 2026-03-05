'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveScrivenerProfile(formData: FormData) {
  const profileText = formData.get('profileText') as string
  const officeName = formData.get('officeName') as string

  if (!profileText || !officeName) {
    return { error: 'すべての必須項目を入力してください', success: false }
  }

  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { error: '再ログインが必要です', success: false }
  }

  try {
    // 承認前だがPROFILE_INPUT完了へ進める
    await prisma.administrativeScrivener.update({
      where: { authUserId: user.id },
      data: {
        profileText,
        officeName,
        onboardingStep: "PROFILE_INPUT"
      }
    })
  } catch (dbError) {
    console.error('[saveScrivenerProfile]', dbError)
    return { error: 'データベースの保存に失敗しました', success: false }
  }

  revalidatePath('/', 'layout')
  redirect('/scrivener/dashboard') // 次のフェーズ(Payment)ですが、便宜上dashboardへ
}
