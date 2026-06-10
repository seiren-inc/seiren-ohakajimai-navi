import { constructMetadata } from "@/lib/seo"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export const metadata = constructMetadata({
    title: "決済完了｜お墓じまいナビ",
    description: "決済が正常に完了しました。",
    noIndex: true,
})

export default function ScrivenerCheckoutSuccessPage() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-100 space-y-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    お申し込み完了
                </h1>
                
                <p className="text-sm text-slate-600">
                    決済手続きが正常に完了しました。現在、運営事務局にて登録内容と資格の確認（審査）を行っております。
                    審査完了し次第、サイトへ掲載されますので今しばらくお待ちください。
                </p>
                
                <div className="pt-4">
                    <Button asChild className="w-full">
                        <Link href="/scrivener/dashboard">
                            マイページへ移動する
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
