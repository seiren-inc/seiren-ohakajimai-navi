'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, Save } from 'lucide-react'
import { updateScrivenerProfile } from '@/actions/scrivener/profile'

type InitialValues = {
  officeName:          string
  representativeName:  string | null
  profileText:         string
  specialties:         string[]
  businessHours:       string | null
  priceRangeText:      string | null
  websiteUrl:          string | null
  prefecture:          string
  city:                string | null
  addressLine:         string | null
  phone:               string | null
  email:               string | null
}

type Props = {
  initialValues: InitialValues
}

/**
 * ScrivenerProfileEditForm — 行政書士によるプロフィール自己編集フォーム
 *
 * Props:
 * - initialValues: 現在のDB値。各フィールドの初期値として設定される。
 *
 * Note: updateScrivenerProfile は認証チェックを行うため、未ログイン状態では
 * エラーを返す。送信後はダッシュボードへリダイレクトされる。
 */
export function ScrivenerProfileEditForm({ initialValues }: Props): React.ReactElement {
  const [state, action, isPending] = useActionState(updateScrivenerProfile, null)

  const specialtiesStr = initialValues.specialties.join(', ')

  return (
    <form action={action} className="space-y-8">
      {/* エラー表示 */}
      {state && !state.success && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* 事務所基本情報 */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-800 border-b pb-2">事務所基本情報</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="officeName">
              事務所名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="officeName"
              name="officeName"
              defaultValue={initialValues.officeName}
              required
              maxLength={100}
              placeholder="例: 山田行政書士事務所"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="representativeName">代表者名</Label>
            <Input
              id="representativeName"
              name="representativeName"
              defaultValue={initialValues.representativeName ?? ''}
              maxLength={50}
              placeholder="例: 山田 太郎"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="prefecture">
              都道府県 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="prefecture"
              name="prefecture"
              defaultValue={initialValues.prefecture}
              required
              maxLength={10}
              placeholder="例: 東京都"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="city">市区町村</Label>
            <Input
              id="city"
              name="city"
              defaultValue={initialValues.city ?? ''}
              maxLength={30}
              placeholder="例: 新宿区"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addressLine">番地・建物名</Label>
            <Input
              id="addressLine"
              name="addressLine"
              defaultValue={initialValues.addressLine ?? ''}
              maxLength={100}
              placeholder="例: 西新宿1-1-1"
            />
          </div>
        </div>
      </section>

      {/* 公開プロフィール */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-800 border-b pb-2">公開プロフィール</h2>

        <div className="space-y-1.5">
          <Label htmlFor="profileText">
            プロフィール文 <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="profileText"
            name="profileText"
            defaultValue={initialValues.profileText}
            required
            rows={6}
            maxLength={1000}
            placeholder="改葬・墓じまい手続きに特化した行政書士として…"
            className="resize-y"
          />
          <p className="text-xs text-slate-500">最大1,000文字。掲載ページに表示されます。</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="specialties">得意分野</Label>
          <Input
            id="specialties"
            name="specialties"
            defaultValue={specialtiesStr}
            maxLength={200}
            placeholder="例: 改葬許可申請, 相続, 無料出張相談"
          />
          <p className="text-xs text-slate-500">カンマ区切りで入力してください。タグとして表示されます。</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="priceRangeText">料金目安</Label>
            <Input
              id="priceRangeText"
              name="priceRangeText"
              defaultValue={initialValues.priceRangeText ?? ''}
              maxLength={100}
              placeholder="例: 改葬許可申請代行 55,000円〜"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="businessHours">営業時間</Label>
            <Input
              id="businessHours"
              name="businessHours"
              defaultValue={initialValues.businessHours ?? ''}
              maxLength={100}
              placeholder="例: 平日 9:00〜18:00（土日応相談）"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="websiteUrl">ウェブサイトURL</Label>
          <Input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            defaultValue={initialValues.websiteUrl ?? ''}
            maxLength={200}
            placeholder="https://example.com"
          />
        </div>
      </section>

      {/* 連絡先（非公開） */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-800 border-b pb-2">
          連絡先情報
          <span className="ml-2 text-xs font-normal text-slate-500">（一般公開されません）</span>
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone">電話番号</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={initialValues.phone ?? ''}
              maxLength={20}
              placeholder="例: 03-1234-5678"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={initialValues.email ?? ''}
              maxLength={200}
              placeholder="例: info@example.com"
            />
            <p className="text-xs text-slate-500">問い合わせ通知メールの送信先です。</p>
          </div>
        </div>
      </section>

      {/* 送信 */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => history.back()}
          disabled={isPending}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />保存中...</>
          ) : (
            <><Save className="mr-2 h-4 w-4" />変更を保存する</>
          )}
        </Button>
      </div>
    </form>
  )
}
