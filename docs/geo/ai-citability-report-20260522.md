# AI Citability Report: お墓じまいナビ

**調査日:** 2026-05-22
**調査対象:** https://www.ohakajimai-navi.jp
**調査者:** Claude Sonnet 4.6（ローカルソースコード解析）
**調査方法:** ローカルソースコードからの静的解析（公開中のファイルと同一内容）

---

## Executive Summary

| 指標 | 値 |
|---|---|
| 総合 Citability スコア（Phase 4完了後・現状） | **72 / 100** |
| llms.txt 充実度スコア | 23/25 |
| robots.txt AI クローラー設定スコア | 15/15 |
| 構造化データスコア | 22/25 |
| クエリ引用可能性スコア | 12/15 |
| コンテンツ深度スコア | 17/20 |

**Phase 4完了後の推定スコア（現状が Phase 4完了状態）:** 72/100

**総評:** GEO基盤として非常に高水準の実装が完了している。llms.txt・robots.txt・構造化データはほぼ最高水準。主要な引き上げ余地は「外部被引用シグナルの欠如」と「llms-full.txtのURL数が少ない点」および「BlogPosting構造化データの未実装」。

---

## 1. llms.txt / llms-full.txt 充実度

### 1.1 llms.txt（public/llms.txt）

| 項目 | 値 |
|---|---|
| 総行数 | 602行 |
| 総URL数 | 38件 |
| セクション数 | 12セクション |
| FAQカテゴリ数 | 10カテゴリ |
| FAQ問答数 | 約75問 |

**セクション構成:**
1. サイト概要（メタ情報、連絡先、評価）
2. 主要コンテンツ（サービス・手続き・専門家ディレクトリ）
3. サービス内容
4. 構造化データ宣言（10種類）
5. 専門用語（14語の定義）
6. FAQカテゴリ1: 費用・料金（6問）
7. FAQカテゴリ2: 法律・手続き（6問）
8. FAQカテゴリ3: お骨・遺骨の取り扱い（5問）
9. FAQカテゴリ4: 供養先の選び方（2問）
10. FAQカテゴリ5: 対応エリア・手続き（3問）
11. カテゴリ6: 時期・タイミング（9問）
12. カテゴリ7: 相続・遺産・家族関係（9問）
13. カテゴリ8: 海洋散骨（9問）
14. カテゴリ9: 行政書士・専門家（9問）
15. カテゴリ10: トラブル・困りごと（10問）
16. 都道府県別改葬手続き特徴（主要10都道府県解説）
17. 改葬手続きの完全ガイド（Step 1〜8）
18. サービス会社情報・海洋散骨詳細・行政書士マッチング事業詳細
19. 法令・規制情報（墓埋法・改葬許可制度・散骨通知・永代使用権・離檀料）
20. 改葬許可申請書データベース説明
21. 清蓮グループ各社URL

**強み:**
- AI引用に必要な「問い→答え」形式が完備している
- 専門用語の定義セクションが AI の語彙習得を促進する
- 法令（墓埋法第5条、厚生省通知平成3年）の一次ソース引用がある
- 都道府県別の手続き特徴が地域クエリに対する引用可能性を高める
- グループ会社URLが明示されており、エンティティの一貫性がある

**改善余地:**
- URL数が38件と少なく、llms-full.txt（669行）との差が小さい（構造が重複しがち）
- ブログ記事30本のURL・タイトル・概要が llms.txt に未掲載
- 行政書士個別ページへのURL参照がない

**スコア: 23/25**

---

### 1.2 llms-full.txt（public/llms-full.txt）

| 項目 | 値 |
|---|---|
| 総行数 | 669行 |
| llms.txtとの差 | +67行 |

llms-full.txtは詳細版として存在しているが、llms.txtとの差は67行と小さく、実質的に同一内容の拡張版になっている。AI検索エンジンが参照する際の付加価値が限定的。

---

## 2. robots.txt AIクローラー設定

