# お墓じまいナビ 料金ページ リデザイン仕様書
# Apple Design Philosophy に基づく改善提案

---

## 0. 現状の課題サマリー

現在の料金ページには以下の構造的・視覚的問題がある：

| 問題 | 詳細 |
|---|---|
| **情報過多による認知負荷** | 基本料金・オプション・相場・内訳・シミュレーターが一気に並び、ユーザーが何を見るべきかわからない |
| **視覚的階層の欠如** | すべてのセクションが同じ視覚的重みで、優先順位が伝わらない |
| **感情設計の不在** | 「お墓じまい」は不安や迷いを伴う決断。現状は事務的な価格表に見え、安心感を与えられていない |
| **余白の不足** | セクション間の余白が狭く、情報が密集して見える |
| **CTAの弱さ** | 「無料お見積りを依頼する」が他の情報に埋もれている |
| **画像の完全な不在** | テキストとアイコンのみで、サービスの実態が視覚的に伝わらない |

---

## 1. 画像についてのプロフェッショナル意見

### 結論：画像は「必要」。ただし、選び方が全てを決める。

Appleが製品ページで画像を使う理由は「説明」ではなく「体験の可視化」。
お墓じまいナビの料金ページにおいても、画像は以下の3つの役割を果たすべき：

### 画像を入れるべき理由

**1. 信頼の構築（Trust Building）**
- お墓じまいは人生で一度の大きな決断。テキストだけの料金表は「本当にこの業者で大丈夫か」という不安を解消できない
- 実際の施工現場、整然とした作業風景、清潔な仕上がりの写真が信頼を生む

**2. サービスの実体化（Tangibility）**
- 「行政手続き代行 55,000円」と書かれても、何をしてくれるのか具体的にイメージできない
- Before/Afterの写真、書類のイメージ、丁寧に作業するスタッフの写真がサービスの価値を可視化する

**3. 感情的安心の提供（Emotional Reassurance）**
- Apple.comが製品の「使っている姿」を見せるように、お墓じまい後の「きれいに整地された区画」「安心した表情のお客様」を見せる

### 絶対にやってはいけないこと

- 汎用的なストックフォト（握手するビジネスマン等）の使用
- 暗い・重い雰囲気の墓地写真
- 解体途中の散乱した現場写真
- 過剰に作り込んだ演出写真

### 推奨する画像の方向性

| 使用箇所 | 画像の内容 | トーン |
|---|---|---|
| ヒーローセクション | 朝の柔らかい光に照らされた、きれいに整備された墓地の風景。または穏やかな日本の風景（遠景） | 静謐・安心・清潔 |
| 基本サービス「行政手続き」 | 書類を丁寧に確認するスタッフの手元（クローズアップ） | 丁寧・プロフェッショナル |
| 基本サービス「墓石撤去」 | Before/After の2枚組。Before: 古いお墓 → After: きれいに整地された区画 | 変化・安心 |
| 費用シミュレーター上部 | ノートPCやスマホでシミュレーションしている俯瞰イメージ | 手軽さ・現代的 |
| お客様の声（新設推奨） | 実際のお客様の写真（許可が必要）またはイラストアバター | 共感・信頼 |

### 画像が用意できない場合の代替案

写真素材がすぐに用意できない場合は、以下で代替する：
- **イラストレーション**: 線画ベースのミニマルなイラスト（Apple Supportページのスタイル）
- **アイコン + 背景グラデーション**: 各サービスに対応するアイコンを大きく配置し、淡い背景色で囲む
- **数字のタイポグラフィ**: 価格や統計数値を大きく美しく見せることで視覚的なアンカーを作る

---

## 2. ページ全体のリデザイン構成

Apple.comの製品ページに倣い「スクロール・ストーリーテリング」構造に変更する。
ユーザーは上からスクロール��ながら、段階的に情報を受け取る。

### セクション構成（上から順）

```
[1] ヘッダー（ナビゲーション）
[2] ヒーローセクション ← 大きなタイポグラフィ + サブコピー + 背景画像
[3] 信頼バー ← 3つの数字で安心感を即座に伝達
[4] 基本サービス料金 ← 2カラムカード（左: 行政手続き / 右: 墓石撤去）
[5] 料金の透明性セクション ← 「追加費用なし」のメッセージを強調
[6] オプションサービス ← 3カラムカード
[7] 料金相場ガイド ← 場所別比較 + 費用内訳のビジュアル表示
[8] 費用シミュレーター ← インタラクティブ計算ツール
[9] 補助金情報 ← アクセントカラーの情報パネル
[10] お客様の声（新設） ← 実体験に基づく信頼構築
[11] CTA セクション ← フルワイドの最終誘導
[12] フッター
```

---

## 3. 各セクションの詳細仕様

---

### [2] ヒーローセクション

**Apple的アプローチ:** iPhone のランディングページのように、巨大なタイポグラフィで一言のメッセージを伝える。

```
デザイン仕様:
- 高さ: 80vh（モバイル）/ 70vh（デスクトップ）
- 背景: 淡いグラデーション（#F5F5F7 → #FFFFFF）または写真にオーバーレイ
- タイトル: "明確な料金で、安心のお墓じまい。"
  - フォントサイズ: 40px（モバイル）/ 64px（デスクトップ）
  - font-weight: 700
  - letter-spacing: -0.02em（タイトな字間でApple風）
  - color: #1D1D1F
- サブタイトル: "見積り後の追加費用は原則なし。すべて税込の明朗会計です。"
  - フォントサイズ: 18px（モバイル）/ 22px（デスクトップ）
  - color: #6E6E73
  - max-width: 540px / text-center
- CTAボタン: 2つ横並び
  - Primary: "無料お見積りを依頼する" → bg-emerald-600, text-white, rounded-full, px-8, py-4
  - Secondary: "料金シミュレーション" → border, text-emerald-600, rounded-full, px-8, py-4
- 余白: pb-24（セクション下部）
```

