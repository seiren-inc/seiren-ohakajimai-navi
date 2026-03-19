import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.googletagmanager.com https://www.clarity.ms;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https: https://*.google-analytics.com https://*.googletagmanager.com;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    connect-src 'self' https://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.clarity.ms;
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
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
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
