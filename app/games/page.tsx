"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { Search, Gamepad2, Crown, Wallet, LogOut, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GameCard } from "@/components/game-card"
import { GameLauncher } from "@/components/game-launcher"
import { AuthModal } from "@/components/auth-modal"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Game {
  id: string
  name: string
  img?: string
  type?: string
  provider?: string
  category?: string
}

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<string>("all")
  const [launchingGameId, setLaunchingGameId] = useState<string | null>(null)
  const [activeGame, setActiveGame] = useState<{ url: string; name: string } | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState<"login" | "register">("login")

  const { data: gamesData, isLoading: gamesLoading } = useSWR("/api/games/list", fetcher)
  const { data: userData, mutate: mutateUser } = useSWR("/api/user/me", fetcher)

  const user = userData?.user
  const games: Game[] = gamesData?.games || []

  // Get unique providers
  const providers = useMemo(() => {
    const providerSet = new Set<string>()
    games.forEach((game) => {
      if (game.provider) providerSet.add(game.provider)
    })
    return Array.from(providerSet).sort()
  }, [games])

  // Filter games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch =
        !searchQuery ||
        game.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.provider?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesProvider =
        selectedProvider === "all" || game.provider === selectedProvider
      return matchesSearch && matchesProvider
    })
  }, [games, searchQuery, selectedProvider])

  const handlePlay = async (gameId: string, demo: boolean) => {
    if (!user && !demo) {
      setAuthTab("login")
      setAuthOpen(true)
      return
    }

    setLaunchingGameId(gameId)
    try {
      const response = await fetch("/api/games/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, demo }),
      })

      const data = await response.json()

      if (data.url) {
        const gameName = games.find((g) => g.id === gameId)?.name || "Game"
        const url = typeof data.url === "string" ? data.url : String(data.url)
        setActiveGame({ url, name: gameName })
      } else if (data.error) {
        alert(data.error)
      }
    } catch (err) {
      console.error("Failed to launch game:", err)
      alert("Failed to launch game. Please try again.")
    } finally {
      setLaunchingGameId(null)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/user/logout", { method: "POST" })
    mutateUser()
  }

  // If a game is active, show the launcher fullscreen
  if (activeGame) {
    return (
      <GameLauncher
        url={activeGame.url}
        gameName={activeGame.name}
        onClose={() => {
          setActiveGame(null)
          mutateUser() // Refresh balance after game
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Назад</span>
            </Link>
            <div className="flex items-center gap-2">
              <Crown className="h-7 w-7 text-gold" />
              <span className="font-[var(--font-playfair)] text-xl font-bold tracking-wide text-foreground">
                Игры
              </span>
            </div>
          </div>

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
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setAuthTab("login")
                  setAuthOpen(true)
                }}
                className="text-foreground hover:text-gold hover:bg-gold/10"
              >
                Войти
              </Button>
              <Button
                onClick={() => {
                  setAuthTab("register")
                  setAuthOpen(true)
                }}
                className="bg-gold text-background font-semibold hover:bg-gold-light"
              >
                Регистрация
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Search and filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск игр..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border focus:border-gold"
            />
          </div>
          {providers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedProvider === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedProvider("all")}
                className={
                  selectedProvider === "all"
                    ? "bg-gold text-background hover:bg-gold-light"
                    : "border-border text-muted-foreground hover:text-gold hover:border-gold/30"
                }
              >
                Все
              </Button>
              {providers.map((provider) => (
                <Button
                  key={provider}
                  variant={selectedProvider === provider ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedProvider(provider)}
                  className={
                    selectedProvider === provider
                      ? "bg-gold text-background hover:bg-gold-light"
                      : "border-border text-muted-foreground hover:text-gold hover:border-gold/30"
                  }
                >
                  {provider}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Games grid */}
        {gamesLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
            <p className="mt-4 text-sm text-muted-foreground">Загрузка игр...</p>
          </div>
        ) : filteredGames.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {filteredGames.length} {filteredGames.length === 1 ? "игра" : "игр"}
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPlay={handlePlay}
                  isLoading={launchingGameId === game.id}
                />
              ))}
            </div>
          </>
        ) : gamesData?.error ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Gamepad2 className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-sm text-destructive">
              Ошибка загрузки: {gamesData.error}
            </p>
            {gamesData.details && (
              <p className="mt-2 max-w-md text-center text-xs text-muted-foreground">
                {gamesData.details}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <Gamepad2 className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-sm text-muted-foreground">
              {searchQuery ? "Игры не найдены" : "Нет доступных игр"}
            </p>
          </div>
        )}
      </main>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
    </div>
  )
}
