# Doc-03 Database Detail Design

## 1. Purpose

本ドキュメントは seiren-ohakajimai-navi におけるデータベース詳細設計を定義する。
非破壊スキーマ進化を前提とし、既存データ（全国1,737自治体）との整合性を最優先とする。

---

## 2. Database Platform

- PostgreSQL（Supabase）
- ORM: Prisma
- Node v22 固定
- strict mode 有効

---

## 3. Entity Definitions

### 3.1 Prefecture

目的：都道府県マスタ管理

Fields：

| Field | Type | Constraint |
|-------|------|-----------|
| id | Int | PK, auto increment |
| name | String | unique |
| slug | String | unique |
| createdAt | DateTime | |
| updatedAt | DateTime | |

Index：

- slug index

---

### 3.2 Municipality

目的：自治体改葬許可情報管理

Fields：

| Field | Type | Constraint |
|-------|------|-----------|
| id | Int | PK |
| jisCode | String | unique, not null |
| name | String | |
| slug | String | |
| prefectureId | Int | FK |
| url | String \| null | |
| pdfUrl | String \| null | |
| linkStatus | LinkStatus | enum |
| linkType | LinkType | enum |
| lastCheckedAt | DateTime \| null | |
| integrityScore | Float \| null | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

Constraints：

- jisCode UNIQUE
- PDF_ONLY の場合 url=NULL
- pdfUrl NULL禁止（PDF_ONLY時）

Index：

- jisCode
- prefectureId
- linkStatus
- updatedAt

---

### 3.3 LinkStatus (Enum)

- ACTIVE
- BROKEN
- NEEDS_REVIEW
- MISSING
- PDF_ONLY

---

### 3.4 LinkType (Enum)

- URL
- PDF
- UNKNOWN

---

### 3.5 AuditLog

目的：データ変更履歴記録

Fields：

| Field | Type | Constraint |
|-------|------|-----------|
| id | Int | PK |
| municipalityId | Int | FK |
| action | String | |
| previousValue | Json | |
| newValue | Json | |
| executedAt | DateTime | |
| executedBy | String | |

Index：

- municipalityId
- executedAt DESC

---

### 3.6 LinkCheckRun

目的：リンク監査実行履歴

Fields：

| Field | Type | Constraint |
|-------|------|-----------|
| id | Int | PK |
| totalChecked | Int | |
| brokenCount | Int | |
| missingCount | Int | |
| pdfViolationCount | Int | |
| executedAt | DateTime | |

---

### 3.7 RecoveryCandidate

目的：自動復旧候補管理

Fields：

| Field | Type | Constraint |
|-------|------|-----------|
| id | Int | PK |
| municipalityId | Int | FK |
| suggestedUrl | String | |
| confidenceScore | Float | |
| status | String | |
| createdAt | DateTime | |

---

## 4. Relationship Diagram (Logical)

```
Prefecture 1 --- N Municipality
Municipality 1 --- N AuditLog
Municipality 1 --- N RecoveryCandidate
```

---

## 5. Integrity Rules

| Rule | 条件 |
|------|------|
| Rule-01 | PDF_ONLY → url = NULL |
| Rule-02 | pdfUrl 必須条件は linkType=PDF |
| Rule-03 | jisCode は重複不可 |
| Rule-04 | IntegrityScore は 0.0〜1.0 |
| Rule-05 | 監査ログは削除禁止 |

---

## 6. Migration Policy

- DROP禁止
- ALTER TYPE ADD VALUE のみ許可
- 既存カラム削除禁止
- NOT NULL追加は default指定必須
- データ破壊的変更禁止

---

## 7. Data Validation Layer

Prisma middleware で以下を検証：

- PDF_ONLY不整合
- URL形式チェック（http/https）
- null許容範囲

---

## 8. Performance Considerations

- skip/take ページネーション
- select限定取得
- N+1防止
- インデックス必須カラム明示

---

## 9. Backup Strategy

- Supabase 自動バックアップ
- 重要変更前に手動スナップショット
- migration前バックアップブランチ作成

---

## 10. Acceptance Criteria

- 1,737件データ整合性PASS
- verify_db_counts PASS
- verify_invariants PASS
- enum整合性エラーなし
