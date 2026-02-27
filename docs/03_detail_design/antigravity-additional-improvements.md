# お墓じまいナビ - 追加改善仕様書（改善5〜12）
# Antigravity向け 追加実装指示

前回の仕様書（antigravity-spec.md）の改善1〜4に加え、以下の追加改善を実装してください。

---

## 改善5: FAQセクションの追加（フッター直上）

**目的:** ユーザーの「改葬手続きってどうやるの？」という不安を解消し、離脱を防ぐ。

**配置:** 自治体アコーディオン一覧とフッターの間

```tsx
const faqs = [
  {
    question: "改葬許可申請書はどこで入手できますか？",
    answer:
      "お墓のある市区町村の役所窓口で直接受け取るか、各自治体の公式サイトからPDFをダウンロードできます。本ページでは各自治体のダウンロードページへのリンクをまとめています。",
  },
  {
    question: "「専用案内あり」と「一般案内」の違いは何ですか？",
    answer:
      "「専用案内あり」は、その自治体が改葬手続き専用のページや申請書PDFを公開していることを示します。「一般案内」は自治体の一般的な窓口案内ページへのリンクです。専用案内がある自治体では、より詳しい手続き情報が得られます。",
  },
  {
    question: "改葬許可の申請手続きの流れを教えてください。",
    answer:
      "一般的な流れ：①改葬先の墓地を決定 → ②現在の墓地管理者から「埋葬証明書」を取得 → ③改葬先から「受入証明書」を取得 → ④市区町村に「改葬許可申請書」を提出 → ⑤「改葬許可証」を受け取り → ⑥お墓じまい・改葬を実施。詳しくは「お墓じまいとは」ページをご覧ください。",
  },
  {
    question: "申請書の様式は全国共通ですか？",
    answer:
      "基本的な記載内容は墓地埋葬法で定められていますが、申請書の様式は自治体ごとに異なります。必ずお墓のある自治体が指定する様式を使用してください。",
  },
  {
    question: "費用はどのくらいかかりますか？",
    answer:
      "改葬許可申請の手数料は無料〜数百円程度の自治体がほとんどです。お墓じまい全体の費用（墓石撤去・永代供養など）は別途かかります。詳しくは「料金」ページをご確認ください。",
  },
];

function FAQSection() {
  return (
    <section className="border-t bg-muted/20">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-foreground md:text-2xl">
            よくある質問
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            改葬許可申請に関するよくあるご質問をまとめました
          </p>
        </div>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border bg-background px-5"
            >
              <AccordionTrigger className="py-4 text-left text-sm font-medium hover:no-underline">
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5 pl-[26px] text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
```

**必要なアイコン追加:** `HelpCircle` を lucide-react のインポートに追加

---

## 改善6: 検索結果のフィードバック表示

**目的:** 検索時に「何件ヒットしたか」「該当なしか」を即座にフィードバックし、ユーザーの迷いをなくす。

**配置:** エリアタブと自治体一覧の間

```tsx
function SearchFeedback({
  query,
  totalPrefectures,
  totalMunicipalities,
}: {
  query: string;
  totalPrefectures: number;
  totalMunicipalities: number;
}) {
  if (!query.trim()) return null;

  if (totalMunicipalities === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              「{query}」に一致する自治体が見つかりませんでした
            </p>
            <p className="mt-0.5 text-xs text-amber-600">
              都道府県名・市区町村名・自治体コードで検索できます。
              別のエリアタブを選択するか、検索キーワードを変更してください。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <p className="text-sm text-muted-foreground">
        「<span className="font-medium text-foreground">{query}</span>」の検索結果：
        <span className="ml-1 font-semibold text-emerald-700">
          {totalPrefectures}都道府県 / {totalMunicipalities}件
        </span>
      </p>
    </div>
  );
}
```

**必要なアイコン追加:** `AlertCircle` を lucide-react のインポートに追加

---

## 改善7: エリアタブに「すべて」タブを追加

**目的:** 全エリア横断で検索したいユーザーのために、エリアの制約なく全自治体を一括表示するオプションを用意する。

**変更箇所:** areas 配列の先頭に追加

```tsx
const areas = [
  { id: "all",              name: "すべて",       count: 1343 }, // ← 追加
  { id: "tohoku-hokkaido",  name: "東北・北海道", count: 264 },
  { id: "kanto-koshin",     name: "関東・甲信",   count: 389 },
  { id: "tokai-hokuriku",   name: "東海・北陸",   count: 198 },
  { id: "kinki",            name: "近畿",         count: 167 },
  { id: "chugoku-shikoku",  name: "中国・四国",   count: 142 },
  { id: "kyushu-okinawa",   name: "九州・沖縄",   count: 183 },
];
```