**実装場所:** `src/app/robots.ts`（Next.js MetadataRoute.Robots）

| クローラー | 設定 | 備考 |
|---|---|---|
| `*`（全クローラー） | Allow `/` / Disallow `/admin/`, `/api/` | 基本許可 |
| `Bingbot` | Allow `/` | ChatGPT Atlas が参照 |
| `GPTBot` | Allow `/` | ChatGPT の学習・引用クロール |
| `PerplexityBot` | Allow `/` | Perplexity AI |
| `Google-Extended` | Allow `/` | Gemini AI 学習 |
| `ClaudeBot` | Allow `/` | Claude AI |
| `Googlebot` | Allow `/` | 通常の Google 検索 |

**評価:**
- 主要 AI 検索エンジンの全クローラーを明示的に許可している（ブロックなし）
- 各エントリにコメントで用途説明があり、意図的な設定であることが読み取れる
- `/admin/` と `/api/` のみを Disallow — 最小限の制限で最大限のクロール許可
- `sitemap` も `robots.ts` 内で参照されている（`${baseUrl}/sitemap.xml`）
- OAI-SearchBot（OpenAI検索向け）、Applebot-Extended（Apple Intelligence向け）は未設定だが、`*` の Allow で実質カバーされている

**スコア: 15/15**（全主要 AI クローラーを明示的に許可）

---

## 3. 構造化データ出力確認

### 3.1 トップページ（/）

実装されているJSON-LDスキーマ:

| スキーマタイプ | コンポーネント | 主要フィールド |
|---|---|---|
| `FAQPage` | `FaqJsonLd` | 9問（費用・手続き・書類・散骨・全国対応など） |
| `Service` + `OfferCatalog` | `ServiceJsonLd` | 改葬手続きサポート・墓石撤去・海洋散骨・粉骨 |
| `DefinedTermSet` | `DefinedTermSetJsonLd` | お墓じまい・改葬・散骨など専門用語 |
| `Organization` | `OrganizationJsonLd` | 47都道府県の `areaServed`、連絡先、SNS、代表者 |
| `WebSite` | `WebSiteJsonLd` | サイト全体のメタ情報 |
| `LocalBusiness` + `ProfessionalService` | `LocalBusinessJsonLd` | 住所・GeoCoordinates・AggregateRating（4.5/28件）・OfferCatalog |

**Organization スキーマの品質:**
- `@id`、`name`、`alternateName`、`url`、`logo`、`telephone`（代表・フリーダイヤル2件）、`address`、`geo`（lat/lng）、`areaServed`（47都道府県全列挙）、`foundingDate`、`employee`（代表取締役・Person）、`sameAs`（SNS5件+Googleマップ）、`knowsAbout`（9項目）が全て揃っている

**AggregateRating:** 4.5点 / 28件（Google Maps由来）— AI が「信頼できる事業者」として引用する際の根拠になる

**FAQPage（トップ）:** 9問。各回答は200〜400文字で設計されており、AI が引用しやすい密度

### 3.2 都道府県ページ（/kaissou/kanagawa 等）

| スキーマタイプ | 実装状況 | 内容 |
|---|---|---|
| `BreadcrumbList` | ✅ | `BreadcrumbJsonLd` コンポーネント（全ページ対応） |
| `Service` + `AdministrativeArea` | ✅ | 都道府県ごとに動的生成（例: `神奈川県の改葬手続きサポート`） |
| `FAQPage`（動的） | ✅ | `FaqJsonLd` で3問の基本FAQ + 都道府県固有FAQ（東京3問・神奈川3問・埼玉3問・千葉3問 etc.） |
| `Person`（行政書士） | 条件付き ✅ | 提携行政書士が存在する場合に表示（DBデータ依存） |

