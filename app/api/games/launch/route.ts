import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDb } from "@/lib/db"
import crypto from "crypto"

const TBS2_API_URL = process.env.TBS2_API_URL || "https://tbs2api.lvslot.net"
const TBS2_HALL_ID = process.env.TBS2_HALL_ID || ""
const TBS2_HALL_KEY = process.env.TBS2_HALL_KEY || ""

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { gameId, demo = false } = await request.json()

    if (!gameId) {
      return NextResponse.json({ error: "gameId is required" }, { status: 400 })
    }

    if (!TBS2_HALL_ID || !TBS2_HALL_KEY) {
      return NextResponse.json({ error: "TBS2 integration not configured" }, { status: 500 })
    }

    const sql = getDb()

    // Create a unique game session ID
    const sessionId = crypto.randomUUID()

    // Store the game session in our database
    await sql`
      INSERT INTO game_sessions (user_id, session_id, game_id)
      VALUES (${user.id}, ${sessionId}, ${gameId})
    `

    // Request game URL from TBS2
    const params = new URLSearchParams({
      hall: TBS2_HALL_ID,
      key: TBS2_HALL_KEY,
      game: gameId,
      session: sessionId,
      player: user.id,
      lang: "ru",
      currency: "USD",
    })

    if (demo) {
      params.set("demo", "1")
    }

    let response = await fetch(`${TBS2_API_URL}/api/open?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    })

    if (!response.ok) {
      // Try POST
      response = await fetch(`${TBS2_API_URL}/api/open`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
        cache: "no-store",
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[Game Launch] TBS2 error:", response.status, errorText)
      return NextResponse.json(
        { error: "Failed to launch game", details: errorText },
        { status: 502 }
      )
    }

    const data = await response.json()

    // TBS2 returns a URL or content with the game
    const gameUrl = data.url || data.content || data.game_url || data

    return NextResponse.json({
      url: gameUrl,
      sessionId,
      gameId,
    })
  } catch (error) {
    console.error("[Game Launch] Error:", error)
    return NextResponse.json(
      { error: "Failed to launch game" },
      { status: 500 }
    )
  }
}
