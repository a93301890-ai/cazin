import { NextResponse } from "next/server"

const TBS2_API_URL = process.env.TBS2_API_URL || "https://tbs2api.lvslot.net"
const TBS2_HALL_ID = process.env.TBS2_HALL_ID || ""
const TBS2_HALL_KEY = process.env.TBS2_HALL_KEY || ""

export async function GET() {
  try {
    if (!TBS2_HALL_ID || !TBS2_HALL_KEY) {
      return NextResponse.json(
        { error: "TBS2 integration not configured" },
        { status: 500 }
      )
    }

    // TBS2 API - Get games list
    const params = new URLSearchParams({
      hall: TBS2_HALL_ID,
      key: TBS2_HALL_KEY,
    })

    let games = []

    // Try GET first
    let response = await fetch(`${TBS2_API_URL}/api/games?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    })

    if (!response.ok) {
      // Try POST
      response = await fetch(`${TBS2_API_URL}/api/games`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
        cache: "no-store",
      })
    }

    if (response.ok) {
      const data = await response.json()
      // The response may be an array or an object with a games property
      if (Array.isArray(data)) {
        games = data
      } else if (data.games && Array.isArray(data.games)) {
        games = data.games
      } else if (data.content && Array.isArray(data.content)) {
        games = data.content
      } else if (typeof data === "object") {
        // Some providers return games as object keys
        games = Object.values(data).filter(
          (item) => typeof item === "object" && item !== null
        )
      }
    } else {
      const errorText = await response.text()
      console.error("[Games List] TBS2 API error:", response.status, errorText)
      return NextResponse.json({ error: "Failed to fetch games from provider", details: errorText }, { status: 502 })
    }

    return NextResponse.json({ games })
  } catch (error) {
    console.error("[Games List] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch games list" },
      { status: 500 }
    )
  }
}
