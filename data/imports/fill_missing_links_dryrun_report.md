# Missing Link Dry-run 突合レポート (Phase 2) — 修正版

- **実行日時**: 2026/2/23 15:11:12

## 候補ソース分析結果
外部候補ファイル (html_extracted_candidates.json, yasuda_municipality_links.json) の全URLは既にpending.jsonに統合済みでした。
そのため、pending.json内部で修復可能な 2グループを対象として計画を生成します。

## 突合結果サマリー
- **対象グループ1 (NEEDS_REVIEW→OK昇格)**: 11件
- **対象グループ2 (null linkStatus→分類付与)**: 106件
- **採用計画件数 (重複除去後)**: 117件
  - fill_url (GUIDE): 116件
  - fill_pdf (PDF): 1件

> [!NOTE]
> この段階では pending.json は変更していません。
> フェーズ3の apply スクリプトで計画ファイル (fill_missing_links_plan.json) をもとに書き換えます。

> [!IMPORTANT]
> 残る 622件の UNKNOWN (url/pdfUrl 両方null) については、現時点で外部から補完できるデータソースが存在しません。
> これらは別途、自治体ごとのURLを手動調査するか、将来のスクレイピングバッチで補完する対象です。