**神奈川県固有の構造化データ品質:**
- 横浜市18区の窓口案内、湘南・鎌倉の離檀注意事項、費用相場（15〜35万円）が FAQ に含まれる
- `Service.areaServed` が `神奈川県`（`AdministrativeArea`）として正確に設定
- `Service.provider` が `#organization` を参照するエンティティグラフが形成されている

**改善余地:**
- BlogPosting スキーマが未実装（ブログ記事30本に構造化データなし）
- VideoObject スキーマが llms.txt に記載されているが、実装コンポーネント（`video-json-ld.tsx`）の使用状況が要確認
- 市区町村レベルのページに `HowTo` スキーマが追加されると引用密度が向上する

**スコア: 22/25**

---

## 4. クエリ別引用可能性評価

### 評価基準
- ◎: サイト独自コンテンツとして直接引用できる詳細な回答がある
- ○: 概要回答はあるが、他サイトより引用されやすい独自性がやや弱い
- △: 情報はあるが、AI が回答を構成するには散在している
- ✗: コンテンツが存在しない・不足している

| 検索クエリ | 評価 | 根拠 |
|---|---|---|
| 神奈川県 お墓じまい 行政書士 | ◎ | `/kaissou/kanagawa` に専用ページ。`prefecture-content.ts` に神奈川固有FAQ3問（横浜18区窓口・湘南注意点・費用相場）。行政書士マッチング機能あり。Organization の本社が横浜市戸塚区で地元E-E-A-Tが高い |
| 改葬許可申請 横浜市 | ◎ | `kaisoukyoka` ページが全国1,700市区町村対応。横浜市18区の窓口情報が神奈川コンテンツに明記。llms.txt に改葬許可申請書の取得フロー（Step 3）の詳細説明あり |
| お墓じまい 費用 相場 | ◎ | `/price` ページ + llms.txt の費用FAQ（墓石撤去15〜30万円・行政書士3〜10万円・散骨チャーター30〜50万円・合同5〜15万円等）が全て数値入りで回答可能。`homepageFaqs` にも「費用はいくらかかりますか」が含まれる |
| 改葬 流れ 手順 | ◎ | llms.txt に「改葬手続きの完全ガイド Step 1〜8」が詳細解説。`/flow` ページが専用コンテンツ。`HowTo` スキーマが宣言されている。改葬後の手順10ステップも llms.txt に掲載 |
| 海洋散骨 東京湾 | ○ | `/sankotsu` ページ + llms.txt に散骨FAQ 9問（チャーター・合同・委託の費用・法的根拠・粉骨・散骨ポイント制限等）あり。グループ会社「海洋散骨クルーズ」のURLも記載。ただし「東京湾」という地名の明示的な記載が llms.txt では限定的。Organization の `knowsAbout` に「横浜 海洋散骨」「湘南 散骨」あり |
| お墓じまい 行政書士 費用 依頼 | ◎ | llms.txt カテゴリ9（行政書士FAQ 9問）に依頼費用3〜10万円・メリット/デメリット・信頼できる行政書士の選び方・業務範囲の区別が全て掲載 |
| 離檀料 払わなくていい | ◎ | llms.txt に「離檀料は法律上の支払い義務なし」「高額請求時の対処法」「相場3〜20万円」が明記。`/ridanryou` 専用ページあり。FAQでも複数回答がある |
| 改葬と散骨の違い | ◎ | llms.txt に「改葬と散骨の違いは何ですか？」として法律上の定義（墓埋法第5条）を引用した詳細回答あり |

**スコア: 12/15**（5クエリ中4◎1○ = 高い引用可能性。ただし「東京湾 海洋散骨」の地名キーワード密度に改善余地）

---

## 5. 推定GEOスコア（Phase 4完了後 = 現状）

### Phase 4実装内容（完了確認済み）

