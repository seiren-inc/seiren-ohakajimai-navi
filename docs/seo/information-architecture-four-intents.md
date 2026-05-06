# 情報設計 — 4つの検索意図クラス（Week 1）

お墓じまいナビ TOP3 計画の「意図ごとに異なるテンプレ」を固定するための分類です。新規ページやリライト時は、どのクラスに属するかを最初に決め、**同じクラスのテンプレ間でタイトル／H1／導入文の重複だけを避ける**（§4 `duplicate-content-rules.md` 参照）。

## 1. サービス理解（What / Why）

- **代表URL**: `/about`, `/ridanryou`, コラム系
- **ユーザー**: 用語・流れ・離檀など「何をするのか」「なぜ必要か」を知りたい
- **コンテンツ要件**: 定義文、注意点、FAQ、内部リンクは「手続き」「費用」「相談」へ

## 2. 手続き・HowTo（公的プロセス）

- **代表URL**: `/kaissou`, `/kaissou/{都道府県}`, `/kaissou/{都道府県}/{市区町村}`, `/kaisoukyoka`, `/flow`
- **ユーザー**: 許可申請・書類・窓口を知りたい
- **コンテンツ要件**: 手順番号、公式リンク、出典・更新日（`ContentProvenance`）、自治体固有FAQ（JSON-LD）
- **クロスセル**: 清蓮サービスは **`SeirenEcosystemNextSteps`** や CTA で文脈を分離（行政情報と混同させない）

## 3. 商業的比較・費用（How much / 選択）

- **代表URL**: `/price`, 費用関連コラム、海洋散骨の料金説明
- **ユーザー**: 相場・内訳・比較軸
- **コンテンツ要件**: 価格レンジは一般論＋「個別見積り」明示、YMYL で断定を避ける

## 4. 供養選択（散骨・移転先など）

- **代表URL**: `/sankotsu`, `/kaisougo`
- **ユーザー**: 散骨・永代供養・樹木葬などの選択肢
- **コンテンツ要件**: 法的不確実性の説明、外部公式（クルーズ・Lab 等）への導線は `seiren-ecosystem-ia.md` に従う

## エコシステム横断のユーザー道筋（要約）

| 道筋 | 入口例 | 主要出口 |
|------|--------|----------|
| 手続き完了後の供養先 | `/kaisougo` | お墓探しナビ・海洋散骨 |
| 散骨を検討 | `/sankotsu` | クルーズ公式・Lab |
| 書類だけ困っている | `/kaisoukyoka`, 市区町村ページ | `/gyoseishoshi`、`SeirenEcosystemNextSteps`（`kaisoukyoka`） |

実装参照: `src/config/seiren-ecosystem.ts`、`SeirenEcosystemNextSteps`。
