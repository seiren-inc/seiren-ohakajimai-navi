import { Metadata } from "next"

export const metadata: Metadata = {
    title: "ログイン | お墓じまいナビ 管理画面",
    robots: {
        index: false,
        follow: false,
    },
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