---

### [3] 信頼バー（新設）

**Apple的アプローチ:** Apple Storeの「なぜAppleで買うか」セクションのように、3つのキーメッセージをアイコン付きで横並び表示。

```
レイアウト: 3カラム（モバイルは縦積み）
背景: bg-muted/30 または淡いベージュ系
padding: py-12

3つの項目:
┌─────────────────┬──────────────────┬──────────────────┐
│ [Shield アイコン] │ [Yen アイコン]     │ [Users アイコン]   │
│                 │                  │                  │
│ 追加費用なし      │ 55,000円〜        │ 累計相談 X,XXX件   │
│ 見積り後の       │ 行政手続き代行の    │ 全国のお客様に     │
│ 追加請求は       │ 基本料金          │ ご利用いただいて    │
│ 原則ありません    │                  │ います             │
└─────────────────┴──────────────────┴──────────────────┘

各項目:
- アイコン: 48px, color: emerald-600
- 数字/キー���ード: text-2xl, font-bold, text-foreground
- 説明: text-sm, text-muted-foreground, leading-relaxed
- カード: bg-background, rounded-2xl, p-8, shadow-sm
```

---

### [4] 基本サービス料金

**Apple的アプローチ:** MacBook ProページのようにFeatureを左右2カラムで大きく見せる。

```
レイアウト: 2カラムグリッド（モバイルは縦積み）
gap: gap-6（モバイル）/ gap-8（デスクトップ）

左カード: 行政手続き代行
┌──────────────────────────────────┐
│ [画像エリア: 書類を扱うスタッフの手元] │
│ 高さ: 240px, rounded-2xl         │
│ object-fit: cover               │
│                                 │
│ ラベル: "ADMINISTRATIVE"         │
│ text-xs, tracking-widest,        │
│ text-emerald-600, uppercase      │
│                                 │
│ タイトル: "行政手続き代行"         │
│ text-2xl, font-bold              │
│                                 │
│ 価格: "55,000円〜"               │
│ text-4xl, font-bold,             │
│ text-emerald-600                 │
│                                 │
│ "(税込)"                         │
│ text-sm, text-muted-foreground   │
│                                 │
│ 含まれるサービス:                  │
│ ✓ 改葬許可申請書の作成・提出代行    │
│ ✓ 埋蔵証明書の取得サポート         │
│ ✓ 受入証明書の手配サポート         │
│ ✓ 自治体窓口との交渉・確認         │
│                                 │
│ チェックマーク: emerald-500       │
│ リスト: text-sm, space-y-3       │
│                                 │
│ カード全体:                       │
│ bg-background, rounded-3xl,      │
│ border, p-8, hover:shadow-lg,    │
│ transition-shadow duration-300   │
└──────────────────────────────────┘

右カード: 墓石の解体・撤去・整地
┌──────────────────────────────────┐
│ [画像エリア: Before/After 分割表示] │
│ 高さ: 240px                      │
│ 左半分: Before（古いお墓）         │
│ 右半分: After（整地後）            │
│ 中央に斜め線 + "Before / After"   │
│                                 │
│ ラベル: "CONSTRUCTION"           │
│ タイトル: "墓石の解体・撤去・整地"  │
│                                 │
│ 価格: "現地調査のうえお見積り"      │
│ text-2xl, font-bold              │
│                                 │
│ 注釈: "墓石の大きさや施工状況に     │
│ より費用が変わります"              │
│ text-sm, text-muted-foreground   │
│                                 │
│ 含まれるサービス:                  │
│ ✓ 墓石の解体・撤去                │
│ ✓ 区画の整地・原状回復            │
│ ✓ 廃材の適正処理                 │
│ ✓ 撤去後の写真報告               │
│                                 │
│ フッター:                        │
│ "現地調査・お見積りは無料"         │
│ bg-emerald-50, rounded-xl,       │
│ text-emerald-700, p-4,           │
│ text-center, font-medium         │
└──────────────────────────────────┘
```

---

### [5] 料金の透明性セクション（新設）

**Apple的アプローチ:** Apple Trade Inのような「安心感を訴求する」フルワイドセクション。

```
背景: bg-[#1D1D1F]（ダークセクション）
テキスト: text-white
padding: py-20

中央揃え:
"見積り後の追加費用は、原則ありません。"
- text-3xl（モバイル）/ text-5xl（デスクトップ）
- font-bold
- text-balance

サブテキスト:
"お墓の規模・場所・施工難度をすべて確認した上で
 正確な金額をご提示します。ご納得いただけない場合は
 お断りいただいて構いません。"
- text-lg, text-white/70
- max-width: 600px
- leading-relaxed

CTA: "無料で見積りを依頼する"
- bg-white, text-[#1D1D1F], rounded-full
- px-8, py-4, font-semibold
- hover:bg-white/90
```

---

### [6] オプションサービス

**Apple的アプローチ:** Apple Watchのバンド選択のようなカード型グリッド。

