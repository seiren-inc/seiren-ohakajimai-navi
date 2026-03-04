import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * 管理者IPアドレス制限チェック（Stripeセキュリティ要件: Section 1-1）
 * ADMIN_ALLOWED_IPS が未設定の場合は制限なし（開発環境向け）
 */
function isAllowedAdminIp(request: NextRequest): boolean {
    const allowedIpsEnv = process.env.ADMIN_ALLOWED_IPS;
    if (!allowedIpsEnv || allowedIpsEnv.trim() === "") {
        // 未設定時はIP制限を適用しない（開発環境）
        return true;
    }
    const allowedIps = allowedIpsEnv.split(",").map((ip) => ip.trim());
    const clientIp =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        "";
    return allowedIps.includes(clientIp);
}

/**
 * ファイルアップロード拒否（Stripeセキュリティ要件: Section 2-2）
 * 管理画面へのmultipart/form-dataによるPOSTリクエストをブロック
 */
function isFileUploadRequest(request: NextRequest): boolean {
    if (request.method !== "POST" && request.method !== "PUT") return false;
    const contentType = request.headers.get("content-type") ?? "";
    return contentType.startsWith("multipart/form-data");
}

export async function middleware(request: NextRequest) {
    const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

    // --- Section 2-2: ファイルアップロード拒否 ---
    if (isAdminRoute && isFileUploadRequest(request)) {
        return new NextResponse("File upload is not allowed.", { status: 403 });
    }

    // --- Section 1-1: IPアドレス制限 ---
    if (isAdminRoute && !isAllowedAdminIp(request)) {
        return new NextResponse("Access denied.", { status: 403 });
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Fail gracefully in local dev if no Supabase URL is set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return response;
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protect /admin routes
    if (isAdminRoute) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // --- Section 1-2: MFA（AAL2）強制 ---
        // Supabase の authenticator_assurance_level が aal1 の場合は MFA 未完了
        // aal2 = TOTP等で確認済み。未完了ユーザーは /admin/mfa-required にリダイレクト
        const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (
            aalData &&
            aalData.nextLevel === "aal2" &&
            aalData.nextLevel !== aalData.currentLevel &&
            !request.nextUrl.pathname.startsWith("/admin/mfa-required")
        ) {
            return NextResponse.redirect(new URL("/admin/mfa-required", request.url));
        }
    }

    // Redirect /login to /admin if already logged in
    if (request.nextUrl.pathname === "/login") {
        if (user) {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

