# 市区町村ページの優先実装リスト

## 目的

検索需要・実装・リンク健全性・データ充実度を踏まえ、**どの `/kaissou/{prefecture}/{municipality}` を先に完成させるか**を機械補助しつつ人間が最終調整する。

## 自動スコア（`npm run municipality-priority-report`）

DB の `Municipality`（`isPublished: true`）から、以下を素点化して並べ替える。

### 需要プロキシ（都道府県スラッグ）

- **Tier A**（高密度・首都圏・主要都市圏など）… ボーナス大
- **Tier B** … ボーナス中
- **その他** … ボーナス小

（具体スラッグは `scripts/municipality-priority-report.ts` 内定数）

### 難易度・品質プロキシ

- `linkStatus === OK` や `PDF_ONLY` は相对稳定。
- `BROKEN` / `UNKNOWN` は要注意（コンテンツ整備またはリンク修正が先）。
- `dataQualityLevel` が高いほどページ完成に近いとみなす。
- `hasDomainWarning` は減点。
- `url` / `seoDescription` の有無で微加点。

### 出力

- `data/imports/municipality_priority_report.md` に順位付きテーブルを書き出す。
- **最終順位は人間が確定**: GSC で既にクリックがある自治体や、営業上重要なエリアで上げ下げする。

## テンプレ必須ブロック（ページ品質）

各市区町村ページに以下があること（計画参照）:

- 申請窓口情報
- 申請書入手先
- 記入時注意点
- 例外ケース
- 関連FAQ  
  および **誰が・いつ・どこへ・何を** が冒頭〜本文で明瞭であること。

## 関連コンポーネント

自治体詳細での E-E-A-T 強化として `ContentProvenance` を公式URL・更新日とともに本文近傍へ配置済みであることを開発時確認する。
