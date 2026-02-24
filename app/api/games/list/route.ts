import { NextResponse } from "next/server"

const API = process.env.TBS2_API_URL
const HALL_ID = process.env.TBS2_HALL_ID
const HALL_KEY = process.env.TBS2_HALL_KEY

export async function GET() {
  try {
    if (!API || !HALL_ID || !HALL_KEY) {
      return NextResponse.json(
        { error: "TBS2 integration not configured" },
        { status: 500 }
      )
    }

    const url = `${API}/GetGamesList/?hall=${HALL_ID}&key=${HALL_KEY}`

    const response = await fetch(url, { cache: "no-store" })

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json(
        { error: "Failed to fetch games", details: text },
        { status: 502 }
      )
    }

    const games = await response.json()

    return NextResponse.json({ games })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch games list", details: String(err) },
      { status: 500 }
    )
  }
}
