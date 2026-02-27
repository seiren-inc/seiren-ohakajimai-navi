# お墓じまいナビ トップページ リデザイン仕様書
# Apple Design Philosophy に基づく全面改修

---

## 0. 現状分析（Appleデザイナーの視点）

### 現在のページに感じる問題

PDFキャプチャから読み取った現状を、Apple.comの設計基準で評価する。

| 評価軸 | 現状の問題 | Apple基準で求められるレベル |
|---|---|---|
| **ファーストインプレッション** | ヒーローが文字だらけ。サービスの「結果」が見えない | Apple.com iPhone: 1枚の画像 + 1行のコピーで全てを伝える |
| **余白（Breathing Room）** | セクション間の余白が均一かつ狭い。窮屈 | Apple: セクション間 `py-24` 〜 `py-32` 以上。「空白も情報」 |
| **視覚的階層** | すべてのセクションが同じ重みで並んでいる | Apple: ヒーロー→信頼構築→機能説明→CTA の感情カーブがある |
| **画像の不在** | テキスト + アイコンのみ。サービスの実態が視覚化されていない | Apple: 全セクションに高品質ビジュアルがある |
| **タイポグラフィ** | 見出しサイズの差が不十分。メリハリに欠ける | Apple: ヒーロー見出しは `text-5xl`〜`text-7xl`。本文との差が極めて大きい |
| **CTA設計** | 「無料相談」ボタンが他の情報に埋もれている | Apple: CTAは必ず呼吸する空間の中に、1つだけ明確に置く |
| **感情設計** | 事務的。安心感や温かみが不足 | Apple: 数字やスペックより「あなたの生活がどう変わるか」を伝える |
| **モバイル体験** | レスポンシブだが最適化は不十分（タッチターゲットの余裕等） | Apple: モバイルが主戦場。指の太さ基準（min 44px）で全設計 |

### ChatGPTの構成案への評価

document.md の構成案は**コンテンツとコピーライティングの観点では優秀**（特に法令遵守の文言整理は必須）。
しかし「デザイン」と「感情設計」の指示が一切ない。以下の仕様書でその部分を補完する。

**document.md のコピー（文言）は基本的に採用する。**ただしデザイン・レイアウト・画像・アニメーションの指示はこの仕様書に従うこと。

---

## 1. デザインシステム

### カラーパレット（5色厳守）

```
Primary:     emerald-600  (#059669)   — 信頼・清潔感・自然
Dark:        #1A1A1A                  — 見出し・メインテキスト
Gray:        #6B7280                  — サブテキスト・説明文
Light BG:    #F9FAFB                  — セクション交互背景
White:       #FFFFFF                  — メイン背景
```

