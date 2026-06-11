import { NextResponse } from "next/server"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ohakajimai-navi.jp"

// RFC 9727 (api-catalog) — エージェント/開発者向けにAPIの存在と仕様書の所在を公示する。
// 中身は RFC 9264 linkset 形式。仕様書本体は public/.well-known/openapi.json。
export const dynamic = "force-static"

export function GET(): NextResponse {
    const linkset = {
        linkset: [
            {
                anchor: `${BASE_URL}/api/v1/municipalities`,
                "service-desc": [
                    {
                        href: `${BASE_URL}/.well-known/openapi.json`,
                        type: "application/openapi+json",
                    },
                ],
                "service-doc": [
                    {
                        href: `${BASE_URL}/contact`,
                        type: "text/html",
                        title: "APIキーの発行・利用相談はお問い合わせフォームから",
                    },
                ],
            },
        ],
    }

    return NextResponse.json(linkset, {
        headers: {
            "Content-Type": "application/linkset+json",
            "Cache-Control": "public, max-age=86400",
        },
    })
}
