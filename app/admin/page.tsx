"use client"

import { useState } from "react"
import useSWR from "swr"
import {
  Crown,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Play,
  Loader2,
  Server,
  Key,
  Globe,
  Activity,
  Copy,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface TestResult {
  request: Record<string, unknown>
  response: Record<string, unknown>
  sessionId: string
}

export default function AdminPage() {
  const { data: statusData, isLoading, mutate } = useSWR("/api/admin/tbs2-status", fetcher)
  const { data: userData } = useSWR("/api/user/me", fetcher)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState<string | null>(null)

  const user = userData?.user

  const runTest = async (cmd: "getBalance" | "writeBet") => {
    if (!user) return
    setTesting(cmd)
    try {
      const response = await fetch("/api/admin/test-callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cmd }),
      })
      const data = await response.json()
      setTestResults((prev) => [
        { ...data, _cmd: cmd, _time: new Date().toISOString() },
        ...prev,
      ])
      // Refresh status to show updated transactions
      mutate()
    } catch (err) {
      console.error("Test failed:", err)
    } finally {
      setTesting(null)
    }
  }

  const callbackUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/callback`
      : "/api/callback"

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-foreground">Требуется авторизация</CardTitle>
            <CardDescription className="text-muted-foreground">
              Войдите в систему для доступа к панели администратора
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/">
              <Button className="bg-gold text-background hover:bg-gold-light">
                На главную
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Назад</span>
            </Link>
            <div className="flex items-center gap-2">
              <Crown className="h-7 w-7 text-gold" />
              <span className="font-[var(--font-playfair)] text-xl font-bold tracking-wide text-foreground">
                TBS2 Admin
              </span>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">{user.username}</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Integration Status */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Server className="h-5 w-5 text-gold" />
                Статус интеграции
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Настройки подключения к TBS2 API
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gold" />
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Статус</span>
                    {statusData?.configured ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Подключено
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="mr-1 h-3 w-3" />
                        Не настроено
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Globe className="h-3.5 w-3.5" />
                      API URL
                    </span>
                    <span className="text-sm font-mono text-foreground">
                      {statusData?.apiUrl || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Key className="h-3.5 w-3.5" />
                      Hall ID
                    </span>
                    <span className="text-sm font-mono text-foreground">
                      {statusData?.hallId || "N/A"}
                    </span>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Callback URL</span>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-secondary px-2 py-1 text-xs text-gold font-mono">
                          {callbackUrl}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-gold"
                          onClick={() => copyToClipboard(callbackUrl)}
                          aria-label="Copy callback URL"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      Вставьте этот URL в поле Callback URL в настройках зала на tbs2api.lvslot.net
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test API */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Activity className="h-5 w-5 text-gold" />
                Test API
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Проверка ответов на команды getBalance и writeBet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <Button
                    onClick={() => runTest("getBalance")}
                    disabled={testing !== null}
                    className="flex-1 bg-gold text-background hover:bg-gold-light"
                  >
                    {testing === "getBalance" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="mr-2 h-4 w-4" />
                    )}
                    getBalance
                  </Button>
                  <Button
                    onClick={() => runTest("writeBet")}
                    disabled={testing !== null}
                    variant="outline"
                    className="flex-1 border-gold/30 text-foreground hover:bg-gold/10 hover:text-gold"
                  >
                    {testing === "writeBet" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="mr-2 h-4 w-4" />
                    )}
                    writeBet
                  </Button>
                </div>

                {/* Test Results */}
                {testResults.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Результаты тестов
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTestResults([])}
                        className="h-6 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Очистить
                      </Button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto flex flex-col gap-2">
                      {testResults.map((result, i) => (
                        <div key={i} className="rounded-lg border border-border bg-secondary/50 p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <Badge
                              className={
                                result.response?.error === 0
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : "bg-destructive/10 text-destructive border-destructive/20"
                              }
                            >
                              {result.response?.error === 0 ? "OK" : `Error ${result.response?.error}`}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {String(result.request?.cmd)}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="text-xs text-muted-foreground">
                              <span className="font-semibold text-foreground">Request:</span>
                            </div>
                            <pre className="rounded bg-background p-2 text-[10px] leading-relaxed text-foreground font-mono overflow-x-auto">
                              {JSON.stringify(result.request, null, 2)}
                            </pre>
                            <div className="mt-1 text-xs text-muted-foreground">
                              <span className="font-semibold text-foreground">Response:</span>
                            </div>
                            <pre className="rounded bg-background p-2 text-[10px] leading-relaxed text-foreground font-mono overflow-x-auto">
                              {JSON.stringify(result.response, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Activity className="h-5 w-5 text-gold" />
                    Последние транзакции
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Журнал всех операций getBalance/writeBet
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => mutate()}
                  className="text-muted-foreground hover:text-gold"
                  aria-label="Refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gold" />
                </div>
              ) : statusData?.transactions?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 pr-4 font-medium text-muted-foreground">Игрок</th>
                        <th className="pb-3 pr-4 font-medium text-muted-foreground">Действие</th>
                        <th className="pb-3 pr-4 font-medium text-muted-foreground">Сумма</th>
                        <th className="pb-3 pr-4 font-medium text-muted-foreground">Баланс до</th>
                        <th className="pb-3 pr-4 font-medium text-muted-foreground">Баланс после</th>
                        <th className="pb-3 pr-4 font-medium text-muted-foreground">Игра</th>
                        <th className="pb-3 font-medium text-muted-foreground">Время</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statusData.transactions.map(
                        (
                          tx: {
                            id: string
                            username: string
                            action: string
                            amount: string
                            balance_before: string
                            balance_after: string
                            game_id: string
                            created_at: string
                          },
                        ) => (
                          <tr key={tx.id} className="border-b border-border/50">
                            <td className="py-2.5 pr-4 text-foreground">{tx.username}</td>
                            <td className="py-2.5 pr-4">
                              <Badge
                                className={
                                  tx.action === "writeBet"
                                    ? "bg-gold/10 text-gold border-gold/20"
                                    : "bg-secondary text-secondary-foreground border-border"
                                }
                              >
                                {tx.action}
                              </Badge>
                            </td>
                            <td className="py-2.5 pr-4 font-mono text-foreground">
                              {Number(tx.amount) >= 0 ? "+" : ""}
                              {Number(tx.amount).toFixed(2)}
                            </td>
                            <td className="py-2.5 pr-4 font-mono text-muted-foreground">
                              ${Number(tx.balance_before).toFixed(2)}
                            </td>
                            <td className="py-2.5 pr-4 font-mono text-foreground">
                              ${Number(tx.balance_after).toFixed(2)}
                            </td>
                            <td className="py-2.5 pr-4 text-muted-foreground">{tx.game_id || "-"}</td>
                            <td className="py-2.5 text-xs text-muted-foreground">
                              {new Date(tx.created_at).toLocaleString("ru-RU")}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Нет транзакций
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
