# 実装計画書 — seiren-ohakajimai-navi

> 最終更新: 2026-04-26  
> ルール: 作業項目は必ず `- [ ]` で記述し、完了したら `- [x]` に変更する（Markdown タスクリスト。Cursor / VS Code / GitHub でクリック切替可）。  
> 新規の実装計画は [`docs/templates/implementation-plan-template.md`](docs/templates/implementation-plan-template.md) をコピーして使う。

---

## 完了済み（〜2026-04-26）

### インフラ・DB基盤

- [x] Next.js 15 / React 19 / TypeScript 5 / Tailwind v4 プロジェクト初期構築
- [x] Supabase PostgreSQL + Prisma 5 セットアップ
- [x] Supabase Auth（SSR / PKCE / WebAuthn）実装
- [x] Stripe サブスクリプション決済 + Webhook 実装
- [x] Vercel デプロイ設定
- [x] DATABASE_URL を Dedicated Pooler（IPv6専用）→ Transaction Pooler（IPv4対応・無料）に変更
- [x] `.env.local` の DATABASE_URL も Transaction Pooler に統一
- [x] ローカル `prisma/seeds/scriveners.ts` で行政書士ダミーデータ 8件投入

### 公開ページ

- [x] トップページ（`/`）
- [x] 改葬許可申請ページ（`/kaisoukyoka`）— 全国自治体一覧
- [x] 改葬後の供養ページ（`/kaisougo`）
- [x] 改葬の流れページ（`/flow`）
- [x] 散骨ページ（`/sankotsu`）
- [x] 離檀料ページ（`/ridanryou`）
- [x] 費用シミュレーションページ（`/estimation`）
- [x] 自治体詳細ページ（`/kaissou/[prefecture]/[municipality]`）
- [x] 都道府県一覧ページ（`/kaissou/[prefecture]`）
- [x] コラム一覧・詳細（`/column`, `/column/[slug]`）
- [x] 会社情報・お問い合わせ・プライバシーポリシー等の静的ページ

### 行政書士マッチング（公開側）

- [x] 行政書士一覧ページ（`/gyoseishoshi`）
- [x] 行政書士詳細ページ（`/gyoseishoshi/[id]`）
- [x] 都道府県別行政書士一覧（`/gyoseishoshi/area/[prefecture]`）
- [x] 行政書士掲載申込フォーム（`/gyoseishoshi/entry`）
- [x] 問い合わせフォーム（`GyoseishoshiInquiryForm`）— 一般向け

### 行政書士ポータル（scrivener側）

- [x] アカウント登録（`/scrivener/signup`）
- [x] ログイン / パスキー認証（`/scrivener/login`）
- [x] オンボーディング（プロフィール入力 → プラン選択 → Stripe決済）
- [x] ダッシュボード（`/scrivener/dashboard`）— 問い合わせ一覧・リアルタイム通知

### 管理画面

- [x] 管理者ログイン + MFA
- [x] 行政書士管理（一覧・詳細・承認操作）
- [x] 問い合わせ管理（一覧・詳細）
- [x] 自治体データ品質管理
- [x] AIを使った品質監査バッチ

### SEO / GEO

- [x] JSON-LD（Organization / FAQ / HowTo / BreadcrumbList / Person / ProfessionalService）
- [x] sitemap.ts 生成
- [x] robots.ts
- [x] OGP・動的メタデータ
- [x] IndexNow 実装

### 開発基盤

- [x] `npm run verify` / `verify:ci` ゲート
- [x] Vitest 単体テスト基盤
- [x] Playwright E2E 基盤
- [x] Upstash レート制限（AI API / チャット）
- [x] Cloudflare Turnstile（フォームスパム対策）
- [x] Resend メール送信（コード実装済み・APIキー設定は未確認）

---

## Phase 1 — 問い合わせの行政書士紐付け

> スキーマ上の `scrivenerId` は実装済み。コード側の配線が未完。