```
セクションタイトル:
"オプションサービス"
- text-3xl, font-bold, text-center

サブタイトル:
"基本サービスに組み合わせてご利用いただけます。"
- text-muted-foreground, text-center

レイアウト: 3カラムグリッド（モバイルは縦積み）
gap: gap-6

各カード共通:
- bg-background
- rounded-3xl
- border
- p-8
- text-center
- hover:shadow-lg, transition-all duration-300
- hover:-translate-y-1（微細な浮き上がりエフェクト）

カード上部にアイコン:
- 64px × 64px の円形背景
- bg-emerald-50（洗骨）/ bg-blue-50（粉骨）/ bg-amber-50（離檀）
- アイコン: Droplets / Sparkles / MessageCircle
- アイコンサイズ: 28px
- 各カードで色を変えることで視覚的に区別

┌──────────┬──────────┬──────────┐
│ 💧        │ ✨        │ 💬        │
│ 洗骨      │ 粉骨      │ 離檀交渉   │
│ サービス   │ サービス   │ サポート   │
│           │           │           │
│ 33,000円〜│ 33,000円〜│ 別途ご相談  │
│           │           │           │
│ 長年カビや │ 散骨や手元 │ お寺との離  │
│ 汚れが付着 │ 供養のため │ 檀交渉を円  │
│ したお骨を │ に、お骨を │ 満に進める  │
│ 丁寧に洗浄 │ 細かく粉砕 │ ためのアド  │
│ します。   │ します。   │ バイス・代  │
│           │           │ 行を行いま  │
│           │           │ す。       │
└──────────┴──────────┴──────────┘
```

---

### [7] 料金相場ガイド

**Apple的アプローチ:** Apple比較表のようなクリーンなデータ表示。

```
セクションタイトル: "お墓じまいの料金相場"
サブタイトル: "お墓の種類や状況によって費用は異なります。"

--- 7a. 大きな数字の表示 ---

中央配置:
"8万円 〜 300万円"
- "8万円" → text-6xl, font-bold, text-emerald-600
- "〜" → text-2xl, text-muted-foreground, mx-4
- "300万円" → text-6xl, font-bold, text-foreground
- 下に補足: "※お墓の状況によって料金は変動します"

--- 7b. 場所別料金比較 ---

3つのカードを横並び（Apple Storeの製品比較風）:

┌─────────────────┬─────────────────┬─────────────────┐
│   霊園墓地       │   寺院墓地       │   納骨堂        │
│                 │                  │                │
│ [墓地アイコン]    │ [寺院アイコン]    │ [建物アイコン]   │
│                 │                  │                │
│ 相場価格         │ 相場価格          │ 相場価格        │
│                 │ + お寺への        │                │
│                 │ お布施            │                │
│                 │                  │                │
│ ● 撤去費用      │ ● 撤去費用       │ ● 撤去費用      │
│ ● 整地費用      │ ● 整地��用       │                │
│                 │ ● 離檀料         │                │
│                 │ ● お布施         │                │
│                 │                  │                │
│ [もっとも一般的]  │ [注意点あり]      │ [比較的安価]     │
│ emerald badge   │ amber badge      │ blue badge      │
└──��──────────────┴─────────────────┴─────────────────┘

各カード:
- rounded-3xl, border, p-8
- ホバーでborder-emerald-200に変化
- バッジ: rounded-full, px-3, py-1, text-xs, font-medium

--- 7c. 費用内訳の視覚化 ---

水平バーチャート風に表示（CSS のみで実装）:

お墓の撤去・解体費用    ████████████████████████ 60%
閉眼供養のお布施        ██████████              25%
行政手続き代行費用      ████                     10%
離檀料                ██                        5%

- 各バー: rounded-full, h-3
- 色: emerald-500, emerald-400, emerald-300, emerald-200
- パーセンテージは目安として表示
- ラベル: text-sm, text-foreground
- 値: text-sm, text-muted-foreground, text-right
```

---

### [8] 費用シミュレーター（リデザイン）

**Apple的アプローチ:** Apple Store のカスタマイズ画面のようなインタラクティブで洗練されたフォーム。

```
背景: bg-muted/30
rounded-3xl（セクション全体を角丸カードに）
padding: py-16, px-8

タイトル: "費用シミュレーション"
- text-3xl, font-bold, text-center

サブタイトル: "簡単な質問に答えるだけで、概算費用がわかります。"
- text-muted-foreground, text-center, mb-12

レイアウト: 2カラム（モバイルは1カラム）
- 左: 入力フォーム
- 右: リアルタイム結果表示（sticky）

--- 左カラム: 入力フォーム ---

フォームスタイル（Apple Store風セグメントコントロール）:

1. お墓の広さ
   - ラベル: text-sm, font-medium, text-foreground
   - スライダー: range input + 数値表示
   - "1㎡" 〜 "10㎡"
   - アクセント: emerald-600
   - 現在値を大きく表示: text-2xl, font-bold

2. 墓地の種類
   - セグメントコントロール（ラジオボタンの代替）:
   ┌──────────┬──────────┬──────────┐
   │  霊園墓地  │  寺院墓地  │  納骨堂   │
   └──────────┴──────────┴──────────┘
   - 選択中: bg-emerald-600, text-white
   - 未選択: bg-muted, text-foreground
   - rounded-xl, transition-all

3. お墓の場所（都道府県）
   - セレクトボックス: rounded-xl, border, p-4

4. 補助金の有無
   - トグルスイッチ: Apple風のON/OFFスイッチ
   - ON: bg-emerald-600
   - OFF: bg-muted

5. 行政手続き代行
   - トグルスイッチ（同上）

--- 右カラム: 結果表示（sticky） ---

sticky top-24
bg-background
rounded-3xl
border
p-8
shadow-sm

"概算見積り"
- text-sm, text-muted-foreground, uppercase, tracking-widest

合計金額:
"¥180,000"
- text-5xl, font-bold, text-emerald-600
- 数値変更時にアニメーション（数字がカウントアップ）

内訳リスト:
├── 墓石撤去費用    ¥120,000
├── 閉眼供養       ¥30,000
├── 行政手続き代行  ¥55,000
└── 補助金適用     -¥25,000
- 各行: flex justify-between, py-3, border-b
- 補助金: text-emerald-600（マイナス表示）

注釈:
"※あくまで目安です。正確な金額は現地調査後にご提示します。"
- text-xs, text-muted-foreground, mt-4

CTA:
"この内容で無料見積りを依頼する"
- w-full, bg-emerald-600, text-white
- rounded-xl, py-4, font-semibold
- hover:bg-emerald-700
```

