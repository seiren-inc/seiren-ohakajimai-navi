import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav 
      aria-label="パンくずリスト" 
      className={`flex py-4 px-4 md:px-6 max-w-7xl mx-auto overflow-x-auto whitespace-nowrap scrollbar-hide ${className}`}
    >
      <ol className="flex items-center text-xs md:text-sm text-neutral-500">
        <li className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center hover:text-emerald-700 transition-colors"
          >
            <Home className="h-3.5 w-3.5 mr-1" />
            <span>ホーム</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <ChevronRight className="h-3.5 w-3.5 mx-2 text-neutral-300 shrink-0" />
            {index === items.length - 1 ? (
              <span className="font-medium text-neutral-900 truncate max-w-[200px]" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link 
                href={item.href} 
                className="hover:text-emerald-700 transition-colors"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
