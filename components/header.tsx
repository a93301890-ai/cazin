"use client"

import { Crown, Wallet, LogOut, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface HeaderProps {
  onLoginClick: () => void
  onRegisterClick: () => void
}

export function Header({ onLoginClick, onRegisterClick }: HeaderProps) {
  const { data, mutate } = useSWR("/api/user/me", fetcher)
  const user = data?.user

  const handleLogout = async () => {
    await fetch("/api/user/logout", { method: "POST" })
    mutate()
    window.location.reload()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <Crown className="h-7 w-7 text-gold" />
          <span className="font-[var(--font-playfair)] text-xl font-bold tracking-wide text-foreground">
            Royal Fortune
          </span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/games" className="flex items-center gap-1.5 text-sm font-medium text-gold transition-colors hover:text-gold-light">
            <Gamepad2 className="h-4 w-4" />
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

        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/5 px-3 py-1.5">
              <Wallet className="h-4 w-4 text-gold" />
              <span className="text-sm font-semibold text-gold">
                ${user.balance.toFixed(2)}
              </span>
            </div>
            <span className="hidden text-sm font-medium text-foreground sm:block">
              {user.username}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              aria-label="Выйти"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onLoginClick}
              className="text-foreground hover:text-gold hover:bg-gold/10"
            >
              Войти
            </Button>
            <Button
              onClick={onRegisterClick}
              className="bg-gold text-background font-semibold hover:bg-gold-light"
            >
              Регистрация
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