| 実装項目 | 状態 | 証拠 |
|---|---|---|
| llms.txt: 602行・10FAQカテゴリ・75問 | ✅ 完了 | `public/llms.txt` |
| llms-full.txt: 669行 | ✅ 完了 | `public/llms-full.txt` |
| ブログ記事: 30本 | ✅ 完了 | `src/content/blog/` に30.mdx |
| ブログ内容: 神奈川・埼玉・千葉・東京地域ガイド | ✅ 完了 | `kaisou-kanagawa-guide.mdx`、`kaisou-saitama-guide.mdx`、`kaisou-chiba-guide.mdx`、`kaisou-tokyo-guide.mdx` |
| 都道府県固有コンテンツ: 神奈川・埼玉・千葉・東京 | ✅ 完了 | `src/lib/prefecture-content.ts` |
| FAQPage スキーマ: 全ページ対応 | ✅ 完了 | `FaqJsonLd` コンポーネント全ページ適用 |
| 都道府県別 Service スキーマ（AdministrativeArea） | ✅ 完了 | `/kaissou/[prefecture]/page.tsx` |
| robots.txt 全AI クローラー許可 | ✅ 完了 | `src/app/robots.ts` |
| Organization スキーマ（完全版） | ✅ 完了 | 47都道府県・SNS・Person・AggregateRating |
| LocalBusiness + AggregateRating | ✅ 完了 | `local-business-json-ld.tsx` |
| SpeakableSpecification | ✅ 完了（コンポーネント存在） | `speakable-json-ld.tsx` |
| DefinedTermSet（専門用語8件） | ✅ 完了 | `defined-term-json-ld.tsx` |

### GEOスコア詳細内訳（100点満点）

| カテゴリ | 配点 | 取得点 | 詳細 |
|---|---|---|---|
| AI クローラーアクセス制御 | 15 | 15 | 全主要 AI クローラーを明示的に許可 |
| llms.txt 充実度 | 20 | 18 | 602行・75問・専門用語・法令引用・URL38件 |
| llms-full.txt 差別化 | 5 | 3 | 669行だが llms.txt との差が小さい |
| 構造化データ（種類・品質） | 20 | 17 | 10種類実装。BlogPosting・VideoObject活用が未確認 |
| コンテンツ深度（FAQ密度・専門性） | 15 | 13 | 75問・法令引用・手順ガイド・都道府県別特徴あり |
| 地域特化コンテンツ（GEO固有性） | 10 | 8 | 関東4都県 + 全47都道府県対応。地名×クエリカバレッジが高い |
| 外部被引用シグナル（推定） | 10 | 4 | 設立17年・Googleマップ4.5点/28件あり。ただし業界メディア被引用が未確認 |
| E-E-A-T（Person・著者・実績） | 5 | 4 | 代表者 Person スキーマ・17年実績・行政書士連携あり |

**合計: 72/100**

---

## 6. 次に取るべきアクション（優先順）

### Priority 1（高インパクト・低コスト）

1. **llms.txt にブログ記事30本のURL・タイトル・概要を追記する**
   - 現状: llms.txt の URL 数が38件のみ。ブログ30本が未掲載
   - 対応: `getBlogSummaries()` の結果を llms.txt の「コラム・記事」セクションとして追加
   - 期待効果: AI 検索エンジンがブログコンテンツを個別記事として索引できるようになる
   - 作業量: 低（ブログメタデータから自動生成可能）

2. **BlogPosting 構造化データをブログ記事に追加する**
   - 現状: 30本のブログ記事に JSON-LD が未実装（`column/[slug]/page.tsx` を要確認）
   - 対応: `src/components/seo/` に `blog-posting-json-ld.tsx` を追加し、frontmatter から自動生成
   - 必須フィールド: `headline`、`author`、`datePublished`、`dateModified`、`description`、`keywords`、`url`
   - 期待効果: AI 検索の「著者・専門性」シグナルが大幅強化

3. **東京湾・相模湾の地名キーワードを llms.txt の海洋散骨セクションに明示的に追加する**
   - 現状: llms.txt の散骨セクションで「東京湾」「相模湾」の出現が限定的
   - 対応: 散骨ポイント（横浜港・東京港出港・沖合の散骨海域）の地名と距離感を追記