**filterMunicipalities の変更:**

```tsx
function filterMunicipalities(
  data: Record<string, Prefecture[]>,
  activeArea: string,
  query: string
): Prefecture[] {
  // 「すべて」が選択されている場合は全エリアのデータを結合
  const prefectures =
    activeArea === "all"
      ? Object.values(data).flat()
      : data[activeArea] || [];

  if (!query.trim()) return prefectures;

  const normalized = query.trim().toLowerCase();
  return prefectures
    .map((pref) => {
      if (pref.name.toLowerCase().includes(normalized)) return pref;
      const filtered = pref.municipalities.filter(
        (m) =>
          m.name.toLowerCase().includes(normalized) ||
          m.code.includes(normalized)
      );
      if (filtered.length === 0) return null;
      return { ...pref, municipalities: filtered };
    })
    .filter(Boolean) as Prefecture[];
}
```

**デフォルトの activeArea を "all" に変更:**

```tsx
const [activeArea, setActiveArea] = useState("all");
```

**「すべて」タブのアイコン:**
`MapPin` の代わりに `Globe` アイコンを使用して他のタブと区別する。

```tsx
<button ...>
  {area.id === "all" ? (
    <Globe className="h-3.5 w-3.5" />
  ) : (
    <MapPin className="h-3.5 w-3.5" />
  )}
  {area.name}
</button>
```

**必要なアイコン追加:** `Globe` を lucide-react のインポートに追加

---

## 改善8: ページ上部に統計サマリーバーを追加

**目的:** ページの信頼性・網羅性を一目で伝える。SEO的にも有効。

**配置:** ページタイトル説明文の下部に組み込む

```tsx
function StatsSummary() {
  const stats = [
    { label: "対応自治体数", value: "1,343", icon: Building2 },
    { label: "専用案内あり", value: "486",   icon: FileCheck },
    { label: "対応都道府県", value: "47",    icon: MapPin },
  ];

  return (
    <div className="mx-auto flex max-w-2xl items-center justify-center gap-6 pt-6 md:gap-10">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
            <stat.icon className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight text-foreground">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

**配置イメージ:** ページタイトルセクション内の `</section>` 直前に挿入。

**必要なアイコン追加:** `Building2` を lucide-react のインポートに追加

---

## 改善9: アコーディオン内のソートオプション

**目的:** 都道府県アコーディオンを展開した際、自治体の並び順を切り替えられるようにする。

**配置:** AccordionContent の先頭

```tsx
type SortMode = "recommended" | "alphabetical" | "dedicated-first";

function SortToggle({
  mode,
  onChange,
}: {
  mode: SortMode;
  onChange: (mode: SortMode) => void;
}) {
  return (
    <div className="mb-3 flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">並び替え:</span>
      {[
        { id: "dedicated-first" as SortMode, label: "専用案内優先" },
        { id: "alphabetical" as SortMode,    label: "五十音順" },
      ].map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            mode === option.id
              ? "bg-emerald-100 text-emerald-700"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
```

**ソートロジック:**

```tsx
function sortMunicipalities(
  municipalities: Municipality[],
  mode: SortMode
): Municipality[] {
  const sorted = [...municipalities];
  switch (mode) {
    case "dedicated-first":
      return sorted.sort((a, b) =>
        a.type === "dedicated" && b.type !== "dedicated" ? -1 :
        a.type !== "dedicated" && b.type === "dedicated" ? 1 : 0
      );
    case "alphabetical":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "ja"));
    default:
      return sorted;
  }
}
```

---

## 改善10: スクロール位置に応じた「トップに戻る」ボタン

**目的:** 全国1,300件超の自治体リストは非常に長い。ページ下部から上部へ素早く戻る手段を提供する。

**配置:** フローティングCTAの左隣（デスクトップ）、またはCTAバーの左側（モバイル）

```tsx
function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed z-50 flex h-10 w-10 items-center justify-center rounded-full border bg-background shadow-md transition-all hover:bg-muted",
        "bottom-20 right-4",               // モバイル: CTAバーの上
        "md:bottom-24 md:right-6"           // デスクトップ: CTAの上
      )}
      aria-label="ページの先頭に戻る"
    >
      <ArrowUp className="h-4 w-4 text-foreground" />
    </button>
  );
}
```

**必要なアイコン追加:** `ArrowUp` を lucide-react のインポートに追加

---

## 改善11: パンくずリスト（Breadcrumb）の追加

**目的:** サイト内でのページ位置を明示し、SEO構造化データの基盤にもなる。

**配置:** ヘッダー直下、ページタイトルセクションの上

```tsx
function Breadcrumb() {
  return (
    <nav
      aria-label="パンくずリスト"
      className="mx-auto max-w-5xl px-4 py-3"
    >
      <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <li>
          <a href="/" className="transition-colors hover:text-foreground">
            ホーム
          </a>
        </li>
        <li>
          <ChevronRight className="h-3 w-3" />
        </li>
        <li>
          <a href="#" className="transition-colors hover:text-foreground">
            お墓じまいの手続き
          </a>
        </li>
        <li>
          <ChevronRight className="h-3 w-3" />
        </li>
        <li>
          <span className="font-medium text-foreground" aria-current="page">
            改葬許可申請書ダウンロード 全国一覧
          </span>
        </li>
      </ol>
    </nav>
  );
}
```

**SEO構造化データ（JSON-LD）も追加:**

```tsx
// layoutまたはpage.tsxの<head>内に追加
<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://ohakajimai-navi.com/" },
    { "@type": "ListItem", "position": 2, "name": "お墓じまいの手続き", "item": "https://ohakajimai-navi.com/procedure" },
    { "@type": "ListItem", "position": 3, "name": "改葬許可申請書ダウンロード 全国一覧" }
  ]
})}
</script>
```

**必要なアイコン追加:** `ChevronRight` を lucide-react のインポートに追加

---

## 改善12: エリアタブ切り替え時のスムーズスクロール

**目的:** エリアタブを切り替えた際に、一覧の先頭まで自動スクロールする。長いリストの中で迷子にならないようにする。

**実装:**

```tsx
const listTopRef = useRef<HTMLDivElement>(null);

