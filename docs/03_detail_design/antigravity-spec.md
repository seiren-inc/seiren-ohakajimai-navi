# お墓じまいナビ - 改葬許可申請書ダウンロード 全国一覧ページ
# Antigravity向け 実装仕様書

## 概要
「お墓じまいナビ」の自治体リンクページを、以下4つの改善を含めて新規作成してください。

### 改善一覧
1. **アコーディオンヘッダーにプレビュー情報を追加** - 展開前に「専用案内あり」の件数をバッジ表示
2. **「専用案内あり」と「一般案内」のビジュアル差別化を強化** - 左ボーダー＋背景色＋アイコン変更
3. **最近閲覧した自治体のハイライト表示** - 検索バー下に直近5件をチップ表示
4. **モバイルエリアタブの横スクロール対応** - 6ボタンをモバイルでは横スクロール可能に

---

## 技術スタック
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (Accordion, Badge, Input, Button などを使用)
- Lucide React (アイコン)

---

## カラーパレット（最大5色）
| 用途 | 色 | Tailwindクラス例 |
|---|---|---|
| ブランド/プライマリ | エメラルドグリーン | `emerald-600` |
| 背景 | 白 | `bg-background` |
| テキスト | ダークグレー | `text-foreground` |
| サブテキスト | ミディアムグレー | `text-muted-foreground` |
| ボーダー/区切り | ライトグレー | `border-border` |

※ 紫・バイオレット系は使用しないこと

---

## ページ全体構成（上から順）

```
┌─────────────────────────────────────────┐
│  ヘッダー（ロゴ + ナビゲーション）         │
├─────────────────────────────────────────┤
│  ページタイトル + 説明文                  │
├─────────────────────────────────────────┤
│  検索バー                                │
├─────────────────────────────────────────┤
│  【改善3】最近閲覧した自治体（最大5件）     │
├─────────────────────────────────────────┤
│  【改善4】エリア選択タブ（6エリア）         │
├─────────────────────────────────────────┤
│  【改善1+2】自治体アコーディオン一覧       │
├─────────────────────────────────────────┤
│  フッター                                │
├─────────────────────────────────────────┤
│  フローティングCTA                       │
└─────────────────────────────────────────┘
```

---

## セクション別 詳細仕様

### 1. ヘッダー

```tsx
<header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
  <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
    {/* ロゴ */}
    <a href="/" className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
        N
      </div>
      <span className="text-lg font-bold text-foreground">お墓じまいナビ</span>
    </a>

    {/* デスクトップナビ */}
    <nav className="hidden items-center gap-6 md:flex">
      <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">お墓じまいとは</a>
      <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">流れ</a>
      <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">料金</a>
      <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">対応地域</a>
      <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">会社概要</a>
    </nav>

    {/* モバイルメニューボタン */}
    <button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted md:hidden">
      <Menu className="h-5 w-5" />
    </button>
  </div>
</header>
```

### 2. ページタイトル + 説明文

```tsx
<section className="border-b bg-muted/30 px-4 py-10 text-center md:py-14">
  <div className="mx-auto max-w-3xl">
    <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl">
      改葬許可申請書ダウンロード 全国一覧
    </h1>
    <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
      全国の自治体が公開している改葬許可申請書のダウンロードページや公式案内ページへのリンクを一覧にまとめました。
      お墓のある市区町村名で検索するか、エリアから探してください。
    </p>
  </div>
</section>
```

### 3. 検索バー

```tsx
<div className="relative mx-auto max-w-2xl px-4 pt-8">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <input
      type="text"
      placeholder="自治体名や都道府県名を検索..."
      className="h-12 w-full rounded-xl border bg-background pl-10 pr-4 text-sm shadow-sm transition-shadow placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    {searchQuery && (
      <button
        onClick={() => setSearchQuery("")}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-muted"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
    )}
  </div>
</div>
```

### 4. 【改善3】最近閲覧した自治体

**仕様:**
- localStorageに `recent-municipalities` キーで保存
- 自治体リンクをクリックした際に配列先頭に追加（重複除去、最大5件）
- 初回訪問時は非表示

```tsx
function RecentlyViewed({ onSelect }: { onSelect: (name: string) => void }) {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("recent-municipalities");
    if (stored) {
      try {
        setRecent(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  if (recent.length === 0) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <h3 className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        最近閲覧した自治体
      </h3>
      <div className="flex flex-wrap gap-2">
        {recent.slice(0, 5).map((name) => (
          <button
            key={name}
            onClick={() => onSelect(name)}
            className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
          >
            <History className="h-3 w-3 text-muted-foreground" />
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

// 自治体クリック時の保存関数
function saveToRecent(name: string) {
  const stored = localStorage.getItem("recent-municipalities");
  let arr: string[] = stored ? JSON.parse(stored) : [];
  arr = [name, ...arr.filter((n) => n !== name)].slice(0, 5);
  localStorage.setItem("recent-municipalities", JSON.stringify(arr));
}
```

