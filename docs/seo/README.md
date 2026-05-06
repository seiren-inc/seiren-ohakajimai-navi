# SEO / GEO / MEO 実行ドキュメント索引

お墓じまいナビ TOP3 計画に沿った運用・ゲート・チェックリストです。計画ファイル本体（`.plan.md`）は編集対象外です。

| ドキュメント | 用途 |
|--------------|------|
| [baseline-kpi-map.md](./baseline-kpi-map.md) | GSC / GA4 の主要KW・LPマッピングとベースライン取得手順 |
| [core-lp-template.md](./core-lp-template.md) | コアLP（`/`, `/kaissou`, `/kaisoukyoka`, `/flow`, `/price`）テンプレ固定仕様 |
| [municipality-priority-methodology.md](./municipality-priority-methodology.md) | 市区町村ページの優先度付け（需要・リンク健全性・データ品質） |
| [technical-seo-checklist.md](./technical-seo-checklist.md) | sitemap / robots / canonical / 構造化データの整合チェック |
| [phase1-release-gate.md](./phase1-release-gate.md) | フェーズ1 スプリント受け入れ・週次ゲート |
| [phase2-growth-loop.md](./phase2-growth-loop.md) | フェーズ2 クラスタ・CTR・月次監査の運用 |
| [geo-aio-aeo-llmo-checklist.md](./geo-aio-aeo-llmo-checklist.md) | GEO・引用しやすい構造・`llms.txt`・AIクローラ前提 |
| [meo-local-entity-checklist.md](./meo-local-entity-checklist.md) | MEO・GBP・NAP・ローカルスキーマ（オフライン含む） |
| [eeat-program.md](./eeat-program.md) | E-E-A-T 共通ブロックと監査基準 |
| [premium-web-quality-gate.md](./premium-web-quality-gate.md) | テクスチャトークン・A11y・CWV・UI保護との整合ゲート |
| [seiren-ecosystem-ia.md](./seiren-ecosystem-ia.md) | 清蓮グループ横断 IA・計測・スキーマ・過剰相互リンク回避 |
| [information-architecture-four-intents.md](./information-architecture-four-intents.md) | Week1 情報設計 — 検索意図4クラスとエコシステム道筋 |
| [staging-vs-production-robots.md](./staging-vs-production-robots.md) | staging / 本番の robots・noindex・canonical 差分 |
| [ga4-ecosystem-tracking.md](./ga4-ecosystem-tracking.md) | GA4/GTM でのエコシステム外向きクリック計測（data属性） |
| [duplicate-content-rules.md](./duplicate-content-rules.md) | 自治体ページのタイトル・H1・導入・FAQの重複回避 |

自動生成レポート:

- `data/imports/municipality_priority_report.md` … `npm run municipality-priority-report` 実行後に出力（DB接続が必要）。