function handleAreaChange(areaId: string) {
  setActiveArea(areaId);
  // 少し遅延させてレンダリング完了後にスクロール
  setTimeout(() => {
    listTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
}

// 一覧セクションの先頭にrefを配置
<div ref={listTopRef} className="scroll-mt-20" /> // sticky headerの分のオフセット
```

`scroll-mt-20` はstickyヘッダー（h-16 = 4rem = 64px）の高さ分のオフセット。

---

## 更新後の全体ページ構成

```
┌─────────────────────────────────────────┐
│  ヘッダー（sticky）                       │
├─────────────────────────────────────────┤
│  【改善11】パンくずリスト                  │
├─────────────────────────────────────────┤
│  ページタイトル + 説明文                  │
│  【改善8】統計サマリーバー                 │
├─────────────────────────────────────────┤
│  検索バー                                │
├─────────────────────────────────────────┤
│  【改善6】検索結果フィードバック            │
├─────────────────────────────────────────┤
│  【既存 改善3】最近閲覧した自治体           │
├─────────────────────────────────────────┤
│  【既存 改善4 + 改善7】エリア選択タブ       │
│  （「すべて」タブ追加）                    │
├─────────────────────────────────────────┤
│  【改善12用】スクロールアンカー ← ref       │
├─────────────────────────────────────────┤
│  【既存 改善1+2 + 改善9】自治体一覧         │
│  （ソートオプション付き）                   │
├─────────────────────────────────────────┤
│  【改善5】FAQセクション                    │
├─────────────────────────────────────────┤
│  フッター                                │
├─────────────────────────────────────────┤
│  【改善10】スクロールトップボタン（fixed）    │
│  フローティングCTA（fixed）                │
└─────────────────────────────────────────┘
```

---

## 追加で必要な lucide-react アイコン（全量）

```tsx
import {
  // 既存（antigravity-spec.mdに記載済み）
  Search, X, Clock, History, MapPin, FileCheck, FileText,
  ExternalLink, Phone, Menu, ChevronDown,

  // 追加（本仕様書で新規使用）
  HelpCircle,     // FAQ
  AlertCircle,    // 検索結果なし
  Globe,          // 「すべて」タブ
  Building2,      // 統計サマリー
  ArrowUp,        // スクロールトップ
  ChevronRight,   // パンくずリスト
} from "lucide-react";
```

---

## 改善の優先度一覧

| 優先度 | 改善 | 概要 | 理由 |
|---|---|---|---|
| **P0** | 改善7  | 「すべて」タブ追加 | エリア選択なしで全検索したいユーザーが多い |
| **P0** | 改善6  | 検索フィードバック | 該当なし時に何の反応もないのはUX上致命的 |
| **P1** | 改善10 | スクロールトップ | 1,300件超のリストではナビゲーション必須 |
| **P1** | 改善11 | パンくずリスト | SEO・サイト構造上の基本要素 |
| **P1** | 改善8  | 統計サマリー | ページの信頼性・網羅性を伝える |
| **P1** | 改善12 | タブ切替時スクロール | 長いリストでの迷子防止 |
| **P2** | 改善5  | FAQ | ユーザーの不安解消、SEO向上 |
| **P2** | 改善9  | ソートオプション | パワーユーザー向け利便性 |
