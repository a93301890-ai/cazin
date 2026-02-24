"use client"

import { Play, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GameCardProps {
  game: {
    id: string
    name: string
    img?: string
    type?: string
    provider?: string
  }
  onPlay: (gameId: string, demo: boolean) => void
  isLoading?: boolean
}

export function GameCard({ game, onPlay, isLoading }: GameCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
        {game.img ? (
          <img
            src={game.img}
            alt={game.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Gamepad2 className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/80 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <Button
            size="sm"
            onClick={() => onPlay(game.id, false)}
            disabled={isLoading}
            className="bg-gold text-background font-semibold hover:bg-gold-light"
          >
            <Play className="mr-1 h-3.5 w-3.5" />
            Играть
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPlay(game.id, true)}
            disabled={isLoading}
            className="border-gold/30 text-foreground hover:bg-gold/10 hover:text-gold"
          >
            Демо
          </Button>
        </div>
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-semibold text-foreground">
          {game.name}
        </h3>
        {game.provider && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {game.provider}
          </p>
        )}
      </div>
    </div>
  )
}
