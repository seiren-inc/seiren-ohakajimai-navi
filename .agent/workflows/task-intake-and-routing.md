# Task Intake and Routing — seiren-ohakajimai-navi

> 対象: Antigravity / Codex / Claude Code
> 更新: 2026-04-14

---

## ワークフロー概要

新規タスクを受け取ったとき、このワークフローに従ってルーティングを決定する。

---

## Step 1: タスク分類

| 種別 | 判断基準 | 担当 |
|---|---|---|
| **設計・構成・方針** | UI設計・アーキテクチャ決定・ドキュメント | Antigravity |
| **実装・コード変更** | ファイル編集・diff生成・リファクタ | Codex |
| **分析・監査** | 横断レビュー・品質確認・深堀り調査 | Claude Code |
| **複合タスク** | 設計+実装が混在 | Antigravity → Codex の分担 |

---

## Step 2: スコープ確認

```
[ ] 問題・ゴールが明確か
[ ] 対象ファイルが特定されているか
[ ] 禁止事項（Prisma schema / Auth / Stripe）に抵触しないか
[ ] このリポジトリのスコープ内か
```

いずれかが NO の場合 → **即時停止してユーザーに確認**

---

## Step 3: 実行フロー

```
Analysis → Plan → Approval → Execution → Verification
```

---

## Step 4: 完了報告テンプレート

```markdown
## 完了報告

### 変更ファイル
- `path/to/file.ts`

### diff

### 検証
- コマンド: `pnpm lint && pnpm build`
- 結果: PASS / FAIL

### Skill Usage Report
```

---

## seiren-ohakajimai-navi 固有チェックポイント

- Supabase Auth SSR: `getUser()` のみ使用
- Supabase RLS: 全ユーザーデータテーブルで有効
- Stripe webhook: `constructEvent()` 必須（server-side）
- WebAuthn ロジックへの変更は必ず承認後
- Vitest + Playwright: 変更後は必ずテスト実行