- [x] `submitGyoseishoshiInquiry` に `scrivenerId` 保存を追加（`src/actions/submit-gyoseishoshi-inquiry.ts`）
- [x] `GyoseishoshiInquiryForm` に `scrivenerId?: string` prop を追加（`src/components/features/gyoseishoshi/GyoseishoshiInquiryForm.tsx`）
- [x] `/gyoseishoshi/[id]` にインライン問い合わせフォームを設置・`scrivenerId` を渡す（`src/app/gyoseishoshi/[id]/page.tsx`）
- [x] `npm run verify` 通過確認

---

## Phase 3 — Resend メール通知の疎通確認と拡張

- [ ] Vercel 環境変数 `RESEND_API_KEY` の設定確認
- [ ] Resend ダッシュボードで送信ドメイン認証（DNS設定）
- [ ] ローカルでテスト問い合わせを送り、管理者・ユーザー双方のメール到達を確認
- [x] `scrivenerId` がある場合、行政書士本人にも問い合わせ通知メールを送信（`src/actions/submit-gyoseishoshi-inquiry.ts`）

---

## Phase 2 — ダッシュボードからのプロフィール編集

- [x] `updateScrivenerProfile` Server Action を追加（`src/actions/scrivener/profile.ts`）— `ScrivenerAuditLog` に変更前後を記録
- [x] `ScrivenerProfileEditForm` コンポーネント作成（`src/components/scrivener/ScrivenerProfileEditForm.tsx`）
- [x] プロフィール編集ページ作成（`src/app/scrivener/profile/edit/page.tsx`）
- [x] ダッシュボードの「登録情報」カードに「編集」リンク追加（`src/app/scrivener/dashboard/page.tsx`）
- [x] `npm run verify` 通過確認

---

## Phase 4 — ISR 戦略の最適化（Phase 1〜3 完了後）

- [x] 行政書士承認・非承認時に `revalidatePath` を呼ぶ（管理画面 Server Action）
- [x] `/gyoseishoshi` を `force-dynamic` → `revalidate = 300` に変更
- [x] `/gyoseishoshi/area/[prefecture]` を `revalidate = 300` に変更
- [x] `/kaisoukyoka` を `revalidate = 3600` に変更
- [x] `npm run verify` 通過確認

---

## Phase 5 — 管理者承認フローの通し確認

- [ ] テスト用行政書士アカウントで signup → onboarding → 決済 → webhook 受信 の通し確認
- [ ] 管理画面で `isApproved = true` → 掲載ページに表示される確認
- [ ] Stripe テストモードキーへの切り替え検討（本番キーが現在設定中）

---

## Phase 6 — コラムコンテンツ整備

- [x] 「改葬許可申請書の書き方・必要書類まとめ」
- [x] 「墓じまいにかかる費用の目安」
- [x] 「離檀料とは？相場と交渉のポイント」
- [x] 「散骨・樹木葬・永代供養の違いと選び方」
- [x] 「行政書士と司法書士の違い——墓じまい手続きで頼む専門家はどちら？」

---

## 作業ログ

- 2026-05-04: Phase 2.5 指示書の7タスクを実装（scrivener ルート保護、問い合わせフォーム都道府県/モバイル修正、ヘッダー二重描画修正、FixedCTA 非表示条件、価格ページスクロールオフセット、ESLint warning コメント削除）。

---

## 参照ドキュメント

| ドキュメント | 場所 |
|---|---|
| タスク詳細分解（Doc-18） | `docs/18_implementation_tasks/Doc-18_ImplementationTaskBreakdown_v1.1.md` |
| アーキテクチャ概要 | `docs/ai/architecture-summary.md` |
| 意思決定ログ | `docs/ai/decision-log.md` |
| テスト・検証ルール | `.claude/rules/06-testing-and-validation-rules.md` |
| DB安全ルール | `.claude/rules/05-data-and-db-safety-rules.md` |
