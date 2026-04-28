import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Trend = "up" | "down" | "flat"
type Tone = "default" | "success" | "warning" | "danger"

interface KpiCardProps {
  title: string
  value: string
  deltaLabel?: string
  subtitle?: string
  trend?: Trend
  tone?: Tone
  loading?: boolean
}

const toneClassMap: Record<Tone, string> = {
  default: "text-[hsl(var(--ds-color-accent-primary,var(--primary)))]",
  success: "text-[hsl(var(--ds-kpi-positive))]",
  warning: "text-[hsl(var(--ds-kpi-warning))]",
  danger: "text-[hsl(var(--ds-kpi-negative))]",
}

const trendIconMap: Record<Trend, typeof ArrowUpRight> = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
}

export function KpiCard({
  title,
  value,
  deltaLabel,
  subtitle,
  trend = "flat",
  tone = "default",
  loading = false,
}: KpiCardProps) {
  if (loading) {
    return (
      <Card className="border-[hsl(var(--ds-kpi-card-border,var(--border)))] bg-[hsl(var(--ds-kpi-card-bg,var(--card)))]">
        <CardContent className="space-y-2 py-5">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-7 w-28 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  const TrendIcon = trendIconMap[trend]

  return (
    <Card className="border-[hsl(var(--ds-kpi-card-border,var(--border)))] bg-[hsl(var(--ds-kpi-card-bg,var(--card)))]">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--ds-kpi-title,var(--muted-foreground)))]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-3">
          <p className="text-[length:var(--ds-text-kpi)] font-semibold leading-tight text-[hsl(var(--ds-kpi-value,var(--foreground)))]">
            {value}
          </p>
          {deltaLabel ? (
            <p className={cn("inline-flex items-center gap-1 text-xs font-medium", toneClassMap[tone])}>
              <TrendIcon className="h-3.5 w-3.5" />
              {deltaLabel}
            </p>
          ) : null}
        </div>
        {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
      </CardContent>
    </Card>
  )
}
