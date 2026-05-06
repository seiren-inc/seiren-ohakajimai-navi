import { AlertTriangle, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardStateProps {
  mode: "loading" | "empty" | "error"
  message: string
  actionLabel?: string
  actionHref?: string
}

export function DashboardState({
  mode,
  message,
  actionLabel,
  actionHref,
}: DashboardStateProps) {
  if (mode === "loading") {
    return <div className="h-40 animate-pulse rounded-md border bg-muted/30" />
  }

  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-md border border-dashed text-center">
      {mode === "error" ? (
        <AlertTriangle className="h-5 w-5 text-destructive" />
      ) : (
        <Inbox className="h-5 w-5 text-muted-foreground" />
      )}
      <p className="text-sm text-muted-foreground">{message}</p>
      {actionLabel && actionHref ? (
        <Button asChild size="sm" variant="outline">
          <a href={actionHref}>{actionLabel}</a>
        </Button>
      ) : null}
    </div>
  )
}
