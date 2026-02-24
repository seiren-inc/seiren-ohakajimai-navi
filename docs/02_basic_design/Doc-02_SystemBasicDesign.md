# Doc-02 System Basic Design

## 1. System Architecture Overview

本システムは、Next.js 16 を基盤とするフルスタックWebアプリケーションであり、Supabase（PostgreSQL）をデータベース基盤とする構成を採用する。

アーキテクチャ種別：

- App Router 構成
- Server Components 主体
- SSR + ISR ハイブリッド構成
- API Route 内包型設計
- エンタープライズ品質前提

全体構成：

```
Client (Browser)
   ↓
Next.js App Router
   ↓
API Layer
   ↓
Prisma ORM
   ↓
PostgreSQL (Supabase)
```

---

## 2. Application Layer Design

### 2.1 Frontend Layer

責務：

- ユーザー表示
- フォーム入力
- SEO最適化
- アクセシビリティ対応

技術要素：

- Next.js 16
- TypeScript strict mode
- Server Components優先
- Client Components最小化
- next/image最適化

レンダリング戦略：

- 自治体一覧：ISR
- 自治体詳細：SSR
- 管理画面：SSR（認証前提）
- API：Server only

---

### 2.2 Backend Layer

責務：

- データ取得
- 監査処理
- 不変条件検証
- API公開

API構成：

```
/api/v1/municipalities
/admin/quality
/admin/quality/issues
/admin/quality/municipalities
/admin/quality/runs
```

認証：

- 管理画面：Supabase Auth allowlist
- API：API Key + Rate Limit

---

## 3. Data Architecture

### 3.1 Core Entities

- Municipality
- Prefecture
- LinkStatus
- AuditLog
- LinkCheckRun
- RecoveryCandidate

### 3.2 Data Integrity Rules

- PDF_ONLY の場合 url=null
- pdfUrl にPDFリンク格納
- linkStatus enum 必須
- JISコードユニーク制約
- paymentIntentId unique（将来拡張想定）

### 3.3 Index Design

- JISコード index
- prefectureId index
- linkStatus index
- updatedAt index

---

## 4. Routing Structure

主要ルーティング：

```
/
/kaisoukyoka
/area/[prefecture]
/area/[prefecture]/[municipality]
/api/v1/municipalities
/admin
/admin/quality
/admin/quality/issues
/admin/quality/municipalities
/admin/quality/runs
```

SEO対象：

- 都道府県ページ
- 自治体ページ
- kaisoukyoka

管理画面は robots disallow

---

## 5. Security Architecture

- HTTP Security Headers
- CSP
- XSS sanitize
- Prisma parameterized query
- Rate Limit middleware
- verify:ci による不変条件検査
- 環境変数管理（.env）

---

## 6. Performance Design

- ISR導入
- select最適化
- N+1防止
- skip/takeページネーション
- DBインデックス
- Lighthouse 90以上目標

---

## 7. Monitoring & Audit

- AuditLog 永続化
- LinkCheckRun 記録
- IntegrityScore 算出
- verify_db_counts
- verify_invariants

---

## 8. Deployment Design

環境：

- Node v22 固定
- Vercel 本番
- Supabase 本番DB

ビルド条件：

- npm run verify:ci PASS 必須
- 自治体総数 1,737件チェック
- enum不整合なし

---

## 9. Error Handling Strategy

- try/catch 包囲
- console.warn（フォールバック時）
- ユーザー向けエラーメッセージ統一
- ログはサーバーのみ

---

## 10. Extensibility Considerations

- 将来API公開拡張
- 外部データ連携
- 改葬許可自動取得AI
- 広告連携
- 多言語対応

---

## 11. Design Principles

- 単一責任原則
- 非破壊スキーマ進化
- 差分最小変更
- git add ファイル指定
- force push禁止
- 設計書は必ず docs 配下保存
