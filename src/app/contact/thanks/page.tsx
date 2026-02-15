import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { constructMetadata } from "@/lib/seo"

export const metadata = constructMetadata({
    title: "送信完了",
    noIndex: true, // Do not index thank you page
})

export default function ThanksPage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-theme(spacing.16))] items-center justify-center p-4 text-center bg-slate-50">
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border max-w-lg w-full">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle2 className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold mb-4">お問い合わせを受け付けました</h1>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                    この度は「お墓じまいナビ」にお問い合わせいただき、<br />誠にありがとうございます。<br /><br />
                    ご入力いただいたメールアドレス宛に、<br />自動返信メールをお送りしました。<br /><br />
                    担当者が内容を確認の上、<br />2営業日以内にご連絡させていただきます。
                </p>
                <div className="space-y-4">
                    <Button asChild className="w-full">
                        <Link href="/">トップページへ戻る</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