補助的にのみ使用:
- `emerald-50` (#ECFDF5) — 強調背景
- `emerald-700` (#047857) — ホバー状態
- `amber-50` / `amber-600` — 注意書き専用（法令遵守セクションのみ）

### タイポグラフィ

```
フォント: Noto Sans JP (Google Fonts)
代替: system-ui, -apple-system

ヒーロー見出し:   text-4xl md:text-6xl lg:text-7xl  font-bold  tracking-tight  leading-[1.1]
セクション見出し: text-3xl md:text-4xl              font-bold  tracking-tight
サブ見出し:       text-xl md:text-2xl               font-semibold
本文:            text-base md:text-lg               font-normal leading-relaxed
キャプション:     text-sm                           font-normal text-gray-500
```

### 余白ルール

```
セクション間:     py-20 md:py-28 lg:py-32
セクション内:     space-y-12 md:space-y-16
コンテンツ幅:     max-w-6xl mx-auto px-6 md:px-8
見出し→本文:      mt-4 md:mt-6
本文→CTA:        mt-8 md:mt-10
```

### アニメーション

全セクションに IntersectionObserver ベースのフェードイン:
```css
/* 初期状態 */
opacity: 0; transform: translateY(32px);

/* 表示時 */
opacity: 1; transform: translateY(0);
transition: opacity 0.7s ease-out, transform 0.7s ease-out;
```

カード・ボタンのホバー:
```css
transition: transform 0.3s ease, box-shadow 0.3s ease;
hover: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.08);
```

---

## 2. ページ全体構成（セクション順）

Apple.com のプロダクトページ構造に準拠:
「感情で引き込む → 信頼を構築 → 機能を説明 → 行動を促す」

```
┌─────────────────────────────────────────┐
│  [A] グローバルナビ（sticky）             │
├─────────────────────────────────────────┤
│  [B] ヒーロー（フルスクリーン）            │
├─────────────────────────────────────────┤
│  [C] 信頼バー（数字3つ）                  │
├─────────────────────────────────────────┤
│  [D] 選ばれる3つの理由                    │
├─────────────────────────────────────────┤
│  [E] サービス内容（6項目・ビジュアル付き）  │
├─────────────────────────────────────────┤
│  [F] 改葬手続きとは（新設・ステッパー）     │
├─────────────────────────────────────────┤
│  [G] 清蓮ができること/行わないこと（新設）   │
├─────────────────────────────────────────┤
│  [H] ご依頼の流れ（5ステップ）            │
├─────────────────────────────────────────┤
│  [I] 料金について（CTA導線）              │
├─────────────────────────────────────────┤
│  [J] ご自分で手続きされる方へ             │
├─────────────────────────────────────────┤
│  [K] よくある質問                        │
├─────────────────────────────────────────┤
│  [L] 最終CTA（フルワイド）               │
├─────────────────────────────────────────┤
│  [M] フッター                           │
└─────────────────────────────────────────┘
│  [N] フローティングCTA（モバイル）         │
```

---

## 3. 各セクション詳細仕様

---

### [A] グローバルナビ

**参考:** Apple.com のグローバルナビ（薄いバー、半透明背景、ミニマル）

```tsx
<header className="sticky top-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-xl">
  <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
    {/* ロゴ */}
    <a href="/" className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600">
        <span className="text-sm font-bold text-white">N</span>
      </div>
      <span className="text-base font-bold tracking-tight">お墓じまいナビ</span>
    </a>

    {/* デスクトップナビ */}
    <nav className="hidden items-center gap-8 md:flex">
      {["お墓じまいとは", "流れ", "料金", "対応地域", "申請書DL"].map((item) => (
        <a
          key={item}
          href="#"
          className="text-sm font-medium text-gray-600 transition-colors hover:text-foreground"
        >
          {item}
        </a>
      ))}
    </nav>

    {/* CTA + モバイルメニュー */}
    <div className="flex items-center gap-3">
      <a
        href="tel:0120000000"
        className="hidden items-center gap-1.5 text-sm font-medium text-emerald-600 md:flex"
      >
        <Phone className="h-4 w-4" />
        0120-000-000
      </a>
      <a
        href="#contact"
        className="hidden rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 md:inline-flex"
      >
        無料相談
      </a>
      {/* モバイル: ハンバーガー */}
      <button className="flex h-10 w-10 items-center justify-center md:hidden" aria-label="メニューを開く">
        <Menu className="h-5 w-5" />
      </button>
    </div>
  </div>
</header>
```

**現状との違い:**
- `backdrop-blur-xl` で半透明背景（Apple風）
- 電話番号をナビ内に常時表示（デスクトップ）
- 「無料相談」ボタンをナビ右端に昇格

---

### [B] ヒーロー

**Apple的設計原則:** 1つのビジュアル + 1つのメッセージ + 1つのCTA。余計なものは一切置かない。

**現状の問題:** テキストが多すぎる。ファーストビューに電話番号・注釈・複数のキャッチコピーが詰め込まれている。

```tsx
<section className="relative flex min-h-[90vh] items-center overflow-hidden">
  {/* 背景画像: 整然とした日本庭園、または整地された清潔な区画 */}
  <div className="absolute inset-0">
    <Image
      src="/images/hero-garden.jpg"
      alt=""
      fill
      className="object-cover"
      priority
    />
    {/* 右側をグラデーションで暗く */}
    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/70 md:via-white/85 md:to-transparent" />
  </div>

  <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-32">
    <div className="max-w-2xl">
      {/* キャッチコピー */}
      <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
        全国対応・法令遵守
      </p>
      <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
        お墓じまいのすべてを、
        <br />
        プロにお任せ。
      </h1>
      <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-gray-600 md:text-lg">
        改葬手続きの案内と書類サポート、提携行政書士のご紹介、
        墓石撤去、遺骨のケア、新しい供養先まで。
        <br className="hidden md:inline" />
        株式会社清蓮がワンストップでサポートします。
      </p>

      {/* CTA群 */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <a
          href="#contact"
          className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-emerald-600 px-8 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl"
        >
          無料相談・お見積り
        </a>
        <a
          href="tel:0120000000"
          className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white/80 px-8 text-base font-semibold text-foreground backdrop-blur transition-all hover:border-gray-300 hover:bg-white"
        >
          <Phone className="h-5 w-5 text-emerald-600" />
          0120-000-000
        </a>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        24時間365日受付 / お見積り無料 / 無理な勧誘なし
      </p>
    </div>
  </div>
</section>
```

**画像の指示:**
- ヒーロー背景: 手入れの行き届いた日本庭園の風景、または緑のある霊園の整然とした風景
- 明るいトーン（暗い墓地写真は絶対NG）
- 人物は入れない（ヒーローでは抽象的な美しさで引き込む）
- 画像がない場合: `bg-gradient-to-br from-emerald-50 via-white to-gray-50` で代替
- 画像サイズ: 2560x1440px 以上、WebP形式推奨

---

### [C] 信頼バー

**Apple的設計原則:** Apple Store の「送料無料」「下取り」「サポート」バーのように、3つの数字/事実を横並びで簡潔に。

```tsx
<section className="border-y bg-gray-50/50">
  <div className="mx-auto grid max-w-4xl grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
    {[
      { number: "47", unit: "都道府県", label: "全国対応" },
      { number: "24", unit: "時間", label: "受付対応" },
      { number: "0", unit: "円", label: "お見積り" },
    ].map((item) => (
      <div key={item.label} className="flex flex-col items-center px-6 py-8 text-center">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-emerald-600 md:text-5xl">
            {item.number}
          </span>
          <span className="text-base font-medium text-gray-500">{item.unit}</span>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-500">{item.label}</p>
      </div>
    ))}
  </div>
</section>
```

**ポイント:** 数字はカウントアップアニメーション（requestAnimationFrame）で表示。ビューポートに入った瞬間に0からカウント。

---

### [D] 選ばれる3つの理由

**ChatGPTコピーを採用（法令遵守版に差し替え）。ただしデザインを全面改修。**

**Apple的設計:** 各理由に大きなビジュアル（画像 or イラスト）を配置し、テキストと交互に左右配置。

```tsx
<section className="py-20 md:py-28">
  <div className="mx-auto max-w-6xl px-6">
    {/* セクション見出し */}
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
        選ばれる3つの理由
      </h2>
      <p className="mt-4 text-base text-gray-500 md:text-lg">
        安さだけではありません。法令遵守と確かな実績で選ばれています。
      </p>
    </div>

    {/* 理由リスト: 画像とテキストの交互配置 */}
    <div className="mt-16 space-y-20 md:mt-20 md:space-y-28">

      {/* 理由1: 全国対応 */}
      <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
        <div className="w-full md:w-1/2">
          <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gray-100">
            {/* 日本地図にピンが立っているイラスト or 提携石材店の作業風景 */}
            <Image
              src="/images/reason-nationwide.jpg"
              alt="全国の提携ネットワーク"
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <span className="text-sm font-semibold text-emerald-600">01</span>
          <h3 className="mt-2 text-2xl font-bold md:text-3xl">
            全国対応と
            <br />
            提携ネットワーク
          </h3>
          <p className="mt-4 leading-relaxed text-gray-600 md:text-lg">
            全国の提携石材店と連携。地域差のある手続きや工事も
            進めやすい体制です。独自のネットワークで、地域ごとの
            条例や慣習に精通した優良石材店を手配します。
          </p>
        </div>
      </div>

      {/* 理由2: 法令遵守（画像とテキストの左右反転） */}
      <div className="flex flex-col items-center gap-10 md:flex-row-reverse md:gap-16">
        <div className="w-full md:w-1/2">
          <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gray-100">
            {/* 書類を丁寧に扱うスタッフの手元、または行政書士との連携イメージ */}
            <Image
              src="/images/reason-compliance.jpg"
              alt="法令遵守の安心設計"
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <span className="text-sm font-semibold text-emerald-600">02</span>
          <h3 className="mt-2 text-2xl font-bold md:text-3xl">
            法令遵守の
            <br />
            安心設計
          </h3>
          <p className="mt-4 leading-relaxed text-gray-600 md:text-lg">
            改葬手続きは「案内」と「行政書士紹介」に限定。
            違法リスクのある代行は行いません。
            改葬許可申請の代理提出が必要な場合は、
            提携行政書士をご紹介します。
          </p>
        </div>
      </div>

      {/* 理由3: 離檀交渉サポート */}
      <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
        <div className="w-full md:w-1/2">
          <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gray-100">
            {/* 相談風景、スタッフが電話で丁寧に対応している風景 */}
            <Image
              src="/images/reason-negotiation.jpg"
              alt="離檀交渉サポート"
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <span className="text-sm font-semibold text-emerald-600">03</span>
          <h3 className="mt-2 text-2xl font-bold md:text-3xl">
            離檀交渉
            <br />
            サポート
          </h3>
          <p className="mt-4 leading-relaxed text-gray-600 md:text-lg">
            寺院・墓地管理者との離檀交渉で悩む方が多い領域を、
            実務目線でサポートします。
            高額な離檀料を請求された場合もご相談ください。
          </p>
          {/* 差別化バッジ */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <Star className="h-4 w-4" />
            他社にない独自サービス
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

**画像指示:**
- 理由1: 日本地図上にピンが並ぶイラスト、または作業員が整然と工事する広角写真
- 理由2: 書類と印鑑が整然と並ぶデスク、または行政書士と打ち合わせるイメージ
- 理由3: ヘッドセットをつけたスタッフ、または穏やかな相談風景
- **すべて明るく、清潔感のあるトーン**
- 各画像: `rounded-3xl` の角丸。影はつけない（Apple的クリーンさ）

---

### [E] サービス内容

**ChatGPTコピーを採用（「代行」→「案内」に修正済み版）。デザインはBentoグリッド風。**

```tsx
<section className="bg-gray-50/50 py-20 md:py-28">
  <div className="mx-auto max-w-6xl px-6">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
        サービス内容
      </h2>
      <p className="mt-4 text-base text-gray-500 md:text-lg">
        お墓じまいに関わるすべての工程をサポートします。
      </p>
    </div>

    {/* Bento Grid: 2列×3行 → モバイル1列 */}
    <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service, i) => (
        <div
          key={i}
          className={cn(
            "group relative overflow-hidden rounded-3xl bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl",
            // 最初のカード（改葬手続きの案内）を大きく
            i === 0 && "md:col-span-2 lg:col-span-2 lg:row-span-1"
          )}
        >
          {/* 番号 */}
          <span className="text-sm font-semibold text-emerald-600">
            {String(i + 1).padStart(2, "0")}
          </span>

          {/* アイコン（大きめ、淡い背景の上に配置） */}
          <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
            <service.icon className="h-7 w-7 text-emerald-600" />
          </div>

          {/* テキスト */}
          <h3 className="mt-5 text-xl font-bold">{service.title}</h3>
          <p className="mt-3 leading-relaxed text-gray-600">{service.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

**サービスデータ（document.md準拠）:**

```tsx
const services = [
  {
    icon: FileText,
    title: "改葬手続きの案内",
    description:
      "流れの説明、必要書類の取得方法、一般的な記入ポイントをご案内します。全国自治体の申請書ダウンロード導線もご用意。",
  },
  {
    icon: UserCheck,
    title: "行政書士のご紹介",
    description:
      "代理提出や個別事情がある場合は、提携行政書士をご紹介します。",
  },
  {
    icon: Hammer,
    title: "墓石撤去工事の手配",
    description:
      "現地状況に応じた撤去・整地・原状回復を手配します。",
  },
  {
    icon: Droplets,
    title: "遺骨の取扱い（洗骨・粉骨）",
    description:
      "取り出したご遺骨の洗骨・粉骨、保管容器（骨壷、骨箱、遺骨袋）への納め替えに対応します。",
  },
  {
    icon: Landmark,
    title: "改葬先のご提案",
    description:
      "納骨堂・樹木葬・合祀など、改葬後の選択肢をご提案します。",
  },
  {
    icon: Waves,
    title: "海洋散骨",
    description:
      "海洋散骨の場合、一般に改葬手続きが不要となるケースがあります。状況に応じてご案内します。",
  },
];
```

---

### [F] 改葬手続きとは（新設）

**Apple的設計:** Apple Watchの健康機能説明のように、ステップを視覚的に、大きく、ゆったり見せる。

```tsx
<section className="py-20 md:py-28">
  <div className="mx-auto max-w-6xl px-6">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
        改葬手続きとは
      </h2>
      <p className="mt-4 text-base text-gray-500 md:text-lg">
        現在のお墓からご遺骨を移し、別の納骨先へ移す手続きです。
        <br />
        墓じまいでは「改葬許可証」の取得が必要になります。
      </p>
    </div>

    {/* 3ステップの大きなカード */}
    <div className="mt-16 grid gap-6 md:grid-cols-3">
      {[
        {
          step: "Step 1",
          title: "受入証明の取得",
          description: "新しい納骨先から「受入証明書」を発行してもらいます。",
          icon: FileCheck,
          image: "/images/step-acceptance.jpg",
        },
        {
          step: "Step 2",
          title: "埋葬証明の取得",
          description: "現在のお墓の管理者から「埋葬証明書」を発行してもらいます。",
          icon: FileSignature,
          image: "/images/step-burial-cert.jpg",
        },
        {
          step: "Step 3",
          title: "改葬許可の申請",
          description: "お墓のある自治体に書類を提出し、「改葬許可証」を受領します。",
          icon: CheckCircle,
          image: "/images/step-permit.jpg",
        },
      ].map((item, i) => (
        <div key={i} className="group overflow-hidden rounded-3xl bg-gray-50">
          {/* 上部: 画像エリア */}
          <div className="aspect-[16/10] overflow-hidden bg-gray-100">
            <Image
              src={item.image}
              alt={item.title}
              width={600}
              height={375}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {/* 下部: テキスト */}
          <div className="p-8">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              {item.step}
            </span>
            <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
            <p className="mt-3 leading-relaxed text-gray-600">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* 補足 */}
    <div className="mx-auto mt-10 flex max-w-2xl items-start gap-3 rounded-2xl bg-gray-50 px-6 py-4">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
      <p className="text-sm leading-relaxed text-gray-500">
        許可証の発行までの期間は自治体により異なります（数日〜1、2週間程度が目安）。
      </p>
    </div>
  </div>
</section>
```

**画像指示:**
- Step 1: 納骨堂や樹木葬墓地の明るい外観写真
- Step 2: お寺の事務所カウンター、または書類を手渡すイメージ
- Step 3: 市役所の窓口、または公印が押された書類のイメージ
- **すべて実写がベスト。なければ線画イラスト（Apple Support風）で代替**

---

### [G] 清蓮ができること / 行わないこと（新設・最重要）

**Apple的設計:** Mac vs PC、iPhone vs Android のような「明確な対比」。ただし攻撃的でなく、誠実なトーン。

```tsx
<section className="bg-gray-50/50 py-20 md:py-28">
  <div className="mx-auto max-w-5xl px-6">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
        私たちの対応範囲
      </h2>
      <p className="mt-4 text-base text-gray-500 md:text-lg">
        法令を遵守し、できることとできないことを明確にしています。
      </p>
    </div>

    <div className="mt-16 grid gap-6 md:grid-cols-2">
      {/* できること */}
      <div className="rounded-3xl bg-white p-8 md:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
          <Check className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="mt-5 text-xl font-bold">清蓮ができること</h3>
        <ul className="mt-6 space-y-4">
          {[
            "改葬手続きの流れのご説明",
            "必要書類の取得方法のご案内",
            "全国自治体の申請書ダウンロード導線",
            "記入方法の一般的なご説明",
            "提携行政書士のご紹介",
            "墓石撤去工事の手配",
            "離檀交渉サポート",
            "遺骨の洗骨・粉骨",
            "改葬先に合わせた容器への納め替え",
            "海洋散骨の手配",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <Check className="h-3 w-3 text-emerald-600" />
              </div>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 行わないこと */}
      <div className="rounded-3xl border-2 border-amber-200 bg-amber-50/30 p-8 md:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
          <ShieldAlert className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="mt-5 text-xl font-bold">清蓮が行わないこと</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          改葬許可申請の「代理提出」「行政手続きの代行」は、
          行政書士等の有資格者が行う業務です。
          清蓮は無資格での代行を行いません。
        </p>
        <p className="mt-4 text-sm leading-relaxed text-gray-600">
          必要な場合は提携行政書士をご紹介します。
        </p>

        {/* 注意 */}
        <div className="mt-8 rounded-xl bg-amber-100/50 px-5 py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-800">ご注意</p>
              <p className="mt-1 text-xs leading-relaxed text-amber-700">
                「代行可」とうたう業者でも、実態が無資格対応のケースがあります。
                依頼前に資格者の関与を確認してください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

**デザインのポイント:**
- 「できること」: 白背景、emeraldアクセント → ポジティブ
- 「行わないこと」: amber背景、amber枠 → 注意喚起（赤ではなく amber。赤は「危険」を感じさせすぎる）
- Apple的な対比構造で、誠実さと専門性を同時に伝える

---

### [H] ご依頼の流れ

**Apple的設計:** Apple Store のオーダープロセスのように、縦のタイムラインで視覚化。

```tsx
<section className="py-20 md:py-28">
  <div className="mx-auto max-w-4xl px-6">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
        ご依頼の流れ
      </h2>
      <p className="mt-4 text-base text-gray-500 md:text-lg">
        お問い合わせから完了まで、5つのステップで進めます。
      </p>
    </div>

    <div className="mt-16 space-y-0">
      {[
        {
          step: "01",
          title: "無料相談",
          description:
            "状況確認（現墓地、改葬先、寺院/管理者との関係、希望日程）。お電話またはフォームで。",
          badge: "24時間受付",
          icon: MessageSquare,
        },
        {
          step: "02",
          title: "現地調査・概算見積",
          description:
            "撤去規模、搬出経路、必要作業を確認。お見積りは無料です。",
          badge: "無料",
          icon: MapPin,
        },
        {
          step: "03",
          title: "事前準備",
          description:
            "受入証明、埋葬証明、申請書の取得と記入ポイント案内。代理提出が必要な場合は行政書士へ接続。",
          badge: null,
          icon: ClipboardList,
        },
        {
          step: "04",
          title: "工事・ご遺骨の取扱い",
          description:
            "撤去工事、洗骨・粉骨、容器への納め替え。施工後の写真報告をお送りします。",
          badge: null,
          icon: Hammer,
        },
        {
          step: "05",
          title: "完了",
          description:
            "改葬先への納骨、散骨など希望に合わせて完了。アフターフォローも対応。",
          badge: null,
          icon: CheckCircle,
        },
      ].map((item, i, arr) => (
        <div key={item.step} className="relative flex gap-6 pb-12 last:pb-0">
          {/* 縦の接続線 */}
          {i < arr.length - 1 && (
            <div className="absolute left-6 top-16 h-full w-px bg-gray-200" />
          )}

          {/* ステップ円 */}
          <div
            className={cn(
              "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              i === arr.length - 1
                ? "bg-emerald-600 text-white"
                : "border-2 border-emerald-600 bg-white text-emerald-600"
            )}
          >
            {item.step}
          </div>

          {/* コンテンツ */}
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold">{item.title}</h3>
              {item.badge && (
                <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-600">
                  {item.badge}
                </span>
              )}
            </div>
            <p className="mt-2 leading-relaxed text-gray-600">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

### [I] 料金について

**Apple的設計:** 詳細は料金ページに任せ、トップページでは「安心感」だけ伝える。Apple.com のiPhone価格表示のように「月額いくらから」だけ見せるスタイル。

```tsx
<section className="bg-gray-50/50 py-20 md:py-28">
  <div className="mx-auto max-w-4xl px-6">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
        料金について
      </h2>
      <p className="mt-4 text-base text-gray-500 md:text-lg">
        現地状況で変動するため、まずは無料で概算をご案内します。
        <br />
        追加費用が出やすいポイントも事前にご説明します。
      </p>
    </div>

    {/* 安心ポイント3つ */}
    <div className="mt-12 grid gap-4 md:grid-cols-3">
      {[
        {
          icon: ShieldCheck,
          title: "追加費用なし",
          description: "お見積り後の追加請求は原則ありません",
        },
        {
          icon: Eye,
          title: "明朗会計",
          description: "すべて税込の明確な料金体系",
        },
        {
          icon: Undo2,
          title: "キャンセル無料",
          description: "お見積り後のお断りも費用ゼロ",
        },
      ].map((item) => (
        <div key={item.title} className="flex flex-col items-center rounded-2xl bg-white p-6 text-center">
          <item.icon className="h-8 w-8 text-emerald-600" />
          <h3 className="mt-4 text-base font-bold">{item.title}</h3>
          <p className="mt-2 text-sm text-gray-500">{item.description}</p>
        </div>
      ))}
    </div>

    {/* CTA */}
    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <a
        href="#contact"
        className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-emerald-600 px-8 text-base font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        無料相談・概算を依頼する
      </a>
      <a
        href="/pricing"
        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-6 text-base font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
      >
        料金プランを見る
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  </div>
</section>
```

---

### [J] ご自分で手続きされる方へ

**Apple的設計:** Apple.com の「Trade In」セクションのように、メイン導線とは別の選択肢を上品に提示。

```tsx
<section className="py-20 md:py-28">
  <div className="mx-auto max-w-5xl px-6">
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-gray-50 p-10 md:p-16">
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          ご自分で手続きされる方へ
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
          全国自治体の改葬許可申請書のダウンロードと、
          一般的な記入ポイントをまとめています。
          <br className="hidden md:inline" />
          まずはお墓の所在地の自治体を検索してください。
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="/downloads"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-foreground px-8 text-base font-semibold text-white transition-colors hover:bg-gray-800"
          >
            <Download className="h-5 w-5" />
            改葬許可申請書 全国一覧
          </a>
          <a
            href="/guide"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border-2 border-gray-200 px-6 text-base font-semibold transition-colors hover:bg-gray-50"
          >
            改葬手続きの流れと書き方
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

### [K] よくある質問

**document.md のFAQコピーを採用（法令関連Q&A含む）。**

```tsx
const faqs = [
  {
    q: "改葬手続きの代行もお願いできますか？",
    a: "代理提出は行政書士等の有資格者業務です。清蓮は代行せず、必要な場合は提携行政書士をご紹介します。",
  },
  {
    q: "受入証明と埋葬証明はどこでもらえますか？",
    a: "受入証明は新しい納骨先、埋葬証明は現在のお墓の管理者（寺院・霊園等）から取得します。",
  },
  {
    q: "離檀交渉サポートとは何ですか？",
    a: "寺院・管理者との手続き上の交渉や段取りで詰まりやすいポイントを整理し、円滑化を支援します。",
  },
  {
    q: "海洋散骨の場合は改葬手続きが必要ですか？",
    a: "状況により異なります。個別事情を確認してご案内します。",
  },
  {
    q: "見積り後に追加費用が発生することはありますか？",
    a: "原則ありません。現地調査で正確に状況を確認した上でお見積りを提示します。ただし、調査時に確認できなかった地中障害物等が発見された場合のみ、事前にご相談のうえ追加費用が発生する場合があります。",
  },
  {
    q: "全国どこでも対応していますか？",
    a: "はい、47都道府県対応しています。全国の提携石材店ネットワークを活用して対応いたします。",
  },
];

<section className="bg-gray-50/50 py-20 md:py-28">
  <div className="mx-auto max-w-3xl px-6">
    <div className="text-center">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
        よくあるご質問
      </h2>
    </div>

    <div className="mt-12 divide-y">
      {faqs.map((faq, i) => (
        <details key={i} className="group">
          <summary className="flex cursor-pointer items-center justify-between gap-4 py-6 text-left text-base font-medium transition-colors hover:text-emerald-600 [&::-webkit-details-marker]:hidden">
            <span>{faq.q}</span>
            <ChevronDown className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
          </summary>
          <p className="pb-6 pr-10 leading-relaxed text-gray-600">
            {faq.a}
          </p>
        </details>
      ))}
    </div>
  </div>
</section>
```

---

### [L] 最終CTA

**Apple的設計:** 最終CTAは「フルワイド + 背景ビジュアル + 最小限の文言」。Apple.com の各ページ末尾と同じ構造。

```tsx
<section className="relative overflow-hidden py-24 md:py-32">
  {/* 背景: 淡い日本庭園 or グラデーション */}
  <div className="absolute inset-0 bg-gradient-to-b from-emerald-600 to-emerald-700" />

  <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
    <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
      まずはお気軽に
      <br />
      ご相談ください
    </h2>
    <p className="mx-auto mt-4 max-w-lg text-base text-emerald-100 md:text-lg">
      お見積りは無料です。無理な勧誘は一切いたしません。
    </p>

    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <a
        href="#contact"
        className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full bg-white px-10 text-base font-bold text-emerald-600 shadow-lg transition-all hover:shadow-xl sm:w-auto"
      >
        無料相談・お見積りフォーム
      </a>
      <a
        href="tel:0120000000"
        className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full border-2 border-white/30 px-8 text-base font-semibold text-white transition-all hover:bg-white/10 sm:w-auto"
      >
        <Phone className="h-5 w-5" />
        0120-000-000
      </a>
    </div>

    <p className="mt-4 text-sm text-emerald-200">
      24時間365日受付
    </p>
  </div>
</section>
```

---

### [M] フッター

```tsx
<footer className="border-t bg-white py-16">
  <div className="mx-auto max-w-6xl px-6">
    <div className="grid gap-12 md:grid-cols-4">
      {/* ブランド */}
      <div className="md:col-span-1">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600">
            <span className="text-sm font-bold text-white">N</span>
          </div>
          <span className="text-base font-bold">お墓じまいナビ</span>
        </a>
        <p className="mt-4 text-sm leading-relaxed text-gray-500">
          株式会社清蓮が運営する、改葬手続きから供養までの
          一括サポートサービス。
        </p>
      </div>

      {/* サービス */}
      <div>
        <h4 className="text-sm font-semibold">サービス</h4>
        <ul className="mt-4 space-y-3">
          {["お墓じまいとは", "手続きの流れ", "料金プラン", "対応エリア"].map((item) => (
            <li key={item}>
              <a href="#" className="text-sm text-gray-500 transition-colors hover:text-foreground">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* 関連サービス */}
      <div>
        <h4 className="text-sm font-semibold">関連サービス</h4>
        <ul className="mt-4 space-y-3">
          {["海洋散骨クルーズ", "遺骨サポートLab", "改葬許可申請書DL"].map((item) => (
            <li key={item}>
              <a href="#" className="text-sm text-gray-500 transition-colors hover:text-foreground">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* 会社情報 */}
      <div>
        <h4 className="text-sm font-semibold">会社情報</h4>
        <ul className="mt-4 space-y-3">
          {["運営会社", "プライバシーポリシー", "お問い合わせ"].map((item) => (
            <li key={item}>
              <a href="#" className="text-sm text-gray-500 transition-colors hover:text-foreground">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="mt-12 border-t pt-8 text-center text-xs text-gray-400">
      &copy; 2026 Seiren Co., Ltd. All rights reserved.
    </div>
  </div>
</footer>
```

---

### [N] フローティングCTA（モバイル）

```tsx
<div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 p-3 backdrop-blur-xl md:hidden">
  <div className="flex gap-2">
    <a
      href="tel:0120000000"
      className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full border-2 border-emerald-600 text-sm font-bold text-emerald-600"
    >
      <Phone className="h-4 w-4" />
      電話で相談
    </a>
    <a
      href="#contact"
      className="flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white"
    >
      無料相談・お見積り
    </a>
  </div>
</div>

{/* フローティングCTAの高さ分、コンテンツにpadding-bottomを追加 */}
{/* <main className="pb-20 md:pb-0"> */}
```

---

## 4. 画像ガイドライン（総合）

### 必要な画像一覧

| ID | 使用箇所 | 内容 | トーン | サイズ |
|---|---|---|---|---|
| hero-garden.jpg | ヒーロー背景 | 手入れの行き届いた日本庭園、緑のある整然とした風景 | 明るい・穏やか | 2560x1440 |
| reason-nationwide.jpg | 選ばれる理由1 | 日本地図+ピンのイラスト or 複数地域の作業風景コラージュ | プロフェッショナル | 800x600 |
| reason-compliance.jpg | 選ばれる理由2 | 書類が整然と並ぶデスク or 行政書士との打ち合わせ | 信頼感・清潔 | 800x600 |
| reason-negotiation.jpg | 選ばれる理由3 | スタッフが電話で丁寧に対応 or 穏やかな相談風景 | 温かみ・安心 | 800x600 |
| step-acceptance.jpg | 改葬手続き Step1 | 納骨堂や樹木葬墓地の明るい外観 | 明るい・希望 | 600x375 |
| step-burial-cert.jpg | 改葬手続き Step2 | お寺の事務所 or 書類を手渡すシーン | 丁寧・信頼 | 600x375 |
| step-permit.jpg | 改葬手続き Step3 | 市役所の窓口 or 公印が押された書類 | 公的・安心 | 600x375 |

### 画像のルール

1. **絶対にストックフォトの「握手」「笑顔のビジネスマン」を使わない**
2. **暗い墓地写真は使わない。**明るさ・清潔感・hope がキーワード
3. すべて WebP 形式、遅延読み込み（ヒーローのみ `priority`）
4. `alt` テキストを必ず設定（アクセシビリティ）
5. 写真が用意できない場合は `bg-gray-100` + 大きなアイコンで代替

---

## 5. レスポンシブ設計

| ブレークポイント | 対応 |
|---|---|
| `<640px` (モバイル) | 1カラム。フローティングCTA表示。ヒーロー画像は上部に縮小 or グラデーション代替。タッチターゲット min 44px |
| `640-1024px` (タブレット) | 2カラムグリッド。余白やや拡大 |
| `>1024px` (デスクトップ) | フルレイアウト。max-w-6xl。フローティングCTA非表示 |

---

## 6. パフォーマンス要件

- 画像: `next/image` で自動最適化、WebP配信
- フォント: `next/font/google` で Noto Sans JP を読み込み（サブセット化）
- アニメーション: CSS + IntersectionObserver のみ。ライブラリ不使用
- LCP: ヒーロー画像を `priority` で先読み。目標 2.5秒以内
- CLS: 画像に `width/height` を明示。レイアウトシフトゼロ

---

## 7. SEO / メタデータ

```tsx
export const metadata = {
  title: "お墓じまいナビ | 全国対応・改葬手続き案内から供養まで - 株式会社清蓮",
  description:
    "お墓じまいの全工程をワンストップサポート。改葬手続きの案内、提携行政書士のご紹介、墓石撤去、遺骨ケア、新しい供養先まで。24時間受付・お見積り無料。",
  openGraph: {
    title: "お墓じまいナビ | 全国対応の改葬サポート",
    description:
      "改葬手続き案内・墓石撤去・遺骨ケア・供養先手配。24時間受付・お見積り無料。",
    images: [{ url: "/og/homepage.jpg", width: 1200, height: 630 }],
  },
};
```

構造化データ (JSON-LD):
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "お墓じまいナビ",
  "description": "改葬手続き案内から供養までの一括サポートサービス",
  "provider": {
    "@type": "Organization",
    "name": "株式会社清蓮"
  },
  "areaServed": "JP",
  "telephone": "0120-000-000",
  "priceRange": "お見積り無料"
}
```

---

## 8. Antigravityへの実装指示まとめ

1. **document.md のコピー（文言）をベースとする。** ただしデザイン・レイアウトはこの仕様書に従うこと
2. **Apple.com の余白感**を徹底: `py-20 md:py-28` 以上。セクション間に十分な呼吸空間を
3. **カラーは5色厳守**: emerald-600, #1A1A1A, #6B7280, #F9FAFB, #FFFFFF（+ amber は注意セクションのみ）
4. **画像を必ず配置**: ヒーロー、選ばれる理由3枚、改葬ステップ3枚の計7枚。写真がなければアイコン+淡い背景で代替
5. **セクション順序は厳守**: A→N の順番でページを構成
6. **法令遵守セクション[G]は必ず実装**: これが他社との最大の差別化
7. **フローティングCTA**: モバイルのみ、電話+フォームの2ボタン
8. **IntersectionObserver フェードイン**: 全セクションに適用（threshold: 0.15）
9. **Noto Sans JP**: `next/font/google` でサブセット読み込み
10. **`<details>` ベースFAQ**: JSなしでも動作するように
11. **印刷CSS**: ターゲット層（50-70代）が紙で家族と相談する前提
12. **モバイルファースト**: タッチターゲット min 44px、フォントサイズ min 14px
13. **既存の antigravity-pricing-redesign.md の料金ページとトーンを統一すること**
