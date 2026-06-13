import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.googletagmanager.com https://www.clarity.ms https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https: https://*.google-analytics.com https://*.googletagmanager.com;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    frame-src https://challenges.cloudflare.com;
    connect-src 'self' https://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.clarity.ms https://challenges.cloudflare.com;
`;

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  },
  {
    key: 'Content-Security-Policy',
    value: cspHeader.replace(/\n/g, '')
  }
];

const nextConfig: NextConfig = {
  eslint: {
    // ビルド時のESLintチェックを無効化（CIで別途実行）
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ビルド時の型チェックを無効化（CIで別途実行）
    ignoreBuildErrors: true,
  },
  // ─── 画像最適化設定 ───────────────────────────────────────────
  images: {
    // AVIF優先、フォールバックとしてWebPを使用（LCP改善）
    formats: ['image/avif', 'image/webp'],
    // 最適化済み画像の最小キャッシュ期間：30日
    minimumCacheTTL: 2592000,
  },
  // ─── バンドル最適化 ────────────────────────────────────────────
  experimental: {
    // lucide-react の tree-shaking を強化し、未使用アイコンをバンドルから除外
    optimizePackageImports: ['lucide-react'],
    // 約1,300ページの一括プリレンダリング中、Supabase pooler への接続が
    // 瞬断するとビルド全体が落ちるため、ページ単位で再試行する
    staticGenerationRetryCount: 3,
    // Vercel ビルドは高コア数のためワーカー数 × Prisma プールが膨らみ、
    // Supabase pooler の上限 (EMAXCONN limit: 200) を食い潰してビルドが落ちる。
    // ワーカー数を絞り(minPagesPerWorker↑)、ワーカー内の同時生成も絞る。
    staticGenerationMaxConcurrency: 2,
    staticGenerationMinPagesPerWorker: 500,
  },
  // ─── Vercelビルドのクラッシュ回避 ────────────────────────────────
  // 2026-06-10 以降、Vercel ビルドイメージの Node 22.22.2 で webpack の
  // WASM ハッシュ (xxhash64) が `WasmHash._updateWithBuffer ... reading 'length'`
  // でクラッシュしビルド全滅。WASM 非依存の sha256 に切り替えて回避する。
  // ローカル(22.22.1)では再現しないが、環境差をなくすため無条件に適用。
  webpack: (config) => {
    config.output.hashFunction = 'sha256'
    return config
  },
  // ─── HTTPSリダイレクト（二重防御） ──────────────────────────────
  // Vercel は HTTP→HTTPS を自動処理するが、アプリ層でも明示的に対応する
  async redirects() {
    // 旧・行政書士エントリーページ → セルフサーブ登録へ恒久リダイレクト
    // （ページ内 redirect() の 307 だと Google が URL を統合せず GSC に残り続ける）
    const permanentRoutes = [
      {
        source: '/gyoseishoshi/entry',
        destination: '/scrivener/signup',
        permanent: true,
      },
    ]
    return process.env.NODE_ENV === 'production'
      ? [
          ...permanentRoutes,
          {
            source: '/:path*',
            has: [{ type: 'header' as const, key: 'x-forwarded-proto', value: 'http' }],
            destination: 'https://www.ohakajimai-navi.jp/:path*',
            permanent: true,
          },
        ]
      : permanentRoutes
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // RFC 8288 Link ヘッダー — エージェントに API カタログ（RFC 9727）の所在を公示
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: '</.well-known/api-catalog>; rel="api-catalog"',
          },
        ],
      },
      // 静的アセット（画像・フォント・JS/CSS）に長期キャッシュを設定
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
