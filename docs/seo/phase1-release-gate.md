# フェーズ1 リリースゲート（サイト完成）

## スプリント単位（1週）

1. **スコープ固定**: 変更するページ・しないページをリスト化。
2. **実装**: コアLPまたは市区町村バッチのみ（デザインブラストと混ぜない）。
3. **検証**:
   - `npm run verify`（少なくとも `lint` + `typecheck`）
   - `npm run verify:seo`
   - 代表URL Lighthouse（または `verify:perf`）はスプリットでローテーション
4. **ドキュメント**: KPI表に1行追記またはスナップショット更新。
5. **プレミアム Web**: 変更ページ＋[`premium-web-quality-gate.md`](./premium-web-quality-gate.md) §7 のローテ URL のうち当該週対象について、同ドキュメント **§6 PASS** と Lighthouse（`npm run verify:perf` 等）を満たす。

## フェーズ1 完了条件（計画転記・運用）

- [ ] コアLPテンプレート統一（仕様書: `core-lp-template.md`）。
- [ ] 優先市区町村ページの公開率が事前に決めた目標を満たす（優先リスト: `municipality-priority-methodology.md` + 自動レポート）。
- [ ] 技術SEOの重大不一致ゼロ（`technical-seo-checklist.md` + `verify:seo`）。
- [ ] GEO・MEOチェックリストの「必須」項目達成。
- [ ] E-E-A-T 共通ブロックを主要タイプページに適用。
- [ ] プレミアム品質ゲート（代表 URL・§6 PASS；詳細: [`premium-web-quality-gate.md`](./premium-web-quality-gate.md)）。
- [ ] エコシステム動線 v1: 優先ページに `SeirenEcosystemNextSteps`、計測方針、リンク監視の運用が載っている状態（`seiren-ecosystem-ia.md`）。

## メタ運用

- 週次で「未完タスク」を次スプリント先頭へ繰り越さず、**優先度を再評価**してから載せる（計画書の指示）。
