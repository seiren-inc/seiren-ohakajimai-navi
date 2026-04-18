import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "お墓じまいナビ｜改葬・墓じまい・海洋散骨",
    short_name: "お墓じまいナビ",
    description:
      "お墓じまい・改葬・海洋散骨の専門サイト。全国対応・お見積り無料。改葬手続きの案内から墓石撤去工事まで株式会社清蓮がワンストップでサポート。",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#059669",
    lang: "ja",
    categories: ["business", "lifestyle"],
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/og-image.jpg",
        sizes: "1200x630",
        type: "image/jpeg",
      },
    ],
  }
}