### 5. 【改善4】エリア選択タブ

**仕様:**
- 6つのエリアボタン
- **モバイル:** 横スクロール + 右端にフェードグラデーションでスクロール可能であることを示唆
- **デスクトップ:** flex-wrapで折り返し表示
- 各ボタンにエリア内の自治体件数を小さく表示
- タッチターゲットは最小44px確保

```tsx
const areas = [
  { id: "tohoku-hokkaido", name: "東北・北海道", count: 264 },
  { id: "kanto-koshin",    name: "関東・甲信",   count: 389 },
  { id: "tokai-hokuriku",  name: "東海・北陸",   count: 198 },
  { id: "kinki",           name: "近畿",         count: 167 },
  { id: "chugoku-shikoku", name: "中国・四国",   count: 142 },
  { id: "kyushu-okinawa",  name: "九州・沖縄",   count: 183 },
];

function AreaTabs({ activeArea, onSelect }: {
  activeArea: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <div className="relative">
        {/* 右端フェード（モバイルのみ） */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-background to-transparent md:hidden" />

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:overflow-x-visible md:pb-0">
          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() => onSelect(area.id)}
              className={cn(
                "inline-flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all",
                activeArea === area.id
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                  : "border-border bg-background text-foreground hover:bg-muted"
              )}
            >
              <MapPin className="h-3.5 w-3.5" />
              {area.name}
              <span className={cn(
                "ml-0.5 text-xs",
                activeArea === area.id ? "text-emerald-100" : "text-muted-foreground"
              )}>
                {area.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**必要なCSS（globals.cssに追加）:**

```css
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

### 6. 【改善1+2】自治体アコーディオン一覧

**改善1: アコーディオンヘッダーにプレビュー情報**
- 都道府県名 + 総件数 + 「専用案内あり」の件数バッジ

**改善2: リスト内の各自治体行のビジュアル差別化**
- 「専用案内あり」: 左ボーダー緑 + 薄緑背景 + チェックアイコン
- 「一般案内」: 通常ボーダー + 通常背景 + ドキュメントアイコン

```tsx
// --- データ型定義 ---
type Municipality = {
  name: string;
  code: string;       // 例: "#011002"
  type: "dedicated" | "general"; // 専用案内 or 一般案内
  url: string;
};

type Prefecture = {
  name: string;
  municipalities: Municipality[];
};

// --- アコーディオンヘッダー（改善1）---
function PrefectureHeader({ prefecture }: { prefecture: Prefecture }) {
  const total = prefecture.municipalities.length;
  const dedicatedCount = prefecture.municipalities.filter(
    (m) => m.type === "dedicated"
  ).length;

  return (
    <AccordionTrigger className="px-4 py-3 hover:no-underline [&[data-state=open]]:bg-muted/30">
      <div className="flex items-center gap-3">
        <span className="text-base font-semibold text-foreground">
          {prefecture.name}
        </span>
        <span className="text-sm text-muted-foreground">{total}件</span>
        {dedicatedCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
            <FileCheck className="h-3 w-3" />
            専用案内 {dedicatedCount}件
          </span>
        )}
      </div>
    </AccordionTrigger>
  );
}

// --- 自治体リスト行（改善2）---
function MunicipalityRow({
  municipality,
  onClickLink,
}: {
  municipality: Municipality;
  onClickLink: (name: string) => void;
}) {
  const isDedicated = municipality.type === "dedicated";

  return (
    <a
      href={municipality.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onClickLink(municipality.name)}
      className={cn(
        "flex items-center justify-between rounded-lg px-4 py-3 transition-colors",
        isDedicated
          ? "border-l-4 border-l-emerald-500 bg-emerald-50/50 hover:bg-emerald-50"
          : "border border-border hover:bg-muted/50"
      )}
    >
      {/* 左側: アイコン + 名前 + コード */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            isDedicated ? "bg-emerald-100" : "bg-muted"
          )}
        >
          {isDedicated ? (
            <FileCheck className="h-4 w-4 text-emerald-600" />
          ) : (
            <FileText className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {municipality.name}
          </p>
          <p className="text-xs text-muted-foreground">{municipality.code}</p>
        </div>
      </div>

      {/* 右側: ラベル + 外部リンクアイコン */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "hidden rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline-flex",
            isDedicated
              ? "bg-emerald-100 text-emerald-700"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isDedicated ? "専用案内あり" : "一般案内"}
        </span>
        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
    </a>
  );
}

// --- アコーディオン全体 ---
function PrefectureAccordion({
  prefectures,
  onMunicipalityClick,
}: {
  prefectures: Prefecture[];
  onMunicipalityClick: (name: string) => void;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Accordion type="multiple" className="space-y-2">
        {prefectures.map((pref) => (
          <AccordionItem
            key={pref.name}
            value={pref.name}
            className="overflow-hidden rounded-xl border bg-background"
          >
            <PrefectureHeader prefecture={pref} />
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="space-y-2">
                {/* 専用案内を先に表示（ソート済み） */}
                {[...pref.municipalities]
                  .sort((a, b) =>
                    a.type === "dedicated" && b.type !== "dedicated" ? -1 : 1
                  )
                  .map((m) => (
                    <MunicipalityRow
                      key={m.code}
                      municipality={m}
                      onClickLink={onMunicipalityClick}
                    />
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
```