---

### [9] 補助金情報パネル（リデザイン）

```
背景: bg-gradient-to-br from-emerald-50 to-blue-50
border: border-emerald-100
rounded-3xl
padding: p-8 md:p-12

レイアウト: 左にテキスト、右にイラストまたはアイコン

左:
ラベル: "SUBSIDY INFO"
- text-xs, tracking-widest, text-emerald-600, uppercase

タイトル: "補助金・助成金を活用できる場合があります"
- text-2xl, font-bold

説明:
"一部の自治体では、お墓じまいに対する補助金制度を設けています。
 お住まいの自治体の制度をご確認ください。"
- text-muted-foreground, leading-relaxed

リンク: "補助金の詳細を見る →"
- text-emerald-600, font-medium, hover:underline

右:
- 大きなアイコン（Banknotes / Coins）: 120px
- またはイラスト
- opacity-80
```

---

### [10] お客様の声（新設）

**Apple的アプローチ:** Apple.comのレビューカルーセルのようなデザイン。

```
セクションタイトル: "ご利用いただいたお客様の声"
- text-3xl, font-bold, text-center

横スクロールカルーセル（モバイル）/ 3カラムグリッド（デスクトップ）

各カード:
┌──────────────────────────────┐
│ ★★★★★                       │
│                              │
│ "見積り通りの金額で、追加費用   │
│  が一切なかったのが本当に       │
│  安心でした。行政手続きも       │
│  すべて代行してくれて           │
│  助かりました。"               │
│                              │
│ ── 東京都 60代女性            │
│    2025年3月ご利用             │
└──────────────────────────────┘

- bg-background, rounded-3xl, border, p-8
- 引用文: text-base, leading-relaxed, text-foreground, italic
- 星: text-amber-400, flex gap-0.5
- 属性: text-sm, text-muted-foreground, mt-4
- border-top: border-t, pt-4
```

---

### [11] 最終CTAセクション

**Apple的アプローチ:** Apple.comのページ最下部にある「まだ迷っていますか？」セクション。

```
背景: bg-[#1D1D1F] または bg-emerald-900
padding: py-20
text-center

タイトル:
"まずは無料でご相談ください。"
- text-3xl md:text-5xl, font-bold, text-white
- text-balance

サブテキスト:
"現地調査・お見積りはすべて無料。
 お墓じまいの専門スタッフが丁寧にご対応します。"
- text-lg, text-white/70, max-w-lg, mx-auto

2つのCTA横並び:
- Primary: "無料お見積りを依頼する"
  → bg-white, text-[#1D1D1F], rounded-full, px-8, py-4
- Secondary: "0120-000-000 に電話する"
  → border-white/30, text-white, rounded-full, px-8, py-4

電話番号:
"0120-000-000"（大きく表示）
- text-2xl, font-bold, text-white, mt-6
- "受付時間: 9:00〜18:00（年中無休）"
- text-sm, text-white/50
```

---

## 4. デザインシステム・共通ルール

### カラーパレット（5色厳守）

| 用途 | 色 | Tailwind |
|---|---|---|
| プライマリ（CTA・アクセント） | Emerald 600 | `emerald-600` |
| テキスト（見出し） | #1D1D1F | `[#1D1D1F]` または `foreground` |
| テキスト（本文） | #6E6E73 | `muted-foreground` |
| 背景（メイン） | #FFFFFF | `background` |
| 背景（セカンダリ） | #F5F5F7 | `muted` |

### タイポグラフィ

```
ヒーロータイトル: 40px / 64px, font-weight: 700, letter-spacing: -0.02em
セクションタイトル: 30px / 36px, font-weight: 700
カードタイトル: 20px / 24px, font-weight: 600
本文: 16px / 18px, font-weight: 400, line-height: 1.6
注釈: 13px / 14px, font-weight: 400, color: muted-foreground
```

### 余���のルール（Apple基準）

```
セクション間: py-20 md:py-28（十分な呼吸空間）
カード内padding: p-6 md:p-8
要素間: space-y-4 md:space-y-6
ページ左右: px-6 md:px-8 lg:px-0 + max-w-6xl mx-auto
```

### 角丸のルール

```
大きなカード・セクション: rounded-3xl
ボタン: rounded-full（Pill Shape）
入力フォーム: rounded-xl
バッジ: rounded-full
画像: rounded-2xl
```

### アニメーション

