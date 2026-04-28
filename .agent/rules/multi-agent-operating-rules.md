# Multi-Agent Operating Rules — seiren-ohakajimai-navi

> 対象: Antigravity / Codex / Claude Code
> 更新: 2026-04-14

---

## 1. チーム構成と役割分担

| エージェント | 主担当 | 副担当禁止事項 |
|---|---|---|
| **Antigravity** | 設計・構成・UI方針・ドキュメント・ワークフロー策定 | 最終ブラウザ検証・本番コード実装 |
| **Codex** | 実装・diff生成・リポジトリ内コード変更 | 大規模リファクタ（承認なし） |
| **Claude Code** | 深堀り分析・横断的レビュー・監査 | 実装（分析専任） |

## 2. タスクルーティング基準

```
UI/デザイン判断 → Antigravity
実装・diff → Codex
横断レビュー・監査 → Claude Code
```

## 3. 実行契約（非交渉）

- app code / schema / env / package.json を理由なく触らない
- 実装前に必ず Analysis → Plan → Approval フローを経る
- 完了報告には必ず変更ファイルパス・diff・検証結果を含める
- 推測での補完は禁止

## 4. プラットフォーム固有禁止事項 — seiren-ohakajimai-navi

- Prisma migration（承認なし）を禁止
- Supabase Auth: `getUser()` のみ使用（`getSession()` 禁止）
- Supabase RLS: 全ユーザーデータテーブルで必ず有効
- Stripe webhook: `constructEvent()` を server-side で必ず使用
- WebAuthn（シンプルウェブ認証）ロジックの詳細保護：
    - `@simplewebauthn/server` による検証フロー（`verifyRegistrationResponse`, `verifyAuthenticationResponse`）の改変禁止。
    - 認証チャレンジ（challenge）の生成・セッション保存・照合ロジックの変更禁止。
    - DB 上の `Authenticator` (Credential) 情報のスキーマおよび不変性の維持。
    - RP ID（Relying Party ID）および Origin 設定の無断変更禁止。
- 市区町村データ・地域データの恣意的な変更禁止

## 5. 完了定義

以下がすべて揃った場合のみ完了とする：

- [ ] 変更ファイルパス（フルパス）の提示
- [ ] diff または変更箇所の明示
- [ ] 検証コマンドとその出力
- [ ] スコープ遵守の確認
- [ ] Skill Usage Report

## 6. エスカレーション基準

以下が発生したら即停止してユーザーに確認：

- 認証・セッション・暗号化ロジックへの変更
- DB スキーマのマイグレーション
- 外部サービスの新規追加
- 複数モジュールへの影響
- 要件が不明確
