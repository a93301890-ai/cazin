import { NextResponse } from "next/server"
import { openTbs2Game } from "@/lib/tbs2"
import { getCurrentUser } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const gameId = searchParams.get("gameId")
    const demo = searchParams.get("demo") === "1"

    if (!gameId) {
      return NextResponse.json({ error: "gameId is required" }, { status: 400 })
    }

    // Для демо можно не требовать пользователя
    const user = await getCurrentUser()
    if (!user && !demo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const login = demo ? "demo" : String(user!.id)

    const result = await openTbs2Game(gameId, login, demo)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[Launch Game] Error:", error)
    return NextResponse.json({ error: "Failed to launch game" }, { status: 500 })
  }
}