```
ホバー: transition-all duration-300
カードホバー: hover:shadow-lg hover:-translate-y-1
スクロール表示: IntersectionObserver で fade-in + translate-y
数字カウントアップ: シミュレーターの合計金額
セグメントコントロール: transition-colors duration-200
```

---

## 5. モバイル対応の特記事項

| 項目 | 仕様 |
|---|---|
| タッチターゲット | すべてのボタン・リンクは最低44px |
| フォーム入力 | font-size: 16px以上（iOS自動ズーム防止） |
| シミュレーター | モバイルではstickyを解除し、結果を入力の下に表示 |
| お客様の声 | 横スクロールカルーセル（snap scroll） |
| CTA | モバイルではフルワイドボタン（w-full） |
| 料金比較カード | モバイルでは縦積み、横スワイプなし |
| フローティングCTA | 画面下部に固定バー表示（改善6を適用） |

---

## 6. SEO・構造化データ

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "お墓じまいナビ",
  "description": "お墓じまいの行政手続き代行・墓石撤去サービス",
  "provider": {
    "@type": "Organization",
    "name": "Seiren Co., Ltd."
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "お墓じまい料金",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "行政手続き代行",
        "price": "55000",
        "priceCurrency": "JPY"
      }
    ]
  }
}
```

---

## 7. 実装優先度

| 優先度 | セクション | 理由 |
|---|---|---|
| P0 | ヒーロー + 信頼バー | ファーストビューの印象が全て |
| P0 | 基本サービス料金カード | コア情報の視認性改善 |
| P0 | 料金の透明性セクション | コンバージョンに直結する安心感 |
| P0 | 最終CTAセクション | コンバージョン導線 |
| P1 | 費用シミュレーター | ユーザーエンゲージメント向上 |
| P1 | オプションサービス | 追加売上の機会 |
| P1 | 料金相場ガイド | 情報価値・SEO |
| P2 | お客様の声 | 信頼構築（コンテンツ準備が必要） |
| P2 | 補助金情報パネル | 補足情報 |

---

---

## 8. Apple デザイナー視点の追加改善（13項目）

以下は既存の仕様書に**追加で実装すべき**改善項目。
Apple.com のプロダクトページ設計原則に基づく。

---

### 追加改善 A: ヒーローにアンカーナビゲーションを追加

**問題:** 料金ページは縦に長い。ユーザーは「自分に関係ある情報」に素早く飛びたい。
Apple.com のiPhoneページには上部にスティッキーなセクションナビがある。

**実装指示:**

```tsx
// ヒーロー直下に配置。スクロールするとヘッダー下に sticky 固定される。
const sections = [
  { id: "plan", label: "料金プラン" },
  { id: "services", label: "基本サービス" },
  { id: "options", label: "オプション" },
  { id: "simulator", label: "シミュレーション" },
  { id: "faq", label: "よくある質問" },
];

<nav className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
  <div className="mx-auto max-w-5xl">
    <div className="flex gap-1 overflow-x-auto px-6 scrollbar-hide">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={cn(
            "shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
            "min-h-[44px] flex items-center", // タッチターゲット確保
            activeSection === section.id
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {section.label}
        </a>
      ))}
    </div>
  </div>
</nav>
```

**IntersectionObserverでアクティブ追従:**
各セクションの `id` をobserveし、ビューポート内に入ったセクションに対応するタブをハイライト。
スムーズスクロール `scroll-behavior: smooth` を `<html>` に設定。

---

### 追加改善 B: 「他社比較」セクション（新設）

**問題:** ユーザーは必ず他社と比較する。比較材料を自社ページ内で提供しないと離脱する。
Apple.com が「なぜAppleか」を明示するのと同じ。

**実装指示:**

```tsx
<section id="comparison" className="py-20 md:py-28">
  <div className="mx-auto max-w-4xl px-6">
    <h2 className="text-center text-3xl font-bold">
      なぜお墓じまいナビが選ばれるのか
    </h2>
    <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
      他社サービスとの違いをご確認ください。
    </p>

    {/* 比較テーブル */}
    <div className="mt-12 overflow-hidden rounded-3xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="p-4 text-left font-medium text-muted-foreground">比較項目</th>
            <th className="p-4 text-center">
              <span className="inline-block rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                お墓じまいナビ
              </span>
            </th>
            <th className="p-4 text-center font-medium text-muted-foreground">他社A</th>
            <th className="p-4 text-center font-medium text-muted-foreground">他社B</th>
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="p-4 font-medium">{row.label}</td>
              <td className="p-4 text-center">
                {/* 自社は強調表示 */}
                <span className="font-semibold text-emerald-600">{row.ours}</span>
              </td>
              <td className="p-4 text-center text-muted-foreground">{row.compA}</td>
              <td className="p-4 text-center text-muted-foreground">{row.compB}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</section>
