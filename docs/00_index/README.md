# 設計資産管理ルール

## 対象プロジェクト

- seiren-ohakajimai-navi
- 保存先: `/Users/takumashinnyo/Workspace/projects/seiren-ohakajimai-navi/docs/`
- Git管理対象に必ず含める

---

## フォルダ構造

```
docs/
├── 00_index/          … 本ルール・ドキュメント一覧
├── 01_requirements/   … 要件定義書
├── 02_basic_design/   … 基本設計書
├── 03_detail_design/  … 詳細設計書
├── 04_technical_design/ … 技術設計書
├── 05_test_design/    … テスト設計書
├── 06_security/       … セキュリティ設計書
├── 07_performance/    … パフォーマンス設計書
├── 08_operations/     … 運用設計書
├── 99_archive/        … 破棄・旧版の設計書
```

---

## 命名規則

- ファイル名: `Doc-XX_<Title>.md`
- 例: `Doc-01_Requirements.md`
- バージョン管理: `Doc-03_DatabaseDesign_v1.1.md`

---

## 保存ルール

1. **1ファイル1Doc**（単一mdにまとめない）
2. **上書き禁止** — 設計変更時はバージョン番号を付与する
3. **破棄した設計は `99_archive/` へ移動**する（削除しない）
4. **設計確定後は必ず Git commit** する
5. **省略版は禁止** — 必ず完全版を保存する

---

## Antigravity（AI）向け保存ルール

1. 生成した要件定義書・設計書は必ず `docs/` 配下に保存する
2. 保存直後にファイル保存確認ログを出力する
3. 保存後に `git status` を表示する
4. commit message と extended description を必ず提示する
5. 単一セッション内メモリに依存しない（必ずファイルとして保存する）

---

## iCloud 禁止

- iCloud 配下のパスは一切使用しない
- GitHub（seiren-inc）を正とする

---

## ドキュメント一覧

| Doc ID | タイトル                   | フォルダ                    | ファイル名                                  | 状態   |
| ------ | -------------------------- | --------------------------- | ------------------------------------------- | ------ |
| Doc-01 | 要件定義書                 | 01_requirements             | Doc-01_RequirementsDefinition.md            | 投入済 |
| Doc-02 | 基本設計書                 | 02_basic_design             | Doc-02_SystemBasicDesign.md                 | 投入済 |
| Doc-03 | DB詳細設計書               | 03_detail_design            | Doc-03_DatabaseDetailDesign_v1.1.md         | 投入済 |
| Doc-04 | アプリケーション詳細設計書 | 03_detail_design            | Doc-04_ApplicationDetailDesign.md           | 投入済 |
| Doc-05 | テスト設計書               | 05_test_design              | Doc-05_TestDesign.md                        | 投入済 |
| Doc-06 | セキュリティ設計書         | 06_security                 | Doc-06_SecurityDesign.md                    | 投入済 |
| Doc-07 | パフォーマンス設計書       | 07_performance              | Doc-07_PerformanceDesign.md                 | 投入済 |
| Doc-08 | 運用設計書                 | 08_operations               | Doc-08_OperationsRunbook.md                 | 投入済 |
| Doc-09 | SEO設計書                  | 04_technical_design         | Doc-09_SEOIndexingDesign.md                 | 投入済 |
| Doc-10 | 監視設計書                 | 04_technical_design         | Doc-10_MonitoringObservabilityDesign.md     | 投入済 |
| Doc-11 | データガバナンス設計書     | 04_technical_design         | Doc-11_DataGovernanceDesign.md              | 投入済 |
| Doc-12 | スケーラビリティ設計書     | 04_technical_design         | Doc-12_ScalabilityDesign.md                 | 投入済 |
| Doc-13 | リスク管理設計書           | 04_technical_design         | Doc-13_RiskManagementDesign.md              | 投入済 |
| Doc-14 | バックアップ・DR設計書     | 14_backup_disaster_recovery | Doc-14_BackupDisasterRecoveryDesign_v1.1.md | 投入済 |
| Doc-15 | API公開設計書              | 04_technical_design         | Doc-15_APIPublicExposureDesign.md           | 投入済 |
| Doc-16 | 統合監査・実装移行ゲート   | 00_index                    | Doc-16_IntegratedAuditReadiness.md          | 投入済 |
| Doc-17 | AI統合アーキテクチャ設計書 | 04_technical_design         | Doc-17_AIIntegrationDesign.md               | 投入済 |
| Doc-18 | 実装タスク分解書           | 18_implementation_tasks     | Doc-18_ImplementationTaskBreakdown_v1.1.md  | 投入済 |
| Doc-19 | リリース判定書             | 19_release_checklist        | Doc-19_ReleaseChecklist_v1.1.md             | 投入済 |

※ Doc 投入のたびにこの表を更新する