### 7. フローティングCTA

```tsx
function FloatingCTA() {
  const [visible, setVisible] = useState(true);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setVisible(current < lastScrollRef.current || current < 100);
      lastScrollRef.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed z-50 transition-transform duration-300",
        // モバイル: フルワイドバー / デスクトップ: 右下フローティング
        "bottom-0 left-0 right-0 border-t bg-background/95 p-3 backdrop-blur-sm",
        "md:bottom-6 md:left-auto md:right-6 md:border-0 md:bg-transparent md:p-0",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <button
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 font-bold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl active:scale-[0.98]",
          "min-h-[52px] px-6 text-base",
          "md:w-auto md:rounded-full md:px-8 md:py-4"
        )}
      >
        <Phone className="h-5 w-5" />
        無料相談・お見積り
      </button>
    </div>
  );
}
```

### 8. フッター

```tsx
<footer className="border-t bg-muted/30">
  <div className="mx-auto max-w-5xl px-4 py-10">
    <div className="grid gap-8 sm:grid-cols-3">
      {/* ブランド */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 text-xs font-bold text-white">
            N
          </div>
          <span className="font-bold text-foreground">お墓じまいナビ</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          お墓じまいに関する手続きを<br />わかりやすくサポートします。
        </p>
      </div>
      {/* サービス */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">サービス</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="#" className="hover:text-foreground">お墓じまいとは</a></li>
          <li><a href="#" className="hover:text-foreground">料金について</a></li>
          <li><a href="#" className="hover:text-foreground">対応地域</a></li>
          <li><a href="#" className="hover:text-foreground">ご利用の流れ</a></li>
        </ul>
      </div>
      {/* 会社情報 */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">会社情報</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="#" className="hover:text-foreground">会社概要</a></li>
          <li><a href="#" className="hover:text-foreground">プライバシーポリシー</a></li>
          <li><a href="#" className="hover:text-foreground">お問い合わせ</a></li>
        </ul>
      </div>
    </div>
    <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
      &copy; 2026 お墓じまいナビ All rights reserved.
    </div>
  </div>
</footer>
```

---

## サンプルデータ構造

自治体データは以下の構造で管理してください。実際のデータは別途JSONファイルまたはAPIから供給されることを想定。

