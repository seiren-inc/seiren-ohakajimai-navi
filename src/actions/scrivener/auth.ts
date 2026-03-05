'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type AuthState = {
  error: string | null
  success: boolean
}

export async function signUpScrivener(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const officeName = formData.get('officeName') as string

  if (!email || !password || !officeName) {
    return { error: 'すべての必須項目を入力してください', success: false }
  }

  const supabase = await createClient()

  // 1. Supabase Authでサインアップ
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'scrivener',
        officeName,
      }
    }
  })

  if (error) {
    console.error('[signUpScrivener]', error)
    return { error: error.message, success: false }
  }

  if (data.user) {
    // 2. Prismaで行政書士レコードを作成
    try {
      // 既存のAuthIDを持つレコードがないかチェック
      const existing = await prisma.administrativeScrivener.findUnique({
        where: { authUserId: data.user.id }
      })

      if (!existing) {
        await prisma.administrativeScrivener.create({
          data: {
            authUserId: data.user.id,
            email: data.user.email,
            officeName: officeName,
            prefecture: "未設定", // 最初は未設定
            profileText: "",
            onboardingStep: "ACCOUNT_CREATED",
            isApproved: false,
            isActive: false,
            paymentStatus: "UNPAID",
          }
        })
      }
    } catch (dbError) {
      console.error('[signUpScrivener dbError]', dbError)
      return { error: 'アカウント作成後のデータベース初期化に失敗しました', success: false }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/scrivener/onboarding/profile')
}

export async function signInScrivener(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'メールアドレスとパスワードを入力してください', success: false }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('[signInScrivener]', error)
    return { error: 'ログインに失敗しました。認証情報を確認してください。', success: false }
  }

  revalidatePath('/', 'layout')
  redirect('/scrivener/dashboard')
}

export async function signOutScrivener() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/scrivener/login')
}
