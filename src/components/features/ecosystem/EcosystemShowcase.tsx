"use client"

import React from "react"
import {
  Waves,
  Heart,
  Handshake,
  MapPin,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react"
import {
  ECOSYSTEM_SHOWCASE_CARDS,
  SEIREN_CORPORATE_SITE_HREF,
} from "@/config/seiren-ecosystem"

const ICON_AND_COLOR: Record<
  (typeof ECOSYSTEM_SHOWCASE_CARDS)[number]["id"],
  { icon: LucideIcon; color: string }
> = {
  cruise: {
    icon: Waves,
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  "ikotsu-lab": {
    icon: Heart,
    color: "bg-rose-50 text-rose-600 border-rose-100",
  },
  "ohaka-navi": {
    icon: MapPin,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  "ikotsu-com": {
    icon: Handshake,
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
}

export function EcosystemShowcase() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
            清蓮グループのトータルサポート
          </h2>
          <p className="mt-4 text-neutral-500 max-w-2xl mx-auto">
            お墓じまいから、その後の供養まで。専門知識を持ったスタッフが、
            グループ全体であなたのご家族を支えます。
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ECOSYSTEM_SHOWCASE_CARDS.map((service) => {
            const meta = ICON_AND_COLOR[service.id]
            const Icon = meta.icon
            return (
            <a
              key={service.id}
              href={service.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col rounded-[2rem] border border-neutral-100 bg-white p-8 transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5"
            >
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border ${meta.color}`}>
                <Icon className="h-7 w-7" />
              </div>

              <h3 className="text-lg font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors">
                {service.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-neutral-500 flex-1">
                {service.description}
              </p>

              <div className="mt-6 flex items-center text-xs font-semibold text-emerald-600">
                公式サイトを見る
                <ArrowUpRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>
            )
          })}
        </div>

        {/* Corporate Link */}
        <div className="mt-12 text-center">
          <a
            href={SEIREN_CORPORATE_SITE_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            運営元：株式会社清蓮（コーポレートサイト）
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  )
}
