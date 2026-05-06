import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  title: string
  description?: string
  actions?: ReactNode
  filters?: ReactNode
  className?: string
  children: ReactNode
}

export function DashboardLayout({
  title,
  description,
  actions,
  filters,
  className,
  children,
}: DashboardLayoutProps) {
  return (
    <section className={cn("flex-1 p-3 sm:p-4 md:p-6 xl:p-8", className)}>
      <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
        <header className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="dashboard-heading font-bold text-[hsl(var(--ds-color-text-primary,var(--foreground)))]">
                {title}
              </h1>
              {description ? (
                <p className="mt-1 text-sm text-[hsl(var(--ds-color-text-muted,var(--muted-foreground)))]">
                  {description}
                </p>
              ) : null}
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
          </div>
          {filters}
        </header>
        {children}
      </div>
    </section>
  )
}
