# CODEX.md — seiren-ohakajimai-navi（事業エージェント向け文脈）

> 最終更新: 2026-03-19 | グループ: A（清蓮 / Seiren）

---

## Project Goal（事業の目的）

**「お墓じまい・改葬の不安と面倒を、デジタルで完全に解消する」**

お墓を継ぐ人がいない、遠方のお墓を管理できない、費用や手続きが分からないといった
現代日本特有の「お墓問題」を抱える家族に対して、比較検索・専門家への相談・
改葬手続きのサポートまでを一気通貫で提供する情報プラットフォーム。

ターゲット: 主に40〜70代の「子供世代（実際の手続き担当）」と「親世代（意思決定者）」
エリア: 横浜市・川崎市・鎌倉市・藤沢市・湘南エリア・熱海市を最優先

---

## Brand Identity（ブランドアイデンティティ）

**「寄り添いと格調」**

- 死・墓・改葬というデリケートなテーマを、重苦しくなく、かといって軽くない誠実さで表現
- 水色（清潔・清蓮）/ ピンク（温かみ・蓮）/ 黄緑（再生・緑）の3色で「新しい始まり」を演出
- 和のフォント＋余白の美で、家族に「信頼できる専門家」という印象を与える

---

## 技術アーキテクチャ概要

- フルスタック Next.js（App Router、Server Actions）
- Supabase（Auth + PostgreSQL via Prisma）でデータとセッションを管理
- microCMS/MDX でブログ・コラム記事を管理
- Stripe で「専門家紹介・相談サービス」の決済を処理
- Vercel にデプロイ（Edge Functions + ISR + PPR）

---

## 現在の進捗と次タスク

**完了済み（推定）**
- トップページ・お墓じまい解説ページのUI構築
- 墓地検索機能（Prisma + Supabase）
- お問い合わせフォーム（react-hook-form + Resend）
- SEO設定（Sitemap・OGP・JSON-LD）

**次タスクの候補**
- PPR（Partial Prerendering）有効化によるLCP改善
- LocalBusiness / FAQPage JSON-LD の高度化
- 専門家マッチング機能の開発
- Stripe決済フローの本番化

---

## AEO（AI回答エンジン最適化）ルール

### 清蓮必須 JSON-LD スキーマ

```tsx
// LocalBusiness（全ページ共通）
const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "清蓮 お墓じまいナビ",
  "description": "横浜・湘南エリアのお墓じまい・改葬・永代供養の比較・相談サービス",
  "url": "https://seiren-ohakajimai-navi.jp",
  "telephone": "連絡先",
  "areaServed": [
    { "@type": "City", "name": "横浜市" },
    { "@type": "City", "name": "鎌倉市" },
    { "@type": "City", "name": "熱海市" },
    { "@type": "AdministrativeArea", "name": "湘南" },
  ],
}

// FAQPage（よくある質問ページに必須）
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "お墓じまいの費用はいくらかかりますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "お墓じまいの費用は墓石の撤去・処分、改葬許可申請、閉眼供養等を合わせて平均20〜50万円が目安です。",
      },
    },
  ],
}

// Service（サービスページごと）
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "お墓じまい相談・代行",
  "provider": { "@type": "LocalBusiness", "name": "清蓮 お墓じまいナビ" },
  "areaServed": "神奈川県・静岡県（熱海市）",
}
```

---

## プライバシー・個人情報取り扱いルール

### AI生成コンテンツのルール
- **禁止**: 実在しない人物・企業・事例を生成して掲載すること
- **禁止**: 個人の氏名・住所・墓地情報を学習データに含めること
- **必須**: AI生成コンテンツには「AI作成補助コンテンツ」と明示する
- **必須**: 法的判断（相続・改葬許可等）をAIが断定することは禁止。「専門家にご相談ください」を付記する

### 個人情報取り扱い
- フォームで取得した氏名・連絡先・墓地情報は Supabase に暗号化保存
- 第三者への情報提供（専門家マッチング）は明示的な同意取得後のみ
- アクセスログ保持期間: 90日
- Cloudflare Turnstile をフォームに必ず実装（reCAPTCHA 代替）

---

## PPR & Edge 設定

```ts
// next.config.ts
experimental: { ppr: true }
// 静的シェル（ヘッダー・フッター）を即時配信し、動的データ（検索結果・推薦）を Suspense でストリーミング
```
