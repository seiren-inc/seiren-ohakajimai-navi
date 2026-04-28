import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterOption {
  label: string
  value: string
}

interface DashboardFiltersBarProps {
  basePath: string
  currentRange?: string
  options?: FilterOption[]
}

const defaultOptions: FilterOption[] = [
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
]

export function DashboardFiltersBar({
  basePath,
  currentRange = "30d",
  options = defaultOptions,
}: DashboardFiltersBarProps) {
  return (
    <div className="rounded-lg border border-[hsl(var(--ds-color-border-default,var(--border)))] bg-[hsl(var(--ds-filter-bg,var(--card)))] p-2">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
          <span className="shrink-0 px-2 text-xs font-medium text-[hsl(var(--ds-color-text-muted,var(--muted-foreground)))]">
            Time Range
          </span>
          {options.map((option) => {
            const isActive = option.value === currentRange
            return (
              <Button
                key={option.value}
                asChild
                size="sm"
                variant={isActive ? "default" : "outline"}
                className={cn("h-8 shrink-0 px-3 text-xs", !isActive && "bg-transparent")}
              >
                <Link
                  href={`${basePath}?range=${option.value}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {option.label}
                </Link>
              </Button>
            )
          })}
        </div>
        <Button asChild size="sm" variant="ghost" className="h-8 shrink-0 px-3 text-xs">
          <Link href={basePath}>Reset</Link>
        </Button>
      </div>
    </div>
  )
}
