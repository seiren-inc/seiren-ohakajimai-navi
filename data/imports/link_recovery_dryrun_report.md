# 壊れリンク復旧クエリ生成レポート (Link Recovery Query Report)

- **実行日時**: 2026/2/23 15:50:16
- **対象となる不備リンク数**: 34件

## クエリ生成サマリー
- **クエリ生成済み自治体**: 34件
- **総クエリ数**: 102件

### 復旧用クエリの構成 (自治体ごとに3パターン)
1. `<都道府県><市区町村> 改葬許可申請`
2. `<都道府県><市区町村> 墓地埋葬 許可`
3. `<都道府県><市区町村> 改葬許可証 filetype:pdf`

## 復旧候補リスト (一部)
| 自治体 | 不備URL | ステータス | 生成クエリ案 |
|---|---|---|---|
| 北海道 美幌町 | `https://www.town.bihoro.hokkaido.jp/page/1042.html` | BROKEN_4XX | `北海道美幌町 改葬許可申請` |
| 北海道 斜里町 | `https://www.town.shari.hokkaido.jp/soshikikarasagasu/kankyoka/seikatsukankyokakari/reien/1866.html` | BROKEN_4XX | `北海道斜里町 改葬許可申請` |
| 山形県 東根市 | `https://www.city.higashine.yamagata.jp/files/original/20211029204004653e85eb7ef.pdf` | BROKEN_4XX | `山形県東根市 改葬許可申請` |
| 福島県 福島市 | `https://www.city.fukushima.fukushima.jp/kankyo-eisei/kurashi/boti/kaisou.html` | BROKEN_4XX | `福島県福島市 改葬許可申請` |
| 山形県 三川町 | `https://www.town.mikawa.yamagata.jp/soshiki/juminka/kaiso.html` | BROKEN_4XX | `山形県三川町 改葬許可申請` |
| 福島県 桑折町 | `https://www.town.koori.fukushima.jp/soshiki/zeiju/1/3_1/14841.html` | BROKEN_4XX | `福島県桑折町 改葬許可申請` |
| 福島県 三島町 | `https://www.city.mishima.shizuoka.jp/ipn028468.html` | BROKEN_4XX | `福島県三島町 改葬許可申請` |
| 茨城県 鉾田市 | `https://www.city.hokota.lg.jp/page/page004087.html` | BROKEN_4XX | `茨城県鉾田市 改葬許可申請` |
| 茨城県 五霞町 | `https://www.town.goka.lg.jp/kurashi/kurashi-tetsuzuki/madoguchi/kakushu-shoumeisho/page003623.html` | BROKEN_4XX | `茨城県五霞町 改葬許可申請` |
| 群馬県 館林市 | `https://www.city.tatebayashi.gunma.jp/s022/kurashi/050/kaisoukyoka.html` | BROKEN_4XX | `群馬県館林市 改葬許可申請` |
| 群馬県 渋川市 | `https://www.city.shibukawa.lg.jp/kurashi/life_event/okuyami/kaisou.html` | BROKEN_4XX | `群馬県渋川市 改葬許可申請` |
| 埼玉県 さいたま市 | `https://www.city.saitama.lg.jp/002/004/011/p071399.html` | BROKEN_4XX | `埼玉県さいたま市 改葬許可申請` |
| 千葉県 佐倉市 | `https://www.city.sakura.lg.jp/0000005168.html` | BROKEN_4XX | `千葉県佐倉市 改葬許可申請` |
| 千葉県 鎌ケ谷市 | `https://www.city.kamagaya.chiba.jp/download_menu/jumin.html` | BROKEN_4XX | `千葉県鎌ケ谷市 改葬許可申請` |
| 東京都 東大和市 | `https://www.city.higashiyamato.lg.jp/kurashi/todokede/1001651/1008864.html` | BROKEN_4XX | `東京都東大和市 改葬許可申請` |
| 東京都 昭島市 | `https://www.city.akishima.lg.jp/s026/010/20240911104221.html` | BROKEN_4XX | `東京都昭島市 改葬許可申請` |
| 神奈川県 秦野市 | `https://www.city.hadano.kanagawa.jp/www/contents/1001000000158/index.html` | BROKEN_4XX | `神奈川県秦野市 改葬許可申請` |
| 富山県 富山市 | `https://www.city.toyama.lg.jp/soshiki/seikatsukankyo/kankyohozenka/12168.html` | BROKEN_4XX | `富山県富山市 改葬許可申請` |
| 長野県 長野市 | `https://www.city.nagano.nagano.jp/n085500/contents/p000282.html` | BROKEN_4XX | `長野県長野市 改葬許可申請` |
| 静岡県 三島市 | `https://www.city.mishima.shizuoka.jp/ipn028468.html` | BROKEN_4XX | `静岡県三島市 改葬許可申請` |

> [!NOTE]
> 今回は dry-run のため、実際の検索APIへのリクエストは行っていません。
> また、`pending.json` や DB への書き込みも一切行っていません。
