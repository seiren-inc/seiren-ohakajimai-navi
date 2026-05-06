# 清蓮エコシステム IA と相互送客方針

## グループ公式URL（ソース・オブ・トゥルース）

一覧はコード上 **`src/config/seiren-ecosystem.ts`** および **`public/llms.txt`** を参照すること（二重編集禁止）。

公式:

- https://www.sankotu-cruise.com/
- https://ikotsu-lab.com/
- https://www.ikotsu.com/
- https://www.ohakanavi.jp/
- https://www.seiren-inc.co.jp/

検索意図クラスとの対応は [information-architecture-four-intents.md](./information-architecture-four-intents.md)。

## レイヤ優先順位（計画どおり）

1. **文脈ブロック**「次のステップ」… `src/components/features/ecosystem/SeirenEcosystemNextSteps.tsx`
   - 設置済みコンテキスト例: `flow`, `sankotsu`, `kaisougo`, `kaisoukyoka`
2. **フッター近傍／会社・特商法付近の概要ブロック**（テンプレごとに承認。全ページの機械的繰り返し禁止）
3. **コーポレート**リンクはグループ全体の権威・アンカーとして利用（改修やURL変更にはリンクヘルス監視を伴う）

## UX / アクセシビリティ

- 別ドメインへ遷移するリンクは要件に従い `rel="noopener noreferrer"` を付与する。
- 公的・手続き情報とサービス提案の**境界を短文明示**する。

## 計測（GA4）

- 実装済みの `data-ecosystem-*` と GTM の取り方は [ga4-ecosystem-tracking.md](./ga4-ecosystem-tracking.md)。
- アウトバウンドおよびUTMまたはイベントプロパティで **`context`**（ページ種別または `EcosystemNextStepsContext` と一致させる）を付与し、「どこからの送客か」を分離できるようにする。
- **リンクスキーム化** を避ける: 総量・同一文言複製にはスプリントごと上限レビューを行う。
- Organization JSON-LD の `sameAs` にグループURLを載せる場合は、既存レイアウト側と**単一設定**で管理する。

## フェーズ2

- 姉妹サイトからお墓じまいナビへの文脈リンクは**価値交換**として設計し、各サイト側リリースと同期させる。
- `verify:seo` / リンクチェックと独立に、四半期で双方向リンクのバランスをレビューする。
