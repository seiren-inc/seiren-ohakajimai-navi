import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-primary">お墓じまいナビ</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">お墓じまいとは</Link>
                    <Link href="/flow" className="transition-colors hover:text-foreground/80 text-foreground/60">流れ</Link>
                    <Link href="/price" className="transition-colors hover:text-foreground/80 text-foreground/60">料金</Link>
                    <Link href="/kaissou" className="transition-colors hover:text-foreground/80 text-foreground/60">対応地域</Link>
                    <Link href="/company" className="transition-colors hover:text-foreground/80 text-foreground/60">会社概要</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Button variant="default" className="hidden md:inline-flex bg-accent text-accent-foreground hover:bg-accent/90">
                        無料相談・お見積り
                    </Button>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
