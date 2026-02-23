# 外部リンク探索バッチ Dry-run レポート

- **実行日時**: 2026/2/23 15:24:59
- **対象総数**: 679件 (UNKNOWN/NEEDS_REVIEWでurl=null AND pdfUrl=null)

## 検索実行サマリー（代表サンプル 15件）
| 結果 | 件数 |
|---|---|
| guide_candidate (lg.jp HTML) | 9件 |
| pdf_candidate (lg.jp PDF) | 0件 |
| reject (非公式ドメイン) | 1件 |
| pending_search (未検索) | 669件 |

## 採用ドメイン条件
- guide_candidate: *.lg.jp のHTMLページ
- pdf_candidate: *.lg.jp の.pdf 直リンク
- reject: 上記以外（民間・ポータルサイト等）

## guide_candidate 一覧（9件確認済み）
| 自治体 | 候補URL |
|---|---|
| 京都府 久御山町 | https://www.kumiyama.lg.jp/forms/list.html |
| 兵庫県 佐用町 | https://www.town.sayo.lg.jp/kakuka/juminbu/jumin/shimei/kaiso/ |
| 北海道 えりも町 | https://www.erimo.lg.jp/kurashi/hoken/bochi/ |
| 千葉県 佐倉市 | https://www.city.sakura.lg.jp/0000005168.html |
| 和歌山県 かつらぎ町 | https://www.town.katsuragi.wakayama.jp/soshiki/3/6254.html |
| 埼玉県 さいたま市 | https://www.city.saitama.lg.jp/002/004/011/p071399.html |
| 富山県 富山市 | https://www.city.toyama.lg.jp/soshiki/seikatsukankyo/kankyohozenka/12168.html |
| 山口県 下関市 | https://www.city.shimonoseki.lg.jp/soshiki/24/85867.html |
| 山形県 三川町 | https://www.town.mikawa.yamagata.jp/soshiki/juminka/kaiso.html |

## ドメイン警告候補
- himeshima.jp (大分県姫島村): 公式サイトが .lg.jp ではなく独自ドメイン運営。直接採用不可→要手動確認。

## 次のステップ
1. 残り 669件に対し、execute バッチを実行する
2. guide_candidate 9件を pending.json へ反映する（別コミット）
3. reject 件数次第で、独自ドメイン自治体の例外リストを作成する

NOTE: pending.json は本 dry-run では一切変更していません。
