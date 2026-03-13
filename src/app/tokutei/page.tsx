import { constructMetadata } from "@/lib/seo"
import Link from "next/link"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ohakajimai-navi.jp"

export const metadata = constructMetadata({
  title: "特定商取引法に基づく表記｜お墓じまいナビ（株式会社清蓮）",
  description:
    "お墓じまいナビを運営する株式会社清蓮の特定商取引法に基づく表記ページです。販売者情報・料金・支払方法・キャンセルポリシーを掲載しています。",
  path: "/tokutei",
})

const items = [
  {
    label: "販売業者",
    value: "株式会社清蓮",
  },
  {
    label: "運営統括責任者",
    value: "代表取締役　眞如 りえ",
  },
  {
    label: "所在地",
    value: "〒244-0003\n神奈川県横浜市戸塚区戸塚町4170\n高橋ビル1階",
  },
  {
    label: "電話番号",
    value: "045-881-9952",
    note: "受付時間：平日 9:00〜18:00（土日祝除く）",
    href: "tel:0458819952",
  },
  {
    label: "メールアドレス",
    value: "contact@seiren.ne.jp",
    href: "mailto:contact@seiren.ne.jp",
  },
  {
    label: "サービス名",
    value: "下記2サービス（株式会社清蓮運営）\n・お墓じまいナビ（ohakajimai-navi.jp）\n・お墓探しナビ（ohakanavi.jp）",
  },
  {
    label: "販売価格",
    value: "各行政書士のプロフィールページおよびサービス詳細ページに記載の金額（消費税込）",
  },
  {
    label: "商品代金以外の必要料金",
    value: "当サイトの閲覧、お問い合わせ等の電子メールの送受信時などに発生する通信料はお客様のご負担となります。",
  },
  {
    label: "支払方法",
    value: "クレジットカード決済（Stripe）",
  },
  {
    label: "支払時期",
    value: "各サービスのお申し込み時に決済が処理されます（前払い）。",
  },
  {
    label: "役務の提供時期",
    value: "お支払い確認後、速やかにご担当行政書士よりご連絡いたします。",
  },
  {
    label: "キャンセル・返金",
    value:
      "【マッチング成立前】\nお支払い後、担当行政書士よりご連絡が届く前（マッチング成立前）にキャンセルをご希望の場合は、全額返金いたします。\n\n【マッチング成立後】\n担当行政書士よりご連絡があった時点でマッチングが成立となります。成立以降のキャンセル・返金は原則お受けできません。\n\n【弊社都合による不成立】\n弊社の事情によりマッチングが成立しなかった場合は、全額返金いたします。\n\nキャンセルのご連絡は、お電話またはメールにて平日9:00〜18:00にお問い合わせください。",
  },
  {
    label: "動作環境",
    value:
      "最新バージョンの Chrome / Safari / Edge / Firefox を推奨します。",
  },
  {
    label: "個人情報の取扱い",
    value: "プライバシーポリシーをご確認ください。",
    link: { href: "/privacy", label: "プライバシーポリシー" },
  },
]

export default function TokuteiPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "特定商取引法に基づく表記", url: `${SITE_URL}/tokutei` },
        ]}
      />
      <Breadcrumb items={[{ name: "特定商取引法に基づく表記", href: "/tokutei" }]} />

      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {/* ヘッダー */}
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Legal
        </p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
          特定商取引法に基づく表記
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-500">
          特定商取引に関する法律（特定商取引法）第11条に基づき、以下の事項を表示します。
        </p>

        {/* 適用範囲 */}
        <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50 px-5 py-4">
          <p className="text-xs font-semibold text-emerald-700 mb-2">本ページの適用範囲</p>
          <p className="text-sm leading-relaxed text-emerald-900">
            本ページは、株式会社清蓮が運営する以下の2サービスに共通して適用されます。
          </p>
          <ul className="mt-2 space-y-1 text-sm text-emerald-900">
            <li>・お墓じまいナビ（ohakajimai-navi.jp）</li>
            <li>・お墓探しナビ（ohakanavi.jp）</li>
          </ul>
        </div>

        {/* テーブル */}
        <dl className="mt-12 divide-y divide-neutral-100 border-t border-b border-neutral-100">
          {items.map((item) => (
            <div
              key={item.label}
              className="grid gap-2 py-6 md:grid-cols-[200px_1fr] md:gap-8"
            >
              <dt className="text-sm font-medium text-neutral-500">
                {item.label}
              </dt>
              <dd className="text-sm leading-relaxed text-neutral-900 whitespace-pre-line">
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-emerald-600 hover:text-emerald-800 transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
                {item.note && (
                  <span className="block mt-1 text-xs text-neutral-400">
                    {item.note}
                  </span>
                )}
                {item.link && (
                  <Link
                    href={item.link.href}
                    className="mt-1 block text-emerald-600 hover:text-emerald-800 transition-colors"
                  >
                    {item.link.label}
                  </Link>
                )}
              </dd>
            </div>
          ))}
        </dl>

        {/* 問い合わせ誘導 */}
        <p className="mt-12 text-sm leading-relaxed text-neutral-500">
          ご不明な点は、
          <Link
            href="/contact"
            className="text-emerald-600 hover:text-emerald-800 transition-colors"
          >
            お問い合わせフォーム
          </Link>
          またはお電話（
          <a
            href="tel:0458819952"
            className="text-emerald-600 hover:text-emerald-800 transition-colors"
          >
            045-881-9952
          </a>
          ）にてお気軽にご連絡ください。
        </p>
      </div>
    </div>
  )
}