```

**比較データ例:**

| 比較項目 | お墓じまいナビ | 他社A | 他社B |
|---|---|---|---|
| 行政手続き代行 | 込み | 別途費用 | 非対応 |
| 見積り後の追加費用 | 原則なし | あり | あり |
| 現地調査 | 無料 | 有料 | 無料 |
| 全国対応 | 47都道府県 | 関東のみ | 主要都市のみ |
| 撤去後の写真報告 | あり | なし | オプション |
| 離檀交渉サポート | あり | なし | なし |

**Apple的なポイント:**
- 自社列の背景を `bg-emerald-50/50` で薄くハイライト
- 自社の優位項目には `Check` アイコン（emerald-600）を使用
- 「他社A/B」は架空の一般名称で問題ない。具体名は出さない

---

### 追加改善 C: 料金プランの「含む/含まない」の明確な境界線

**問題:** 現状は「基本プランに含まれる」リストと「別途費用」リストが別セクションに分散。
ユーザーは「何が含まれて何が含まれないか」を一目で比較したい。

**実装指示:**

基本プランカードの下部に「含まれないもの」を明示する。

```tsx
{/* 含まれるもの（既存） */}
<div className="space-y-3">
  <h4 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
    含まれるもの
  </h4>
  {includedItems.map(item => (
    <div key={item} className="flex items-center gap-3 text-sm">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
        <Check className="h-3 w-3 text-emerald-600" />
      </div>
      <span>{item}</span>
    </div>
  ))}
</div>

{/* 区切り線 */}
<div className="my-6 h-px bg-border" />

{/* 含まれないもの */}
<div className="space-y-3">
  <h4 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
    別途費用が発生する場合
  </h4>
  {excludedItems.map(item => (
    <div key={item.label} className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
          <Minus className="h-3 w-3 text-muted-foreground" />
        </div>
        <span className="text-muted-foreground">{item.label}</span>
      </div>
      <span className="text-xs text-muted-foreground">{item.note}</span>
    </div>
  ))}
</div>
```

**含まれないもの一覧:**
- 離檀料（お寺により異なる）
- 閉眼供養のお布施（3〜10万円が目安）
- 遠方の場合の出張費（要相談）
- 墓石の特殊処分費（石材の種類による）

---

### 追加改善 D: マイクロインタラクションの追加

**問題:** 現状は完全に静的。Apple.comは微細なアニメーションでプレミアム感を演出している。

**実装指示（CSS/JSのみ、ライブラリ不要）:**

```css
/* 1. セクション表示アニメーション（IntersectionObserver連動） */
.fade-in-section {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.fade-in-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 2. 価格の数字カウントアップ（シミュレーター用） */
/* requestAnimationFrame ベースで実装 */

/* 3. カードのホバーエフェクト */
.service-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

/* 4. CTAボタンのパルスアニメーション（最終CTA用、控えめに） */
@keyframes subtle-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.2); }
  50% { box-shadow: 0 0 0 8px rgba(5, 150, 105, 0); }
}
.cta-pulse {
  animation: subtle-pulse 3s ease-in-out infinite;
}
```

```tsx
// IntersectionObserver フック
function useFadeInOnScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// 使い方
function Section({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useFadeInOnScroll();
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      {children}
    </div>
  );
}
```

---

### 追加改善 E: 料金に関するFAQ（新設）

**問題:** 料金ページにFAQがない。価格を見た後のユーザーの疑問に答えられていない。

**実装指示:**

```tsx
const pricingFaqs = [
  {
    q: "見積り後に追加費用が発生することはありますか？",
    a: "原則ありません。現地調査で正確に状況を確認した上でお見積りをお出ししますので、その後の追加請求は基本的にございません。ただし、調査時に確認できなかった地中障害物等が発見された場合のみ、事前にご相談のうえ追加費用が発生する場合があります。",
  },
  {
    q: "支払い方法は何がありますか？",
    a: "銀行振込、クレジットカード（VISA/Mastercard/JCB）に対応しております。分割払いのご相談も承ります。",
  },
  {
    q: "見積りだけでもお願いできますか？",
    a: "はい、もちろんです。現地調査・お見積りは完全無料です。お見積り後にお断りいただいても費用は一切かかりません。",
  },
  {
    q: "他社の見積りと比較してもよいですか？",
    a: "ぜひ比較してください。当社は明朗会計を徹底しておりますので、他社様のお見積りとの違いも丁寧にご説明いたします。",
  },
  {
    q: "離檀料はいくらかかりますか？",
    a: "離檀料はお寺によって大きく異なります（0〜30万円程度）。高額な離檀料を請求された場合の交渉サポートも行っておりますので、お気軽にご相談ください。",
  },
  {
    q: "補助金や助成金は使えますか？",
    a: "一部の自治体ではお墓じまいに関する補助金制度を設けています。対象の自治体かどうかの確認もサポートいたします。",
  },
];
```

**デザイン:** Apple Supportページ風のクリーンなアコーディオン

```tsx
<section id="faq" className="py-20 md:py-28">
  <div className="mx-auto max-w-3xl px-6">
    <h2 className="text-center text-3xl font-bold">料金についてよくある質問</h2>
    <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
      お客様からよくいただくご質問にお答えします。
    </p>

    <div className="mt-12 divide-y">
      {pricingFaqs.map((faq, i) => (
        <details key={i} className="group py-5">
          <summary className="flex cursor-pointer items-center justify-between gap-4 text-left text-base font-medium transition-colors hover:text-emerald-600 min-h-[44px] [&::-webkit-details-marker]:hidden">
            <span>{faq.q}</span>
            <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-3 leading-relaxed text-muted-foreground pr-8">
            {faq.a}
          </p>
        </details>
      ))}
    </div>
  </div>
