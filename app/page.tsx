"use client"

import { useState, useEffect } from "react"
// Neon PostgreSQL backend
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"
import { AuthModal } from "@/components/auth-modal"

type AuthTab = "login" | "register"

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState<AuthTab>("login")

  const openLogin = () => {
    setAuthTab("login")
    setAuthOpen(true)
  }

  const openRegister = () => {
    setAuthTab("register")
    setAuthOpen(true)
  }

  useEffect(() => {
    if (!authOpen) {
      setAuthTab("login")
    }
  }, [authOpen])

  return (
    <main className="min-h-screen bg-background">
      <Header onLoginClick={openLogin} onRegisterClick={openRegister} />
      <HeroSection onRegisterClick={openRegister} />
      <FeaturesSection />
      <Footer />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
    </main>
  )
}
