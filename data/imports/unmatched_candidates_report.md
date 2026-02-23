# マスター不一致候補レコード 隔離レポート
    
- **実行日時**: 2026/2/23 14:36:37
- **対象件数**: 5件

> [!NOTE]
> これらのデータは、HTMLからURLの抽出には成功しましたが、`municipality_map.json` (および `pending.json`) のマスターJISコード実体と自動突合ができなかったレコードです。そのため `pending.json` には統合せず隔離しています。

## 内訳と推奨解決手順
**【推奨解決手順】**
県と自治体名（表記揺れや文字化けを解読）から人間が本来のJISコードを確定し、そのJISコードを用いて再度マージするか、手動で `pending.json` に反映させてください。

### 隔離レコード一覧

**1. 宮城県 青葉区**
- URL: https://www.city.sendai.jp/boenkanri/kurashi/tetsuzuki/koseki/kofu/kaiso.html
- 生テキスト枠: `青葉区`
- 理由タグ: `文字化け疑いによる突合失敗`

**2. 宮城県 宮城野区**
- URL: https://www.city.sendai.jp/boenkanri/kurashi/tetsuzuki/koseki/kofu/kaiso.html
- 生テキスト枠: `宮城野区`
- 理由タグ: `文字化け疑いによる突合失敗`

**3. 宮城県 若林区**
- URL: https://www.city.sendai.jp/boenkanri/kurashi/tetsuzuki/koseki/kofu/kaiso.html
- 生テキスト枠: `若林区`
- 理由タグ: `文字化け疑いによる突合失敗`

**4. 宮城県 太白区**
- URL: https://www.city.sendai.jp/boenkanri/kurashi/tetsuzuki/koseki/kofu/kaiso.html
- 生テキスト枠: `太白区`
- 理由タグ: `文字化け疑いによる突合失敗`

**5. 宮城県 泉区**
- URL: https://www.city.sendai.jp/boenkanri/kurashi/tetsuzuki/koseki/kofu/kaiso.html
- 生テキスト枠: `泉区`
- 理由タグ: `文字化け疑いによる突合失敗`