</section>
```

**Apple的ポイント:**
- shadcn Accordion でなく `<details>` を使ってもOK（軽量）
- 区切り線は `divide-y` でシンプルに
- 開閉アイコンは `rotate-180` のみ。派手なアニメーション不要
- 質問文は `font-medium`、回答は `text-muted-foreground` で明確な視覚階層

---

### 追加改善 F: 「お見積りの流れ」ステッパー（新設）

**問題:** 「無料お見積り」ボタンを押した後、何が起こるかわからない。不安で押せない。

**実装指示:**

最終CTAの直前に配置。

```tsx
const steps = [
  {
    number: "01",
    title: "お問い合わせ",
    description: "フォームまたはお電話でご連絡ください。24時間受付。",
    duration: "所要時間: 3分",
    icon: MessageSquare,
  },
  {
    number: "02",
    title: "ヒアリング",
    description: "お墓の状況やご希望を専門スタッフが丁寧にお伺いします。",
    duration: "所要時間: 15分",
    icon: Headphones,
  },
  {
    number: "03",
    title: "現地調査",
    description: "お墓の現地を確認し、正確な施工内容を把握します。",
    duration: "無料・全国対応",
    icon: MapPin,
  },
  {
    number: "04",
    title: "お見積り提示",
    description: "調査結果をもとに、すべての費用を含んだ明細をお渡しします。",
    duration: "追加費用なし",
    icon: FileText,
  },
];

