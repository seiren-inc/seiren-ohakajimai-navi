'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ============================================================
// updateScrivenerProfile — 行政書士自身によるプロフィール編集
// 変更前後を ScrivenerAuditLog に記録する。
// ============================================================

type UpdateProfileResult = { error: string; success: false } | { error: null; success: true }

export async function updateScrivenerProfile(
  _prevState: UpdateProfileResult | null,
  formData: FormData,
): Promise<UpdateProfileResult> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: '再ログインが必要です', success: false }
  }

  // 編集可能フィールドを取得
  const officeName     = (formData.get('officeName') as string | null)?.trim() ?? ''
  const representativeName = (formData.get('representativeName') as string | null)?.trim() || null
  const profileText    = (formData.get('profileText') as string | null)?.trim() ?? ''
  const specialtiesRaw = (formData.get('specialties') as string | null)?.trim() ?? ''
  const businessHours  = (formData.get('businessHours') as string | null)?.trim() || null
  const priceRangeText = (formData.get('priceRangeText') as string | null)?.trim() || null
  const websiteUrl     = (formData.get('websiteUrl') as string | null)?.trim() || null
  const prefecture     = (formData.get('prefecture') as string | null)?.trim() ?? ''
  const city           = (formData.get('city') as string | null)?.trim() || null
  const addressLine    = (formData.get('addressLine') as string | null)?.trim() || null
  const phone          = (formData.get('phone') as string | null)?.trim() || null
  const email          = (formData.get('email') as string | null)?.trim() || null

  if (!officeName || !profileText || !prefecture) {
    return { error: '事務所名・プロフィール文・都道府県は必須です', success: false }
  }

  // カンマ区切り文字列 → 配列（空文字除外）
  const specialties = specialtiesRaw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  try {
    // 変更前スナップショット取得
    const before = await prisma.administrativeScrivener.findUnique({
      where: { authUserId: user.id },
      select: {
        id:                  true,
        officeName:          true,
        representativeName:  true,
        profileText:         true,
        specialties:         true,
        businessHours:       true,
        priceRangeText:      true,
        websiteUrl:          true,
        prefecture:          true,
        city:                true,
        addressLine:         true,
        phone:               true,
        email:               true,
      },
    })

    if (!before) {
      return { error: 'プロフィールが見つかりません', success: false }
    }

    const afterData = {
      officeName,
      representativeName,
      profileText,
      specialties,
      businessHours,
      priceRangeText,
      websiteUrl,
      prefecture,
      city,
      addressLine,
      phone,
      email,
    }

    // プロフィール更新 + 監査ログ記録をトランザクションで実行
    await prisma.$transaction([
      prisma.administrativeScrivener.update({
        where: { id: before.id },
        data:  afterData,
      }),
      prisma.scrivenerAuditLog.create({
        data: {
          scrivenerId: before.id,
          actionType:  'PROFILE_UPDATED',
          beforeValue: before,
          afterValue:  { id: before.id, ...afterData },
          adminUserId: user.id,
        },
      }),
    ])
  } catch (dbError) {
    console.error('[updateScrivenerProfile]', dbError)
    return { error: 'データベースの保存に失敗しました', success: false }
  }

  revalidatePath('/scrivener/dashboard')
  redirect('/scrivener/dashboard')
}

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
  redirect('/scrivener/onboarding/plan')
}
