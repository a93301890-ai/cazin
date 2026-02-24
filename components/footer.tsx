import { Crown } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-gold" />
            <span className="font-[var(--font-playfair)] text-lg font-bold text-foreground">
              Royal Fortune
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/games" className="text-sm text-muted-foreground transition-colors hover:text-gold">
              Игры
            </Link>
            <a href="#slots" className="text-sm text-muted-foreground transition-colors hover:text-gold">
              Слоты
            </a>
            <a href="#betting" className="text-sm text-muted-foreground transition-colors hover:text-gold">
              Ставки
            </a>
            <a href="#about" className="text-sm text-muted-foreground transition-colors hover:text-gold">
              О нас
            </a>
          </nav>

          <p className="text-sm text-muted-foreground">
            {"Royal Fortune \u00A9 2026"}
          </p>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Играйте ответственно. Азартные игры могут вызывать зависимость. 18+
          </p>
        </div>
      </div>
    </footer>
  )
}