```tsx
const SAMPLE_DATA: Record<string, Prefecture[]> = {
  "tohoku-hokkaido": [
    {
      name: "北海道",
      municipalities: [
        { name: "札幌市",  code: "#011002", type: "dedicated", url: "https://example.com/sapporo" },
        { name: "旭川市",  code: "#012041", type: "dedicated", url: "https://example.com/asahikawa" },
        { name: "函館市",  code: "#012025", type: "general",   url: "https://example.com/hakodate" },
        { name: "小樽市",  code: "#012033", type: "general",   url: "https://example.com/otaru" },
        { name: "帯広市",  code: "#012076", type: "dedicated", url: "https://example.com/obihiro" },
        { name: "釧路市",  code: "#012068", type: "general",   url: "https://example.com/kushiro" },
        { name: "北見市",  code: "#012084", type: "general",   url: "https://example.com/kitami" },
        { name: "稚内市",  code: "#012149", type: "dedicated", url: "https://example.com/wakkanai" },
      ],
    },
    {
      name: "青森県",
      municipalities: [
        { name: "青森市",  code: "#022012", type: "dedicated", url: "https://example.com/aomori" },
        { name: "弘前市",  code: "#022021", type: "general",   url: "https://example.com/hirosaki" },
        { name: "八戸市",  code: "#022039", type: "dedicated", url: "https://example.com/hachinohe" },
      ],
    },
    {
      name: "岩手県",
      municipalities: [
        { name: "盛岡市", code: "#032018", type: "dedicated", url: "https://example.com/morioka" },
        { name: "花巻市", code: "#032051", type: "general",   url: "https://example.com/hanamaki" },
      ],
    },
  ],
  "kanto-koshin": [
    {
      name: "東京都",
      municipalities: [
        { name: "新宿区", code: "#131041", type: "dedicated", url: "https://example.com/shinjuku" },
        { name: "渋谷区", code: "#131130", type: "dedicated", url: "https://example.com/shibuya" },
        { name: "世田谷区", code: "#131121", type: "dedicated", url: "https://example.com/setagaya" },
        { name: "練馬区", code: "#131202", type: "general",   url: "https://example.com/nerima" },
        { name: "足立区", code: "#131211", type: "general",   url: "https://example.com/adachi" },
      ],
    },
    {
      name: "神奈川県",
      municipalities: [
        { name: "横浜市", code: "#141003", type: "dedicated", url: "https://example.com/yokohama" },
        { name: "川崎市", code: "#141305", type: "dedicated", url: "https://example.com/kawasaki" },
        { name: "相模原市", code: "#141500", type: "general",  url: "https://example.com/sagamihara" },
      ],
    },
    {
      name: "埼玉県",
      municipalities: [
        { name: "さいたま市", code: "#111007", type: "dedicated", url: "https://example.com/saitama" },
        { name: "川越市", code: "#112011", type: "general",   url: "https://example.com/kawagoe" },
      ],
    },
  ],
  // 他のエリアも同様の構造で追加
};
```

---

## 検索ロジック仕様

```tsx
function filterMunicipalities(
  data: Record<string, Prefecture[]>,
  activeArea: string,
  query: string
): Prefecture[] {
  // 1. エリアでフィルタ
  const prefectures = data[activeArea] || [];

  // 2. 検索クエリが空ならそのまま返す
  if (!query.trim()) return prefectures;

  // 3. 都道府県名 or 自治体名で部分一致フィルタ
  const normalized = query.trim().toLowerCase();
  return prefectures
    .map((pref) => {
      // 都道府県名がマッチしたら全自治体を返す
      if (pref.name.toLowerCase().includes(normalized)) return pref;
      // 自治体名でフィルタ
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

---

## 状態管理まとめ

```tsx
// ページのメイン状態
const [searchQuery, setSearchQuery] = useState("");
const [activeArea, setActiveArea] = useState("tohoku-hokkaido");
const [recentMunicipalities, setRecentMunicipalities] = useState<string[]>([]);

// フィルタ済みデータ（useMemoで最適化）
const filteredPrefectures = useMemo(
  () => filterMunicipalities(SAMPLE_DATA, activeArea, searchQuery),
  [activeArea, searchQuery]
);
```

---

## レスポンシブブレークポイント

| 画面幅 | 対応 |
|---|---|
| `< 640px` (sm未満) | エリアタブ横スクロール、ラベル非表示（アイコンのみ）、CTA=フルワイドバー |
| `640px - 767px` (sm) | ラベル表示、CTA=フルワイドバー |
| `768px+` (md) | エリアタブ折り返し、フッター3カラム、CTA=右下フローティング |

---

## 使用するLucide Reactアイコン一覧

```tsx
import {
  Search,
  X,
  Clock,
  History,
  MapPin,
  FileCheck,
  FileText,
  ExternalLink,
  Phone,
  Menu,
  ChevronDown, // AccordionTrigger用
} from "lucide-react";
```

---

## 使用するshadcn/uiコンポーネント

- `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- `Badge`（必要に応じて）
- `Input`（検索バーをshadcn Inputに置換してもよい）

---

## アクセシビリティ要件

1. 検索バーに `aria-label="自治体検索"` を付与
2. エリアタブは `role="tablist"` + 各ボタンに `role="tab"` + `aria-selected`
3. 外部リンクには `target="_blank" rel="noopener noreferrer"` を付与
4. フローティングCTAには `aria-label="無料相談・お見積りのお問い合わせ"` を付与
5. スクリーンリーダー用テキストには `sr-only` クラスを使用
6. タッチターゲットは最小44px (`min-h-[44px]`)

---

## パフォーマンス要件

1. アコーディオンの中身は展開時のみレンダリング（shadcn AccordionContentのデフォルト動作）
2. 検索フィルタリングは `useMemo` で最適化
3. スクロールイベントは `{ passive: true }` を付与
4. 画像は使用しない（アイコンのみ）ため、LCPは問題なし
