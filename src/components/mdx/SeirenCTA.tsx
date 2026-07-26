import Link from "next/link"
import { ChevronRight } from "lucide-react"

type SeirenCTAProps = {
  heading?: string
}

export function SeirenCTA({
  heading = "お墓じまい・改葬で迷ったら清蓮へご相談ください",
}: SeirenCTAProps) {
  return (
    <div className="my-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
        無料相談受付中
      </p>
      <h3 className="mt-2 text-lg font-bold text-neutral-900 md:text-xl">{heading}</h3>
      <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-neutral-700">
        お墓じまいは、改葬許可申請だけでなく、墓地管理者との確認、墓石撤去、閉眼供養、遺骨の取り出し、粉骨・洗骨、次の納骨先選びまで関係します。
        清蓮では、お墓じまい全体の流れを整理し、ご状況に合わせて必要な手続きや供養先をご案内します。
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-seiren-cta px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-seiren-cta-hover"
        >
          清蓮にお墓じまいを無料相談する
          <ChevronRight className="h-4 w-4" />
        </Link>
        <Link
          href="/gyoseishoshi"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          書類・手続きは行政書士に相談する
        </Link>
      </div>
      <p className="mt-3 text-xs text-neutral-500">
        見積もり・相談は無料。強引な勧誘は行いません。
      </p>
    </div>
  )
}
