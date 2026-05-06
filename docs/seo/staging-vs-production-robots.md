# Staging と本番の robots / インデックス方針

計画§3に沿い、プレビュー環境での誤インデックスを防ぎ、本番の `robots` / sitemap 意図を明文化する。

## 本番（想定）

- **正規ホスト**: `https://www.ohakajimai-navi.jp`（監査・引用の主参照）
- `**robots.txt`**: 本番向けルールのみ。AI クローラー方針は `geo-aio-aeo-llmo-checklist.md` と整合
- `**llms.txt`**: `public/llms.txt` を本番 origin で配信
- **canonical / `NEXT_PUBLIC_BASE_URL`**: 本番 URL と一致させる（ステージングで本番 canonical を出さない）

## Staging / Preview（Vercel 等）

- **推奨**: `X-Robots-Tag: noindex, nofollow`（または環境別 middleware）でクロール対象から除外
- `**robots.txt`**: プレビュー用に `Disallow: /` を出す構成でも可。**本番ファイルをそのまま配信しない**（誤って duplicate canonical や sitemap を指さないようにする）
- **検索コンソール**: ステージング URL をプロパティ追加しない／URL 検査でインデックス依頼しない

## リリース前チェック（抜粋）


| 項目                     | 本番                              | Staging                                          |
| ---------------------- | ------------------------------- | ------------------------------------------------ |
| `noindex`              | 適用しない（意図した noindex ページのみメタ／ヘッダ） | 原則 `noindex`                                     |
| sitemap が指す URL        | 本番 origin のみ                    | 空 or ステージング専用（任意）                                |
| `NEXT_PUBLIC_BASE_URL` | 本番                              | ステージング URL（canonical 検証時のみ。本番 canonical を混在させない） |


詳細は `technical-seo-checklist.md` の robots / canonical 節と併読。