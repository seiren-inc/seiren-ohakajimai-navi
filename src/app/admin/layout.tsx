import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    AppWindow,
    LayoutDashboard,
    Settings,
    LogOut,
    MessageSquare,
    Building2
} from "lucide-react"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Check AdminUser table
    const adminUser = await prisma.adminUser.findUnique({
        where: {
            supabaseUserId: user.id,
            isActive: true, // Must be active
        },
    })

    // If not admin/operator, deny access
    if (!adminUser) {
        redirect("/")
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-50 flex-shrink-0 hidden md:block">
                <div className="p-6">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <AppWindow className="h-6 w-6" />
                        <span>管理画面</span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">お墓じまいナビ</p>
                </div>
                <nav className="px-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800" asChild>
                        <Link href="/admin/inquiries">
                            <MessageSquare className="mr-2 h-4 w-4" /> 問い合わせ一覧
                        </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800" asChild>
                        <Link href="/admin/municipalities">
                            <Building2 className="mr-2 h-4 w-4" /> 自治体データ管理
                        </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800" asChild>
                        <Link href="#">
                            <Settings className="mr-2 h-4 w-4" /> 設定 (TBD)
                        </Link>
                    </Button>
                </nav>
                <div className="absolute bottom-4 left-4 right-4">
                    {/* Logout handled via client side usually, using a form action here for simplicity or just a link to Logout page if existed */}
                    <form action="/auth/signout" method="post">
                        <Button variant="outline" className="w-full bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white">
                            <LogOut className="mr-2 h-4 w-4" /> ログアウト
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-slate-50 overflow-y-auto">
                <header className="h-16 bg-white border-b flex items-center justify-between px-6 md:hidden">
                    <h1 className="font-bold">管理画面</h1>
                    {/* Mobile menu could go here */}
                </header>
                <div className="p-6 md:p-10">
                    {children}
                </div>
            </main>
        </div>
    )
}
