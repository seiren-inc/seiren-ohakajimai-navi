# Task Intake and Routing — seiren-ohakajimai-navi

> 対象: Codex / Claude Code / Antigravity
> 更新: 2026-05-01
> 目的: `task-intake-and-routing` を入口に、条件一致で下位スキルを順次起動する

---

## 0) 入口ルーターの基本動作

新規依頼を受けたら、まずこのルーターで以下を行う。

1. **Intake質問でタスクを正規化**
2. **リスク判定（Stop Conditions）**
3. **タスク種別判定**
4. **スキルチェーン決定（順序付き）**
5. **実行 + 検証 + 定型レポート**

---

## 1) Intake質問（最初に必ず確認）

以下の5項目を短く埋める。

```md
- Goal: 何を達成したいか（1文）
- Scope: 対象ファイル/画面/API
- Constraints: 触ってはいけない領域（SEO/DB/Auth/UIなど）
- Done Definition: 完了条件（例: build通過、UI確認）
- Deadline/Priority: 緊急度
```

1つでも不明瞭なら、実装前に質問して確定する。

---

## 2) Stop Conditions（分岐前の強制停止）

以下に該当する場合、**勝手に進めず承認待ち**:

- DB schema / migration / Supabase RLS 変更
- Authフロー変更（`getUser()`運用含む）
- Stripe webhook検証（`constructEvent()`）に関わる変更
- WebAuthnの削除・迂回・無効化
- SEO/GEO/MEO基盤（metadata / JSON-LD / canonical / sitemap / robots / routing）への影響
- 既存UIの構造・余白・タイポグラフィ変更を伴う改変

---

## 3) ルーティングマップ（本体スキル + dashboard-variant-designer）

### F. ダッシュボード設計（設問分岐・複数案）

- 条件（いずれか）:
  - 「ダッシュボード」「KPI」「管理画面」「コンソール」を新規設計または全面刷新したい
  - Animoライク、`Animo`、ミニマルダーク運用コンソール
  - 設問で分岐させ、複数バリアントから選びたい
  - GEO/MEO/SEO系の運用ダッシュボード構想
- チェーン（設計フェーズと実装フェーズを分離）:
  1. **`dashboard-variant-designer`**（必ず先に起動）
  2. ユーザーが変体をロックしたら、`implementation-flow`（コード変更は承認後）
  3. （DB/Auth/Stripe/WebAuthn関連なら）`db-safe-update`
  4. （UI適用フェーズのみ）`ui-qa-check`
  5. （仕様恒久化が必要なら）`docs-writer`
- メモ:
  - **Stop Conditions に抵触しそうなら**（SEO/routing/metadata 等）、設計のみに留めるか明示承認を取る。
  - 既存レイアウト保護がある場合、その制約は **Intakeの Constraints に必ず記載**させる。

### A. バグ/失敗系

- 条件: build失敗、runtime error、テスト失敗、想定外挙動
- チェーン:
  1. `bugfix-flow`
  2. （DB/Auth/Stripe/WebAuthn関連なら）`db-safe-update`
  3. （UI変更ありなら）`ui-qa-check`
  4. `docs-writer`（必要時のみ: 再発防止メモ）

### B. 新規実装/改修

- 条件: 機能追加、画面追加、Server Action追加、UI変更
- チェーン:
  1. `implementation-flow`
  2. （DB/Auth/Stripe/WebAuthn関連なら）`db-safe-update`
  3. （UI変更ありなら）`ui-qa-check`
  4. `docs-writer`（仕様/運用更新が必要な場合）

### C. ドキュメント主導

- 条件: 設計書更新、運用手順、ADR、引き継ぎ資料
- チェーン:
  1. `docs-writer`
  2. （セッション終了/引き継ぎ時）`handoff-flow`

### D. コンテキスト肥大・切替

- 条件: 文脈が長くなりすぎる、作業種別を切替える
- チェーン:
  1. `context-trim-flow`
  2. その後、A/B/Cのいずれかへ再ルーティング

### E. コミット要求時

- 条件: ユーザーが明示的に commit を要求
- チェーン:
  1. （直前タスクの本体スキルを完了）
  2. `commit-writer`

---

## 4) ルーター判定ロジック（擬似コード）

```txt
if task.isDashboardVariantDesign:
  run dashboard-variant-designer
  if user.locksVariantAndRequestsCode:
    run implementation-flow
    if task.touchesDbOrAuthOrStripeOrWebAuthn: run db-safe-update
    if task.touchesUI: run ui-qa-check

if task.isBugOrFailure:
  run bugfix-flow
  if task.touchesDbOrAuthOrStripeOrWebAuthn: run db-safe-update
  if task.touchesUI: run ui-qa-check
elif task.isImplementation:
  run implementation-flow
  if task.touchesDbOrAuthOrStripeOrWebAuthn: run db-safe-update
  if task.touchesUI: run ui-qa-check
elif task.isDocumentation:
  run docs-writer

if context.isLargeOrTaskSwitched:
  run context-trim-flow

if user.explicitlyRequestsCommit:
  run commit-writer

if session.endsOrhandoffNeeded:
  run handoff-flow
```

---

## 5) 実行規律（品質ゲート）

- 最小差分（minimal diff）を徹底
- 無関係ファイルは変更しない
- `any` を増やさない
- 既存命名・構成に合わせる
- 検証は最小面→必要に応じて全体へ拡張

推奨検証:

```bash
npm run typecheck
npm run lint
npm run build
```

---

## 6) 完了レポート形式（固定）

```md
1. status
2. files changed
3. why
4. validation
5. next step
```

---

## 7) 運用メモ（実務向け）

- 「まず `task-intake-and-routing` で開始」と明示すると、入口統一しやすい
- `/taskmaster` から起動すると、上記フローをそのまま短縮版で実行できる
- 複数ダッシュボード方向性の検討は、`implementation-flow` に入る前に **`dashboard-variant-designer`** を必ず通す（案の固定→承認→実装の順）
- 実装タスクは基本 `implementation-flow` を起点にする（設計ロック後）
- 不具合調査は必ず `bugfix-flow` から入り、根本原因を先に確定する
- 1セッション終盤で `handoff-flow` を走らせると再開コストが下がる

