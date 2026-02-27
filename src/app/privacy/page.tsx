import { constructMetadata } from "@/lib/seo"
import Link from "next/link"

export const metadata = constructMetadata({
  title: "プライバシーポリシー｜株式会社清蓮 お墓じまいナビ",
  description:
    "株式会社清蓮が運営するお墓じまいナビにおける個人情報の取り扱い方針。個人情報保護法に基づく取得目的・第三者提供・Cookie・お客様の権利について。",
})

// 最終更新日
const LAST_UPDATED = "2026年2月27日"
const EFFECTIVE_DATE = "2026年2月27日"

const sections = [
  {
    id: "01",
    title: "基本方針",
    body: `株式会社清蓮（以下「当社」）は、お客様の個人情報を適切に保護することが社会的責務であると認識し、「個人情報の保護に関する法律」（個人情報保護法）およびその他関連法令を遵守します。

当社が運営する「お墓じまいナビ」（以下「本サービス」）を利用するすべてのお客様の個人情報について、本ポリシーに従い、適法かつ公正な手段で取り扱います。`,
  },
  {
    id: "02",
    title: "取得する個人情報",
    items: [
      {
        subtitle: "お客様が直接提供する情報",
        content:
          "無料相談フォーム・お見積りフォーム・お問い合わせフォームを通じてご提供いただく氏名・メールアドレス・電話番号・お墓の所在地・ご希望内容等。",
      },
      {
        subtitle: "サービス利用を通じて取得する情報",
        content:
          "当社ウェブサイトへのアクセスログ（IPアドレス・ブラウザ種別・OS・アクセス日時・参照URL）、Cookieおよび類似技術により収集される閲覧行動データ。",
      },
      {
        subtitle: "第三者から取得する情報",
        content:
          "Google Analytics 等の解析サービスから取得される集計・匿名化された統計データ。",
      },
    ],
  },
  {
    id: "03",
    title: "個人情報の利用目的",
    items: [
      { content: "無料相談・お見積りのご回答およびサービスのご提供" },
      { content: "改葬手続きサポート・石材店・行政書士等のご紹介" },
      { content: "ご依頼案件の管理・進捗連絡・アフターフォロー" },
      { content: "サービス改善・新サービス開発のための分析" },
      { content: "法的義務の履行および当社権利の保護" },
      { content: "お客様の同意に基づく情報提供・お知らせの送付" },
    ],
  },
  {
    id: "04",
    title: "個人情報の第三者提供",
    body: `当社は、以下の場合を除き、お客様の個人情報を第三者に提供しません。

・お客様の事前の同意がある場合
・法令に基づき開示が必要な場合（裁判所・警察等の公的機関からの適法な要請）
・人の生命・身体または財産の保護のために必要で、お客様の同意を得ることが困難な場合
・国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行する場合

なお、当社はサービス提供のために業務委託先（石材店・行政書士・ITシステム事業者等）に個人情報を提供することがあります。その際は、委託先に対して適切な安全管理措置を講ずるよう契約上の義務を課しています。`,
  },
  {
    id: "05",
    title: "Cookie・解析ツールの使用",
    items: [
      {
        subtitle: "Google Analytics",
        content:
          "当社ウェブサイトでは、アクセス解析のために Google LLC が提供する「Google Analytics」を利用しています。Google Analytics は Cookie を使用して匿名の訪問データを収集します。収集されたデータは Google のプライバシーポリシーに基づき管理されます。ブラウザの設定またはGoogle Analytics オプトアウトアドオンにより無効化できます。",
      },
      {
        subtitle: "必須 Cookie",
        content:
          "セッション管理・セキュリティ保護のために必要な Cookie を使用しています。これらはサービスの基本機能に不可欠なため、無効化するとサービスが正常に動作しない場合があります。",
      },
      {
        subtitle: "Cookieの管理",
        content:
          "ブラウザの設定から Cookie を無効化することができます。ただし無効化した場合、一部のサービス機能が利用できなくなる場合があります。",
      },
    ],
  },
  {
    id: "06",
    title: "個人情報の安全管理",
    body: `当社は、取り扱う個人情報の漏えい・滅失・毀損を防止するため、以下の安全管理措置を実施しています。

・SSL/TLS暗号化通信によるデータ転送の保護
・アクセス権限の適切な管理と定期的な見直し
・個人情報を取り扱う従業者への教育・監督
・不正アクセス防止のためのセキュリティ対策の実施
・個人情報の保存期間の設定と期限超過データの適切な廃棄`,
  },
  {
    id: "07",
    title: "個人情報の保存期間",
    body: `当社は、利用目的の達成に必要な期間のみ個人情報を保存します。

・お問い合わせ・相談記録：ご依頼終了後3年間
・契約に関連する書類：法令で定められた期間（原則7年）
・アクセスログ：最大13ヶ月
・Cookieデータ：最大2年

上記の保存期間経過後、または保存の必要性がなくなった場合は、適切な方法で速やかに破棄します。`,
  },
  {
    id: "08",
    title: "お客様の権利",
    body: `個人情報保護法に基づき、お客様は以下の権利を有します。

・**開示請求**：当社が保有するお客様の個人情報の開示を求める権利
・**訂正・追加・削除請求**：内容が事実と異なる場合の訂正等を求める権利
・**利用停止・消去請求**：目的外利用または不正取得の場合の利用停止を求める権利
・**第三者提供停止請求**：第三者提供の停止を求める権利

これらの権利を行使する場合は、下記の問い合わせ先までご連絡ください。ご本人確認の上、法令の定める期間内に対応いたします。`,
  },
  {
    id: "09",
    title: "外部リンク・外部サービス",
    body: `本サービスには、外部ウェブサイト（散骨クルーズ、遺骨ラボ等）へのリンクを含む場合があります。これらの外部サービスにおける個人情報の取り扱いについては、各サービスのプライバシーポリシーをご確認ください。当社は外部サービスの個人情報取り扱いについて責任を負いません。`,
  },
  {
    id: "10",
    title: "未成年者の個人情報",
    body: `本サービスは、18歳未満の方を対象としていません。18歳未満の方がお問い合わせをされる場合は、保護者の方と一緒にご利用ください。`,
  },
  {
    id: "11",
    title: "本ポリシーの変更",
    body: `当社は、法令の改正・サービスの変更等に伴い、本ポリシーを改訂することがあります。重要な変更を行う場合は、本ウェブサイト上で事前にお知らせします。改訂後のポリシーは、本ページに掲載した時点から効力を生じます。`,
  },
  {
    id: "12",
    title: "個人情報に関するお問い合わせ",
    isContact: true,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">

      {/* ── Hero ── */}
      <div className="border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <nav className="flex items-center gap-2 text-xs text-neutral-400" aria-label="パンくず">
            <Link href="/" className="hover:text-neutral-600 transition-colors">ホーム</Link>
            <span aria-hidden="true">/</span>
            <span className="text-neutral-700">プライバシーポリシー</span>
          </nav>

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-lg font-medium text-neutral-900">プライバシーポリシー</p>

          <div className="mt-8 flex flex-col gap-1">
            <p className="text-sm text-neutral-500">
              <span className="font-medium text-neutral-700">制定日：</span>{EFFECTIVE_DATE}
            </p>
            <p className="text-sm text-neutral-500">
              <span className="font-medium text-neutral-700">最終更新：</span>{LAST_UPDATED}
            </p>
            <p className="text-sm text-neutral-500">
              <span className="font-medium text-neutral-700">事業者：</span>株式会社清蓮
            </p>
          </div>
        </div>
      </div>

      {/* ── 目次 ── */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">目次</p>
          <nav aria-label="目次">
            <ol className="grid gap-2 sm:grid-cols-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#section-${s.id}`}
                    className="group flex items-center gap-3 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    <span className="text-xs font-medium text-neutral-400 tabular-nums">{s.id}</span>
                    <span className="group-hover:underline underline-offset-2">{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      {/* ── 本文 ── */}
      <div className="mx-auto max-w-3xl px-6 py-16 space-y-0">
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={`section-${section.id}`}
            className={`py-12 ${index !== sections.length - 1 ? "border-b border-neutral-100" : ""}`}
          >
            {/* セクションヘッダー */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-xs font-semibold text-neutral-400 tabular-nums shrink-0">
                {section.id}
              </span>
              <h2 className="text-xl font-bold text-neutral-900">{section.title}</h2>
            </div>

            {/* 本文テキスト */}
            {section.body && (
              <div className="pl-8">
                {section.body.split("\n\n").map((para, i) => (
                  <p
                    key={i}
                    className="text-base leading-relaxed text-neutral-600 mb-4 last:mb-0 whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: para.replace(
                        /\*\*(.+?)\*\*/g,
                        '<strong class="text-neutral-800">$1</strong>'
                      ),
                    }}
                  />
                ))}
              </div>
            )}

            {/* リスト形式 */}
            {section.items && (
              <div className="pl-8 space-y-5">
                {section.items.map((item: { subtitle?: string; content: string }, i) => (
                  <div key={i}>
                    {item.subtitle && (
                      <p className="text-sm font-semibold text-neutral-800 mb-1.5">{item.subtitle}</p>
                    )}
                    <p className="text-base leading-relaxed text-neutral-600">{item.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* お問い合わせ */}
            {section.isContact && (
              <div className="pl-8">
                <p className="text-base leading-relaxed text-neutral-600 mb-6">
                  本ポリシーに関するご質問・個人情報の開示等の請求は、下記の窓口までご連絡ください。
                  ご本人確認のための書類（運転免許証等）の提示をお願いする場合があります。
                </p>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="w-28 text-xs font-semibold text-neutral-500 shrink-0">会社名</span>
                    <span className="text-sm text-neutral-800">株式会社清蓮</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="w-28 text-xs font-semibold text-neutral-500 shrink-0">担当部署</span>
                    <span className="text-sm text-neutral-800">個人情報保護管理担当</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="w-28 text-xs font-semibold text-neutral-500 shrink-0">所在地</span>
                    <span className="text-sm text-neutral-800">神奈川県横浜市戸塚区戸塚町4170 高橋ビル1階</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="w-28 text-xs font-semibold text-neutral-500 shrink-0">電話</span>
                    <a
                      href="tel:045-881-9952"
                      className="text-sm text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      045-881-9952
                    </a>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="w-28 text-xs font-semibold text-neutral-500 shrink-0">メール</span>
                    <a
                      href="mailto:contact@seiren.ne.jp"
                      className="text-sm text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      contact@seiren.ne.jp
                    </a>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="w-28 text-xs font-semibold text-neutral-500 shrink-0">受付時間</span>
                    <span className="text-sm text-neutral-800">平日 10:00〜18:00</span>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-neutral-500">
                  ※ 本人確認後、原則として30日以内に回答いたします。法令に基づき対応が困難な場合は、その旨をご連絡します。
                </p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                  ※ 個人情報の取り扱いに関する苦情は、まず上記窓口にお申し出ください。
                  解決しない場合は、個人情報保護委員会（<a href="https://www.ppc.go.jp/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">www.ppc.go.jp</a>）への申告も可能です。
                </p>
              </div>
            )}
          </section>
        ))}
      </div>

    </div>
  )
}
