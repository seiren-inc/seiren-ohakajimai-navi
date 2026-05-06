# GA4 / GTM — 清蓮エコシステム外部遷移の計測

計画§1.5 に沿い、`Organization` の `sameAs` は `src/config/seiren-ecosystem.ts` の `SEIREN_ORGANIZATION_SAME_AS` に集約済み。**クリック計測**は GTM 等で CSS セレクタまたは data 属性を利用する。

## 実装済み data 属性（`SeirenEcosystemNextSteps`）


| 属性                       | 例                                                | 意味                  |
| ------------------------ | ------------------------------------------------ | ------------------- |
| `data-ecosystem-block`   | `next-steps`                                     | ブロック種別              |
| `data-ecosystem-context` | `flow` / `sankotsu` / `kaisougo` / `kaisoukyoka` | 設置ページコンテキスト         |
| `data-ecosystem-link`    | `sankotsu-cruise`, `ohaka-navi`, …               | 個別リンク ID            |
| `data-ecosystem-from`    | 上記と同じコンテキスト                                      | クリック発生元（リンク側でも重複指定） |


## GTM でのイベント例（命名はプロパティで統一）

- **イベント名**: `select_ecosystem_outbound`（または既存命名規約に合わせる）
- **パラメータ**:  
  - `link_id`: `{{Click Element}}` の `data-ecosystem-link`  
  - `from_context`: `data-ecosystem-from`  
  - `destination_hostname`: Click URL の host

トリガー: クリック — 条件 `Click Element` matches CSS selector `[data-ecosystem-link][href^="http"]`。

## フッター（関連サービス・企業サイト）

`src/components/layouts/footer.tsx` で次を付与済み:


| 属性                     | 値の例                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `data-ecosystem-block` | `footer-related-services`（姉妹4リンクのラッパー）                                                   |
| `data-ecosystem-link`  | `sankotsu-cruise`, `ikotsu-lab-sankotsu`, `ikotsu-com`, `ohaka-navi`, `seiren-corporate` |
| `data-ecosystem-from`  | `footer-related-services` または `footer-company`                                           |


ID は `FOOTER_SISTER_SITES`（`src/config/seiren-ecosystem.ts`）の単一ソース。上記トリガーで **NextSteps と同一の outbound イベント**に集約できる。

## トップ専用フッター（`HomepageClient`）

共通 `Footer` が出ないページのため、`src/components/home/HomepageClient.tsx` 内フッターにも同じ `link_id`（`data-ecosystem-link`）を付与。発生源の区別用に `from` とブロックのみ別値:


| 属性                     | 値の例                                                      |
| ---------------------- | -------------------------------------------------------- |
| `data-ecosystem-block` | `home-footer-related-services`                           |
| `data-ecosystem-link`  | 共通フッターと同じ（`sankotsu-cruise`, …）                          |
| `data-ecosystem-from`  | `home-footer-related-services` または `home-footer-company` |


表示ラベルはトップ向け文言（「（個人）」「（法人）」等）を維持し、**URL は `FOOTER_SISTER_SITES` / `SEIREN_CORPORATE_SITE_HREF` に統一**。

## プライバシー

イベントに PII を含めない。URL にクエリで個人情報を付けない。