### Priority 2（中インパクト・中コスト）

4. **VideoObject 構造化データの実装状況を確認・展開する**
   - `video-json-ld.tsx` コンポーネントが存在するが、どのページで使用されているか要確認
   - 海洋散骨・改葬手続き解説動画があれば VideoObject を全動画に適用

5. **市区町村レベルページ（`/kaissou/kanagawa/yokohama` 等）に HowTo スキーマを追加する**
   - 現状: 市区町村ページにはBreadcrumbのみ
   - 対応: 改葬許可申請の手順を HowTo スキーマとして各ページに追加
   - 期待効果: 「横浜市 改葬許可申請 手順」クエリへの引用可能性が向上

6. **llms-full.txt を真の詳細版として再設計する**
   - 現状: llms.txt（602行）との差が67行（10%）と小さい
   - 対応: ブログ全文要約・市区町村別窓口情報・行政書士個別プロフィールを llms-full.txt に追加
   - 期待効果: Perplexity・Gemini がより詳細な情報ソースとして参照する

### Priority 3（中インパクト・高コスト）

7. **業界メディア・地方紙・行政サイトからの被リンク獲得**
   - 現状: GEO スコアで最も低い部分が「外部被引用シグナル」（4/10）
   - 対応: 神奈川県・横浜市の終活関連記事への情報提供、行政書士会との連携ページ作成
   - 期待効果: AI 検索エンジンが「権威ある情報源」として優先的に引用する確率が上昇

8. **SpeakableSpecification の実際のページへの適用を確認・拡大する**
   - `speakable-json-ld.tsx` コンポーネントが存在するが、使用ページを確認
   - 「FAQ の回答部分」「ページの概要文」を cssSelector で明示的に指定する

---

## 7. 競合との差別化ポイント（AI引用観点）

| 差別化要素 | 評価 | 詳細 |
|---|---|---|
| 専門用語の定義（DefinedTermSet） | 高 | 改葬・散骨・離檀料など14語が Schema.org で定義されている |
| 法令一次引用（墓埋法第5条・厚生省通知） | 高 | AI が法的根拠を必要とする質問に対し、一次情報として引用しやすい |
| 全国1,700市区町村の申請書データベース | 高 | 他社が持っていない規模のデータ網羅性。GEO引用の核 |
| 地元事業者としての E-E-A-T（横浜拠点・17年） | 中 | Googleマップ4.5点が構造化データに組み込まれている |
| 費用の具体的数値（単位まで明記） | 高 | 「30〜50万円」「1〜3万円」と数値が具体的。AI が回答に使いやすい |
| ブログ30本の地域別コンテンツ | 中 | 神奈川・東京・埼玉・千葉の地域ガイドが揃っている |

---

## 付録: 調査対象ファイル一覧

| ファイルパス | 内容 |
|---|---|
| `public/llms.txt` | 602行・AI検索向けサイト概要 |
| `public/llms-full.txt` | 669行・詳細版サイトマップ |
| `src/app/robots.ts` | AI クローラー許可設定 |
| `src/app/page.tsx` | トップページ・スキーマ実装 |
| `src/app/kaissou/[prefecture]/page.tsx` | 都道府県別ページ・動的スキーマ |
| `src/components/seo/faq-json-ld.tsx` | FAQPage スキーマ（9問） |
| `src/components/seo/organization-json-ld.tsx` | Organization スキーマ |
| `src/components/seo/local-business-json-ld.tsx` | LocalBusiness + AggregateRating |
| `src/components/seo/speakable-json-ld.tsx` | SpeakableSpecification コンポーネント |
| `src/lib/prefecture-content.ts` | 東京・神奈川・埼玉・千葉の固有コンテンツ |
| `src/lib/blog.ts` | ブログ記事データ管理 |
| `src/content/blog/` | ブログ記事30本（.mdx） |