<section className="py-20 md:py-28">
  <div className="mx-auto max-w-3xl px-6">
    <h2 className="text-center text-3xl font-bold">お見積りの流れ</h2>
    <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
      お見積りは4つのステップで完了します。すべて無料です。
    </p>

    <div className="mt-12 space-y-0">
      {steps.map((step, i) => (
        <div key={step.number} className="relative flex gap-6 pb-12 last:pb-0">
          {/* 縦の接続線 */}
          {i < steps.length - 1 && (
            <div className="absolute left-6 top-14 h-full w-px bg-border" />
          )}

          {/* ステップ番号（円形） */}
          <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow-sm">
            {step.number}
          </div>

          {/* コンテンツ */}
          <div className="pt-1">
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
            <span className="mt-2 inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {step.duration}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

**Apple的ポイント:**
- 番号を円形バッジで表示（Apple Storeの注文ステップを参考）
- 縦の接続線で「流れ」を視覚化
- 各ステップに所要時間を明記 → 心理的ハードルを下げる

---

### 追加改善 G: 「安心保証」バッジセクション（新設）

**問題:** Apple.comには「無料配送」「分割払い」「返品無料」のバッジが並ぶ。
お墓じまいナビにも「安心の保証」を視覚的に並べるべき。

**実装指示:**

ヒーローと信頼バーの間、またはCTAの直上に配置。

```tsx
const guarantees = [
  {
    icon: ShieldCheck,
    title: "見積り後の追加費用なし",
    description: "提示金額から追加請求は原則いたしません",
  },
  {
    icon: Eye,
    title: "明朗会計",
    description: "すべて税込の明確な料金体系",
  },
  {
    icon: Undo2,
    title: "キャンセル無料",
    description: "見積り後のお断りも費用ゼロ",
  },
  {
    icon: Clock,
    title: "24時間受付",
    description: "お電話・フォームいつでもOK",
  },
];

<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
  {guarantees.map((g) => (
    <div key={g.title} className="flex flex-col items-center rounded-2xl bg-muted/30 p-5 text-center">
      <g.icon className="h-7 w-7 text-emerald-600" />
      <p className="mt-3 text-sm font-semibold leading-tight">{g.title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{g.description}</p>
    </div>
  ))}
</div>
```

---

### 追加改善 H: 電話番号のタップ最適化（モバイル）

**問題:** 現状の電話番号はテキスト表示のみ。モバイルでワンタップ発信できない可能性。

```tsx
{/* モバイルではフルワイドの電話ボタン、デスクトップでは通常リンク */}
<a
  href="tel:0120000000"
  className="group flex items-center justify-center gap-3 rounded-2xl border-2 border-emerald-600 bg-emerald-50 px-6 py-4 transition-all hover:bg-emerald-100 min-h-[56px]"
>
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600">
    <Phone className="h-5 w-5 text-white" />
  </div>
  <div className="text-left">
    <p className="text-xs text-muted-foreground">通話料無料・24時間受付</p>
    <p className="text-xl font-bold tracking-wider text-emerald-600">
      0120-000-000
    </p>
  </div>
</a>
```

---

### 追加改善 I: ページ内の「注釈」デザイン統一

**問題:** 「※表示金額はすべて税込です」等の注釈が散在し、デザインがバラバラ。

**実装指示:**

```tsx
// 統一された注釈コンポーネント
function PriceNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-muted/50 px-4 py-3">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <p className="text-xs leading-relaxed text-muted-foreground">
        {children}
      </p>
    </div>
  );
}

// 使用例
<PriceNote>
  表示金額はすべて税込です。墓石撤去工事の費用はお墓の規模・場所・施工難度により
  大きく異なります。正確な金額は現地調査後にご提示します。
</PriceNote>
```

---

### 追加改善 J: OGP / Social Sharing 最適化

**問題:** 料金ページがSNSでシェアされた時のプレビューが最適化されていない。

```tsx
// メタデータ
export const metadata = {
  title: "料金について | お墓じまいナビ - 明確な料金体系で安心",
  description: "お墓じまいの料金プラン。行政手続き代行55,000円〜、基本プラン150,000円〜。見積り後の追加費用は原則なし。全国対応・現地調査無料。",
  openGraph: {
    title: "料金について | お墓じまいナビ",
    description: "明確な料金体系。見積り後の追加費用なし。基本プラン150,000円〜",
    images: [{ url: "/og/pricing.jpg", width: 1200, height: 630 }],
  },
};
```

---

### 追加改善 K: スクロール進捗インジケーター

**問題:** 長い料金ページでユーザーがどこまで読んだか把握できない。

```tsx
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-50 h-0.5 w-full bg-transparent">
      <div
        className="h-full bg-emerald-600 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
```

---

### 追加改善 L: 「ページ印刷」最適化

**問題:** 料金ページは家族で相談するためプリントされることが多い（ターゲット層は50-70代）。

```css
@media print {
  /* ナビ・フッター・フローティングCTA非表示 */
  header, footer, .floating-cta, .scroll-progress, nav.sticky {
    display: none !important;
  }

  /* 背景色を白に統一 */
  section {
    background: white !important;
    color: black !important;
  }

  /* 電話番号を目立たせる */
  .phone-number::after {
    content: " (通話料無料)";
  }

  /* ページ末尾に問い合わせ先を追加 */
  body::after {
    content: "お問い合わせ: 0120-000-000（24時間受付）| https://ohakajimai-navi.jp";
    display: block;
    text-align: center;
    padding: 24px;
    font-size: 14px;
    border-top: 1px solid #ccc;
    margin-top: 24px;
  }

  /* 改ページ制御 */
  .service-card, .option-card {
    break-inside: avoid;
  }
}
```

---

### 追加改善 M: アクセシビリティの徹底（Apple基準）

```tsx
// 1. 価格情報のスクリーンリーダー対応
<span aria-label="55,000円から、税込み">
  <span className="text-4xl font-bold" aria-hidden="true">55,000</span>
  <span className="text-sm" aria-hidden="true">円〜（税込）</span>
</span>

// 2. 比較表のアクセシビリティ
<table role="table" aria-label="他社サービスとの比較表">
  <caption className="sr-only">
    お墓じまいナビと他社サービスの料金・サービス比較
  </caption>
  ...
</table>

// 3. シミュレーターのライブリージョン
<div aria-live="polite" aria-atomic="true" className="sr-only">
  概算見積り金額: {formattedPrice}円
</div>

// 4. カラーコントラスト
// emerald-600 (#059669) on white = コントラスト比 4.67:1 → AA準拠
// ただしテキストが小さい場合は emerald-700 (#047857) を使用 → 5.92:1

// 5. フォーカス管理
// すべてのインタラクティブ要素に focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2
```

---

## 9. 改善の全体優先度マップ

| 優先度 | 改善 | セクション | コンバージョンへの影響 |
|---|---|---|---|
| **P0** | 既存[2] ヒーロー | ファーストビュー | 極大 |
| **P0** | 既存[5] 料金の透明性 | 安心感訴求 | 極大 |
| **P0** | 既存[11] 最終CTA | コンバージョン直結 | 極大 |
| **P0** | 追加B: 他社比較 | 意思決定支援 | 極大 |
| **P0** | 追加F: 見積りの流れ | 行動障壁の除去 | 極大 |
| **P1** | 既存[3] 信頼バー | 即時安心感 | 大 |
| **P1** | 既存[4] 基本サービスカード | 情報理解 | 大 |
| **P1** | 既存[8] シミュレーター | エンゲージメント | 大 |
| **P1** | 追加A: アンカーナビ | ナビゲーション | 大 |
| **P1** | 追加C: 含む/含まない | 明確性 | 大 |
| **P1** | 追加D: アニメーション | プレミアム感 | 中 |
| **P1** | 追加E: FAQ | 疑問解消 | 大 |
| **P1** | 追加G: 安心保証バッジ | 信頼構築 | 大 |
| **P1** | 追加H: 電話タップ最適化 | モバイルCV | 大 |
| **P2** | 既存[6] オプション | 追加売上 | 中 |
| **P2** | 既存[7] 料金相場 | 情報価値 | 中 |
| **P2** | 既存[9] 補助金情報 | 補足情報 | 小 |
| **P2** | 既存[10] お客様の声 | 信頼構築 | 中 |
| **P2** | 追加I: 注釈統一 | デザイン品質 | 小 |
| **P2** | 追加J: OGP | シェア最適化 | 小 |
| **P2** | 追加K: スクロール進捗 | UX改善 | 小 |
| **P3** | 追加L: 印刷最適化 | ターゲット層配慮 | 中 |
| **P3** | 追加M: アクセシビリティ | 法令遵守・品質 | 中 |

---

## 10. Antigravityへの実装指示まとめ

1. 上記セクション[2]〜[11] + 追加改善A〜Mを優先度順に実装すること
2. Apple.com の製品ページを参考に、十分な余白とタイポグラフィの階層を意識すること
3. カラーは5色厳守（emerald-600, #1D1D1F, #6E6E73, #FFFFFF, #F5F5F7）
4. 画像がまだ準備できない箇所は、大きなアイコン + 淡い背景色で代替すること
5. モバイルファースト設計を徹底すること（特にシミュレーターとカルーセル）
6. すべての価格表示に「(税込)」を明記すること
7. フローティングCTAは別途 antigravity-spec.md の改善6を参照
8. IntersectionObserver によるフェードインアニメーションを全セクションに適用
9. 印刷用CSSを必ず含めること（ターゲット層がプリントする前提）
10. `<details>` ベースのFAQはJSなしでも動作するようにすること
11. アンカーナビの IntersectionObserver はパフォーマンスに配慮し、threshold: 0.3 を推奨
12. 電話番号は必ず `tel:` リンクにすること
