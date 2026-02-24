"use client"

import { X, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface GameLauncherProps {
  url: string
  gameName: string
  onClose: () => void
}

export function GameLauncher({ url, gameName, onClose }: GameLauncherProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <h2 className="truncate text-sm font-semibold text-foreground">
          {gameName}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            aria-label="Close game"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Game iframe */}
      <div className="flex-1">
        <iframe
          src={url}
          title={gameName}
          className="h-full w-full border-0"
          allow="autoplay; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </div>
  )
}
