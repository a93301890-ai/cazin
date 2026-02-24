"use client"

import { useState, useEffect } from "react"
import { Crown, Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AuthTab = "login" | "register"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: AuthTab
}

export function AuthModal({ open, onOpenChange, defaultTab = "login" }: AuthModalProps) {
  const [tab, setTab] = useState<AuthTab>(defaultTab)

  useEffect(() => {
    setTab(defaultTab)
  }, [defaultTab])

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!loginForm.email || !loginForm.password) {
      setError("Заполните все поля")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Ошибка авторизации")
        return
      }

      onOpenChange(false)
      window.location.reload()
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!registerForm.username || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      setError("Заполните все поля")
      return
    }

    if (registerForm.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов")
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Ошибка регистрации")
        return
      }

      onOpenChange(false)
      window.location.reload()
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.")
    } finally {
      setLoading(false)
    }
  }

  const switchTab = (newTab: AuthTab) => {
    setTab(newTab)
    setError("")
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card p-0 sm:max-w-md">
        <div className="p-6 pb-0">
          <DialogHeader className="items-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
              <Crown className="h-6 w-6 text-gold" />
            </div>
            <DialogTitle className="font-[var(--font-playfair)] text-xl text-foreground">
              Royal Fortune
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6 flex rounded-lg border border-border bg-secondary p-1">
            <button
              onClick={() => switchTab("login")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                tab === "login"
                  ? "bg-gold text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => switchTab("register")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                tab === "register"
                  ? "bg-gold text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Регистрация
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground focus:border-gold focus:ring-gold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-foreground">
                  Пароль
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Введите пароль"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="border-border bg-secondary pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:border-gold focus:ring-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gold font-semibold text-background hover:bg-gold-light disabled:opacity-50"
              >
                {loading ? "Вход..." : "Войти"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {"Нет аккаунта? "}
                <button
                  type="button"
                  onClick={() => switchTab("register")}
                  className="font-medium text-gold hover:text-gold-light"
                >
                  Зарегистрируйтесь
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-username" className="text-foreground">
                  Имя пользователя
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="Username"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                    className="border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground focus:border-gold focus:ring-gold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground focus:border-gold focus:ring-gold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-foreground">
                  Пароль
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Минимум 6 символов"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="border-border bg-secondary pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:border-gold focus:ring-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password" className="text-foreground">
                  Подтвердите пароль
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Повторите пароль"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    className="border-border bg-secondary pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:border-gold focus:ring-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showConfirmPassword ? "Скрыть пароль" : "Показать пароль"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gold font-semibold text-background hover:bg-gold-light disabled:opacity-50"
              >
                {loading ? "Регистрация..." : "Создать аккаунт"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {"Уже есть аккаунт? "}
                <button
                  type="button"
                  onClick={() => switchTab("login")}
                  className="font-medium text-gold hover:text-gold-light"
                >
                  Войдите
                </button>
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
