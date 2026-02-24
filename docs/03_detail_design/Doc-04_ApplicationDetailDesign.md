# Doc-04 Application Detail Design

## 1. Purpose

本ドキュメントは、seiren-ohakajimai-navi のアプリケーション詳細設計を定義する。
Next.js App Router 構成を前提とし、Server Component 中心設計、エンタープライズ品質、
SEO最適化、運用監査基盤との整合を保証する。

---

## 2. Application Structure Overview

プロジェクト構造（論理）：

```
/app
  / (top)
  /kaisoukyoka
  /area/[prefecture]
  /area/[prefecture]/[municipality]
  /api/v1/municipalities
  /admin
  /admin/quality
  /admin/quality/issues
  /admin/quality/municipalities
  /admin/quality/runs

/lib
  /db
  /services
  /validations
  /admin
  /seo

/components
  /ui
  /forms
  /layout

/scripts
  verify_db_counts.ts
  verify_invariants.ts

/docs
  （設計資産）
```

---

## 3. Rendering Strategy

### 3.1 Public Pages

**Top Page (/)**

- Static Generation
- SEO最適化
- Lighthouse 90以上目標

**Kaisoukyoka (/kaisoukyoka)**

- ISR
- 改葬許可解説コンテンツ

**Prefecture Page (/area/[prefecture])**

- ISR
- 自治体一覧表示
- ページネーション（skip/take）

**Municipality Page (/area/[prefecture]/[municipality])**

- SSR
- 最新リンクステータス取得
- IntegrityScore表示

---

### 3.2 Admin Pages

**/admin**

- 認証必須

**/admin/quality**

- ダッシュボード表示
- 統計取得は Server Component

**/admin/quality/issues**

- フィルタリング（Missing, Broken, PDF_ONLY違反等）
- サーバーサイドページネーション

**/admin/quality/municipalities**

- 全1,737件管理画面
- 検索 + JISコード順

**/admin/quality/runs**

- 監査履歴一覧
- 成功率表示

---

## 4. Service Layer Design

lib/services 配下に以下を定義：

**MunicipalityService**

- getAll()
- getByPrefecture()
- getByJisCode()
- updateLinkStatus()

**AuditService**

- recordChange()
- getRecentLogs()

**QualityService**

- calculateIntegrityScore()
- validateInvariants()
- summarizeRun()

---

## 5. Validation Layer

lib/validations 配下：

- URL形式チェック
- PDF_ONLY整合チェック
- フォーム入力バリデーション
- XSSサニタイズ

全てサーバー側で検証必須。

---

## 6. API Design

**/api/v1/municipalities**

- Method: GET
- Auth: API Key header
- Rate Limit: middleware適用

Response形式：

```json
{
  "total": "number",
  "data": "Municipality[]"
}
```

エラー時：

```json
{
  "error": "Unauthorized"
}
```

---

## 7. Error Handling Policy

- try/catch必須
- 内部エラーはログのみ
- ユーザー向けは汎用メッセージ
- Admin画面では詳細表示可

---

## 8. SEO Design

- metadata API利用
- sitemap.ts 動的生成
- robots.ts 制御
- admin/search disallow
- prefecture priority 0.9
- municipality priority 0.6

---

## 9. Performance Optimization

- select限定取得
- 不要なClient Component排除
- 画像最適化
- skip/takeページネーション
- N+1防止

---

## 10. Security Design

- HTTP Security Headers
- CSP
- XSS sanitize
- SQL injection防止（Prisma）
- Rate Limit
- verify:ci必須通過

---

## 11. Logging & Audit

- 全更新はAuditLogへ
- 監査実行はLinkCheckRunへ
- RecoveryCandidate保存

---

## 12. Coding Standards

- TypeScript strict
- any禁止
- 未使用変数禁止
- eslintエラー0目標
- 差分最小変更

---

## 13. Acceptance Criteria

- 全ページ正常表示
- API正常応答
- 管理画面表示成功
- verify:ci PASS
- Lighthouse 90以上
- 1,737件整合性PASS
