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

// ─────────────────────────────────────────────────────────
// Stripe 審査対応：2022年6月施行改正特定商取引法ガイドライン準拠
// 必須記載事項をすべて網羅
// ─────────────────────────────────────────────────────────
const items = [
  {
    label: "販売事業者名",
    value: "株式会社清蓮",
  },
  {
    label: "運営統括責任者",
    value: "代表取締役　眞如 りえ",
  },
  {
    label: "所在地",
    // ★ Stripe 審査：法人は番地まで完全記載が必須
    value: "〒244-0003\n神奈川県横浜市戸塚区戸塚町4170\n高橋ビル1階",
  },
  {
    label: "電話番号",
    value: "045-881-9952",
    note: "受付時間：平日 9:00〜18:00（土日祝を除く）",
    href: "tel:0458819952",
  },
  {
    label: "メールアドレス",
    value: "contact@seiren.ne.jp",
    href: "mailto:contact@seiren.ne.jp",
  },
  {
    label: "サービス内容",
    // ★ Stripe 審査：「何を売るか」を具体的に記載
    value:
      "本サービスは、お墓じまい・改葬に関する手続きを検討されるお客様と、提携登録された行政書士をオンライン上でマッチングする有料の仲介サービスです。\n\n【提供するサービス】\n① 行政書士マッチング（有料）\n　改葬許可申請・書類作成代行を依頼できる行政書士を紹介します。\n\n② 情報提供・相談（無料）\n　改葬手続き情報の提供・書類ダウンロード・見積り相談は無料でご利用いただけます。\n\n※当社自身が行政書士業務を行うものではありません。業務は各提携行政書士が独立した立場で行います。",
  },
  {
    label: "販売価格（税込）",
    // ★ Stripe 審査：具体的な金額または確認できる場所を明記
    value:
      "行政書士マッチングサービス：各専門家のサービス詳細ページに税込金額を明示しています。\n\n【料金の目安（税込）】\n・改葬手続きサポート：55,000円〜\n・書類作成のみ：22,000円〜\n\n※お申し込み前にサービス詳細画面にて必ず金額をご確認ください。\n※情報提供・見積り相談は無料です。",
  },
  {
    label: "商品代金以外に必要な費用",
    value:
      "・当サービスの閲覧・ご利用時のインターネット接続料金・通信費はお客様のご負担となります。\n・役所への申請に必要な実費（印紙代等）が別途発生する場合があります。事前に担当行政書士よりご案内します。",
  },
  {
    label: "支払方法",
    // ★ クレジットカードブランドを明記（Stripe 審査基準）
    value:
      "クレジットカード決済（Visa / Mastercard / American Express / JCB）\n※決済処理には Stripe, Inc. の決済システムを使用しています。",
  },
  {
    label: "支払時期",
    value: "サービスお申し込み時に決済処理が行われます（前払い）。\nカード引き落とし時期はご利用のカード会社の規定に従います。",
  },
  {
    label: "役務の提供時期",
    // ★ Stripe 審査：「いつサービスが提供されるか」を具体的に
    value:
      "お支払い確認後、通常1〜3営業日以内に担当行政書士よりお客様宛にご連絡いたします。\n\n※「マッチング成立」とは、担当行政書士よりお客様への最初のご連絡（電話またはメール）が行われた時点を指します。\n※専門家の状況によって前後する場合は、事前にご案内いたします。",
  },
  {
    label: "キャンセル・返金について",
    // ★ Stripe 審査：返金条件・手数料の扱い・連絡方法を明記
    value:
      "【マッチング成立前：全額返金】\nお支払い後、担当行政書士からの最初のご連絡が届く前にキャンセルをご希望の場合は、全額返金いたします。\n返金はお客様のクレジットカード口座に対して行います。カード会社の処理期間（通常5〜10営業日）を要します。\n\n【マッチング成立後：原則返金不可】\n担当行政書士よりお客様への最初のご連絡をもってマッチング成立とします。成立後のキャンセル・返金はサービスの性質上、原則としてお受けできません。\n\n【当社都合によるキャンセル：全額返金】\n当社の事情によりマッチングを提供できなかった場合は、全額返金いたします。\n\n【キャンセル・返金のご連絡先】\n電話：045-881-9952（平日 9:00〜18:00）\nメール：contact@seiren.ne.jp",
  },
  {
    label: "個人情報の取扱い",
    value: "ご入力いただいた個人情報は、サービス提供・マッチングの目的にのみ使用します。詳細は下記をご確認ください。",
    link: { href: "/privacy", label: "プライバシーポリシー" },
  },
  {
    label: "動作推奨環境",
    value:
      "最新バージョンの Chrome / Safari / Edge / Firefox を推奨します。古いブラウザではレイアウトが崩れる場合があります。",
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
          特定商取引に関する法律（特定商取引法）第11条（通信販売）に基づき、以下の事項を表示します。
        </p>

        {/* 適用サービス */}
        <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50 px-5 py-4">
          <p className="text-xs font-semibold text-emerald-700 mb-2">本ページの適用サービス</p>
          <p className="text-sm leading-relaxed text-emerald-900">
            本ページは、株式会社清蓮が運営する以下のサービスに共通して適用されます。
          </p>
          <ul className="mt-2 space-y-1 text-sm text-emerald-900">
            <li>
              ・お墓じまいナビ（
              <a href="https://www.ohakajimai-navi.jp" className="underline">
                ohakajimai-navi.jp
              </a>
              ）
            </li>
            <li>
              ・お墓探しナビ（
              <a href="https://www.ohakanavi.jp" className="underline">
                ohakanavi.jp
              </a>
              ）
            </li>
          </ul>
        </div>

        {/* 法定記載事項テーブル */}
        <dl className="mt-12 divide-y divide-neutral-100 border-t border-b border-neutral-100">
          {items.map((item) => (
            <div
              key={item.label}
              className="grid gap-2 py-6 md:grid-cols-[220px_1fr] md:gap-8"
            >
              <dt className="text-sm font-semibold text-neutral-600">
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

        {/* 最終更新日 */}
        <p className="mt-8 text-xs text-neutral-400">最終更新日：2026年3月19日</p>

        {/* 問い合わせ誘導 */}
        <p className="mt-4 text-sm leading-relaxed text-neutral-500">
          本表記に関するご不明点は、
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
