import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-primary">お墓じまいナビ</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/flow" className="transition-colors hover:text-foreground/80 text-foreground/60">流れ</Link>
                    <Link href="/price" className="transition-colors hover:text-foreground/80 text-foreground/60">料金</Link>
                    <Link href="/kaissou" className="transition-colors hover:text-foreground/80 text-foreground/60">対応地域</Link>
                    <Link href="/kaisoukyoka" className="transition-colors hover:text-foreground/80 text-foreground/60">申請書DL</Link>
                </nav>

                <div className="flex items-center gap-3">
                    <a href="tel:0120-000-000" className="hidden lg:flex items-center gap-1.5 text-sm font-bold text-foreground/80 hover:text-primary transition-colors">
                        <Phone className="h-4 w-4" />
                        0120-000-000
                    </a>
                    <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90 text-sm" asChild>
                        <Link href="/contact">無料相談・お見積り</Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}
