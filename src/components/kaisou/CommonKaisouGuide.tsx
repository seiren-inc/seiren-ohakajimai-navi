import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileText,
  CheckSquare,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'

export default function CommonKaisouGuide() {
  return (
    <section aria-labelledby="common-guide-heading" className="space-y-8">
      <div className="border-t pt-8">
        <h2
          id="common-guide-heading"
          className="text-2xl font-bold tracking-tight mb-2"
        >
          改葬手続きの詳しい流れと申請書の書き方
        </h2>
        <p className="text-muted-foreground text-sm">
          全国の自治体ページ共通の情報です。お住まいの自治体の固有情報と合わせてご確認ください。
        </p>
      </div>

      {/* 改葬許可申請とは */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            改葬許可申請とは
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-loose text-muted-foreground space-y-3">
          <p>
            改葬（墓じまい）を行うには、現在遺骨がある墓地の所在地を管轄する市区町村に「改葬許可申請書」を提出し、改葬許可証の交付を受ける必要があります。改葬許可証がないと、新しい墓地・納骨堂・寺院などで受け入れできないのが一般的です。
          </p>
        </CardContent>
      </Card>

      {/* 手続きの流れ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckSquare className="h-5 w-5 text-primary" />
            改葬手続きの流れ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          {[
            {
              step: 1,
              title: '受入証明書の取得',
              body: '新しく遺骨を移す先（墓地、納骨堂、寺院、散骨事業者など）から、受入を証明する書類を取得します。名称は「受入証明書」「受入承諾書」など自治体や受入先によって異なる場合があります。',
            },
            {
              step: 2,
              title: '埋蔵証明（埋葬証明）の取得',
              body: '現在の墓地管理者（寺院、霊園管理事務所など）に、遺骨が埋蔵（収蔵）されている事実を証明してもらいます。改葬許可申請書に証明欄がある場合はそこへ記入押印してもらい、別紙の証明書で代替できる自治体もあります。',
            },
            {
              step: 3,
              title: '改葬許可申請書の提出',
              body: '現在のお墓の所在地を管轄する市区町村役所へ申請します。窓口での提出が基本ですが、自治体によっては郵送申請に対応している場合があります。必要書類や提出方法は自治体ごとに違いがあるため、公式案内で確認します。',
            },
            {
              step: 4,
              title: '改葬許可証の交付',
              body: '受理後、数日で交付される自治体もあれば、1〜2週間程度かかる場合もあります。受け取り方法（窓口受取、郵送返送）も自治体により異なります。',
            },
            {
              step: 5,
              title: '遺骨の取り出しと移送、納骨',
              body: '改葬許可証を取得後、閉眼供養・石材工事・遺骨取り出しを行い、新しい移転先で納骨します。受入先によっては納骨時に改葬許可証（原本）の提出が必要です。',
            },
          ].map(({ step, title, body }) => (
            <div key={step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                  {step}
                </div>
                {step < 5 && <div className="w-0.5 flex-1 bg-border my-2" />}
              </div>
              <div className="pb-4">
                <h3 className="font-bold text-base mb-1 text-foreground">{title}</h3>
                <p className="text-muted-foreground leading-loose">{body}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 申請書の入手方法 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">改葬許可申請書の入手方法</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-loose text-muted-foreground">
          <p>
            改葬許可申請書は、お墓の所在地を管轄する市区町村役所の窓口（住民課、戸籍課など）で入手できます。近年は自治体ホームページからダウンロードできるケースも増えています。申請が郵送対応かどうかもあわせて確認します。
          </p>
        </CardContent>
      </Card>

      {/* 申請書の書き方と注意点 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-primary" />
            改葬許可申請書の書き方と注意点
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-5">
          {[
            {
              title: '故人の氏名・性別・死亡日',
              body: '改葬対象の故人情報を記載します。故人が複数の場合は別紙記載を求められることがあります。自治体によっては戸籍の添付を求められる場合もあります。',
            },
            {
              title: '死亡時の本籍・住所',
              body: '死亡時点の本籍・住所を記入します。手元資料で不明な場合は戸籍等で確認が必要になることがあります。',
            },
            {
              title: '埋葬又は火葬の場所、埋葬又は火葬の年月日',
              body: null,
              detail: [
                'ここは自治体によって運用が異なる注意点です。',
                '多くの自治体では「埋葬又は火葬の場所」欄に、現在遺骨が納められている墓地（墓地・霊園）の所在地を書く運用が見られます。',
                '一方で、火葬場の所在地を書くよう求める自治体もあります。',
                '「埋葬又は火葬の年月日」も、納骨日を書く自治体が多い一方で、火葬日を求められる場合があります。',
                '資料等から火葬の場所が確認できない場合、「不詳」と記載して差し支えないとされるケースが多いです。',
              ],
            },
            {
              title: '改葬の理由・改葬先',
              body: '改葬理由は簡潔に書きます。例：新しく墓地を購入したため、遠方で管理が困難なため、承継者不在のため等。改葬先は、新しい墓地・納骨堂・寺院などの所在地を記載します。',
            },
            {
              title: '申請者と故人の続柄',
              body: '故人から見た続柄を記載するのが一般的ですが、自治体により解釈が異なる場合があります。書き方が不明な場合は役所に確認します。',
            },
            {
              title: '申請者（墓地使用者）の氏名・住所',
              body: '原則、墓地使用者（名義人）が申請します。申請者が名義人でない場合、名義人からの承諾書を求められることがあります。自治体によっては自署で押印不要の場合もあります。',
            },
          ].map(({ title, body, detail }) => (
            <div key={title} className="border-l-2 border-border pl-4 space-y-1">
              <h3 className="font-bold text-foreground">{title}</h3>
              {body && (
                <p className="text-muted-foreground leading-loose">{body}</p>
              )}
              {detail && (
                <ul className="text-muted-foreground leading-loose space-y-1 list-none">
                  {detail.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 必要書類 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">必要書類（一般的）</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2 leading-loose">
            {[
              '改葬許可申請書',
              '受入証明書（受入先が発行）',
              '埋蔵証明書（現墓地管理者が証明）',
              '名義人承諾書（申請者が名義人でない場合）',
              '戸籍等（自治体が求める場合）',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 許可が下りるまでの期間 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">許可が下りるまでの期間</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-loose text-muted-foreground">
          <p>
            改葬許可申請書の受理から許可証の発行までの期間は自治体により異なり、数日から1〜2週間程度が目安です。繁忙期や郵送申請では追加日数がかかる場合があります。
          </p>
        </CardContent>
      </Card>

      {/* 自治体差が出やすいポイント */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <HelpCircle className="h-5 w-5 text-primary" />
            自治体差が出やすいポイント
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2 leading-loose">
            {[
              '「埋葬又は火葬の場所」「年月日」に何を書くか（墓地所在地か火葬場所在地か、納骨日か火葬日か）',
              '申請の提出方法（窓口のみか郵送可か）',
              '添付書類（戸籍の要否、原本提出の要否）',
              '複数遺骨の扱い（別紙の要否）',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-muted-foreground">・</span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* よくあるつまずき */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">よくあるつまずき</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2 leading-loose">
            {[
              '墓地の名義人と申請者が違い、承諾書が必要になる',
              '受入証明の書式が自治体要件に合わず差し戻し',
              '火葬場情報が不明で記入に迷う（不詳で可か自治体確認）',
              '複数人分で別紙を求められる',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-muted-foreground">・</span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
