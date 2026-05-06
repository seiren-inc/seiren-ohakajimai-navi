# コアLPテンプレート固定仕様

対象ルート:

- `/` … `src/app/page.tsx`
- `/kaissou` … `src/app/kaissou/page.tsx`（親ハブ）
- `/kaisoukyoka` … `src/app/kaisoukyoka/page.tsx`
- `/flow` … `src/app/flow/page.tsx`
- `/price` … `src/app/price/page.tsx`

## 共通の情報ブロック順（推奨）

1. **一言定義**（1文）／ユーザーの検索意図への即答。
2. **結論または次のアクション**（スキャンしやすい箇条書き可）。
3. **根拠・出典**（官公庁・条例・一次ソースへのリンク。曖昧表現のみで終えない）。
4. **手順または比較の整理**（番号リスト）。
5. **FAQ**（`FAQPage` と整合させる質問のみ）。
6. **文脈に基づく内部リンク**（市区町村ハブ、`/kaisoukyoka`、`/price` 等）。
7. **清蓮エコシステム「次のステップ」**（該当テンプレートのみ、`SeirenEcosystemNextSteps`。全ページ自動挿入はしない）。

## メタデータ / 構造化

- `metadata`（title / description）はページごと固有。コアKWの取り込みは自然文で。
- 組織・パンくず・`FAQPage` 等は `src/app/layout.tsx` と各ページの JSON-LD が **矛盾しないこと** を技術チェックリストで確認する。

## デザイン・UI保護

- サーフェス: `var(--texture-paper)` / `var(--texture-clay)`、境界線: `var(--color-mineral)` を基準とする。
- レイアウト・コンポーネント構成の変更は **別スコープ／明示承認**（AGENTS.md の UI Protection）。

## フェーズ1 完了条件

- 上記5ルートが、見出し階層・FAQモジュール・内部リンクの「型」において統一されている。
- 変更はこのドキュメントと差分レビューをセットにする。
