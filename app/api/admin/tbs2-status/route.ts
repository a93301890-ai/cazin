import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDb } from "@/lib/db"

const TBS2_API_URL = process.env.TBS2_API_URL || ""
const TBS2_HALL_ID = process.env.TBS2_HALL_ID || ""

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sql = getDb()

    // Get recent transactions
    const transactions = await sql`
      SELECT gt.*, u.username
      FROM game_transactions gt
      JOIN users u ON u.id = gt.user_id
      ORDER BY gt.created_at DESC
      LIMIT 50
    `

    // Get active game sessions
    const activeSessions = await sql`
      SELECT gs.*, u.username
      FROM game_sessions gs
      JOIN users u ON u.id = gs.user_id
      WHERE gs.is_active = true
      ORDER BY gs.created_at DESC
      LIMIT 20
    `

    const isConfigured = !!(TBS2_API_URL && TBS2_HALL_ID)

    return NextResponse.json({
      configured: isConfigured,
      hallId: TBS2_HALL_ID,
      apiUrl: TBS2_API_URL,
      transactions,
      activeSessions,
    })
  } catch (error) {
    console.error("[Admin TBS2 Status] Error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
