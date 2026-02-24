"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Trophy, Gamepad2 } from "lucide-react"

interface HeroSectionProps {
  onRegisterClick: () => void
}

export function HeroSection({ onRegisterClick }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/casino-hero.jpg"
          alt="Casino interior with golden ambiance"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 pt-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2">
          <Sparkles className="h-4 w-4 text-gold" />
          <span className="text-sm font-medium text-gold">Premium Casino Experience</span>
        </div>

        <h1 className="mb-6 font-[var(--font-playfair)] text-5xl font-bold leading-tight text-foreground md:text-7xl">
          <span className="text-balance">
            {"Играй и "}
            <span className="text-gold">выигрывай</span>
            {" по-крупному"}
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Лучшие слот-автоматы и спортивные ставки в одном месте.
          Присоединяйся к Royal Fortune и получи бонус на первый депозит.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            onClick={onRegisterClick}
            className="gap-2 bg-gold px-8 py-6 text-lg font-semibold text-background hover:bg-gold-light"
          >
            <Trophy className="h-5 w-5" />
            Начать играть
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-gold/30 px-8 py-6 text-lg text-foreground hover:border-gold hover:bg-gold/10 hover:text-gold"
            asChild
          >
            <Link href="/games">
              <Gamepad2 className="h-5 w-5" />
              Каталог игр
            </Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <span className="font-[var(--font-playfair)] text-3xl font-bold text-gold md:text-4xl">500+</span>
            <span className="mt-1 text-sm text-muted-foreground">Слот-игр</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-[var(--font-playfair)] text-3xl font-bold text-gold md:text-4xl">24/7</span>
            <span className="mt-1 text-sm text-muted-foreground">Поддержка</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-[var(--font-playfair)] text-3xl font-bold text-gold md:text-4xl">10K+</span>
            <span className="mt-1 text-sm text-muted-foreground">Игроков</span>
          </div>
        </div>
      </div>
    </section>
  )
}
