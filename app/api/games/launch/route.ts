import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

const API = process.env.TBS2_API_URL
const HALL_ID = process.env.TBS2_HALL_ID
const HALL_KEY = process.env.TBS2_HALL_KEY
const DOMAIN = process.env.TBS2_DOMAIN
const EXIT_URL = process.env.TBS2_EXIT_URL

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { gameId, demo = false } = await req.json()

    if (!gameId) {
      return NextResponse.json({ error: "gameId is required" }, { status: 400 })
    }

    const url =
      `${API}/OpenGame/?hall=${HALL_ID}` +
      `&key=${HALL_KEY}` +
      `&gameid=${gameId}` +
      `&login=${user.id}` +
      `&domain=${DOMAIN}` +
      `&exitUrl=${EXIT_URL}` +
      `&demo=${demo ? 1 : 0}`

    const response = await fetch(url)

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json(
        { error: "Failed to launch game", details: text },
        { status: 500 }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      url: data.url,
      gameId,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to launch game", details: String(err) },
      { status: 500 }
    )
  }
}
