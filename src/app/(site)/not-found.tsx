import Link from "next/link"
import { constructMetadata } from "@/lib/seo"

export const metadata = constructMetadata({
  title: "ページが見つかりません（404）｜お墓じまいナビ",
  description: "お探しのページは見つかりませんでした。URLの確認、またはトップページからお探しの情報をご確認ください。",
  noIndex: true,
})

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">404</p>
      <h1 className="mt-4 text-2xl font-bold text-neutral-900 md:text-3xl">
        ページが見つかりません
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
        お探しのページは移動・削除された可能性があります。
        URLをご確認いただくか、下記のリンクからお探しの情報にアクセスしてください。
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          トップページへ
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          お問い合わせ
        </Link>
      </div>
      <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-neutral-500">
        <Link href="/about" className="hover:text-emerald-700 hover:underline">お墓じまいとは</Link>
        <Link href="/flow" className="hover:text-emerald-700 hover:underline">ご依頼の流れ</Link>
        <Link href="/price" className="hover:text-emerald-700 hover:underline">料金</Link>
        <Link href="/kaissou" className="hover:text-emerald-700 hover:underline">改葬手続き情報</Link>
        <Link href="/gyoseishoshi" className="hover:text-emerald-700 hover:underline">行政書士紹介</Link>
      </div>
    </div>
  )
}
